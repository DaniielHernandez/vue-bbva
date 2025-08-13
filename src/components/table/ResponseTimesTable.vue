<template>
  <v-container fluid class="pl-12">
    <v-row>
      <v-col class="d-flex">
        <div>
          <tooltip-options-response-time :setRadioFilter="setRadioFilter" :radioFilters="radioFilters"/>
        </div>
        <div class="pl-4">
          <bbva-web-link
            :disabled="!canDownload"
            class="primary fw-500"
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
        <span class="fc-white bg-orange-gold fs-15 pl-2 pr-2">Tiempos de respuesta</span>
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
                    class="primary fw-500 fs-14"
                    style="color: #1973B8; padding-bottom: 0px; padding-top: 5px;"
                    @click="watchDetail(row.cfsId)"
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
                  {{ row.meta }}
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
                {{row.annual.value}}
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
import '@/components/bbva-web-components/bbva-button-default.js'
import '@/components/bbva-web-components/bbva-web-link.js'
import FilterTable from "@/components/table/FilterTable.vue"
import NoDataMessage from '@/components/utils/NoDataMessage.vue'
import Results from '@/components/serviceLevels/Results.vue';
import TooltipOptionsResponseTime from '@/components/tooltips/TooltipOptionsResponseTime.vue';
/* Utils */
import { parseCatalog } from '@/utils/form';
import { errorRequestModal } from '@/utils/informationModal';
import {
  getYearFromString, getMonthFromString, stringToday , formatNumber, getDateLastday
} from '@/utils/general';
/* Constants */
import {
  filtersResponseTimes, headers, nestedFilterFields, validationsFilterFields
} from '@/constants/responseTimes';
/* Requests */
import { getResponseTimesBuAPI, getExcelFileResponseTime  } from '@/requests/responseTimes';

/*
 * This components show the table for response times
 */
export default {
  data: () => ({
    /* Format number method */
    formatNumber,
    /* Flag, true if the user can download the file */
    canDownload: false,
    /*Date to show into the table */
    data: [],
    /* Radio filters */
    radioFilters: { decimals: 2, compliance: true },
    /* nested Filter fields*/
    nestedFilterFields,
    /* Columns names for header months */
    colorColumns: [
      'enero', 'febrero', 'marzo', 'abril', 'mayo',
      'junio', 'julio', 'agosto', 'septiembre', 'octubre',
      'noviembre', 'diciembre',
    ],
    monthsKeys: [
      'january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september',
      'october', 'november', 'december'
    ],
    /* Validation for the filters fields*/
    validationsFilterFields,
    /* Request to get thedata for the table*/
    requestData: getResponseTimesBuAPI,
    /* It saves the date for the filters inputs */
    filters: { values: [], options: filtersResponseTimes },
    /* it saves the catalogs used by th filters inputs */
    catalogs: {},
    /* It has the values used by the modal */
    modal: {
      open: false,
      title: '',
      message: '',
      type: ''
    },
  }),
  components: {
    FilterTable,
    Results,
    TooltipOptionsResponseTime,
    NoDataMessage
  },
  beforeMount() {
    this.setFilters();
    this.loadCatalogs();
  },
  computed: {
    /*
     * This method gets the months to by showed into the rows
     * @return Object[]
     */
    monthColumns() {
      const dateIndex = this.filters.values.findIndex( (item) => item.name === 'date');
      const date = this.filters.values[dateIndex].value;
      const lastMonth = getMonthFromString(date);
      return [...this.monthsKeys].splice(0,lastMonth);
    },
    /*
     * This method gets the header to be showed into the tables
     * @return Object[]
     */
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
      const storage = localStorage.getItem(`response-times-${this.index}`);
      const storageFilters = storage ? JSON.parse( storage ) : {};
      if( Object.keys(storageFilters).length === 0 ) {
        return;
      }

      this.filters.values = storageFilters.values;

      this.radioFilters.compliance = storageFilters.radios.compliance;
      this.radioFilters.decimals = parseInt(storageFilters.radios.decimals);
    },
    /*
     * This method sets into local storage the filters
     */
    setStorageFilters() {
      localStorage.setItem(
        `response-times-${this.index}`,
        JSON.stringify(
          {
            values: this.filters.values,
            radios: {
              compliance: this.radioFilters.compliance,
              decimals: this.radioFilters.decimals
            }
          }
        )
      );
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
      query += `&compliance=${this.radioFilters.compliance}`
      query += `&decimals=${this.radioFilters.decimals}`
      this.$router.push(
        `/response-times/cfs-cbp-operative?${query.replace('buId', 'buId')}`
      );
    },
    /*
     * This method set the title and  subtitle
     */
    setTitle(bu) {
      const title = bu ? `Tiempos de respuesta - ${bu}` : 'Tiempos de respuesta';
      this.emitter.emit("responseTimesTitle", { title });
    },

    /*
     * It downloads the excel file
     */
    download() {
      this.emitter.emit("load", { loading: true });
      const buId = this.filters.values.find( (item) => item.name === 'buId' );
      const allFilters = [
        ...this.filters.values.filter( (item) => !['buId'].includes(item.name) ),
        { name: 'decimals', value: this.radioFilters.decimals },
        { name: 'compliance', value: this.radioFilters.compliance },
        { name: 'buId', value: buId.value }
      ]

      getExcelFileResponseTime( allFilters ).then(
        (response) => {
        const blob = new Blob(
          [response.data], { type: 'application/vnd.ms-excel' }
        )
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.download = `Tablero_tiempos_de_respuesta.xlsx`;
        link.click()
        URL.revokeObjectURL(link.href)
        this.emitter.emit("load", { loading: false });
      }).catch((error) => {
        this.emitter.emit("load", { loading: false });
        this.errorInRequestModal('descargar archivo', error);
      });
    },
    /*
     * It closes the modal
     */
    closeModal() {
      this.modal.open = false;
    },
    /*
     * This method set the error to show the modal
     */
    errorInRequestModal(action, error) {
      this.modal = {
        open: true, ...errorRequestModal(action, error)
      };
    },
    /*
     * This method redirects to show detail of cfs cbp operative
     * @param {Number} cfsId   CFS's ID
     */
    watchDetail(cfsId) {
      let query = '';
      this.filters.values.forEach((item) => {
        if(item.name === 'cfsId') return;

        query +=  item.name + '=' + item.value + '&';
      })

      query += `cfsId=${cfsId}`
      query += `&compliance=${this.radioFilters.compliance}`
      query += `&decimals=${this.radioFilters.decimals}`
      this.$router.push(
        `/response-times/cfs-cbp-operative?${query.replace('buId', 'buId')}`
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
        { name: 'compliance', value: this.radioFilters.compliance },
      ])
    },
    /* 
     * This methods unify the date gotten from the requests
     */
    unifyData(values) {
      let items = [];
      values.forEach( (value) => {
        items = [...items, ...value.data.items];
      });
      return items;
    },
    /*
     * This methos search the date given by the filters
     * @param {Object[]} filters        Filters
     * @param {Object[]} filters[].name   Filter's name
     * @param {Object[]} filters[].value  Filter's value
     */
    searchData(filters = []) {
      if( ! this.validateFilters() ) {
        return;
      }
      this.setStorageFilters();
      const cfses = filters.find( (item) => item.name === 'cfsId' );
      const buId = filters.find( (item) => item.name === 'buId' );
      const allFilters = [
        ...filters.filter( (item) => !['cfsId', 'buId'].includes(item.name) ),
        { name: 'decimals', value: this.radioFilters.decimals },
        { name: 'compliance', value: this.radioFilters.compliance },
      ]

      this.emitter.emit("load", { loading: true });
      Promise.all(
        cfses.value.map( (cfsId) => this.requestData([
          ...allFilters,
          { name: 'cfsId', value: [cfsId] },
          { name: 'buId', value: buId.value }
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
        this.errorInRequestModal('obtener información', error);
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
      const requests = selects.map( ({request, name}) => ({request, name}) );

      Promise.all(
        requests.map( (item) => item.request( 1, 3000, this.nestedFilters(item.name) ) )
      ).then((values) => {
        for( let i = 0; i < requests.length; i++) {
          this.filters.options[i].options = parseCatalog(values[i].data);
        }
        this.emitter.emit("load", { loading: false });
        if( this.filters.values.length ) {
          this.searchData(this.filters.values);
        }
      }).catch((error) => {
        this.emitter.emit("load", { loading: false });
        this.errorInRequestModal('cargar catalogos', error);
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
.v-table__wrapper {
  overflow: unset !important;
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

