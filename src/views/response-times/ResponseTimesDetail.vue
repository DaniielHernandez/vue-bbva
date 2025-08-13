<template>
  <app-bar />
  <simple-section-header :title="title" :icon="icon" :breadcrumbs="breadcrumbs" backPath="/" />
  <div class="d-flex flex-wrap px-12 ga-4">
    <cfs-tooltip
      :setFilter="setRadio"
      :setCBP="setCbpId"
      :cfsId="selectedCfsId"
      :radio="radio"
      @load="setLoad"
    />
    <tooltip-filters
      titleLink="Otras opciones de vista"
      :filters="filters"
      :filtersOptions="filtersResponseTimesDetail"
      @setOption="setOption"
    />
  </div>
  <form :id="nameForm" class="w-100" @submit.prevent="search">
    <v-container fluid class="px-12">
      <v-row justify="start">
        <v-col cols="12" xs="6" md="3">
          <base-select
            :form-id="nameForm"
            :options="options.bu"
            :required="true"
            :value="filters.idBU"
            :invalid="!filters.idBU"
            @value-change="setFilters"
            error-message="Campo requerido"
            label="Business Unit"
            name="idBU"
          />
        </v-col>
        <v-col cols="12" xs="6" md="3">
          <base-select
            :form-id="nameForm"
            :options="options.cfs"
            :required="true"
            :value="filters.idCFS"
            :invalid="!filters.idCFS"
            @value-change="setFilters"
            error-message="Campo requerido"
            label="CFS"
            name="idCFS"
          />
        </v-col>
        <v-col cols="12" xs="6" md="3">
          <date-picker
            :form-id="nameForm"
            :required="true"
            :value="filters.date"
            :invalid="!filters.date"
            error-message="Campo requerido"
            @value-change="(ev) => setFilters({ date: ev.target.value })"
            label="Fecha"
          />
        </v-col>
        <v-col cols="auto">
          <bbva-button-default text="Buscar" type="submit"></bbva-button-default>
        </v-col>
      </v-row>
    </v-container>
  </form>
  <v-container fluid class="pa-4 pa-lg-12 bg-grey-lighten-4">
    <v-row>
      <v-col cols="12">
        <daily-cumulative-compliance
          v-if="data.dailyCumulativeCompliance"
          ref="dailyCumulativeCompliance"
          :data="data.dailyCumulativeCompliance"
          :compliance="filters.compliance"
          :decimals="filters.decimals"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <daily-compliance
          v-if="data.dailyCompliance"
          ref="dailyCompliance"
          :data="data.dailyCompliance"
          :compliance="filters.compliance"
          :decimals="filters.decimals"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
//  Components
import AppBar from '@/components/AppBar/AppBar.vue'
import SimpleSectionHeader from '@/components/headers/SimpleSectionHeader.vue'
import CfsTooltip from '@/components/tooltips/CfsTooltip.vue'
import TooltipFilters from '@/components/tooltips/TooltipFilters.vue'
import DatePicker from '../../components/forms/DatePicker.vue'
import BaseSelect from '@/components/forms/BaseSelect.vue'
import DailyCumulativeCompliance from './graphs/DailyCumulativeCompliance.vue'
import DailyCompliance from './graphs/DailyCompliance.vue'

// Constants
import { filtersResponseTimesDetail } from '@/constants/responseTimesDetail.js'

// Requests
import {
  getDailyComplianceGraphAPI,
  getDailyCumulativeComplianceGraphAPI
} from '@/requests/responseTimes.js'
import { getBusinessUnitsAPI } from '@/requests/businessUnit.js'
import { getCfsModelAPI } from '@/requests/cfs'

// Utils
import { parseCatalog } from '@/utils/form'

export default {
  name: 'ResponseTimesDetail',
  components: {
    AppBar,
    SimpleSectionHeader,
    CfsTooltip,
    TooltipFilters,
    DatePicker,
    BaseSelect,
    DailyCumulativeCompliance,
    DailyCompliance
  },
  data() {
    return {
      // Constants
      icon: '/icons/response-times.svg',
      breadcrumbs: [
        {
          name: 'Resumen Ejecutivo - Tiempos de respuesta',
          href: '/response-times?back=true'
        },
        {
          name: 'BU / CFS / CBP / OPERATIVA',
          href: `/response-times/cfs-cbp-operative`
        },
        {
          name: 'Detalle',
          href: '/response-times/cfs-cbp-operative/detail'
        }
      ],
      filtersResponseTimesDetail,
      nameForm: 'responseTimesDetailForm',

      // Variables
      loading: {
        cfsFilterLoaded: false,
        firstLoad: false
      },
      title: 'Tiempos de respuesta - [BU] - [CFS]',
      options: {
        bu: [],
        cfs: []
      },
      selectedCfsId: null,
      filters: {
        idBU: null,
        idCFS: null,
        idCBP: null,
        idOperative: null,
        date: null,
        decimals: null,
        compliance: null
      },
      data: {
        dailyCompliance: null,
        dailyCumulativeCompliance: null
      },

      // Radio
      radio: {}
    }
  },
  methods: {
    /**
     * Sets the value of a filter and triggers a search.
     *
     * @param {Object} options - The options object.
     * @param {string} options.key - The key of the filter to set.
     * @param {any} options.value - The value to set for the filter.
     * @return {Promise<void>} - A promise that resolves when the search is complete.
     */
    async setOption({ key, value }) {
      this.filters[key] = value
      await this.search()
    },
    /**
     * Sets the value of a radio filter and triggers a search.
     *
     * @param {Object} value - The object containing the name and value of the radio filter.
     * @param {string} value.name - The name of the radio filter.
     * @param {any} value.value - The value of the radio filter.
     * @return {Promise<void>} - A promise that resolves when the search is complete.
     */
    async setRadio(value) {
      if(value.value === this.radio.value && value.name === this.radio.name) return
      if (!value.name || !value.value) {
        this.filters.idCBP = null
        this.filters.idOperative = null
      } else if (value.name === 'operativeId') {
        this.filters.idOperative = value.value
      } else {
        this.filters.idOperative = null
      }
      this.radio = value

      await this.search()
    },
    /**
     * Sets the filters for the component.
     *
     * @param {Object} filter - The filter object containing the new filters to be set
     * @return {void}
     */
    setFilters(filter) {
      this.filters = { ...this.filters, ...filter }
    },
    /**
     * Sets the load status and emits a 'load' event if it's the first load.
     *
     * @return {void}
     */
    setLoad() {
      this.loading.cfsFilterLoaded = true
      if (this.loading.firstLoad) {
        this.emitter.emit('load', { loading: false })
      }
    },
    /**
     * Sets the CBP ID filter to the provided value.
     *
     * @param {Number} cbpId - The ID to set for the CBP filter
     * @return {void}
     */
    setCbpId(cbpId) {
      this.filters.idCBP = cbpId
    },
    /**
     * Loads data based on specified conditions.
     *
     * @param {Boolean} firstTime - Flag indicating if it's the first time loading data
     * @return {Promise<void>} - A promise that resolves when the data is loaded
     */
    async loadData(firstTime = false) {
      const promises = [
        getDailyCumulativeComplianceGraphAPI(this.filters),
        getDailyComplianceGraphAPI(this.filters),
        getCfsModelAPI(1, 1000, [{ name: 'buId', value: this.filters.idBU }])
      ]

      if (firstTime) {
        promises.push(getBusinessUnitsAPI(1, 1000))
      }
      const data = await Promise.all(promises)
      const responseDailyCumulativeCompliance = data[0].data || null
      const responseDailyCompliance = data[1].data || null
      const responseCFS = data[2].data || null
      const parsedCFS = parseCatalog(responseCFS?.items) || []
      this.options.cfs = parsedCFS

      if (firstTime) {
        const responseBU = data[3].data || null
        const parsedBU = parseCatalog(responseBU?.items) || []
        this.options.bu = parsedBU

        this.data.dailyCumulativeCompliance = responseDailyCumulativeCompliance || null
        this.data.dailyCompliance = responseDailyCompliance || null
      } else {
        if (this.selectedCfsId !== this.filters.idCFS) {
          this.selectedCfsId = this.filters.idCFS
          this.loading.cfsFilterLoaded = false
        }
        this.$refs.dailyCumulativeCompliance.updateChart(
          responseDailyCumulativeCompliance,
          this.filters
        )
        this.$refs.dailyCompliance.updateChart(responseDailyCompliance, this.filters)
      }
      const selectedCfs = this.options.cfs.find((cfs) => cfs.id === this.filters.idCFS)
      this.title = `Tiempos de respuesta - ${selectedCfs?.label}`
    },
    /**
     * Asynchronously performs a search operation, emitting 'load' event with loading set to true,
     * loading data, handling errors by emitting 'informational' event with error details, and
     * emitting 'load' event with loading set to false in the end.
     *
     * @return {Promise<void>} - A promise that resolves after the search operation is complete.
     */
    async search() {
      try {
        this.emitter.emit('load', { loading: true })
        await this.loadData()
      } catch (error) {
        this.emitter.emit('informational', {
          type: 'error',
          title: 'Error al obtener la información',
          message: error
        })
      } finally {
        if (this.loading.cfsFilterLoaded) {
          this.emitter.emit('load', { loading: false })
        }
      }
    }
  },
  watch: {
    /**
     *  Asynchronously performs a search operation, emitting 'load' event with loading set to true
     *
     * @return {Promise<void>} - A promise that resolves after the search operation is complete.
     */
    async 'filters.idBU'(value, oldValue) {
      if (value === oldValue || !this.loading.cfsFilterLoaded || !this.loading.firstLoad) return
      this.emitter.emit('load', { loading: true })
      this.filters.idCFS = null
      const responseCFS = await getCfsModelAPI(1, 3000, [
        { name: 'buId', value: this.filters.idBU }
      ])
      const parsedCFS = parseCatalog(responseCFS?.data?.items) || []
      this.options.cfs = parsedCFS
      this.emitter.emit('load', { loading: false })
    }
  },
  /**
   * Asynchronously initializes the component by emitting a 'load' event with loading set to true,
   * parsing the query parameters, setting filters, loading data, handling errors by emitting
   * an 'informational' event with error details, and emitting a 'load' event with loading set to
   * false in the end.
   *
   * @return {Promise<void>} - A promise that resolves after the initialization is complete.
   */
  async created() {
    try {
      this.emitter.emit('load', { loading: true })
      let { buId, cfsId, cbpId, operativeId, date } = this.$route.query

      if (!buId || !cfsId || !date || isNaN(buId) || isNaN(cfsId)) {
        throw new Error('Verifique que los parametros de consulta sean correctos')
      }

      this.breadcrumbs[1].href = `/response-times/cfs-cbp-operative?buId=${buId}&cfsId=${cfsId}&date=${date}`

      // Parse values
      buId = parseInt(buId)
      cfsId = parseInt(cfsId)
      if (cbpId) {
        this.breadcrumbs[1].href = this.breadcrumbs[1].href + `&cbpId=${cbpId}`
        cbpId = parseInt(cbpId)
        this.radio = { name: 'cbpId', value: cbpId }
      }
      if (operativeId) {
        this.breadcrumbs[1].href = this.breadcrumbs[1].href + `&operativeId=${operativeId}`
        operativeId = parseInt(operativeId)
        this.radio = { name: 'operativeId', value: operativeId }
      }

      // Set filters
      this.filters.idBU = buId
      this.filters.idCFS = cfsId
      this.selectedCfsId = cfsId
      this.filters.date = date
      this.filters.idCBP = cbpId || null
      this.filters.idOperative = operativeId || null

      // First load default values
      this.filtersResponseTimesDetail.forEach((filter) => {
        this.filters[filter.name] = filter.defaultValue
      })

      await this.loadData(true)
    } catch (error) {
      this.emitter.emit('informational', {
        type: 'error',
        title: 'Error al obtener la información',
        message: error
      })
    } finally {
      this.loading.firstLoad = true
      if (this.loading.cfsFilterLoaded) {
        this.emitter.emit('load', { loading: false })
      }
    }
  }
}
</script>
