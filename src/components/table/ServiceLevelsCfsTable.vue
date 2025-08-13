<template>
  <v-container fluid class="pl-12">
    <v-row>
      <v-col class="d-flex">
        <div>
          <options-tooltip :setRadioFilter="setRadioFilter" :radioFilters="radioFilters"/>
        </div>
        <div class="pl-4">
          <bbva-web-link
            class="primary"
            icon="bbva:download"
            @click="download"
          >
            Descargar
          </bbva-web-link>
        </div>
      </v-col>
    </v-row>
    <v-row class="mt-0">
      <v-col>
        <filter-table
          v-if="forceRender"
          :filters="filters.options"
          :values="filters.values"
          :nestedFields="nestedFilterFields"
           :validations="validationsFilterFields"
          :clear="false"
          :search="searchFilter" :withoutPadding="true"/>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="d-flex">
        <span class="fc-white bg-gold fs-15 pl-2 pr-2">Disponibilidad</span>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="d-flex">
        <results />
      </v-col>
    </v-row>
    <v-row v-if="!data.length">
      <v-col>
        <no-data-message 
           title="Información de la tabla"
           :message="filters.values.length ? 'No hay datos para los filtros seleccionados' :
                    'No hay datos que mostrar en la tabla'"
        />
      </v-col>
    </v-row>
    <v-row v-else>
      <v-col>
        <v-table class="data-table" fixed-header>
          <thead>
            <th
              v-for="(header, index) in headers"
              :class="`${getStickyHeaderClass(index)} text-left header-service-level`"
              :style="'padding-left: 15px;' + (index === 0 ? 'min-width: 200px;' : 'min-width: 70px;')"
              :width="index === 0 ? '400px;' : ''"
              :key="`service-level-heaer${index}`">
              <div class="d-flex">
              <bbva-button-default
                v-if="index === 0"
                variant="link"
                class="primary"
                :icon="showAllRows ? 'bbva:collapse' : 'bbva:expand'"
                text=""
                @click="switchData">
              </bbva-button-default>
              <bbva-button-default
                v-if="isBetweenMonths(index - 4)"
                variant="link"
                class="primary"
                :icon="getIconMonth(index - 4)"
                text=""
                @click="() => switchMonth(index - 4)">
              </bbva-button-default>
              <span
                class="text-header-service-level">
                {{header.label}}
                </span>
              </div>
            </th>
            <th
              v-if="expandMonth"
              class="text-left header-service-level bg-white text-header-service-level"
              style="padding-left: 15px;min-width: 70px;"
              v-for="n in monthDays"
              >
              {{n}}
            </th>
          </thead>
          <tbody>
            <tr
              v-for="(row,indexRow) in data"
              :key="`row-service-level-${indexRow}`"
            >
              <td
                :class="`
                    border-gray
                    column-sticky-0 ${getColorRow(row.cbp)}
                  `"
                >
                <div v-if="!!row.cfs" class="fc-white fs-14" >
                  <a
                    class="primary fs-14"
                    style="color: #1973B8; padding-bottom: 0px; padding-top: 5px;"
                    @click.prevent="watchItem(row.cbpId, row.operativeId)"
                    href="#"
                  >
                  <span
                    class="primary fw-500 fs-14"
                    style="text-align: start">{{row.cfs}}</span>
                  </a>
                </div>
                <div v-else :class="`${row.operative ? 'pl-2' : ''}`">
                  <a
                    class="primary fs-14"
                    style="color: #1973B8; padding-bottom: 0px; padding-top: 5px;"
                    @click.prevent="watchItem(row.cbpId, row.operativeId)"
                    href="#"
                  >
                  <span
                    class="primary fw-500 fs-14"
                    style="text-align: start">{{row.name}}</span>
                  </a>
                </div>
              </td>
              <td :class="`
                  border-gray
                  fs-14 column-sticky-1 ${getColorRow(row.cbp)}
                `">
                <span
                  style="padding-bottom: 27px;"
                  >
                  {{ [null, undefined ].includes(row.meta) ? '' : formatNumber(row.meta) }}
                </span>
              </td>
              <td :class="`
                  border-gray
                  fs-14 column-sticky-2 ${getColorRow(row.cbp)}
                `">
                <span
                  style="padding-bottom: 27px;"
                  >
                  {{ row.activ === null ? '' : formatNumber(row.activ) }}
                </span>
              </td>
               <td :class="`
                  border-gray
                  fs-14 column-sticky-3 ${getColorRow(row.cbp)}
                 `">
                <span
                  style="padding-bottom: 27px;"
                  >
                  {{ row.weight === null ?  ''  : formatNumber(row.weight) }}
                </span>
              </td>
              <td
                v-for="(col, indexCol) in months"
                :key="`col.service-level-${indexCol}`"
                class="fw-500 fs-14 border-white"
                :style="`
                  background: ${row[col]?.color};
                  border-bottom: 1px solid white;
                  color: ${
                    row[col]?.color !== '#F8CD51' ? 'white' : 'black'
                  };
                `">
                {{row[col]?.value === null ? '-'  : formatNumber(row[col]?.value) }}
              </td>
              <td
                v-if="expandMonth"
                v-for="(day, indexDay) in row.lastMonth"
                :key="`day-${indexDay}`"
                class="fw-500 fs-14 border-white"
                :style="`
                  background: ${day?.color};
                  border-bottom: 1px solid white;
                  color: ${
                    day?.color !== '#F8CD51' ? 'white' : 'black'
                  };
                `"
              >
              {{day?.value === null ? '-' : formatNumber(day.value) }}
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-col>
    </v-row >
  </v-container>
</template>

<script>
/* Components */
import '@/components/bbva-web-components/bbva-web-table-header.js'
import '@/components/bbva-web-components/bbva-web-table-body.js'
import '@/components/bbva-web-components/bbva-web-table-footer.js'
import '@/components/bbva-web-components/bbva-core-icon.js'
import FilterTable from "@/components/table/FilterTable.vue"
import OptionsTooltip from '@/components/tooltips/OptionsTooltip.vue';
import '@/components/bbva-web-components/bbva-button-default.js'
import '@/components/bbva-web-components/bbva-web-link.js'
import NoDataMessage from '@/components/utils/NoDataMessage.vue'
import Results from '@/components/serviceLevels/Results.vue';
/* constants */
import {
  filtersServiceLevels, headersCFS, nestedFilterFields, validationsFilterFields
} from '@/constants/serviceLevelsCfs';
/* requests */
import {
  getServiceLevelsCFSAPI,
  getServiceLevelsCBPAPI,
  getServiceLevelsOperativeAPI,
  getExcelFileServiceLevelCfs
} from '@/requests/serviceLevels';
/* utils */
import {
  getDateLastday, getMonthFromString, getYearFromString, formatStringDate, formatNumber
} from '@/utils/general';
import { parseCatalog } from '@/utils/form';
import { nextTick } from 'vue'

/*
 * This components show the table for service level CFS CBP operative
 */
export default {
  props: {
    /* Function to handle errors in resquets*/
    requestError: { type: Function, default: () => {} },
  },
  data: () => ({
    /* Function to format the number */
    formatNumber,
    /* Flag, true if it muts show all the rows */
    showAllRows: false,
    /* It saves the data to show into the table */
    data: [],
    /* Flag to force render the filters*/
    forceRender: true,
    /* It saves the number days of the month for the date */
    monthDays: 0,
    /* Flag, true if if must expand the month */
    expandMonth: false,
    /* It saves the expanded data */
    expandedData: [],
    /* It saves the nested fields filters */
    nestedFilterFields,
    /* It saves the brief data*/
    closedData: [],
    /*Radio filters  */
    radioFilters: {decimals: 2, availability: true },
    /* Headers of the months */
    colorColumns: [
      'annual', 'january', 'february', 'march', 'april', 'may',
      'june', 'july', 'august', 'september', 'october',
      'november', 'december',
    ],
    /* Headers used by the table */
    headers: headersCFS,
    /* It saves the months to be showeb into the table*/
    months: [],
    /* Function to request the data used by the table*/
    requestData: getServiceLevelsCFSAPI,
    /* It saves the data used by the input filters */
    filters: { values: [], options: filtersServiceLevels},
    /* It saves the validations for the input filters */
    validationsFilterFields,
    /* it saves the catalogs used by select inputs */
    catalogs: {},
  }),
  components: {
    FilterTable,
    NoDataMessage,
    Results,
    OptionsTooltip,
  },
  beforeMount() {
    this.setFilters();
    this.loadCatalogs();
    this.updateHeaders();
  },
  methods: {
    /*
     * Force to update the filters
     */
    async forceUpdate() {
      this.forceRender = false;
      await nextTick();
      this.forceRender = true;
    },
    /*
     * This method redirect to see and cbp or operative
     * with the query params
     * @param {Number} cbpId        CBP's ID
     * @param {Number} operativeId  Operative's ID
     */
    watchItem(cbpId, operativeId) {
      let query = '';
      this.filters.values.forEach((item) => {
        query +=  item.name + '=' + item.value + '&';
      })
      const cfsId = this.filters.values.find( (item) => 'cfsId' === item.name );

      if( cfsId ) query += `&cfsId=${cfsId.value}`
      if(operativeId) query += `&operativeId=${operativeId}`

      if(cbpId ) query += `&cbpId=${cbpId}`

      query += `&availability=${this.radioFilters.availability}`
      query += `&decimals=${this.radioFilters.decimals}`
      this.$router.push(
        `/service-levels/cfs-cbp-operative/detail?${query}`
      );
    },
    /*
     * This method set the title and  subtitle
     */
    setTitle(bu, cfs) {
      const dateIndex = this.filters.values.findIndex( (item) => item.name === 'date');
      const date = this.filters.values[dateIndex].value;

      const title = cfs && bu ? `Disponibilidad - ${bu} - ${cfs}` : 'Disponibilidad';
      const subtitle = `Resultados al ${ formatStringDate( date ) }`;
      this.emitter.emit("serviceCfsTitle", { title, subtitle });
    },
    /*
     * This method update the header depending on the filter date
     */
    updateHeaders() {
      this.headers = [...headersCFS].splice(0, this.getLastMonth() + 5)
      this.months = [...this.colorColumns].splice(0, this.getLastMonth() + 1);
    },
    /*
     * This method download the file xlsx depend on the filters
     */
    download() {
      this.emitter.emit("load", { loading: true });
      getExcelFileServiceLevelCfs(
        [ 
          ...this.filters.values,
          { name: 'decimals', value: this.radioFilters.decimals },
          { name: 'availability', value: this.radioFilters.availability },
        ]
      ).then(
        (response) => {
        const blob = new Blob(
          [response.data], { type: 'application/vnd.ms-excel' }
        )
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.download = `Tablero_dias_Criticos_Canal.xlsx`;
        link.click()
        URL.revokeObjectURL(link.href)
        this.emitter.emit("load", { loading: false });
      }).catch((error) => {
        this.emitter.emit("load", { loading: false });
        this.emitter.emit('error', { action: 'descargar archivo',  error });
      });
    },
    /*
     * This method return the background for the cell
     * depending on the date showed in the cell
     * CBP light-gray
     * Other white
     */
    getColorRow(isCbp) {
      if( isCbp ) {
       return 'bg-light-gray'
      } else {
        return 'bg-white';
      }
    },
    /*
     * It checks if the menth is between month 1 and the month
     * set on the date filter
     * @param {Number} month  Month
     @return Boolean
     */
    isBetweenMonths(month) {
      return  1 <= month && month <= this.getLastMonth();
    },
    /*
     * This method return the icon to expaand the months
     * @param {Number} index  header's index
     * @return String with the icon for the header's index
     */ 
    getIconMonth(index) {
      return this.getLastMonth() !== index || !this.expandMonth ? 'bbva:next' : 'bbva:unfold';
    },
    /*
     * This method sets the sticky style for the headers,
     * it depends on the index
     * @param  {Number}  index   Header's index
     * @return String css class
     */
    getStickyHeaderClass(index) {
      if(index < 4) {
        return `column-sticky-${index}`;
      }
       return '';
    },
    /*
     * This method gets the last month, it's the month from the filter date
     * @return Number
     */
    getLastMonth() {
      const dateIndex = this.filters.values.findIndex( (item) => item.name === 'date');
      const date = this.filters.values[dateIndex].value;

      return getMonthFromString(date);
    },
    /*
     * This method catch the event when an user tries to open a month, if the month
     * is the last one, only opens the days, but if the month is previous of the
     * filter date, then it executes the search to get the data with the new date and expand showing teh dates
     * @param {Number} index Month's index
     */
    switchMonth(index) {
      const dateIndex = this.filters.values.findIndex( (item) => item.name === 'date');
      const date = this.filters.values[dateIndex].value;
      const lastMonth = getMonthFromString(date);;

      if( index !== lastMonth ) {
        const year =  getYearFromString( date );
        this.filters.values[dateIndex] = {
          ...this.filters.values[dateIndex], value: getDateLastday(index - 1, year)
        };
        this.searchData(this.filters.values);
        this.expandMonth = true;
      } else {
        this.expandMonth = !this.expandMonth;
      }
    },
    /*
     * This method  expands the data or closes them
     * it depends on the previous state
     */
    switchData() {
      this.showAllRows = ! this.showAllRows;
      if(this.showAllRows) {
        this.data = this.expandedData;
      }  else {
        this.data = this.closedData;
      }
    },
    /*
     * This method clones the object without the keys received
     * @param {Object} item     Object any
     * @param {String[]} keys   Array with the key ot ignore when clone the object
     * @return Object
     */
    cloneObjectWithoutKeys(item, keys) {
      const newItem = {...item}
      keys.forEach( (key) => {
        delete newItem[key];
      })
      return newItem;
    },
    /*
     * This method saves the data showed into the table when the rows aren't expanded
     * @param {Object} data  Data to save
     */
    closedRows(data) {
      if(! data?.cbps ) {
        this.closedData = [];
        return;
      }
      const closed = [
        {
          ...this.cloneObjectWithoutKeys(data, ['cbps']),
          ...data.months
        }
      ]
      data?.cbps?.forEach( (cbp) => {
        closed.push({
          ...this.cloneObjectWithoutKeys(cbp, ['operatives']),
          ...cbp.months,
          cbp: true
        });
      });
      this.closedData = closed;
    },
    /*
     * This method saves the data shows into the table when the rows are expanded
     * @param {Object} data  Data
     */
    expandRows(data) {
      if(!data?.cbps ){
        this.expandedRows = []
        return;
      }
      const expanded = [
        {
          ...this.cloneObjectWithoutKeys(data, ['cbps']),
          ...data.months
        }
      ]
      data?.cbps?.forEach( (cbp) => {
        expanded.push({
          ...this.cloneObjectWithoutKeys(cbp, ['operatives']),
          ...cbp.months,
          cbp: true
        });
        cbp?.operatives?.forEach( (operative) => {
          expanded.push({...operative,...operative.months, operative:  true, cbpId: cbp.cbpId });
        });
      });
      this.expandedData = expanded;
    },
    /*
     * This methods validates if the filters required exists
     * @return Boolean, true if the required filters exist
     */
    validateFilters() {
      let valid = false;
      this.filters.values.every( (item) => {
        valid = !!item.value;
        return valid;
      });
      return valid;
    },
    /*
     * This method sets the initial filters
     */
    setFilters() {
      this.filters.values.push({
        value: this.$route.query.date, name: 'date'
      });

      this.filters.values.push({
        value: parseInt(this.$route.query.cfsId), name: 'cfsId'
      });
      this.filters.values.push({
        value: parseInt(this.$route.query.buId), name: 'buId'
      });
      this.radioFilters.availability = this.$route.query.availability === 'true';
      this.radioFilters.decimals = parseInt(this.$route.query.decimals);
    },
    /*
     * This method sets the value for the radio filters
     * @param {String}          key    Field's name
     * @param {Number|Boolean}  value  Field's value
     */
    setRadioFilter(key, value) {
      this.radioFilters[key] = value;
      this.searchData([...this.filters.values])
    },
    /*
     *  This method updates the variable monthDays
     */
    updateMonthDays() {
      if(this.data.length) {
        this.monthDays = this.data[0].lastMonth.length;
      }
    },
    /*
     * This methods return an array with nested filters for the catalogs
     */
    nestedFilters(name) {
      const nestedKey = Object.keys(this.nestedFilterFields).find( (key) => {
        return this.nestedFilterFields[key].find( (item) => item.field === name );
      });
      if( nestedKey && this.filters.values.length ) {
        const field = this.filters.values.find( (item) => item.name === nestedKey );
        if(field) {
          return [{ name: 'buId', value: field.value }]
        }
      }
      return [];
    },
    /*
     * This method searches the date to show into the table depending on
     * the filters
     * @param {Object[]}                 filters           Filter to send into the request
     * @param {String}                   filters[].name    Name of the filter
     * @param {String|Number|Boolean}    filters[].value   Value of the filter
     */
    searchData(filters = []) {
      if( ! this.validateFilters() ) {
        return;
      }

      const cfs = filters.find((item) => item.name === 'cfsId')
      const filtersRequest = [ 
        ...filters,
        { name: 'decimals', value: this.radioFilters.decimals },
        { name: 'availability', value: this.radioFilters.availability },
      ];

      this.emitter.emit("load", { loading: true });
      Promise.all([
        getServiceLevelsCFSAPI( filtersRequest ),
        getServiceLevelsCBPAPI( filtersRequest ),
        getServiceLevelsOperativeAPI( filtersRequest )
      ]).then( (values) => {
        const data = values[0].data;
        data.cbps = this.addOperativesToCbps(values[1].data, values[2].data);
        this.closedRows(data);
        this.expandRows(data);
        this.data = this.closedData;
        this.updateMonthDays();
        this.updateHeaders();
        this.setTitle(data.bu, data.cfs);
      }).catch((error) =>  {
        this.closedRows({});
        this.expandRows({});
        this.data = []
        this.emitter.emit('error', { action: 'obtener datos',  error });
      }).finally(() => {
        this.showAllRows = false;
        this.emitter.emit("load", { loading: false });
        this.forceUpdate();
      });
    },
    addOperativesToCbps(cbps, operatives) {
      cbps.forEach( (cbp, index) => {
        cbp.operatives = operatives.filter( (op) => op.cbpId === cbp.cbpId );
      });
      return cbps;
    },
    /*
     * This methods loads the catalog used by the inout select in teh filters
     * and loads the initial data showed into the table
     */
    loadCatalogs() {
      this.emitter.emit("load", { loading: true });
      const selects = this.filters.options.filter((item) => !!item.request);
      const requests = selects.map( ({request, name}) => ({request, name}) );
      const cfs = this.filters.values.find((item) => item.name === 'cfsId')

      const filtersRequest = [ 
        ...this.filters.values,
        { name: 'decimals', value: this.radioFilters.decimals },
        { name: 'availability', value: this.radioFilters.availability },
      ];

      Promise.all([
        ...requests.map( (item) => item.request(1,3000, this.nestedFilters(item.name) ) ),
      ]).then(async (values) => {
        for( let i = 0; i < requests.length; i++) {
          this.filters.options[i].options = parseCatalog(values[i].data);
        }
        this.emitter.emit("load", { loading: false });
        this.searchData(this.filters.values);
      }).catch((error) => {
        this.emitter.emit('error', { action: 'cargar datos iniciales',  error });
      });
    },
    /*
     * It saves the filters and secute the function search
     */
    searchFilter(values){
      this.filters.values = [...values];
      this.searchData(this.filters.values);
    },
  },
}
</script>

<style>
.data-table {
  border-bottom: 1px solid #D3D3D3;
}

.border-gray {
  border-bottom: 1px solid #E0E0E0 !important;
  border-right: 1px solid #E0E0E0;
}

.border-white {
  border: 1px solid white;
}
.column-sticky-0 {
  position: sticky;
  left: 0;
  z-index: 1;
}
.column-sticky-1 {
  position: sticky;
  left: 200px;
  z-index: 1;
}
.column-sticky-2 {
  position: sticky;
  left: 270px;
  z-index: 1;
}
.column-sticky-3 {
  position: sticky;
  left: 340px;
  z-index: 1;
}
.text-header-service-level {
  font-size: 12px;
  color: #666666;
  padding-top: 4px;
}
.header-service-level {
  border-bottom: thin solid rgba(var(--v-border-color),var(--v-border-opacity));
  background: white;
}

.v-table__wrapper {
  overflow-y: hidden;
  overflow-x: auto;
}
</style>

