<template>
  <app-bar />
  <simple-section-header
    :title="title"
    :subtitle="subtitle"
    backPath="/"
    :breadcrumbs="breadcrumbs"
    icon="/icons/service-levels.svg"
  />

  <div class="options pl-12">
    <cfs-tooltip :setFilter="setRadio"  :setCBP="setCbpId" :cfsId="cfsId" :radio="radio"/>
    <options-tooltip class="pl-8" :setRadioFilter="setOptions" :radioFilters="options"/>
    <div class="pl-4">
      <bbva-web-link
        class="primary fw-500"
        icon="bbva:download"
        @click="download"
      >
        Descargar
      </bbva-web-link>
    </div>
  </div>
  <filter-table
      v-if="forceRender"
    :filters="filters.options"
    :values="filters.values"
    :nestedFields="nestedFilterFields"
    :validations="validationsFilterFields"
    :clear="false"
    :search="searchFilter"
  />
  <bbva-web-tab-default class="ma-4 ma-lg-12" @selected-change="(evt) => changeTab(evt.detail?.value)">
    <bbva-web-tab-default-item heading="Mapa de calor">
      <heat-map-table :data="data.heatMap" :filters="getAllFilters()" :bu="bu.name"/>
    </bbva-web-tab-default-item>
    <bbva-web-tab-default-item heading="Actividad Mensual">
      <v-container fluid class="pa-4 pa-lg-12 bg-grey-lighten-4">
        <v-row>
          <v-col cols="12">
            <daily-cumulative-availability
              v-if="data.dailyCumulativeAvailability"
              ref="dailyCumulativeAvailability"
              :data="data.dailyCumulativeAvailability"
              :availability="options.availability"
              :decimals="options.decimals"
            />
          </v-col>
          <v-col cols="12">
            <daily-availability
              v-if="data.dailyAvailability"
              ref="dailyAvailability"
              :data="data.dailyAvailability"
              :availability="options.availability"
              :decimals="options.decimals"
            />
          </v-col>
          <v-col cols="12">
            <daily-activity-and-errors
              v-if="data.dailyActivityAndErrors"
              ref="dailyActivityAndErrors"
              :data="data.dailyActivityAndErrors"
            />
          </v-col>
        </v-row>
      </v-container>
    </bbva-web-tab-default-item>
    <bbva-web-tab-default-item heading="Actividad Anual">
      <v-container fluid class="pa-4 pa-lg-12 bg-grey-lighten-4">
        <v-row>
          <v-col cols="12">
            <monthly-cumulative-availability
              v-if="data.monthlyCumulativeAvailability"
              ref="monthlyCumulativeAvailability"
              :data="data.monthlyCumulativeAvailability"
              :availability="options.availability"
              :decimals="options.decimals"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <monthly-activity-and-errors
              v-if="data.monthlyActivityAndErrors"
              ref="monthlyActivityAndErrors"
              :data="data.monthlyActivityAndErrors"
            />
          </v-col>
        </v-row>
      </v-container>
    </bbva-web-tab-default-item>
    <bbva-web-tab-default-item heading="Impactos del mes">
      <v-container fluid class="pa-4">
        <v-row>
          <v-col cols="12">
            <monthly-impacts
              v-if="data.monthlyImpacts"
              ref="monthlyImpacts"
              :data="data.monthlyImpacts"
              @search="searchImpacts"
              @load-more="loadMoreImpacts"
            />
          </v-col>
        </v-row>
      </v-container>
    </bbva-web-tab-default-item>
  </bbva-web-tab-default>
</template>
<script>
//  Components
import '@/components/bbva-web-components/bbva-web-tab-default.js'
import '@/components/bbva-web-components/bbva-web-link.js'
import AppBar from '@/components/AppBar/AppBar.vue'
import SimpleSectionHeader from '@/components/headers/SimpleSectionHeader.vue'
import FilterTable from '@/components/table/FilterTable.vue'
import DailyAvailability from './graphs/monthly/DailyAvailability.vue'
import DailyCumulativeAvailability from './graphs/monthly/DailyCumulativeAvailability.vue'
import DailyActivityAndErrors from './graphs/monthly/DailyActivityAndErrors.vue'
import MonthlyActivityAndErrors from './graphs/annual/MonthlyActivityAndErrors.vue';
import MonthlyCumulativeAvailability from './graphs/annual/MonthlyCumulativeAvailability.vue'
import CfsTooltip from '@/components/tooltips/CfsTooltip.vue';
import OptionsTooltip from '@/components/tooltips/OptionsTooltip.vue';
import HeatMapTable from '@/components/table/HeatMapTable.vue'
import MonthlyImpacts from '@/components/table/MonthlyImpacts.vue'

// Utils
import { errorRequestModal } from '@/utils/informationModal'
import { parseCatalog } from '@/utils/form'

// Constants
import {
  filters, nestedFilterFields, validationsFilterFields
} from '@/constants/serviceLevelDetail.js'
import {
  formatStringDate
} from '@/utils/general';


// Requests
import { 
  getDailyAvailabilityAPI,
  getDailyCumulativeAvailabilityAPI,
  getDailyActivityAndErrorsAPI,
  getMonthlyActivityAndErrorsAPI,
  getMonthlyCumulativeAvailabilityAPI,
  getMonthlyImpactsAPI,
  getExcelMonthlyImpactsAPI
} from '@/requests/availability'
import { getExcelFileHeatMap, getHeatMapAPI, getHeatMapFooterAPI } from '@/requests/heatMap.js';

import { nextTick } from 'vue'

/*
 * View to show heat map and graphs
 */
export default {
  name: 'DetailView',
  components: {
    AppBar,
    SimpleSectionHeader,
    FilterTable,
    CfsTooltip,
    OptionsTooltip,
    DailyAvailability,
    DailyCumulativeAvailability,
    DailyActivityAndErrors,
    MonthlyActivityAndErrors,
    MonthlyCumulativeAvailability,
    HeatMapTable,
    MonthlyImpacts
  },
  data() {
    return {
      /* BU's data*/
      bu: {
        name: ''
      },
      /* Header Title */
      title: 'Disponibilidad',
      /* Header Subtitle */
      subtitle: '',
      /* Breaddrumbs */
      breadcrumbs: [],
      /* Input filters */
      filters: { values: [], options: filters},
      /* Flag to force render the filters*/
      forceRender: true,
      /* nested field on the filters*/
      nestedFilterFields,
      /* Validation used by the filters */
      validationsFilterFields,
      /* CBP's ID filter*/
      cbpId: null,
      /* */
      cfsId: null,
      /* Data used by the graphs*/
      data: {
        dailyAvailability: null,
        dailyCumulativeAvailability: null,
        dailyActivityAndErrors: null,
        monthlyActivityAndErrors: null,
        monthlyCumulativeAvailability: null,
        monthlyImpacts: null
      },
      /* Radio filters */
      radio: {}, 
      /* Option filters */
      options: {
        availability: true,
        decimals: 2
      },
      selectedTab: 0
    }
  },
  methods: {
    /**
     * errorInRequestModal function handles errors in request modals.
     *
     * @param {String} action - description of the action
     * @param {Error} error - description of the error
     * @return {Void} opens the modal with the error message
     */
    errorInRequestModal(action, error) {
      this.modal = {
        open: true, ...errorRequestModal(action, error)
      };
    },
    /**
     * Change the selected tab to the given value.
     *
     * @param {Number} value - the new tab value
     * @return {Void} 
     */
    changeTab(value) {
      this.selectedTab = value;
    },
    /**
     * Asynchronously searches impacts based on the provided monthly filters.
     *
     * @param {Object} monthlyFilters - The monthly filters to be applied to the search.
     * @return {Promise} A promise that resolves with the response data from the search.
     */
    async searchImpacts(monthlyFilters) {
      const monthlyImpactsFilters = this.getMonthlyImpactsFilters()
      const filters = { ...monthlyImpactsFilters, ...monthlyFilters }
      const { data: responseMonthlyImpacts } = await getMonthlyImpactsAPI(filters)
      this.$refs.monthlyImpacts.updateData(responseMonthlyImpacts)
    },
    /**
     * Loads more impacts based on the given monthly filters.
     *
     * @param {Object} monthlyFilters - The monthly filters to apply.
     * @return {Promise<void>} A promise that resolves when the impacts are loaded.
     */
    async loadMoreImpacts(monthlyFilters) {
      const monthlyImpactsFilters = this.getMonthlyImpactsFilters()
      const filters = { ...monthlyImpactsFilters, ...monthlyFilters }

      this.emitter.emit("load", { loading: true })
      const { data: responseMonthlyImpacts } = await getMonthlyImpactsAPI(filters)
      this.emitter.emit("load", { loading: false })
      this.$refs.monthlyImpacts.getMoreData(responseMonthlyImpacts)
    },
  /**
   * Downloads a file based on the selected tab and filters.
   *
   * @return {Promise<void>} A promise that resolves when the file is downloaded.
   */
    async download() {
      try {
        this.emitter.emit("load", { loading: true })

        let filename
        let responseData

        const allFilters = this.getAllFilters()
        if (this.selectedTab === 3) {
          const response = await getExcelMonthlyImpactsAPI({ 
            buId: allFilters.find( (item) => item.name === 'buId')?.value,
            cfsId: allFilters.find( (item) => item.name === 'cfsId')?.value,
            date: allFilters.find( (item) => item.name === 'date')?.value,
          })
          responseData = response.data
          filename = 'Impactos_mensuales.xlsx'
        } else {
          const response = await getExcelFileHeatMap(this.getAllFilters())
          responseData = response.data
          filename = 'Mapa_de_calor.xlsx'
        }

        const blob = new Blob([responseData], { type: 'application/vnd.ms-excel' })
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.download = filename
        link.click()
        URL.revokeObjectURL(link.href)

      } catch (error) {
        this.errorInRequestModal('descargar archivo', error)
      } finally {
        this.emitter.emit("load", { loading: false })
      }
    },

    /*
     * This method saves the values 
     */
    setTitle() {
      const buId = this.filters.values.find( (item) => item.name === 'buId')?.value;
      const cfsId = this.filters.values.find( (item) => item.name === 'cfsId')?.value;
      const bu  = this.filters.options.find((item) => item.name === 'buId').options.find(
        (item) => item.id === buId
      );
      const cfs = this.filters.options.find((item) => item.name === 'cfsId').options.find(
        (item) => item.id === cfsId
      )
      const dateIndex = this.filters.values.findIndex( (item) => item.name === 'date');
      const date = this.filters.values[dateIndex].value;

      this.title = `Disponibilidad - ${cfs?.label}`
      this.subtitle = `Resultados al ${ formatStringDate( date ) }`;
      this.bu.name = bu?.label
    },

    /*
     * Force to update the filters
     */
    async forceUpdate() {
      this.forceRender = false;
      await nextTick();
      this.forceRender = true;
    },
    /*
     * Get all the filters in format required
     */
    getAllFilters() {
      const allFilters = [
        ...this.filters.values,
        { name: 'availability', value: this.options.availability ? 1 : 0 },
        { name: 'decimals', value: this.options.decimals },
      ];

      if( this.radio.name ) allFilters.push( this.radio );

      allFilters.push({ name: 'cbpId', value: this.cbpId });

      return allFilters;
    },
    /**
     * Retrieves the filters required for fetching monthly impacts.
     *
     * @return {Object} The filters object
     */
    getMonthlyImpactsFilters() {
      const allFilters = this.getAllFilters();
      const filters = {
        buId: allFilters.find( (item) => item.name === 'buId' )?.value,
        cfsId: allFilters.find( (item) => item.name === 'cfsId' )?.value,
        date: allFilters.find( (item) => item.name === 'date' )?.value,
        cbpId: this.cbpId || allFilters.find( (item) => item.name === 'cbpId' )?.value || null,
        operativeId: allFilters.find( (item) => item.name === 'operativeId' )?.value || null,
        pageNumber: 1,
        pageSize: 5,
        ticketNumber: null,
        ticketProblem: null,
        order: null,
        filter: null
      }
      return filters;
    },
    /*
     * Validate if the required filters exists
     * @param {Object[]} filters Array with tye filters to send
     * @return Boolean Flag, true if it's valid
     */
    validateRequiredFilters(filters) {
      let valid = true;
      const required = ['buId', 'cfsId', 'date', 'decimals'];

      if( filters.length === 0 ) return false;

      filters.every( (field) => {
        if( required.includes( field.name ) ) {
          valid = typeof(field.value) === 'boolean' ? true : !!field.value;
        }
        return valid;
      });
      return valid;
    },
    /*
     * Search the data used by the graphs
     */
    search() {
      const allFiltersValues = this.getAllFilters();
      if( !this.validateRequiredFilters(allFiltersValues) ) {
        return;
      }

      const monthlyImpactsFilters = this.getMonthlyImpactsFilters();

      this.emitter.emit('load', { loading: true });
      Promise.all([
        getDailyAvailabilityAPI(allFiltersValues),
        getDailyCumulativeAvailabilityAPI(allFiltersValues),
        getDailyActivityAndErrorsAPI(allFiltersValues),
        getMonthlyActivityAndErrorsAPI(allFiltersValues),
        getMonthlyCumulativeAvailabilityAPI(allFiltersValues),
        getHeatMapAPI(allFiltersValues),
        getHeatMapFooterAPI(allFiltersValues),
        getMonthlyImpactsAPI(monthlyImpactsFilters)
      ]).then( (values) => {
        this.setTitle();
        this.data.dailyAvailability = values[0].data;
        this.data.dailyCumulativeAvailability = values[1].data;
        this.data.dailyActivityAndErrors = values[2].data;
        this.data.monthlyActivityAndErrors = values[3].data;
        this.data.monthlyCumulativeAvailability = values[4].data;
        this.data.heatMap = {...values[5].data, ...values[6].data};
        this.data.monthlyImpacts = values[7].data;

        this.$refs.dailyAvailability.updateChart(this.data.dailyAvailability, this.options)
        this.$refs.dailyCumulativeAvailability.updateChart(this.data.dailyCumulativeAvailability, this.options)
        this.$refs.dailyActivityAndErrors.updateChart(this.data.dailyActivityAndErrors, this.options)
        this.$refs.monthlyActivityAndErrors.updateChart(this.data.monthlyActivityAndErrors)
        this.$refs.monthlyCumulativeAvailability.updateChart(this.data.monthlyCumulativeAvailability, this.options)
        this.$refs.monthlyImpacts.updateData(this.data.monthlyImpacts)
      }).catch( (error) => {
        this.emitter.emit('error', { action: 'cargar Disponibilidad',  error });
      }).finally(() => {
        this.emitter.emit('load', { loading: false });
      });
    },
    /*
     * Load the catalogs used by the filters
     */
    loadCatalogs() {
      this.emitter.emit('load', { loading: true })
      const selects = this.filters.options.filter((item) => !!item.request)
      const requests = selects.map(({ request }) => request)
      const bu = this.filters.values.find( (item) => item.name === 'buId' );
      const indexCfs = this.filters.options.findIndex( (item) => item.name === 'cfsId' );

      Promise.all(
        requests.map(
          (request, index) =>  (
            index === indexCfs ? request(1,3000, [ bu ]) : request(1,3000)
           )
        )
      ).then(async (values) => {
        for (let i = 0; i < requests.length; i++) {
          this.filters.options[i].options = parseCatalog( values[i].data )
        }
        this.setTitle();
        this.forceUpdate();
        const allFilters = this.getAllFilters();
        const monthlyImpactsFilters = this.getMonthlyImpactsFilters()
        await Promise.all([
          getDailyAvailabilityAPI( allFilters ),
          getDailyCumulativeAvailabilityAPI( allFilters ),
          getDailyActivityAndErrorsAPI( allFilters ),
          getMonthlyActivityAndErrorsAPI( allFilters ),
          getMonthlyCumulativeAvailabilityAPI( allFilters ),
          getHeatMapAPI(allFilters),
          getHeatMapFooterAPI(allFilters),
          getMonthlyImpactsAPI(monthlyImpactsFilters)
        ]).then((responses) => {
          const responseDailyAvailability = responses[0]
          this.data.dailyAvailability = responseDailyAvailability.data;

          const responseDailyCumulativeAvailability = responses[1]
          this.data.dailyCumulativeAvailability = responseDailyCumulativeAvailability.data;

          const responseDailyActivityAndErrors = responses[2]
          this.data.dailyActivityAndErrors = responseDailyActivityAndErrors.data

          const responseMonthlyActivityAndErrors = responses[3]
          this.data.monthlyActivityAndErrors = responseMonthlyActivityAndErrors.data

          const responseMonthlyCumulativeAvailability = responses[4]
          this.data.monthlyCumulativeAvailability = responseMonthlyCumulativeAvailability.data

          this.data.heatMap = {...responses[5].data, ...responses[6].data};

          const responseMonthlyImpacts = responses[7]
          this.data.monthlyImpacts = responseMonthlyImpacts.data
        })
      })
      .catch((error) => {
        this.emitter.emit('error', { action: 'cargar catalogos',  error });
      })
      .finally(() => {
        this.emitter.emit('load', { loading: false })
      })
    },
    /*
     * Set filter options, availability or decimals
     * @param {String} key    Field's name
     * @param {String} value  Field's value 
     */
    setOptions(key, value) {
      if( this.options[key] === value) return;

      this.options[key] = value;
      this.search();
    },
    /*
     * Set the radio filter, cbpId or operativeId
     * @param {Object}  value  Object with the format { name: 'Some', value: 'Any' '}
     */
    setRadio(value) {
      if( value.name && this.radio.name === value.name && this.radio.value === value.value ) {
        return;
      }
      this.radio = value;
      this.search();
    },
    /*
     * Set the filter CBP's ID
     */
    setCbpId(cbpId) {
      this.cbpId = cbpId; 
    },
    /*
     * Load the breacrumbs
     */
    loadBreadcrumbs() {
      const query = this.$route.fullPath.match(/\?.*/)[0];
      this.breadcrumbs = [
        {
          name: 'Resumen ejecutivo - Disponibilidad',
          href: '/service-levels?back=true'
        },
        {
          name: 'BU - CFS / CBP / OPERATIVA',
          href: `/service-levels/cfs-cbp-operative${query}`
        },
        {
          name: 'Detalle',
          href: '/service-levels/cfs-cbp-operative/detail'
        }
      ];
    },
    /*
     * Search the data given the filters
     */
    searchFilter(filters) {
      this.filters.values = [...filters];
      const filterCfsId = filters.find( (item) => item.name === 'cfsId' )?.value;
      if( this.cfsId !== filterCfsId ) {
        this.cfsId = filterCfsId;
        this.radio = {};
        this.cbpId = null;
      }
      this.search();
    },
    /*
     * Load the initial filters
     */
    setFilters() {
      this.filters.values = [
        { name: 'date', value: this.$route.query.date },
        { name: 'cfsId', value: parseInt(this.$route.query.cfsId) },
        { name: 'buId', value: parseInt(this.$route.query.buId) }
      ];

      const fieldRadio = this.$route.query.operativeId ? 'operativeId' : 'cbpId';
      this.options = {
        availability: this.$route.query.availability === 'true',
        decimals: parseInt(this.$route.query.decimals)
      }

      this.cbpId = parseInt( this.$route.query.cbpId );

      this.radio = { value: parseInt(this.$route.query[fieldRadio]), name: fieldRadio }
    }
  },
  /*
   * Loads the initial data as filter, catalogs, breadcrumbs and the data for the graphs
   */
  beforeMount() {
    this.cfsId = parseInt(this.$route.query.cfsId);
    this.setFilters();
    this.loadCatalogs();
    this.loadBreadcrumbs();
  }
}
</script>


<style>
.options {
  display: flex;
}
</style>
