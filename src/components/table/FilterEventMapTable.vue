<template>
  <v-row justify="start" v-show="!showMoreFilters">
    <v-col cols="12" xs="12" sm="6" md="2">
      <bbva-web-form-select
        @change="(ev) => setValue('buId', ev.target.value)"
        :value="inputs.buId.value"
        :invalid="!!inputs.buId.error"
        :error-message="inputs.buId.error"
        label="Bu"
      >
        <bbva-web-form-option v-for="option in options.bu" :key="option.id" :value="option.id">
          <span class="pl-4 d-inline-block">{{ option.label }}</span>
        </bbva-web-form-option>
      </bbva-web-form-select>
    </v-col>
    <v-col cols="12" xs="12" sm="6" md="2">
      <date-picker
        label="Fecha"
        :value="inputs.date.value"
        :invalid="!!inputs.date.error"
        :errorMessage="inputs.date.error"
        @value-change="(ev) => setValue('date', ev.target.value)"
      />
    </v-col>
    <v-col cols="12" xs="12" sm="6" md="2">
      <bbva-web-form-select-multiple
        @change="(ev) => setValue('ticketTypeIds', ev.target.selectedOptionsValues)"
        :invalid="!!inputs.ticketTypeIds.error"
        :error-message="inputs.ticketTypeIds.error"
        label="Tipo de folio"
      >
        <bbva-web-form-option-multiple
          v-for="option in options.ticketType"
          :key="`multi-option-${option.id}`"
          :selected="inputs.ticketTypeIds.value.includes(option.id) || false"
          :value="`${option.id}`"
        >
          <span class="pl-4 d-inline-block">{{ option.label }}</span>
        </bbva-web-form-option-multiple>
      </bbva-web-form-select-multiple>
    </v-col>
    <v-col cols="12" xs="12" sm="6" md="2">
      <bbva-web-form-select-multiple
        @change="(ev) => setValue('criticalityIds', ev.target.selectedOptionsValues)"
        :invalid="!!inputs.criticalityIds.error"
        :error-message="inputs.criticalityIds.error"
        label="Clasific criticidad del CFS"
      >
        <bbva-web-form-option-multiple
          v-for="option in options.criticality"
          :key="`multi-option-${option.id}`"
          :selected="inputs.criticalityIds.value.includes(option.id) || false"
          :value="`${option.id}`"
        >
          <span class="pl-4 d-inline-block">{{ option.label }}</span>
        </bbva-web-form-option-multiple>
      </bbva-web-form-select-multiple>
    </v-col>
    <v-col cols="12" xs="12" sm="6" md="auto">
      <bbva-button-default
        text="Ver más filtros"
        variant="link"
        class="block-inherit w-100"
        @click="showMoreFilters = true"
      ></bbva-button-default>
    </v-col>
    <v-col cols="12" xs="12" sm="6" md="auto">
      <bbva-button-default
        active=""
        class="w-100"
        text="Buscar"
        @click="searchFilter"
      ></bbva-button-default>
    </v-col>
  </v-row>
  <v-card v-show="showMoreFilters" class="overflow-visible z-index-auto">
    <v-container fluid class="px-12">
      <v-row>
        <v-col cols="12">
          <div class="float-right pr-5">
            <v-btn variant="text" size="x-small" @click="showMoreFilters = false"
              ><img src="/icons/close.svg" alt="Cerrar"
            /></v-btn>
          </div>
        </v-col>
      </v-row>
      <v-row>
        <v-col sm="12" md="6">
          <bbva-web-form-select-multiple
            @change="(ev) => setValue('originIds', ev.target.selectedOptionsValues)"
            :invalid="!!inputs.originIds.error"
            :error-message="inputs.originIds.error"
            label="Origen"
          >
            <bbva-web-form-option-multiple
              v-for="option in options.origin"
              :key="`multi-option-${option.id}`"
              :selected="inputs.originIds.value.includes(option.id) || false"
              :value="`${option.id}`"
            >
              <span class="pl-4 d-inline-block">{{ option.label }}</span>
            </bbva-web-form-option-multiple>
          </bbva-web-form-select-multiple>
        </v-col>
      </v-row>
      <v-row align="center">
        <v-col cols="auto">
          <bbva-button-default active="" text="Buscar" @click="searchFilter"></bbva-button-default>
        </v-col>
        <v-col cols="auto">
          <bbva-button-default
            text="Borrar filtros"
            variant="link"
            @click="clearFilter"
          ></bbva-button-default>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
// Components
import '@/components/bbva-web-components/bbva-web-form-select.js'
import '@/components/bbva-web-components/bbva-web-form-select-multiple.js'
import '@/components/bbva-web-components/bbva-button-default.js'
import DatePicker from '@/components/forms/DatePicker.vue'

// Utils
import { isThereError, validateAllFields, parseCatalog, validateRequired } from '@/utils/form.js'

// Requests
import { getBusinessUnitsAPI } from '@/requests/businessUnit.js'
import { getTicketsTypesAPI } from '@/requests/impactTickets.js'
import { getCriticalitiesAPI } from '@/requests/criticality.js'
import { getOriginAPI } from '@/requests/origin.js'

export default {
  name: 'FilterEventMapTable',
  components: {
    DatePicker
  },
  data() {
    return {
      // Variables
      showMoreFilters: false,
      inputs: {
        buId: { value: null, error: null },
        date: { value: null, error: null },
        ticketTypeIds: { value: [], error: null },
        criticalityIds: { value: [], error: null },
        originIds: { value: [], error: null }
      },

      // Options
      options: {
        bu: [],
        ticketType: [],
        criticality: [],
        origin: []
      },

      // Validations
      validations: {
        buId: validateRequired,
        date: validateRequired,
        ticketTypeIds: validateRequired
      }
    }
  },
  /**
   * Method called before the component is mounted.
   *
   * @return {void}
   */
  beforeMount() {
    this.loadOptions()
  },
  methods: {
    /**
     * Loads options by calling various APIs and updating the options object accordingly.
     *
     * @return {void}
     */
    loadOptions() {
      this.emitter.emit('load', { loading: true })
      Promise.all([
        getBusinessUnitsAPI(1, 3000),
        getTicketsTypesAPI(),
        getCriticalitiesAPI(),
        getOriginAPI()
      ])
        .then((responses) => {
          this.options.bu = parseCatalog(responses[0].data.items)
          this.options.ticketType = parseCatalog(responses[1].data)
          this.options.criticality = parseCatalog(responses[2].data)
          this.options.origin = parseCatalog(responses[3].data)
        })
        .catch((error) => {
          this.emitter.emit('error', { action: 'cargar catalogos', error })
        })
        .finally(() => {
          this.emitter.emit('load', { loading: false })
        })
    },
    /**
     * Sets the value of a specific input in the inputs object.
     *
     * @param {string} name - The name of the input.
     * @param {any} value - The value to set for the input.
     * @return {void}
     */
    setValue(name, value) {
      this.inputs[name] = {
        value,
        name
      }
    },
    /**
     * Validates all fields in the inputs object and performs a search if there are no errors.
     *
     * @return {void}
     */
    searchFilter() {
      this.inputs = validateAllFields(this.validations, this.inputs)

      if (isThereError(this.inputs)) {
        const values = {}
        Object.keys(this.inputs).forEach((field) => {
          values[field] = this.inputs[field].value
        })
        this.search(values)
      }
      this.showMoreFilters = false
    },
    /**
     * Clears the filter inputs and resets the selected options in the multi-select components.
     *
     * @return {void}
     */
    clearFilter() {
      this.inputs = {
        ...this.inputs,
        buId: { value: [], error: null },
        date: { value: null, error: null },
        ticketTypeIds: { value: [], error: null },
        criticalityIds: { value: [], error: null },
        originIds: { value: [], error: null }
      }

      const selectsMultiples = document.querySelectorAll('bbva-web-form-select-multiple')
      selectsMultiples.forEach((select) => {
        const children = select.children || []
        for (let i = 0; i < children.length; i++) {
          children[i].selected = false
        }
      })
      this.showMoreFilters = false
    },
    /**
     * Emits a 'search' event with the given values.
     *
     * @param {Object} values - The values to be emitted.
     * @return {void}
     */
    search(values) {
      this.$emit('search', values)
    }
  }
}
</script>

<style>
.block-inherit {
  padding-block: inherit !important;
}
.date-input input {
  top: 0.6rem !important;
  left: 1rem !important;
}
.z-index-auto {
  z-index: auto !important;
}
</style>
