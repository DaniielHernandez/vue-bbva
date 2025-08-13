<template>
  <form ref="formFilters" class="w-100" @submit.prevent="validateForm" novalidate>
    <v-row class="mb-3" justify="start">
      <v-col cols="12" sm="6" md="3" lg="2" class="mb-2 mt-2">
        <base-select
          :form-id="formName"
          :disabled="checkStatusModel"
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
        <bbva-web-form-select-multiple
          class="select-multiple"
          label="CFS Servicio"
          v-if="showSelectMultiple"
          :disabled="!isUnitSelected || checkStatusModel"
          :invalid="showErrors.cfs && isUnitSelected && filters.cfs.length === 0"
          error-message="Campo requerido"
          @change="onFilterChange({ cfs: $event.target.selectedOptionsValues })"
        >
          <bbva-web-form-option-multiple v-for="option in options.cfs" :value="`${option.id}`">
            <span class="pl-4">{{ option.label }}</span>
          </bbva-web-form-option-multiple>
        </bbva-web-form-select-multiple>

        <base-select
          :form-id="formName"
          :disabled="!isUnitSelected || checkStatusModel"
          :options="options.cfs"
          v-else
          :value="filters.cfs"
          :required="true"
          :invalid="showErrors.cfs && isUnitSelected && !filters.cfs"
          error-message="Campo requerido"
          @value-change="onFilterChange({ cfs: $event.cfs })"
          label="CFS Servicio"
          name="cfs"
        />
      </v-col>

      <v-col cols="12" sm="6" md="3" lg="2" class="mb-2 mt-2">
        <bbva-web-form-select-multiple
          class="select-multiple"
          label="Entorno"
          v-if="showSelectMultiple"
          :invalid="showErrors.environment && filters.environment.length === 0"
          error-message="Campo requerido"
          @change="onFilterChange({ environment: $event.target.selectedOptionsValues })"
        >
          <bbva-web-form-option-multiple
            v-for="option in options.environment"
            :value="`${option.id}`"
          >
            <span class="pl-4">{{ option.label }}</span>
          </bbva-web-form-option-multiple>
        </bbva-web-form-select-multiple>

        <base-select
          :form-id="formName"
          :disabled="checkStatusModel"
          :options="options.environment"
          v-else
          :value="filters.environment"
          :required="true"
          :invalid="showErrors.environment && !filters.environment"
          @value-change="onFilterChange({ environment: $event.environment })"
          error-message="Campo requerido"
          label="Entorno"
          name="environment"
        />
      </v-col>

      <v-col cols="12" sm="6" md="3" lg="2" class="mb-2 mt-2" v-if="!hideStatusModel">
        <base-select
          :form-id="formName"
          :options="options.status"
          :value="filters.status"
          :required="true"
          :invalid="showErrors.status && !filters.status"
          @value-change="onFilterChange({ status: $event.status })"
          error-message="Campo requerido"
          label="Estatus Modelo"
          name="status"
        />
      </v-col>
      <v-col cols="12" sm="6" md="3" lg="2" class="mb-2 mt-2" v-if="hideStatusModel">
        <base-select
          :form-id="formName"
          :disabled="!isUnitSelected"
          :options="options.serviceOwner"
          :value="filters.serviceOwner"
          :required="true"
          :invalid="showErrors.serviceOwner && !filters.serviceOwner"
          @value-change="onFilterChange({ serviceOwner: $event.serviceOwner })"
          error-message="Campo requerido"
          label="Service Owner"
          name="serviceOwner"
        />
      </v-col>
      <v-col cols="12" sm="6" md="3" lg="2" class="mb-2 mt-2" v-if="!hideStatusModel">
        <bbva-button-default text="Buscar" class="w-100" type="submit" />
      </v-col>
    </v-row>
  </form>
</template>

<script>
// Components
import '@/components/bbva-web-components/bbva-button-default.js'
import '@/components/bbva-web-components/bbva-web-form-select.js'
import '@/components/bbva-web-components/bbva-web-form-select-multiple.js'
import BaseSelect from '@/components/forms/BaseSelect.vue'

// Request
import {
  getBuAll,
  getCFS,
  getEnvironmentsByStatus,
  getEnvironments,
  getServiceOwner
} from '@/requests/businessUnit'

export default {
  components: {
    BaseSelect
  },
  props: {
    // Determines whether the "select multiple" control should be displayed. Default is false.
    showSelectMultiple: {
      type: Boolean,
      default: false
    },
    // Determines whether the "status model" section should be hidden. Default is false.
    hideStatusModel: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // Name of the form used in the environment selection
      formName: 'environmentForm',
      // Indicates whether a unit is selected or not
      isUnitSelected: false,
      // Tracks whether the form is valid
      formValid: false,
      // Object to display error messages for each field
      showErrors: {
        units: false,
        cfs: false,
        environment: false,
        status: false,
        serviceOwner: false
      },
      // Object containing options for various dropdowns
      options: {
        // Options for unit selection
        units: [],
        // Options for CFS selection
        cfs: [],
        // Options for environment selection
        environment: [],
        // Options for status selection
        status: [
          { id: 1, label: 'Activo' },
          { id: 2, label: 'Inactivo' }
        ],
        // Options for Service Owner selection
        serviceOwner: []
      },
      // Object containing the selected filter values
      filters: {
        units: '',
        cfs: '',
        environment: '',
        status: '',
        serviceOwner: ''
      },
      // Indicates whether the "status model" section is checked
      checkStatusModel: false
    }
  },

  /**
   * Loads the initial model data into the component's filters state.
   *
   * This method takes the initial model object as a parameter and updates
   * the filter object with the appropriate values for business unit,
   * CFS, environment, and status. It also attempts to pre-select the
   * service owner from the available options based on the full name
   * provided in the initial model.
   *
   */
  async created() {
    await this.loadOptions()
    const initialModel = JSON.parse(localStorage.getItem('initialModel')) || null
    const filtersLocal = JSON.parse(localStorage.getItem('filters')) || null

    this.checkStatusModel = initialModel ? initialModel.status === 1 : false

    if (initialModel) {
      await this.onUnitChange({ units: initialModel.bu.id })
      this.loadInitialData(initialModel)
      this.$emit('filter-change', this.filters)
      this.$emit('options-change', this.options)
      return
    }

    if (filtersLocal) {
      this.filters = filtersLocal
      await this.onUnitChange({ units: filtersLocal.units })
      this.$emit('filter-change', this.filters)
      this.$emit('options-change', this.options)
    }
  },
  methods: {
    /**
     * Handles the change event when a unit is selected.
     * Updates the state of related filters and options,
     * making API requests for connected components (CFS and service owners).
     *
     * @param {Object} value - The selected unit value.
     * @property {string} value.units - The ID of the selected unit.
     */
    async onUnitChange(value) {
      this.isUnitSelected = !!value.units
      this.emitter.emit('load', { loading: true })
      try {
        const { data: listCFS } = await getCFS(value.units)
        const { data: listServiceOwner } = await getServiceOwner(value.units)

        this.options.cfs = (listCFS || []).map((cfs) => ({ id: cfs.id, label: cfs.name }))
        this.options.serviceOwner = (listServiceOwner || []).map((owner) => ({
          id: owner.id,
          label: owner.name
        }))

        this.onFilterChange({ units: value.units })
        this.$emit('options-change', this.options)
        this.emitter.emit('load', { loading: false })
      } catch (error) {
        this.emitter.emit('load', { loading: false })
        console.error('Error fetching CFS:', error)
      }
    },

    /**
     * Updates the filter object with new values and emits the updated filter.
     *
     * @param {Object} value - Object containing new filter values.
     */
    onFilterChange(value) {
      this.filters = { ...this.filters, ...value }
      this.$emit('filter-change', this.filters)
    },

    /**
     * Validates the form fields and updates the error state for each field.
     * Emits a "search-click" event if validation passes and the "status model" section is not hidden.
     *
     * @returns {boolean} - Returns true if the form is valid, otherwise false.
     */
    validateForm() {
      this.showErrors = {
        units: !this.filters.units,
        cfs: this.filters.cfs.length === 0,
        environment: this.filters.environment.length === 0,
        status: !this.filters.status && !this.hideStatusModel,
        serviceOwner: !this.filters.serviceOwner && this.hideStatusModel
      }

      this.formValid = Object.values(this.showErrors).every((error) => !error)

      if (this.formValid && !this.hideStatusModel) {
        this.$emit('search-click')
      } else {
        return this.formValid
      }
    },

    /**
     * Loads the options for the select dropdown fields by making API requests.
     * Updates the `options` object with Business Units and Environment options.
     */
    async loadOptions() {
      this.emitter.emit('load', { loading: true })
      try {
        const { data: listBU } = await getBuAll()
        let environments = {}
        if (this.showSelectMultiple) {
          environments = await getEnvironments()
        } else {
          environments = await getEnvironmentsByStatus()
        }

        const { data: listEnvironments } = environments
        this.options.units = listBU.map((unit) => ({ id: unit.id, label: unit.name }))
        this.options.environment = listEnvironments.map((env) => ({
          id: env.id,
          label: env.title
        }))
        this.$emit('options-change', this.options)
        this.emitter.emit('load', { loading: false })
      } catch (error) {
        this.emitter.emit('load', { loading: false })
        console.error('Error fetching data:', error)
      }
    },

    /**
     * Loads the initial data into the filters based on the given model.
     * Ensures proper selection of Business Unit, CFS, Environment, and Service Owner options.
     *
     * @param {Object} initialModel - The initial data model to populate filters.
     * @property {Object} initialModel.bu - Business Unit object including its ID and name.
     * @property {Object} initialModel.cfs - CFS object including its ID and name.
     * @property {Object} initialModel.environment - Environment object with its ID and title.
     * @property {number} initialModel.status - The current status (e.g., 1 for Active, 2 for Inactive).
     * @property {Object} initialModel.serviceOwner - Selected Service Owner with its full name.
     */
    loadInitialData(initialModel) {
      const { bu, cfs, environment, status } = initialModel
      const serviceOwner = this.options.serviceOwner.find(
        (owner) => owner.label === initialModel.serviceOwner.fullName
      )

      this.filters = {
        units: bu.id,
        cfs: cfs.id,
        environment: environment.id,
        status: status,
        serviceOwner: serviceOwner?.id
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
