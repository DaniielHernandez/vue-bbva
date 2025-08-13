<template>
  <v-card title="Editar registro" class="pa-4" v-if="firstLoad">
    <form @submit.prevent="updateCfs()" class="d-flex flex-column w-100" id="form-edit-cfs-impact">
      <v-card-text>
        <div class="d-flex flex-row flex-wrap gc-6 gr-3 mb-4">
          <div class="d-flex ga-2">
            <img src="/icons/flag.svg" alt="Icono de listado" width="16" />
            <span class="font-weight-light">Business Unit: {{ bu?.name }}</span>
          </div>
          <div class="d-flex ga-2">
            <img src="/icons/flag.svg" alt="Icono de listado" width="16" />
            <span class="font-weight-light"> Nº de folio: {{ ticket?.name }}</span>
          </div>
          <div v-for="field in selectedFields" :key="field.value" class="d-flex ga-2">
            <img src="/icons/flag.svg" alt="Icono de listado" width="16" />
            <span v-if="field.value === 'dateTimeStart'" class="font-weight-light">
              {{ field.title }}: {{ cfs.startDateString }} - {{ cfs.startTimeString }}
            </span>
            <span v-else-if="field.value === 'dateTimeEnd'" class="font-weight-light">
              {{ field.title }}: {{ cfs.endDateString }} - {{ cfs.endTimeString }}
            </span>
            <span v-else class="font-weight-light">
              {{ field.title }}: {{ cfs[field.value] }}
            </span>
          </div>
        </div>
        <v-row>
          <template v-for="fieldEdit in selectedEditFields" :key="fieldEdit.value">
            <!-- Field Síntoma -->
            <v-col v-if="fieldEdit.value === 'symptom'" cols="12" xs="12" md="6">
              <bbva-form-input
                :form="nameForm"
                :label="fieldEdit.title"
                :maxlength="500"
                :required="true"
                :value="filters.symptom"
                @form-field-input-blur="({ target: { value } }) => setFilters({ symptom: value })"
                @formFieldInputClear="setFilters({ symptom: null })"
                error-message="Síntoma requerido"
                type="text"
              >
              </bbva-form-input>
            </v-col>
            <!-- Field Origen -->
            <v-col
              v-else-if="fieldEdit.value === 'originId'"
              class="min-width"
              cols="12"
              xs="12"
              md="6"
            >
              <base-select
                :form-id="nameForm"
                :invalid="!filters.originId"
                :label="fieldEdit.title"
                :options="optionsOrigin"
                :required="true"
                :value="filters.originId"
                @value-change="setFilters"
                error-message="Escenario requerido"
                name="originId"
              />
            </v-col>
            <!-- Field Impacto Total -->
            <v-col v-else-if="fieldEdit.value === 'totalImpact'" cols="12" xs="12" md="auto">
              <div class="d-flex flex-column ga-2">
                <span class="fw-500 fs-15">{{ fieldEdit.title }}</span>
                <div role="radiogroup" class="d-flex flex-row ga-4">
                  <bbva-web-form-radio-button
                    v-for="option in optionsRadioYesNo"
                    :key="option.id"
                    :checked="option.id === filters.totalImpact"
                    :form="nameForm"
                    :value="filters.totalImpact"
                    @change="() => setFilters({ totalImpact: option.id })"
                    name="totalImpact"
                    required
                  >
                    <span class="fs-15">{{ option.label }}</span>
                  </bbva-web-form-radio-button>
                </div>
              </div>
            </v-col>
            <!-- Field Impacto en el Acceso -->
            <v-col v-else-if="fieldEdit.value === 'accessImpact'" cols="12" xs="12" md="auto">
              <div class="d-flex flex-column ga-2">
                <span class="fw-500 fs-15">{{ fieldEdit.title }}</span>
                <div role="radiogroup" class="d-flex flex-row ga-4">
                  <bbva-web-form-radio-button
                    v-for="option in optionsRadioYesNo"
                    :key="option.id"
                    :checked="option.id === filters.accessImpact"
                    :form="nameForm"
                    :value="filters.accessImpact"
                    @change="() => setFilters({ accessImpact: option.id })"
                    name="accessImpact"
                    required
                  >
                    <span class="fs-15">{{ option.label }}</span>
                  </bbva-web-form-radio-button>
                </div>
              </div>
            </v-col>
          </template>
        </v-row>
      </v-card-text>
      <v-card-actions class="d-flex ga-4">
        <bbva-button-default text="Continuar" type="submit" :disabled="!validForm">
        </bbva-button-default>
        <bbva-button-default text="Cancelar" @click="closeDialog" variant="link">
        </bbva-button-default>
      </v-card-actions>
    </form>
  </v-card>
</template>

<script>
// Components
import '@/components/bbva-web-components/bbva-form-input.js'
import '@/components/bbva-web-components/bbva-web-form-radio-button.js'
import BaseSelect from '@/components/forms/BaseSelect.vue'

// Constants
import { cfsImpactEditFields, optionsRadioYesNo } from '@/constants/impactTickets'

export default {
  name: 'EditCfsImpactForm',
  components: {
    BaseSelect
  },
  data() {
    return {
      // Constants
      nameForm: 'form-edit-cfs-impact',
      editFields: cfsImpactEditFields,
      optionsRadioYesNo,

      // Variables
      firstLoad: false,
      optionsOrigin: [],
      filters: {
        symptom: null,
        originId: null,
        totalImpact: null,
        accessImpact: null,
        cfsId: null
      }
    }
  },
  props: {
    ticket: {
      type: Object,
      required: true
    },
    bu: {
      type: Object,
      required: true
    },
    cfs: {
      type: Object,
      required: true
    },
    originOptions: {
      type: Array,
      required: true
    }
  },
  computed: {
    /**
     * Returns an array of fields that should be shown based on the current ticket type.
     *
     * @return {Array} An array of fields.
     */
    selectedFields() {
      return this.editFields.filter(
        (field) => !field.editable && field.typesShow?.includes(this.ticket.type)
      )
    },
    /**
     * Returns an array of editable fields that should be shown based on the current ticket type.
     *
     * @return {Array} An array of editable fields.
     */
    selectedEditFields() {
      return this.editFields.filter(
        (field) => field.editable && field.typesShow?.includes(this.ticket.type)
      )
    },
    /**
     * Checks if all the editable fields have valid values.
     *
     * @return {boolean} True if all the editable fields have valid values, false otherwise.
     */
    validForm() {
      const valid = this.selectedEditFields.every(
        (field) => this.filters[field.value] !== null && this.filters[field.value] !== ''
      )
      return valid
    }
  },
  methods: {
    /**
     * Emits the close event.
     *
     * @return {void}
     */
    closeDialog() {
      this.$emit('close')
    },
    /**
     * Set the filters for the component.
     *
     * @param {Object} filters - Object containing the filters to be set
     * @return {void}
     */
    setFilters(filters) {
      this.filters = { ...this.filters, ...filters }
    },
    /**
     * Emits the updateCfs event.
     *
     * @return {void}
     */
    updateCfs() {
      this.$emit('update-cfs', this.filters)
    }
  },
  /**
   * Mounts the component and initializes the optionsOrigin and filters properties.
   *
   * @return {void}
   */
  mounted() {
    this.optionsOrigin =
      this.originOptions?.map((origin) => {
        return {
          id: origin.id,
          label: origin.name
        }
      }) || []

    this.filters = {
      ...this.filters,
      symptom: this.cfs?.symptom || null,
      originId: this.cfs?.originId || null,
      totalImpact: this.cfs?.totalImpact || null,
      accessImpact: this.cfs?.accessImpact || null,
      cfsId: this.cfs?.cfsId
    }

    this.firstLoad = true
  }
}
</script>

<style scoped>
.min-width {
  min-width: 150px;
}
</style>
