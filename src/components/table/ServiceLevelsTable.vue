<template>
  <v-container fluid class="pl-12">
    <v-row>
      <v-col class="d-flex">
        <div>
          <options-tooltip :setRadioFilter="setRadioFilter" :radioFilters="radioFilters"
            :index="index"/>
        </div>
        <div class="pl-4">
          <bbva-web-link
            :disabled="!canDownload"
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
          :key="index"
          :values="filters.values"
          :filters="filters.options"
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

    <v-row>
      <v-col v-if="!data.length">
        <no-data-message 
          
           title="Información de la tabla"
           :message="filters.values.length ? 'No hay datos para los filtros seleccionados' :
                    'No hay datos que mostrar en la tabla'"
        />
      </v-col>
      <v-col v-else>
        <v-table class="data-table" fixed-header>
          <thead>
            <th
              v-for="(header, index) in headers"
              :class="`${index === 0 ? 'column-sticky' : ''} text-left header-service-level`"
              style="padding-left: 15px;"
              :key="`service-level-heaer${index}`">
              <span
                class="text-header-service-level">
                {{header.label}}
               </span>
            </th>
          </thead>
          <tbody>
            <tr
              v-for="(row,indexRow) in data"
              :key="`row-service-level-${indexRow}`"
            >
              <td  class="column-sticky border-gray">
                <div style="display: inline-grid">
                  <bbva-web-link
                    class="primary fs-14"
                    style="color: #1973B8; padding-bottom: 0px; padding-top: 5px;"
                    @click="watchCfs(row.cfsId)"
                  >
                  {{row.cfs}}
                  </bbva-web-link>
                  <span class="fs-12 gray">
                    {{row.bu}}
                  </span>
                </div>
              </td>
              <td class="fs-14 border-gray">
                <span style="padding-bottom: 27px;">
                  {{ row.goal ? formatNumber(row.goal) : '' }}
                </span>
              </td>
              <td
                :key="`col-service-level-0`"
                class="fw-500 fs-14 border-white"
                :style="`
                  background: ${row.annual.color};
                  border-bottom: 1px solid white;
                  color: ${
                    row.annual.color !== '#F8CD51' ? 'white' : 'black'
                  };
                `">
                {{row.annual.value ? formatNumber(row.annual.value) : '' }}
              </td>

              <td
                v-for="(col, indexCol) in monthColumns"
                :key="`col-service-level-${indexCol + 1}`"
                class="fw-500 fs-14 border-white"
                :style="`
                  background: ${row.months[col].color};
                  border-bottom: 1px solid white;
                  color: ${
                    row.months[col].color !== '#F8CD51' ? 'white' : 'black'
                  };
                `">
                  <bbva-web-link
                    v-if=" ![null, undefined].includes(row.months[col].value) "
                    class="fw-500 fs-14"
                    :style="`
                      color: ${
                        row.months[col].color !== '#F8CD51' ? 'white' : 'black'
                      };
                    `"
                    @click="() => watchMonthCfs(row.cfsId, indexCol + 1)"
                  >
                  {{ formatNumber( row.months[col].value ) }}
                  </bbva-web-link>
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
import '@/components/bbva-web-components/bbva-web-form-radio-button.js'
import '@/components/bbva-web-components/bbva-web-table-header.js'
import '@/components/bbva-web-components/bbva-web-table-body.js'
import '@/components/bbva-web-components/bbva-web-table-footer.js'
import '@/components/bbva-web-components/bbva-core-icon.js'
import FilterTable from "@/components/table/FilterTable.vue"
import Results from '@/components/serviceLevels/Results.vue';
import OptionsTooltip from '@/components/tooltips/OptionsTooltip.vue';
import '@/components/bbva-web-components/bbva-button-default.js'
import '@/components/bbva-web-components/bbva-web-link.js'
import NoDataMessage from '@/components/utils/NoDataMessage.vue'
/* Constants */
import {
  filtersServiceLevels, headers, validationsFilterFields
} from '@/constants/serviceLevels';
/* Requests */
import { getServiceLevelsBuAPI, getExcelFileServiceLevel  } from '@/requests/serviceLevels';
import { getCfsModelAPI } from '@/requests/cfs';
/* utils */
import {
  getYearFromString, getDateLastday,getMonthFromString, cloneArrayOfObjects, formatNumber,
  stringToday
} from '@/utils/general';
import { parseCatalog } from '@/utils/form';

/*
 * This components show the table for service level
 */
export default {
  props: {
    /* Dashboard data */
    dashboard: { type: Function, default: () => ({}) },
    key: { type: Number, default: 0 },
    /* index */
    index: { type: Number, default: 0 },
  },
  data: () => ({
    /* Function to format the number */
    formatNumber,
    canDownload: false,
    /*Date to show into the table */
    data: [],
    /* Radio filters */
    radioFilters: { decimals: 2, availability: true },
    /* nested Filter fields*/
    nestedFilterFields: { buId:  [{field: 'cfsId', request: getCfsModelAPI }] },
    /* Columns names for header months */
    colorColumns: [
      'january', 'february', 'march', 'april', 'may',
      'june', 'july', 'august', 'september', 'october',
      'november', 'december',
    ],
    /* Validation for the filters fields*/
    validationsFilterFields,
    /* Request to get thedata for the table*/
    requestData: getServiceLevelsBuAPI,
    /* It saves the date for the filters inputs */
    filters: { values: [], options: cloneArrayOfObjects( filtersServiceLevels ) },
    /* it saves the catalogs used by th filters inputs */
    catalogs: {},
  }),
  components: {
    FilterTable,
    Results,
    OptionsTooltip,
    NoDataMessage
  },
  beforeMount() {
    this.setFilters();
    this.loadCatalogs();
    if( this.dashboard.id ) {
      this.nestedFilterFields.buId[0].extraFilters = [
        { name: 'dashboardId', value: this.dashboard.id }
      ];
      const dateIndex = this.filters.options.findIndex( (item) => item.name === 'date' );
      this.filters.options[dateIndex].min = `${this.dashboard.year}-01-01`
    }

  },
  computed: {
    monthColumns() {
      const dateIndex = this.filters.values.findIndex( (item) => item.name === 'date');
      const date = this.filters.values[dateIndex].value;
      const lastMonth = getMonthFromString(date);
      return [...this.colorColumns].splice(0,lastMonth);
    },
    headers() {
      const dateIndex = this.filters.values.findIndex( (item) => item.name === 'date');
      const date = this.filters.values[dateIndex].value;
      const lastMonth = getMonthFromString(date);
      return [...headers].splice(0,lastMonth + 3);
    }
  },
  methods: {
    /*
     * This method sets the initial filters
     */
    setFilters() {
      if( !this.$route.query.back ) {
        localStorage.clear();
        return;
      }
      const storage = localStorage.getItem(`service-levels-tab-${this.index}`);
      const storageFilters = storage ? JSON.parse( storage ) : {};
      if( Object.keys(storageFilters).length === 0 ) {
        return;
      }

      this.filters.values = storageFilters.values;

      this.radioFilters.availability = storageFilters.radios.availability;
      this.radioFilters.decimals = parseInt(storageFilters.radios.decimals);
    },

    /*
     * This method set the title and  subtitle
     */
    setTitle(bu) {
      const title = bu ? `Disponibilidad - ${bu}` : 'Resumen Ejecutivo - Disponibilidad';
      this.emitter.emit("serviceTitle", { title, index: parseInt(this.index) });
    },
    /*
     * It downloads the excel file
     */
    download() {
      this.emitter.emit("load", { loading: true });
      getExcelFileServiceLevel([
        ...this.filters.values,
        { name: 'decimals', value: this.radioFilters.decimals },
        { name: 'availability', value: this.radioFilters.availability }
      ]).then(
        (response) => {
        const blob = new Blob(
          [response.data], { type: 'application/vnd.ms-excel' }
        )
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.download = `Tablero_dias_Criticos.xlsx`;
        link.click()
        URL.revokeObjectURL(link.href)
        this.emitter.emit("load", { loading: false });
      }).catch((error) => {
        this.emitter.emit("load", { loading: false });
        this.emitter.emit('error', { action: 'descargar archivo',  error });
      });
    },
    /*
     * This method redirects to show detail of cfs cbp operative
     * @param {Number} cfsId   CFS's ID
     * @param {Number} month   Month
     */
    watchMonthCfs(cfsId, month) {
      let query = '';
      this.filters.values.forEach((item) => {
        if(['date', 'cfsId'].includes(item.name) ) return;

        query +=  item.name + '=' + item.value + '&';
      })
      const date = this.filters.values.find( (item) => item.name === 'date' );
      const year = getYearFromString(date.value);
      const today = stringToday();

      if( getMonthFromString(today) === month && getYearFromString(today) === year ) {
        query += `&date=${today}`;
      } else {
        query += `&date=${getDateLastday(month - 1, year)}`;
      }

      query += `&cfsId=${cfsId}`;
      query += `&availability=${this.radioFilters.availability}`
      query += `&decimals=${this.radioFilters.decimals}`
      this.$router.push(
        `/service-levels/cfs-cbp-operative?${query}`
      );
    },
    /*
     * This method redirects to show detail of cfs cbp operative
     * @param {Number} cfsId   CFS's ID
     */
    watchCfs(cfsId) {
      let query = '';
      this.filters.values.forEach((item) => {
        if(item.name === 'cfsId') return;

        query +=  item.name + '=' + item.value + '&';
      })


      query += `cfsId=${cfsId}`
      query += `&availability=${this.radioFilters.availability}`
      query += `&decimals=${this.radioFilters.decimals}`
      this.$router.push(
        `/service-levels/cfs-cbp-operative?${query}`
      );
    },
    /*
     * It validates if the required filters were filled
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
     * It sets the radio filters values
     *
     * @param {String}         key     Field's name
     * @param {Boolean|Number}  value   Field's value
     */
    setRadioFilter(key, value) {
      this.radioFilters[key] = value;
      this.searchData([
        ...this.filters.values,
        { name: 'decimals', value: this.radioFilters.decimals },
        { name: 'availability', value: this.radioFilters.availability },
      ])
    },
    /*
     * This method unify the data gotten
     * @param {Object[]} values             Array of objects
     * @param {Object[]} values.data.       Object
     * @param {Object[]} values.data.items  Array of items
     */
    unifyData(values) {
      let items = [];
      values.forEach( (value) => {
        items = [...items, ...value.data.channels];
      });
      return items;
    },
    /*
     * Set into local storage the parameters for the filters
     */
    setStorageFilters() {
      localStorage.setItem(
        `service-levels-tab-${this.index}`,
        JSON.stringify(
          {
            values: this.filters.values,
            radios: {
              availability: this.radioFilters.availability,
              decimals: this.radioFilters.decimals
            }
          }
        )
      );
    },
    /*
     * This methos search the date given by the filters
     * @param {Object[]} filters        Filters
     * @param {Object[]} filters[].name   Filter's name
     * @param {Object[]} filters[].value  Filter's value
     */
    searchData(filters = []) {
      this.setStorageFilters();
      if( ! this.validateFilters() ) {
        return;
      }
      const cfses = filters.find( (item) => item.name === 'cfsId' );
      const allFilters = [
        ...filters.filter( (item) => item.name !== 'cfsId' ),
        { name: 'decimals', value: this.radioFilters.decimals },
        { name: 'availability', value: this.radioFilters.availability },
      ]


      this.emitter.emit("load", { loading: true });
      Promise.all(
        cfses.value.map( (cfsId) => this.requestData([
          ...allFilters,
          { name: 'cfsId', value: [cfsId] }
        ]) )
      ).then( (values) => {
        this.data = this.unifyData(values);
        this.canDownload = true;
        this.emitter.emit("load", { loading: false });
        if( this.data.length ) {
          this.setTitle(this.data[0].bu);
        }
      }).catch((error) =>  {
        this.emitter.emit("load", { loading: false });
        this.emitter.emit('error', { action: 'obtener información',  error });
      });
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
     * This methods load the catalogs used by the filters inputs
     */
    loadCatalogs() {
      this.emitter.emit("load", { loading: true });
      const selects = this.filters.options.filter((item) => !!item.request);
      const requests = selects.map( ({request, name}) => ({ request, name }) );
      const dashboardFilter = [];
      if( this.dashboard.id ) {
        dashboardFilter.push( {name: 'dashboardId', value:  this.dashboard.id} );
      }

      Promise.all(
        requests.map( (item) => item.request(
          1, 3000, [...dashboardFilter, ...this.nestedFilters(item.name) ]
        ) )
      ).then((values) => {
        const cfs = [];
        for( let i = 0; i < requests.length; i++) {
          this.filters.options[i].options = parseCatalog(values[i].data);
        }
        this.emitter.emit("load", { loading: false });
        if(this.filters.values.length) {
          this.searchData(this.filters.values);
        } else if( this.dashboard.id ) {
          this.filters.values = [
            { name: 'buId', value: this.filters.options[0].options[0].id },
            { name: 'cfsId', value: this.filters.options[1].options.map((item) => item.id) },
            { name: 'date', value: stringToday() },
          ]
          this.searchData(this.filters.values);
        }
      }).catch( (error) => {
        this.emitter.emit("load", { loading: false });
        this.emitter.emit('error', { action: 'cargar catalogos',  error });
      });
    },
    /*
     * This method pre filter the search
     * @param {Object[]} values          Values
     * @param {Object[]} values[].name   Filter's name
     * @param {Object[]} values[].value  Filter's value
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
.border-white {
  border: 1px solid white;
}
.column-sticky {
  position: sticky;
  left: 0;
  background: white;
  z-index: 1;
}
.text-header-service-level {
  font-size: 12px;
  color: #666666;
}
.header-service-level {
  border-bottom: thin solid rgba(var(--v-border-color),var(--v-border-opacity));
  background: white;
}

.border-gray {
  border-bottom: 1px solid #E0E0E0 !important;
  border-right: 1px solid #E0E0E0;
}
</style>

