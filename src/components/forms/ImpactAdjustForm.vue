<template>
  <v-container fluid class="box-shadow">
    <v-row align="center">
      <v-col cols="auto">
        <img :src="icon" alt="Icono de la sección" />
      </v-col>
      <v-col cols="auto">
        <div class="d-flex flex-column">
          <span class="fs-15 fw-500">{{ title }}</span>
          <span class="fs-12 font-weight-light"> {{ subtitle }} </span>
        </div>
      </v-col>
      <v-spacer></v-spacer>
      <v-col cols="auto">
        <bbva-web-link :icon="'bbva:show'" class="primary fw-500" @click="openDialog">
          Ver resumen de ajustes guardados
        </bbva-web-link>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <form
          ref="impactAdjustForm"
          :id="nameForm"
          class="w-100"
          @submit.prevent="searchForm"
          @input="validateForm"
          novalidate
        >
          <v-container fluid>
            <v-row>
              <v-col cols="12" xs="12" sm="12" md="6" lg="6" xl="6">
                <base-select
                  :form-id="nameForm"
                  :options="optionsScenario"
                  :required="true"
                  :value="filters.scenarioId"
                  :invalid="!filters.scenarioId"
                  @value-change="setFilters"
                  error-message="Escenario requerido"
                  label="Escenario"
                  name="scenarioId"
                />
              </v-col>
              <v-col cols="12" xs="12" sm="12" md="6" lg="6" xl="6">
                <base-select-multiple
                  :form-id="nameForm"
                  :invalid="!filters.operativesIds.length"
                  :options="optionsOperations"
                  :required="true"
                  :value="filters.operativesIds"
                  @value-change="setFilters"
                  class="max-height-multiple"
                  error-message="Operativa requerida"
                  label="Operativas"
                  name="operativesIds"
                />
              </v-col>
            </v-row>

            <template v-for="(item, index) in filters.data" :key="index">
              <v-row
                v-if="filters.scenarioId === scenariosIds.IMPACTO_LIBRE"
                justify="space-between"
              >
                <v-col cols="auto">
                  <span class="fs-15 fw-500">Franja horaria y porcentaje {{ index + 1 }}</span>
                </v-col>
                <v-col v-if="index > 0" cols="auto">
                  <bbva-web-link
                    @click="() => removeDataFilter(index)"
                    class="primary fs-15 fw-500"
                  >
                    Eliminar franja horaria
                  </bbva-web-link>
                </v-col>
              </v-row>

              <v-row v-if="filters.scenarioId === scenariosIds.IMPACTO_LIBRE" align="center">
                <v-col cols="12" xs="12" sm="12" md="6" lg="6" xl="6">
                  <div role="radiogroup" class="d-flex flex-row w-100 radio-group">
                    <bbva-web-form-radio-button
                      v-for="(option, indexNormalize) in optionsNormalization"
                      :checked="item.normalize === option.id"
                      :key="option.id"
                      :required="indexNormalize === 0"
                      :value="option.id"
                      @change="(ev) => setDataFilter({ normalize: ev.target.value }, index)"
                      class="radio-item"
                      :name="'normalize' + index"
                    >
                      <span class="fs-15">{{ option.label }}</span>
                    </bbva-web-form-radio-button>
                  </div>
                </v-col>
                <v-col cols="12" xs="12" sm="12" md="6" lg="6" xl="6">
                  <bbva-web-form-number
                    :form-id="nameForm"
                    :pattern="percentageWithTwoDecimalsPattern"
                    :required="true"
                    :value="item.impactPercentage"
                    @change="(ev) => setDataFilter({ impactPercentage: ev.target.value }, index)"
                    auto-validate
                    class="form-number"
                    error-message="El porcentaje debe ser un valor entre 0 y 100"
                    label="Porcentaje de impacto"
                    max="100"
                    min="0"
                    step="0.01"
                  >
                  </bbva-web-form-number>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12" xs="12" sm="6" md="3" lg="3" xl="3">
                  <date-picker
                    :required="true"
                    :value="item.date.start"
                    :disabled="isDisabled"
                    @value-change="
                      (ev) => setDataFilter({ date: { start: ev.target.value } }, index)
                    "
                    label="Fecha inicio"
                  />
                </v-col>
                <v-col cols="12" xs="12" sm="6" md="3" lg="3" xl="3">
                  <date-picker
                    :min="item.date.start"
                    :disabled="isDisabled"
                    :required="true"
                    :value="item.date.end"
                    @value-change="(ev) => setDataFilter({ date: { end: ev.target.value } }, index)"
                    label="Fecha fin"
                  />
                </v-col>
                <v-col cols="12" xs="12" sm="6" md="3" lg="3" xl="3">
                  <base-field-time
                    :form-id="nameForm"
                    :min="minStartTime(index)"
                    :pattern="timePattern"
                    :required="true"
                    :step="300"
                    :value="item.time.start"
                    :invalid="!item.time.start"
                    :key="item.time.start"
                    @value-change="
                      ({ start }) => {
                        setDataFilter({ time: { start } }, index)
                        reloadEndTime(index)
                      }
                    "
                    error-message="Valor en periodos de 5min"
                    label="Hora inicio"
                    name="start"
                  />
                </v-col>
                <v-col cols="12" xs="12" sm="6" md="3" lg="3" xl="3">
                  <base-field-time
                    :form-id="nameForm"
                    :min="minEndTime(index)"
                    :pattern="timePattern"
                    :required="true"
                    :step="isLastItem(index) && item.time.end === '23:59' ? 60 : 300"
                    :value="item.time.end"
                    :invalid="!item.time.end"
                    :key="item.time.end"
                    @value-change="({ end }) => setDataFilter({ time: { end } }, index)"
                    error-message="Valor en periodos de 5min y mayor al de inicio"
                    label="Hora final"
                    name="end"
                  />
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <base-text-area
                    :form-id="nameForm"
                    :max="500"
                    :required="true"
                    :show-max-counter="true"
                    :value="item.description"
                    :invalid="!item.description"
                    @value-change="({ description }) => setDataFilter({ description }, index)"
                    label="Descripción"
                    name="description"
                  />
                </v-col>
              </v-row>
            </template>
            <v-row v-if="filters.scenarioId === scenariosIds.IMPACTO_LIBRE">
              <v-col cols="12">
                <bbva-web-link @click="addDataFilter" class="primary fs-15 fw-500" icon="bbva:add">
                  Añadir otra franja horaria
                </bbva-web-link>
              </v-col>
            </v-row>
            <v-row align="center">
              <v-col cols="auto">
                <bbva-button-default text="Ajustar" type="submit" :disabled="!formValid">
                </bbva-button-default>
              </v-col>
              <v-col cols="auto">
                <bbva-button-default text="Descartar" variant="link" @click="resetArray">
                </bbva-button-default>
              </v-col>
            </v-row>
          </v-container>
        </form>
      </v-col>
    </v-row>
  </v-container>
  <!-- dialog -->
  <v-dialog v-model="dialog" opacity="85" scrim="#043263" max-width="950">
    <impact-adjustments-summary @close="closeDialog"></impact-adjustments-summary>
  </v-dialog>
</template>

<script>
// Components
import '@/components/bbva-web-components/bbva-web-link.js'
import '@/components/bbva-web-components/bbva-web-form-radio-button.js'
import '@/components/bbva-web-components/bbva-web-form-number.js'
import BaseSelect from './BaseSelect.vue'
import BaseSelectMultiple from './BaseSelectMultiple.vue'
import BaseFieldTime from './BaseFieldTime.vue'
import DatePicker from '@/components/forms/DatePicker.vue'
import BaseTextArea from './BaseTextArea.vue'
import ImpactAdjustmentsSummary from '../table/ImpactAdjustmentsSummary.vue'

// Constants
import {
  timePattern,
  optionsNormalization,
  percentageWithTwoDecimalsPattern,
  scenariosIds
} from '@/constants/impact'

// Requests
import { getScenarios } from '@/requests/impactAdjustments'

// Utils
import { addMinutesToTime } from '../../utils/general'

export default {
  name: 'ImpactAdjustForm',
  components: {
    BaseSelect,
    BaseSelectMultiple,
    BaseFieldTime,
    DatePicker,
    BaseTextArea,
    ImpactAdjustmentsSummary
  },
  props: {
    operations: {
      type: Array,
      required: true,
      default: () => []
    },
    data: {
      type: Object,
      required: true,
      default: () => {}
    }
  },
  data() {
    return {
      // Constants
      icon: '/icons/Funnel.svg',
      title: 'Ajustar impacto',
      subtitle: 'Elije el tipo de escenario antes de ajustar',
      nameForm: 'impactAdjustForm',
      timePattern,
      optionsNormalization,
      percentageWithTwoDecimalsPattern,
      addMinutesToTime,
      scenariosIds,

      // Variables
      optionsScenario: [],
      optionsOperations: [],
      dialog: false,

      // Form
      formValid: false,

      // Filters
      filters: {
        scenarioId: null,
        operativesIds: [],
        data: [
          {
            time: {
              start: null,
              end: null
            },
            date: {
              start: null,
              end: null
            },
            description: null,
            normalize: null,
            impactPercentage: null
          }
        ]
      }
    }
  },
  computed: {
    /**
     * Determines if the function is disabled.
     *
     * @return {boolean} Returns true if the scenarioId is not equal to scenariosIds.ASOCIAR_IMPACTO, otherwise false.
     */
    isDisabled() {
      return this.filters.scenarioId !== scenariosIds.ASOCIAR_IMPACTO
    }
  },
  methods: {
    /**
     * Determines if the form is valid.
     *
     * @return {boolean} Returns true if the form is valid, otherwise false.
     */
    validateForm() {
      this.$nextTick(() => {
        this.formValid = this.$refs.impactAdjustForm?.checkValidity()
      })
    },
    /**
     * Set the filters for the component.
     *
     * @param {Object} filters - Object containing the filters to be set
     * @return {void}
     */
    setFilters(filters) {
      this.filters = {
        ...this.filters,
        ...filters
      }
    },
    /**
     * Check if the given index is the last item in the data array.
     *
     * @param {number} index - The index to check
     * @return {boolean} True if the index is the last item, false otherwise
     */
    isLastItem(index) {
      return index === this.filters.data.length - 1
    },
    /**
     * Add a new data filter to the filters.data array.
     */
    addDataFilter() {
      this.filters.data.push({
        time: {
          start: this.data.time.start || null,
          end: this.data.time.end || null
        },
        date: {
          start: this.data.dates[0].day || null,
          end: this.data.dates[0].day || null
        },
        description: null,
        normalize: null,
        impactPercentage: null
      })
    },
    /**
     * Removes a data filter at the specified index.
     *
     * @param {number} index - The index of the data filter to remove
     * @return {void}
     */
    removeDataFilter(index) {
      this.filters.data.splice(index, 1)
    },
    /**
     * Sets the data filter for a specific index in the filters array.
     *
     * @param {Array} filters - the new filters to be set
     * @param {number} index - the index of the filter to be updated
     */
    setDataFilter(filters, index) {
      this.filters.data[index] = {
        ...this.filters.data[index],
        ...filters,
        time: filters.time
          ? { ...this.filters.data[index].time, ...filters.time }
          : this.filters.data[index].time,
        date: filters.date
          ? { ...this.filters.data[index].date, ...filters.date }
          : this.filters.data[index].date
      }
    },
    /**
     * Reloads the end time for a specific index in the filters data array.
     *
     * @param {number} index - The index of the filter data to reload the end time for.
     * @return {void}
     */
    reloadEndTime(index) {
      const endTime = this.filters.data[index].time.end
      this.filters.data[index].time.end = null
      this.$nextTick(() => {
        this.filters.data[index].time.end = endTime
        this.validateForm()
      })
    },
    /**
     * searchForm - Function that is called when the form is submitted.
     * It emits the 'create-adjust-impact' event with the filters.
     * @return {Promise<void>} - description of return value
     */
    searchForm() {
      if (this.$refs.impactAdjustForm?.checkValidity()) {
        this.$emit('create-adjust-impact', this.filters)
      }
    },
    /**
     * Calculate the minimum end time based on the provided index.
     *
     * @param {number} index - The index of the data to be considered.
     * @return {String} The minimum end time calculated based on the provided index.
     */
    minEndTime(index) {
      const item = this.filters.data[index]
      if (
        this.filters.scenarioId === scenariosIds.ASOCIAR_IMPACTO &&
        item.date.start !== item.date.end
      ) {
        return '00:00'
      } else {
        return this.addMinutesToTime(item.time.start, 5)
      }
    },
    /**
     * Calculates the minimum start time for a given index.
     *
     * @param {number} index - The index of the item.
     * @return {string} The minimum start time in the format 'HH:MM'.
     */
    minStartTime(index) {
      const item = this.filters.data[index - 1]
      if (item) {
        return item.time.end
      } else {
        return '00:00'
      }
    },
    /**
     * Reset the array by splicing all elements except the first one
     * and updating the first element with new time and date values.
     *
     * @return {void}
     */
    resetArray() {
      this.filters.data.splice(1)
      this.filters.data[0] = {
        ...this.filters.data[0],
        time: {
          start: this.data.time.start || null,
          end: this.data.time.end || null
        },
        date: {
          start: this.data.dates[0].day || null,
          end: this.data.dates[0].day || null
        },
        description: null
      }
      this.validateForm()
    },
    /**
     * Opens a dialog.
     */
    openDialog() {
      this.dialog = true
    },
    /**
     * Closes the dialog.
     */
    closeDialog() {
      this.dialog = false
    },
    /**
     * Update function to update the filters with new data.
     *
     * @param {Object} newData - The new data to update the filters with
     */
    update(newData) {
      // Set filters
      if (newData) {
        // replace the first item in filters.data with the data from the parent component
        this.filters.data[0] = {
          time: {
            start: newData.time.start || null,
            end: newData.time.end || null
          },
          date: {
            start: newData.dates[0].day || null,
            end: newData.dates[0].day || null
          }
        }

        this.filters.operativesIds = []
        this.filters.operativesIds.push(newData.operativeId.toString())
      }
    }
  },
  /**
   * Perform various data assignments and transformations on component mount
   */
  async mounted() {
    const { data: scenarios } = (await getScenarios()) || []
    this.optionsScenario = scenarios.map((item) => {
      return {
        id: item.id,
        label: item.title
      }
    })

    // The multiple select component requires the value to be a string
    const operations = this.operations || []
    this.optionsOperations = operations.map((op) => {
      return {
        id: op.id.toString(),
        label: op.label,
        cbpId: op.cbpId
      }
    })

    // Set filters
    if (this.data) {
      // replace the first item in filters.data with the data from the parent component
      this.resetArray()

      this.filters.operativesIds.push(this.data.operativeId.toString())
    }
  },
  watch: {
    // watch for scenario changes
    'filters.scenarioId'(newScenarioId) {
      if (newScenarioId !== scenariosIds.IMPACTO_LIBRE) {
        this.resetArray()
        // Remove data normalize and impactPercentage fields if scenario is not IMPACTO_LIBRE for validation
        delete this.filters.data[0].normalize
        delete this.filters.data[0].impactPercentage
      }
    }
  }
}
</script>

<style>
.max-height-multiple {
  max-height: 48px;
}
.box-shadow {
  box-shadow: 0px 0px 3px 1px rgba(0, 0, 0, 0.25) !important;
}
.radio-group {
  border-bottom: 1px solid #d3d3d3;
}
.radio-item {
  width: 100%;
}
.form-number input {
  top: 0.6rem !important;
  left: 1rem !important;
}
</style>
