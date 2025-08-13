<template>
  <form ref="formFilters" class="w-100" @submit.prevent="validateForm" novalidate>
    <v-row class="mb-3" justify="start">
      <v-col cols="12" sm="6" md="3" lg="2" class="mb-2 mt-2">
        <base-select
          :form-id="formName"
          :options="options.units"
          :value="filters.units"
          :required="true"
          :invalid="showErrors.units && !filters.units"
          @value-change="onUnitChange"
          error-message="Campo requerido"
          label="Business Unit"
          name="units"
        />
      </v-col>
      <v-col cols="12" sm="6" md="3" lg="2" class="mb-2 mt-2">
        <base-select
          :form-id="formName"
          :disabled="!isUnitSelected"
          :options="options.cfs"
          :value="filters.cfs"
          :required="true"
          :invalid="showErrors.cfs && isUnitSelected && !filters.cfs"
          @value-change="onFilterChange({ cfs: $event.cfs })"
          error-message="Campo requerido"
          label="CFS Servicio"
          name="cfs"
        />
      </v-col>
      <v-col cols="12" sm="6" md="3" lg="2" class="mb-2 mt-2">
        <base-select
          :form-id="formName"
          :options="options.environment"
          :value="filters.environment"
          :required="true"
          :invalid="showErrors.environment && !filters.environment"
          @value-change="onFilterChange({ environment: $event.environment })"
          error-message="Campo requerido"
          label="Entorno"
          name="environment"
        />
      </v-col>
      <v-col cols="12" sm="6" md="3" lg="2" class="mb-2 mt-2">
        <date-picker
          :form-id="formName"
          :required="true"
          :value="filters.date"
          :invalid="showErrors.date && !filters.date"
          @value-change="onFilterChange({ date: $event.target.value })"
          error-message="Fecha requerida"
          label="Fecha Estatus"
          name="date"
        />
      </v-col>
      <v-col cols="12" sm="6" md="3" lg="2" class="mb-2 mt-2">
        <bbva-button-default text="Buscar" class="w-100" type="submit" />
      </v-col>
    </v-row>
  </form>
</template>

<script>
// Components
import BaseSelect from '@/components/forms/BaseSelect.vue'
import DatePicker from '@/components/forms/DatePicker.vue'
import '@/components/bbva-web-components/bbva-button-default.js'

// Request
import { getBuAll, getCFS, getEnvironments } from '@/requests/businessUnit'

export default {
  components: {
    BaseSelect,
    DatePicker
  },
  data() {
    return {
      // The identifier for the form. Used to scope validations and maintain form state.
      formName: 'environmentForm',
      // Indicates whether a business unit is selected.
      // It controls the enabled/disabled state of dropdowns (e.g., CFS Servicio).
      isUnitSelected: false,
      // Reflects the overall form validation state. True if all required inputs are valid.
      formValid: false,
      // Tracks which fields have validation errors. Each key corresponds to a field in the form:
      showErrors: {
        units: false,
        cfs: false,
        environment: false,
        date: false
      },
      // Holds the options for the `BaseSelect` components. The keys represent form fields:
      options: {
        units: [],
        cfs: [],
        environment: []
      },
      // Tracks the current user inputs for the form. Each key represents a field:
      filters: {
        units: '',
        cfs: '',
        environment: '',
        date: ''
      }
    }
  },

  /**
   * Fetches and populates the `cfs` (CFS Servicio) options list based on the selected unit.
   * Updates the state of the form to enable/disable dependent fields.
   * Emits updates to options via the `options-change` event.
   *
   * @returns {Promise<void>} - A promise that resolves after the options are updated.
   */
  async beforeMount() {
    this.emitter.emit('load', { loading: true })
    try {
      const { data: listBU } = await getBuAll()
      const { data: listEnvironments } = await getEnvironments()

      this.options.units = listBU.map((unit) => ({ id: unit.id, label: unit.name }))
      this.options.environment = listEnvironments.map((env) => ({ id: env.id, label: env.title }))
      this.$emit('options-change', this.options)
      this.emitter.emit('load', { loading: false })
    } catch (error) {
      this.emitter.emit('load', { loading: false })
      console.error('Error fetching data:', error)
    }
  },
  methods: {
    /**
     * Handles the change event when a business unit is selected.
     * Updates the state to enable/disable dependent dropdowns and fetches new options for the CFS Servicio select.
     *
     * @param {Object} value - Contains the selected 'units' value from the dropdown.
     * @returns {Promise<void>} - A promise that resolves after updating the CFS options.
     */
    async onUnitChange(value) {
      this.isUnitSelected = !!value.units

      this.emitter.emit('load', { loading: true })
      try {
        const { data: listCFS } = await getCFS(value.units)
        this.options.cfs = listCFS.map((cfs) => ({ id: cfs.id, label: cfs.name }))
        this.onFilterChange({ units: value.units })
        this.$emit('options-change', this.options)
        this.emitter.emit('load', { loading: false })
      } catch (error) {
        this.emitter.emit('load', { loading: false })
      }
    },

    /**
     * Updates the form `filters` object and emits an event to notify listeners of the change.
     *
     * @param {Object} value - The object containing updated key-value pairs for form filters.
     * @returns {void}
     */
    onFilterChange(value) {
      this.filters = { ...this.filters, ...value }
      this.$emit('filter-change', this.filters)
    },

    /**
     * Validates the form fields, updates the state of error indicators,
     * and emits a `search-click` event if the form is valid.
     *
     * @returns {void}
     */
    validateForm() {
      // Initialize the error state for each field
      this.showErrors = {
        units: !this.filters.units,
        cfs: !this.filters.cfs,
        environment: !this.filters.environment,
        date: !this.filters.date
      }

      // Check if all fields are valid
      this.formValid = Object.values(this.showErrors).every((error) => !error)

      // Emit event if the form is valid, otherwise log an error
      if (this.formValid) {
        this.$emit('search-click')
      } else {
        console.error('Formulario inválido, revise los campos requeridos.')
      }
    }
  }
}
</script>

<style scoped>
.mb-3 {
  margin-bottom: 1.5rem;
}
</style>
