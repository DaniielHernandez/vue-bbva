<template>
  <header-form-model stepValue="0" :onClose="cancel" :onSubmit="saveData" :title-else="title" />
  <v-container class="pl-8 pb-12" fluid>
    <v-row>
      <v-col cols="12">
        <span class="text-step-form">1 de 2</span>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <span class="title-form-model">Datos del modelo</span>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <bbva-web-notification-message style="padding-top: 5px; padding-left: 10px">
          <p>Todos los campos son obligatorios para poder avanzar</p>
        </bbva-web-notification-message>
      </v-col>
    </v-row>

    <filters-modelo
      ref="filtersModelo"
      :hideStatusModel="true"
      @filter-change="onFilterChange"
      @options-change="onOptionsChange"
    />

    <ventanas-generales
      ref="ventanasGenerales"
      @ventana-change="onWindowChange"
      @datos-medicion-change="onMeasurementDataChange"
    />

    <v-row justify="end">
      <v-col cols="6" sm="6" md="3" lg="2" class="mb-2 mt-2">
        <bbva-button-default text="Continuar" class="w-100" @click="navigate" />
      </v-col>
      <v-col cols="6" sm="6" md="3" lg="2" class="mb-2 mt-2">
        <bbva-button-default text="Guardar" class="w-100" @click="saveData" />
      </v-col>
    </v-row>
    <information-modal
      :open="modal.open"
      :close="closeModal"
      :title="modal.title"
      :message="modal.message"
      :onAccept="modal.onAccept"
      :confirmation="modal.confirmation"
      :forceOnAccept="modal.forceOnAccept"
      :type="modal.type"
    />
  </v-container>
</template>

<script>
// Components
import InformationModal from '@/components/modals/InformationModal.vue'
import FiltersModelo from '@/components/filters-modelo/FiltersModelo.vue'
import VentanasGenerales from '@/components/filters-modelo/VentanasGenerales.vue'
import '@/components/bbva-web-components/bbva-web-notification-message.js'
import HeaderFormModel from '@/components/headers/HeaderFormModel.vue'

// Constants
import { titleWindow } from '@/constants/modelsEnvironments'

export default {
  components: {
    FiltersModelo,
    VentanasGenerales,
    InformationModal,
    HeaderFormModel
  },

  data() {
    return {
      // Information of the selected filters
      filters: {},
      // Information about the selected options
      options: {},
      // List of configured windows
      windows: [],
      // Measurement data related to the model
      measurementData: {},
      // Modal configuration and state
      modal: {
        open: false,
        title: '',
        message: '',
        confirmation: false,
        forceOnAccept: true,
        onAccept: () => {}
      },
      title: 'Nuevo Modelo',
      titleWindow
    }
  },
  /**
   * It gets the status from the localStorage and sets the title
   */
  created() {
    const status = JSON.parse(localStorage.getItem('status'))

    this.title = titleWindow.find((title) => title.id === status).label
  },
  methods: {
    /*
     * It closes the modal, when it's warning
     */
    cancel() {
      this.modal = {
        open: true,
        type: 'caution',
        title: '¿Seguro que quieres eliminar el proceso?',
        message: 'Vas a salir del proceso y todos los datos se perderán',
        confirmation: true,
        finish: false
      }
      this.modal.onAccept = () => {
        this.$router.push({ name: 'admin-models-environments' })
        localStorage.clear()
      }
    },
    /**
     * Handles changes to filters.
     * @param {Object} filters - The updated filters.
     */
    onFilterChange(filters) {
      this.filters = filters
    },

    /**
     * Handles changes to options.
     * @param {Object} options - The updated options.
     */
    onOptionsChange(options) {
      this.options = options
    },

    /**
     * Handles changes to the list of windows.
     * @param {Array} windows - The updated list of windows.
     */
    onWindowChange(windows) {
      this.windows = windows
    },

    /**
     * Handles changes to the measurement data.
     * @param {Object} data - The updated measurement data.
     */
    onMeasurementDataChange(data) {
      this.measurementData = data
    },

    /**
     * Saves the current data to localStorage after validating the forms.
     * Displays a success modal if valid, otherwise displays an error modal.
     */
    saveData() {
      const validations = this.$refs.ventanasGenerales.validateForm()
      const validationsFilters = this.$refs.filtersModelo.validateForm()

      if (!validations || !validationsFilters) {
        this.showErrorModal()
        return
      }
      localStorage.setItem('filters', JSON.stringify(this.filters))
      localStorage.setItem('options', JSON.stringify(this.options))
      localStorage.setItem('ventanas', JSON.stringify(this.windows))
      localStorage.setItem('datosMedicion', JSON.stringify(this.measurementData))

      this.showSuccessModal()
    },

    /**
     * Navigates to another route after validating the forms and storing data in localStorage.
     */
    navigate() {
      const validations = this.$refs.ventanasGenerales.validateForm()
      const validationsFilters = this.$refs.filtersModelo.validateForm()

      if (!validations || !validationsFilters) {
        this.showErrorModal()
        return
      }

      localStorage.setItem('filters', JSON.stringify(this.filters))
      localStorage.setItem('options', JSON.stringify(this.options))
      localStorage.setItem('ventanas', JSON.stringify(this.windows))
      localStorage.setItem('datosMedicion', JSON.stringify(this.measurementData))

      const initialModel = JSON.parse(localStorage.getItem('initialModel')) || null

      if (initialModel) {
        this.updateInitialModel(initialModel)
      }

      this.$router.push({ name: 'admin-models-environments-operatives' })
    },

    /**
     * Updates the initial model stored in localStorage with the latest data.
     * @param {Object} initialModel - The initial model data.
     */
    updateInitialModel(initialModel) {
      const flagClone = localStorage.getItem('clonedModel')
      const serviceOwner = this.options.serviceOwner.find(
        (owner) => owner.id === this.filters.serviceOwner
      )

      initialModel = {
        ...initialModel,
        bu: { id: this.filters.units },
        cfs: { id: this.filters.cfs },
        environment: { id: this.filters.environment },
        serviceOwner: { fullName: serviceOwner.label },
        availabilityTarget: this.measurementData.disponibilidad,
        startDate: this.measurementData.fechaInicio,
        endDate: this.measurementData.fechaFin,
        windows: this.formatWindows(this.windows, initialModel),
        version: flagClone ? this.measurementData.version - 1 : this.measurementData.version
      }

      localStorage.setItem('initialModel', JSON.stringify(initialModel))
    },

    /**
     * Formats the window data to match the expected structure.
     * @param {Array} ventanas - The list of windows to format.
     * @param {Object} initialModel - The initial model to associate with the windows.
     * @returns {Array} The formatted list of windows.
     */
    formatWindows(ventanas, initialModel) {
      return ventanas.map((ventana, index) => {
        return {
          id: initialModel?.windows?.[index]?.id,
          startTime: this.removeSeconds(ventana.horaInicio),
          endTime: this.removeSeconds(ventana.horaFin),
          startDay: ventana.diaInicio,
          endDay: ventana.diaFin,
          nonBusinessDays: ventana.excluirDiasInhabiles ? 1 : 0,
          modelEEPP: initialModel?.id
        }
      })
    },

    /**
     * Removes the seconds component from a time string.
     * @param {string} time - The time string in the format "HH:mm:ss" or "HH:mm".
     * @returns {string} The time string without seconds.
     */
    removeSeconds(time) {
      const [hours, minutes] = time.split(':')
      return `${hours}:${minutes}`
    },

    /**
     * Displays a success modal with a predefined message.
     */
    showSuccessModal() {
      this.modal = {
        open: true,
        title: 'Información guardada',
        type: 'success',
        message: 'La información se ha guardado correctamente'
      }
    },

    /**
     * Displays an error modal with a predefined message.
     */
    showErrorModal() {
      this.modal = {
        open: true,
        title: 'Verificar campos',
        type: 'caution',
        message: 'Por favor, llena todos los campos obligatorios'
      }
    },

    /**
     * Closes the modal by setting its open state to false.
     */
    closeModal() {
      this.modal.open = false
    }
  }
}
</script>
<style>
.text-input input {
  position: absolute;
  top: 20%;
  left: 5%;
}

.form-number input {
  top: 0.6rem !important;
  left: 1rem !important;
}

.title-form-model {
  font-size: 26px;
  font-weight: 700 !important;
}

.title-section-form-model {
  font-size: 15px;
  font-weight: 501 !important;
}

.text-step-form {
  font-size: 15px !important;
  font-style: italic !important;
  color: #666666 !important;
}
</style>
