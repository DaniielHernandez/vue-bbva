<template>
  <app-bar></app-bar>
  <v-container fluid class="pl-12">
    <v-row justify="space-between" >
      <v-col>
        <div class="d-flex pt-4">
          <img src="/icons/omegaReport.svg" alt="Icono de la sección"/>
          <span class="pl-1 fs-18 fw-500 pt-2">
            Informe Omega
          </span>
        </div>
      </v-col>
    </v-row>
    <v-row justify="space-between" >
      <v-col class="d-flex pb-0">
          <options-tooltip :setRadioFilter="setRadioFilter" :radioFilters="radioFilters"
            :index="index"/>
          <bbva-web-link
            class="primary fw-500 pl-3 pb-4"
            :disabled="!filters.length"
            icon="bbva:download"
            @click="download"
          >
          Descargar
          </bbva-web-link>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" class="pb-0 pt-0">
        <filter-omega-report  :search="searchFilter"/>
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
           :message="filters.length ? 'No hay datos para los filtros seleccionados' :
                    'No hay datos que mostrar en la tabla'"
        />
      </v-col>
    </v-row>
    <v-row v-else>
      <v-col>
        <v-table>
          <thead>
            <th class="text-left header-omega-report" >
              <bbva-web-table-header-text
                order=""
                id="bu"
                :sort-active="orderBy === 'bu'"
                class="pl-4"
                @sort-criteria="(evt) => sortTable('bu')"
                >
                BUSINESS UNIT
              </bbva-web-table-header-text>
            </th>
            <th class="text-left header-omega-report">
              <bbva-web-table-header-text
                class="pl-4"
                id="cfs"
                order=""
                :sort-active="orderBy === 'cfs'"
                @sort-criteria="(evt) => sortTable('cfs')"
                >
                CFS
              </bbva-web-table-header-text>
            </th>
            <th class="text-left header-omega-report">
              <bbva-web-table-header-text
                class="pl-4"
                >
                EXPECTED
              </bbva-web-table-header-text>
            </th>
            <th class="text-left header-omega-report pl-4">
              <bbva-web-table-header-text>
                MINIMUM
              </bbva-web-table-header-text>
            </th>
            <th class="text-left header-omega-report pl-4">
              <bbva-web-table-header-text>
                STRETCHED
              </bbva-web-table-header-text>
            </th>
            <th
              v-for="(month, index) in monthsHeaders"
              :key="`header-month-${index}`"
              class="text-left header-omega-report"
            >
              <bbva-web-table-header-text class="pl-4">
                {{ month }}
              </bbva-web-table-header-text>
            </th>
          </thead>
          <tbody>
            <tr v-for="(item, index) in data"
                :key="`row-omega-table-${index}`"
              >
              <td  class="border-gray fs-14">{{ `${item.bu}` }}</td>
              <td  class="border-gray fs-14">{{ `${item.cfs}` }}</td>
              <td  class="border-gray fs-14">
                {{ item.expected ? `${item.expected}%` : '-' }}
              </td>
              <td  class="border-gray fs-14">
                {{ item.minimum ? `${item.minimum}%` : '-' }}
              </td>
              <td  class="border-gray fs-14">
                {{ item.stretched ? `${item.stretched}%` : '-' }}
              </td>
              <td
                v-for="(month, indexMonth) in item.months"
                :key="`row-omega-table-month-${index}-${indexMonth}`"
                class="text-white border-white fs-14 fw-501"
                :style="`
                  background-color: ${month.color};
                  ${month.color ===  '#F8CD51' ? 'color: black !important;': ''}
                `"
              >
              {{ month.value === null ? '-' : `${month.value}%` }}
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-col>
    </v-row>
    <v-row justify="center" v-if="data.length">
      <v-col sm="4" md="4" lg="3">
        <bbva-web-table-footer
           v-if="total > data.length"
           @click="loadMore"
           class="load-more"
          :loading="loading" loading-text="Cargando">Ver más</bbva-web-table-footer>
        <span v-else class="no-more">no hay más registros por mostrar</span>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
// Components
import AppBar from "@/components/AppBar/AppBar.vue";
import '@/components/bbva-web-components/bbva-web-table-header.js'
import '@/components/bbva-web-components/bbva-web-table-footer.js'
import OptionsTooltip from '@/components/tooltips/OptionsTooltip.vue';
import Results from '@/components/serviceLevels/Results.vue';
import FilterOmegaReport from '@/components/table/FilterOmegaReport.vue';
import NoDataMessage from '@/components/utils/NoDataMessage.vue'
// Request
import { getExcelFileOmegaReport, getOmegaReportAPI } from '@/requests/omegaReport.js';
// Utils
import { getMonthFromString } from '@/utils/general.js';
// constants
import { pagination } from '@/constants/pagination';

export default {
  data() {
    return {
      /* Sort the table, it can be ASC or DESC */
      order: 'DESC',
      /* It has the value to sort by BU or CFS*/
      orderBy: 'bu',
      /* Value of the input date */
      date: null,
      page: { ...pagination },
      /* Table's data */
      data: [],
      /* Total of items */
      total: 0,
      /* Table's Filter*/
      filters: [],
      /* Radio filters */
      radioFilters: { decimals: 2, availability: true },
    };
  },
  components: {
    AppBar,
    OptionsTooltip,
    Results,
    FilterOmegaReport,
    NoDataMessage,
  },
  computed: {
    /*
     * It makes the headers for the months given the date selected
     */
    monthsHeaders() {
      const headers = [];
      if( !this.date ) {
        return headers;
      }
      const month = getMonthFromString(this.date);
      const months = [
        'ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO',
        'SEP', 'OCT', 'NOV', 'DIC'
      ];

      months.every( (item, index) => {
        if( index >= month ) {
          return false
        }
        headers.push(item);
        return true;
      });
      return headers;
    }
  },
  methods: {
    /*
     * It sort the table by any header
     * @param {String} header Header's name
     */
    sortTable(header) {
      const tag = document.getElementById(header);
      if( this.order === 'ASC' ) {
        tag.removeAttribute('sort-ascending');
        tag.setAttribute('sort-descending', true);
      } else {
        tag.removeAttribute('sort-descending');
        tag.setAttribute('sort-ascending', true);
      }
      this.orderBy = header,
      this.order = this.order === 'ASC' ? 'DESC' : 'ASC'
      this.search(1, this.page.size);
    },
    /*
     * It loads more data to be showed into the table
     */
    loadMore() {
      this.search(this.page.number + 1, this.page.size);
    },
    /*
     * It sets the radio filters values
     *
     * @param {String}         key     Field's name
     * @param {Boolean|Number}  value   Field's value
     */
    setRadioFilter(key, value) {
      this.radioFilters[key] = value;
      this.filters = [
        ...this.filters,
        { name: 'decimals', value: this.radioFilters.decimals },
        { name: 'availability', value: this.radioFilters.availability ? 1 : 0 },
      ];

      if( !this.filters.length ) {
        return;
      }
      this.search(1, pagination.size);
    },
    /*
     * It downloads the excel file
     */
    download() {
      this.emitter.emit("load", { loading: true });
      getExcelFileOmegaReport([
        ...this.filters,
        { name: 'decimals', value: this.radioFilters.decimals },
        { name: 'availablity', value: this.radioFilters.availability ? 1 : 0}
      ]).then(
        (response) => {
        const blob = new Blob(
          [response.data], { type: 'application/vnd.ms-excel' }
        )
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.download = `omeg-report.xlsx`;
        link.click()
        URL.revokeObjectURL(link.href)
        this.emitter.emit("load", { loading: false });
      }).catch((error) => {
        this.emitter.emit("load", { loading: false });
        this.emitter.emit('error', { action: 'descargar archivo',  error });
      });

    },
    /*
     * It saves the filters, add the radio filters and executes the search method
     * @param {Object[]} values  It has the filters { name: 'some name', value: 'some' }
     *
     */
    searchFilter(values) {
      this.filters = [
        ...values,
        { name: 'decimals', value: this.radioFilters.decimals },
        { name: 'availability', value: this.radioFilters.availability ? 1 : 0},
      ];
      this.search(1, 20)
    },
    /*
     * It gets the data to be showed by the table
     * @param {Number} pageNumber Page's number
     * @param {Number} pageSize Page's size
     */
    search(pageNumber, pageSize) {
      this.emitter.emit("load", { loading: true });
      getOmegaReportAPI(
        pageNumber, pageSize,
        [
          { name: 'order', value: this.order },
          { name: 'orderBy', value: this.orderBy },
          ...this.filters
        ]
      ).then( (response) => {
        this.emitter.emit("load", { loading: false });
        if( pageNumber === 1 ) {
          this.data = response.data.items;
        } else {
          this.data = [...this.data, ...response.data.items];
        }
        this.page.number = pageNumber;
        this.page.size = pageSize;
        this.total = response.data.count;
        this.date = this.filters.find( (item) => item.name === 'date').value;
      }).catch( (error) => {
        this.emitter.emit("load", { loading: false });
        this.emitter.emit('error', { action: 'cargar tabla',  error });
      });
    }
  }
};
</script>

<style>
.header-omega-report-text {
  font-size: 12px;
  color: #666666;
}
.header-omega-report {
  border-bottom: thin solid rgba(var(--v-border-color),var(--v-border-opacity));
  background: white;
}

.border-gray {
  border-bottom: 1px solid #E0E0E0 !important;
}
.border-white {
  border: 1px solid white !important;
}
.no-more {
  color: #666666;
  font-size: 12px;
  font-weight: 350 !important;
}
.fw-501 {
  font-weight: 501;
}
</style>
