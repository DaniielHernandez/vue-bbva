<template>
  <app-bar />
  <simple-section-header :title="title" :subtitle="subtitle" :icon="icon" backLabel="" />
  <v-container fluid class="px-12" v-if="firstLoad">
    <v-row>
      <v-col cols="auto">
        <span class="fs-15 fw-500">VISUALIZAR Y ACOTAR IMPACTO</span>
      </v-col>
      <v-col cols="auto">
        <tooltip-filter
          v-if="optionsInterval.length > 0 && filters.interval"
          :options="optionsInterval"
          :value="filters.interval"
          @value-change="setFiltersAndSearch"
          filterName="interval"
          icon="bbva:clock"
          optionsTitle="Selecciona un intervalo"
          title="Resolución de la gráfica"
        />
      </v-col>
      <v-col cols="auto">
        <tooltip-filter
          v-if="optionsElements.length > 0 && filters.elements"
          :options="optionsElements"
          :value="filters.elements"
          @value-change="setFiltersAndSearch"
          filterName="elements"
          icon="bbva:graphics"
          optionsTitle="Selecciona una serie gráfica"
          title="Elementos a graficar"
        />
      </v-col>
    </v-row>
    <v-row>
      <form ref="impactForm" :id="nameForm" class="w-100" @submit.prevent="searchForm" novalidate>
        <v-container fluid>
          <v-row>
            <v-col cols="12" xs="12" sm="6" md="3" lg="3" xl="3">
              <base-select
                v-if="optionsOperations.length > 0 && filters.operativeId"
                :form-id="nameForm"
                :options="optionsOperations"
                :required="true"
                :value="filters.operativeId"
                :invalid="!filters.operativeId"
                @value-change="setFilters"
                label="Operativas"
                name="operativeId"
              />
            </v-col>
            <v-col cols="12" xs="12" sm="6" md="3" lg="3" xl="3">
              <base-field-time
                v-if="filters.time.start"
                :form-id="nameForm"
                :pattern="timePattern"
                :required="true"
                :step="step"
                :value="filters.time.start"
                @value-change="
                  ({ start }) => {
                    setFilters({ time: { start } })
                    reloadEndTime()
                  }
                "
                :error-message="`Valor en periodos de ${intervalText}`"
                label="Hora inicio"
                name="start"
              />
            </v-col>
            <v-col cols="12" xs="12" sm="6" md="3" lg="3" xl="3">
              <base-field-time
                v-if="filters.time.end"
                :form-id="nameForm"
                :min="minEndTime"
                :pattern="timePattern"
                :required="true"
                :step="step"
                :value="filters.time.end"
                @value-change="({ end }) => setFilters({ time: { end } })"
                :error-message="`Valor en periodos de ${intervalText} y mayor al de inicio`"
                label="Hora final"
                name="end"
              />
            </v-col>
            <v-col cols="12" xs="12" sm="6" md="3" lg="3" xl="3">
              <bbva-button-default class="w-100" text="Cambiar" type="submit">
              </bbva-button-default>
            </v-col>
          </v-row>
        </v-container>
      </form>
    </v-row>
    <v-row>
      <v-col cols="12">
        <imapct-graph
          ref="impactGraph"
          v-if="data.imapctGraphData"
          :data="data.imapctGraphData"
          @update-day="updateDay"
          @updateVisibility="updateVisibility"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" xs="12" sm="12" md="8" lg="8" xl="8">
        <impact-adjust-form
          ref="impactAdjustForm"
          :data="filters"
          :operations="optionsOperations"
          @create-adjust-impact="createAdjustImpact"
        />
      </v-col>
      <v-col cols="12" xs="12" sm="12" md="4" lg="4" xl="4">
        <ticket-form :data="ticketFilters" :buId="filters.buId" />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
// Components
import AppBar from '@/components/AppBar/AppBar.vue'
import SimpleSectionHeader from '@/components/headers/SimpleSectionHeader.vue'
import TooltipFilter from '@/components/tooltips/TooltipFilter.vue'
import BaseSelect from '@/components/forms/BaseSelect.vue'
import BaseFieldTime from '@/components/forms/BaseFieldTime.vue'
import ImapctGraph from '@/views/service-levels/graphs/ImpactGraph.vue'
import ImpactAdjustForm from '@/components/forms/ImpactAdjustForm.vue'
import TicketForm from '@/components/forms/TicketForm.vue'

// Constants
import { optionsInterval, optionsElements, timePattern } from '@/constants/impact'

// Requests
import {
  getOperationsByCfsId,
  getSimilarImpactDays,
  getImpactGraphData,
  createAdjustmentImpact
} from '@/requests/impactAdjustments'
import { getBusinessUnitAPI } from '@/requests/businessUnit'

// Utils
import { formatDateWhitSlash, addMinutesToTime } from '@/utils/general'

export default {
  name: 'ImpactView',
  components: {
    AppBar,
    SimpleSectionHeader,
    TooltipFilter,
    BaseSelect,
    BaseFieldTime,
    ImapctGraph,
    ImpactAdjustForm,
    TicketForm
  },
  data() {
    return {
      // Constants
      nameForm: 'impact-form',
      optionsInterval,
      optionsElements,
      icon: '/icons/service-levels.svg',
      timePattern,
      addMinutesToTime,

      // Variables
      title: 'Gráficas y ajustes - Disponibilidad - [BU] - [CFS] ',
      subtitle: 'Operativa: [NAME] · Fecha: [DD/MM/YYYY]',
      optionsOperations: [],
      filters: {
        buId: null,
        cfsId: null,
        cbpId: null,
        operativeId: null,
        interval: null,
        elements: null,
        time: {
          start: null,
          end: null
        },
        dates: []
      },
      firstLoad: false,
      data: {
        imapctGraphData: null
      },
      ticketFilters: {
        adjustmentId: null
      }
    }
  },
  computed: {
    /**
     * A description of the entire function.
     *
     * @return {number} the result of multiplying this.filters.interval by 60
     */
    step() {
      return this.filters.interval * 60
    },
    /**
     * Calculate the minimum end time based on the start time and interval.
     *
     * @return {String} returns the minimum end time on the format 'HH:MM'
     */
    minEndTime() {
      return this.addMinutesToTime(this.filters.time.start, this.filters.interval)
    },
    /**
     * Returns a string representing the interval text based on the value of `filters.interval`.
     *
     * @return {string} the interval text
     */
    intervalText() {
      let text = ''
      if (this.filters.interval === 5) {
        text = '5min'
      } else if (this.filters.interval === 60) {
        text = '1 hora'
      }
      return text
    }
  },
  methods: {
    /**
     * Set the filters for the component.
     *
     * @param {Object} filters - The new filters to be set
     * @return {void}
     */
    setFilters(filters) {
      // if filters has a time object, copy it to filters.time
      this.filters = {
        ...this.filters,
        ...filters,
        time: filters.time ? { ...this.filters.time, ...filters.time } : this.filters.time
      }
    },
    /**
     * Reloads the end time by temporarily setting it to null, then restoring it to its original value.
     *
     * @return {void}
     */
    reloadEndTime() {
      const endTime = this.filters.time.end
      this.filters.time.end = null
      this.$nextTick(() => {
        this.filters.time.end = endTime
      })
    },
    setFiltersAndSearch(filters) {
      this.setFilters(filters)
      this.searchForm()
    },
    /**
     * Update the specified day in the filters and trigger a search.
     *
     * @param {Object} day - The day object to update
     * @return {void}
     */
    updateDay(day) {
      this.filters.dates[day.index].day = day.day
      this.search()
    },
    /**
     * Update the visibility of the specified day in the filters.
     *
     * @param {Object} day - The day object to update
     * @return {void}
     */
    updateVisibility(day) {
      this.filters.dates[day.index].visible = day.visible
    },
    /**
     * Perform a search operation and update the impact graph data based on the applied filters.
     *
     * @return {Promise<void>} A Promise that resolves once the search operation and impact graph update are complete.
     */
    async search() {
      try {
        this.emitter.emit('load', { loading: true })
        const filtersWhitoutElements = {
          ...this.filters,
          dates: this.filters.dates.map((item) => item.day)
        }
        delete filtersWhitoutElements.elements
        const { data: responseImapctGraph } = await getImpactGraphData(filtersWhitoutElements)
        this.data.imapctGraphData = responseImapctGraph
        this.$refs.impactGraph.updateChart(this.data.imapctGraphData, this.filters)
        this.$refs.impactAdjustForm.update(this.filters)
      } catch (error) {
        const obj = {
          type: 'error',
          title: 'Error al obtener la información',
          message: error
        }
        this.emitter.emit('informational', obj)
      } finally {
        this.emitter.emit('load', { loading: false })
      }
    },
    /**
     * Function for handling the search form submission.
     *
     * @param {Event} e - the event object for the form submission
     * @return {void}
     */
    searchForm() {
      if (this.$refs.impactForm?.checkValidity()) {
        this.search()
      }
    },
    /**
     * Creates an adjusted impact based on the provided filters.
     *
     * @param {Object} filtersAdjust - The filters for adjusting the impact
     * @return {void}
     */
    async createAdjustImpact(filtersAdjust) {
      const obj = {}
      try {
        this.emitter.emit('load', { loading: true })
        const similarDays = this.filters.dates.slice(1)
        const daysSimilarDays = similarDays.filter((item) => item.visible).map((item) => item.day)
        const filtersToSend = {
          idScenery: filtersAdjust.scenarioId,
          buId: this.filters.buId,
          cfsId: this.filters.cfsId,
          operativesIds: filtersAdjust.operativesIds,
          similarDays: daysSimilarDays,
          timeZones: filtersAdjust.data
        }
        const { data: responseAdjust } = await createAdjustmentImpact(filtersToSend)
        this.ticketFilters.adjustmentId = responseAdjust.id
        obj.type = 'success'
        obj.title = 'Impacto Ajustado'
        obj.message = 'Se ha ajustado la franja del impacto correctamente'
      } catch (error) {
        obj.type = 'error'
        obj.title = 'Impacto No Ajustado'
        obj.message = error.response.data.message || error.message
      } finally {
        this.emitter.emit('informational', obj)
        this.emitter.emit('load', { loading: false })
      }
    }
  },
  /**
   * Lifecycle hook that is called right before a Vue instance is mounted.
   *
   * @return {Promise<void>}
   */
  async mounted() {
    try {
      this.emitter.emit('load', { loading: true })
      //get t query param
      const { cfsId: cfsIdString, buId: buIdString, date } = this.$route.query

      if (!cfsIdString || !buIdString || !date) {
        throw new Error('Verificar parámetros de consulta')
      }

      // Parse querys
      const cfsId = parseInt(cfsIdString) || null
      const buId = parseInt(buIdString) || null
      // Optionals querys
      const cbpId = parseInt(this.$route.query.cbpId) || null
      const operativeId = parseInt(this.$route.query.operativeId) || null

      // get operations and similar days
      this.filters.buId = buId
      this.filters.cfsId = cfsId
      this.filters.dates = [{ day: date, visible: false }]
      const [{ data: responseOperations }, { data: responseDays }, { data: responseBusinessUnit }] =
        await Promise.all([
          await getOperationsByCfsId({ cfsId }),
          await getSimilarImpactDays({ buId, date }),
          await getBusinessUnitAPI(buId)
        ])
      const days = responseDays?.days || []
      days.forEach((day) => {
        this.filters.dates.push({
          day: day,
          visible: true
        })
      })

      // set title
      this.title = `Gráficas y ajustes - Disponibilidad - ${responseBusinessUnit?.name} - ${responseOperations?.cfs}`
      const operations = responseOperations?.operations || []
      this.optionsOperations = operations.map((op) => {
        return {
          id: op.id,
          label: op.name,
          cbpId: op.cbpId
        }
      })

      // set selected operation based on cbpId or operativeId from query params
      let selectedOperation =
        this.optionsOperations.find((op) => {
          return (operativeId && op.id === operativeId) || (cbpId && op.cbpId === cbpId)
        }) || this.optionsOperations[0]
      if (selectedOperation) {
        const parseDate = formatDateWhitSlash(date) || null
        this.subtitle = `Operativa: ${selectedOperation.label} · Fecha: ${parseDate}`
        this.filters.cbpId = selectedOperation.cbpId
        this.filters.operativeId = selectedOperation.id
      }

      // set filters
      this.filters.time.start = '00:00'
      this.filters.time.end = '23:00'
      this.filters.interval = optionsInterval[0]?.id
      this.filters.elements = optionsElements[0]?.id

      // get data from api
      const filtersWhitoutElements = {
        ...this.filters,
        dates: this.filters.dates.map((item) => item.day)
      }
      delete filtersWhitoutElements.elements
      const { data: responseImapctGraphData } = await getImpactGraphData(filtersWhitoutElements)
      this.data.imapctGraphData = responseImapctGraphData

      // First load completed
      this.firstLoad = true
    } catch (error) {
      const obj = {
        type: 'error',
        title: 'Error al obtener la información',
        message: error
      }
      this.emitter.emit('informational', obj)
    } finally {
      this.emitter.emit('load', { loading: false })
    }
  },
  watch: {
    'filters.operativeId': {
      handler(operativeId) {
        if (operativeId) {
          this.filters.cbpId = this.optionsOperations.find((op) => op.id === operativeId).cbpId
        }
      }
    }
  }
}
</script>
