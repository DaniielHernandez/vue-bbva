<template>
  <header-form-model stepValue="0" :onClose="cancel" :onSubmit="saveData" :title-else="title" />
  <v-container class="pl-8 pb-12" fluid>
    <v-row>
      <v-col cols="12">
        <span class="text-step-form">2 de 2</span>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <span class="title-form-model">Resumen modelo</span>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <bbva-web-notification-message style="padding-top: 5px; padding-left: 10px">
          <p>Todos los campos son obligatorios para poder avanzar</p>
        </bbva-web-notification-message>
      </v-col>
    </v-row>
    <v-row class="mb-3 mt-5" justify="center">
      <v-col cols="12" sm="6" md="3" lg="2" class="mb-2 mt-2 d-flex align-center">
        <h3 class="mr-4">BU</h3>
        <bbva-form-input
          class="text-input"
          name="bu"
          :value="filtersLabel.units"
          :readonly="true"
          type="text"
        />
      </v-col>
      <v-col cols="12" sm="6" md="3" lg="2" class="mb-2 mt-2 d-flex align-center">
        <h3 class="mr-4">CFS</h3>
        <bbva-form-input
          class="text-input"
          name="cfs"
          :value="filtersLabel.cfs"
          :readonly="true"
          type="text"
        />
      </v-col>
      <v-col cols="12" sm="6" md="3" lg="2" class="mb-2 mt-2 d-flex align-center">
        <h3 class="mr-4">Entorno</h3>
        <bbva-form-input
          class="text-input"
          name="environment"
          :value="filtersLabel.environment"
          :readonly="true"
          type="text"
        />
      </v-col>
    </v-row>

    <operativas-modelo ref="operativasModelo" @operativas-change="onOperativesChange" />

    <v-row justify="end">
      <v-col cols="6" sm="6" md="3" lg="2" class="mb-2 mt-2">
        <bbva-button-default text="Regresar" class="w-100" @click="navigate" />
      </v-col>
      <v-col cols="6" sm="6" md="3" lg="2" class="mb-2 mt-2">
        <bbva-button-default text="Guardar" class="w-100" @click="saveData" />
      </v-col>
    </v-row>
  </v-container>

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
</template>

<script>
// Components
import '@/components/bbva-web-components/bbva-form-input.js'
import '@/components/bbva-web-components/bbva-web-form-text.js'
import '@/components/bbva-web-components/bbva-web-notification-message.js'
import '@/components/bbva-web-components/bbva-button-default.js'
import InformationModal from '@/components/modals/InformationModal.vue'
import OperativasModelo from '@/components/filters-modelo/OperativasModelo.vue'
import HeaderFormModel from '@/components/headers/HeaderFormModel.vue'

// Request
import { addModel, updateActive, updateInactive } from '@/requests/businessUnit'
import { titleWindow } from '@/constants/modelsEnvironments'

export default {
  components: {
    OperativasModelo,
    InformationModal,
    HeaderFormModel
  },
  data() {
    return {
      // Represents the labels of the filters displayed on the UI
      filtersLabel: {},
      // Stores the options used to populate dropdowns or selections
      options: {},
      // Contains the list of operatives retrieved or modified in the UI
      operatives: [],
      // Configures the modal's visibility, content, and behavior
      modal: {
        open: false,
        title: 'Información guardada',
        message: 'El modelo se ha guardado correctamente',
        confirmation: false,
        forceOnAccept: true,
        onAccept: () => {}
      },
      title: 'Nuevo Modelo',
      titleWindow
    }
  },

  /**
   * Retrieves and parses data stored in localStorage for a given key.
   *
   * @returns {Object} - The parsed data from localStorage, or the default value if the key does not exist or parsing fails.
   */
  created() {
    const filters = JSON.parse(localStorage.getItem('filters'))
    const options = JSON.parse(localStorage.getItem('options'))
    const status = JSON.parse(localStorage.getItem('status'))

    this.title = titleWindow.find((title) => title.id === status).label

    const units = options.units.find((unit) => unit.id === filters.units).label
    const cfs = options.cfs.find((cfs) => cfs.id === filters.cfs).label
    const environment = options.environment.find(
      (environment) => environment.id === filters.environment
    ).label

    this.filtersLabel = { units, cfs, environment }
    this.options = options
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
     * Event handler triggered when the operatives change.
     * Updates the operative array with the new data.
     *
     * @param {Array} operatives - The updated list of operatives.
     */
    onOperativesChange(operatives) {
      this.operatives = operatives
    },

    /**
     * Navigates the user to the 'admin-models-environments-create-model' route.
     */
    navigate() {
      this.$router.push({ name: 'admin-models-environments-create-model' })
    },

    /**
     * Validates the form data and attempts to save or update the model data.
     * Displays error or success modals based on the outcome.
     * Fetches and formats data from localStorage for inclusion in the payload.
     */
    async saveData() {
      const validations = this.$refs.operativasModelo.validateForm()

      if (!validations) {
        this.showErrorModal(
          'caution',
          'Verificar campos',
          'Por favor, llena todos los campos obligatorios'
        )
        return
      }

      try {
        this.emitter.emit('load', { loading: true })

        // Obtener datos desde localStorage con una función auxiliar
        const filters = this.getStoredData('filters')
        const ventanas = this.getStoredData('ventanas')
        const datosMedicion = this.getStoredData('datosMedicion')
        const initialModel = this.getStoredData('initialModel', null)
        const clonedModel = this.getStoredData('clonedModel', null)
        const isUpdate = !!initialModel

        const payload = {
          bu: filters.units,
          cfs: filters.cfs,
          serviceOwner: filters.serviceOwner,
          environment: filters.environment,
          version: +datosMedicion.version,
          availabilityTarget: +datosMedicion.disponibilidad,
          status: datosMedicion.estatusModelo === 1 ? 1 : 0,
          registrationDate: this.getCurrentDate(),
          startDate: datosMedicion.fechaInicio,
          endDate: datosMedicion.fechaFin,
          operatives: this.formatOperatives(isUpdate, initialModel),
          windows: this.formatWindows(ventanas, isUpdate, initialModel)
        }

        if (isUpdate) {
          payload.id = initialModel.id
          payload.activationDate = initialModel.activationDate
          payload.deactivationDate = initialModel.deactivationDate
        }
        let status = 0

        if (clonedModel) {
          delete payload.id
          const payloadClean = this.clearIds(payload)
          status = await this.saveModel(payloadClean, true)
        } else {
          status = isUpdate
            ? await this.updateModel(payload, initialModel)
            : await this.saveModel(payload, false)
        }

        if (status === 200) {
          this.showSuccessModal()
        } else {
          this.showErrorModal(
            'caution',
            'Error del sistema',
            'Ocurrió un error del lado del servidor'
          )
        }
      } catch (error) {
        let mensaje = 'Ocurrió un error al guardar la información'
        if (error?.response.status === 409) {
          if (typeof error?.response.data === 'string') {
            mensaje = error?.response.data
          } else {
            mensaje = ''
            error?.response.status.forEach((obj) => {
              mensaje += obj + '\n'
            })
          }
        }

        this.showErrorModal('caution', 'Error al guardar', mensaje)
      } finally {
        this.emitter.emit('load', { loading: false })
      }
    },

    /**
     * Retrieves and parses data stored in localStorage for a given key.
     *
     * @param {string} key - The key under which the data is stored in localStorage.
     * @param {any} defaultValue - The default value to return if the key is not found or parsing fails.
     * @returns {Object} - The parsed data from localStorage, or the default value.
     */
    getStoredData(key, defaultValue = {}) {
      return JSON.parse(localStorage.getItem(key)) || defaultValue
    },

    /**
     * Formats the operative data before including it in the payload.
     * Adds or retains IDs for existing operatives when updating a model.
     *
     * @param {boolean} isUpdate - Indicates if the operation is an update (true) or a creation (false).
     * @param {Object|null} initialModel - The initial model data used for updates, or null for creations.
     * @returns {Array} - The formatted list of operatives.
     */
    formatOperatives(isUpdate = false, initialModel = null) {
      return this.operatives.map((operative, index) => {
        const operativeId = initialModel?.operatives?.[index]?.operativeEEPP?.id || null

        const formattedOperative = {
          operativeEEPP: operativeId
            ? { id: operativeId, name: operative.nombre }
            : { name: operative.nombre },
          operativeWeight: operative.peso,
          configurationElements: operative.configurations.map((config, configIndex) => {
            const configId =
              initialModel?.operatives?.[index]?.configurationElements?.[configIndex]?.id || null
            const operativeEEPPId = operativeId ? operativeId : undefined // Solo incluir si existe un ID

            const formattedConfig = {
              configurationName: config.elementoNombre,
              element: config.elemento
            }

            if (isUpdate && configId) {
              formattedConfig.id = configId
            }
            if (isUpdate && operativeEEPPId) {
              formattedConfig.operativeEEPP = operativeEEPPId
            }
            if (isUpdate && operativeId) {
              formattedConfig.modelEEPP = initialModel?.id
            }

            return formattedConfig
          })
        }

        if (isUpdate && operativeId) {
          formattedOperative.modelEEPP = initialModel?.id
        }

        return formattedOperative
      })
    },

    /**
     * Formats the window data before including it in the payload.
     * Adjusts the structure of each window object and adds or retains IDs for
     * existing windows when updating a model.
     *
     * @param {Array} ventanas - Array of window objects to format.
     * @param {boolean} isUpdate - Indicates if the operation is an update (true) or a creation (false).
     * @param {Object|null} initialModel - The initial model data used for updates, or null for creations.
     * @returns {Array} - The formatted list of windows.
     */
    formatWindows(ventanas, isUpdate = false, initialModel = null) {
      return ventanas.map((ventana, index) => {
        return isUpdate
          ? {
              id: initialModel?.windows?.[index]?.id,
              startTime: this.removeSeconds(ventana.horaInicio),
              endTime: this.removeSeconds(ventana.horaFin),
              startDay: ventana.diaInicio,
              endDay: ventana.diaFin,
              nonBusinessDays: ventana.excluirDiasInhabiles ? 1 : 0,
              modelEEPP: initialModel?.id
            }
          : {
              startTime: this.removeSeconds(ventana.horaInicio),
              endTime: this.removeSeconds(ventana.horaFin),
              startDay: ventana.diaInicio,
              endDay: ventana.diaFin,
              nonBusinessDays: ventana.excluirDiasInhabiles ? 1 : 0
            }
      })
    },

    /**
     * Saves a new model to the backend.
     * If `clonedModel` is true, add a `clonado` property to the payload.
     *
     * @param {Object} payload - The data to send to the API to save the model.
     * @param {boolean} clonedModel - Indicates if the model is being cloned from an existing model.
     * @returns {number} - The status code returned by the API.
     */
    async saveModel(payload, clonedModel) {
      if (clonedModel) {
        payload.clonado = true
      }

      const { status } = await addModel(payload)
      return status
    },

    /**
     * Updates an existing model in the backend, depending on its status.
     * Handles both active and inactive models.
     *
     * @param {Object} payload - The data to send to the API to update the model.
     * @param {Object} initialModel - The initial data of the model being updated.
     * @returns {number} - The status code returned by the API.
     */
    async updateModel(payload, initialModel) {
      const request = {
        id: initialModel.id,
        ...payload,
        activationDate: initialModel.activationDate,
        deactivationDate: initialModel.deactivationDate
      }

      const { status } = !!initialModel.status
        ? await updateActive(request)
        : await updateInactive(request)

      return status
    },

    /**
     * Clears IDs from the operatives and windows data of a payload.
     * Modifies the payload to remove internal identifiers before sending it to the API.
     *
     * @param {Object} payload - The payload containing operatives and windows data.
     * @returns {Object} - The same payload with IDs removed.
     */
    clearIds(payload) {
      const { operatives, windows } = payload

      operatives.forEach((operative) => {
        if (operative.operativeEEPP && typeof operative.operativeEEPP === 'object') {
          delete operative.operativeEEPP.id
        }
        delete operative.modelEEPP

        if (operative.configurationElements) {
          operative.configurationElements.forEach((config) => {
            delete config.id
            delete config.operativeEEPP
            delete config.modelEEPP
          })
        }
      })

      windows.forEach((window) => {
        delete window.id
        delete window.modelEEPP
      })

      return { ...payload, operatives, windows }
    },

    /**
     * Gets the current date formatted as 'yyyy-MM-dd'.
     *
     * @returns {string} - The current date in 'yyyy-MM-dd' format.
     */
    getCurrentDate() {
      const today = new Date()
      const dd = String(today.getDate()).padStart(2, '0')
      const mm = String(today.getMonth() + 1).padStart(2, '0')
      const yyyy = today.getFullYear()
      return yyyy + '-' + mm + '-' + dd
    },

    /**
     * Removes the seconds from a time string.
     * Accepts a time string in 'HH:mm:ss', and returns it in 'HH:mm' format.
     *
     * @param {string} time - The time string to process.
     * @returns {string} - The time string without seconds.
     */
    removeSeconds(time) {
      const [hours, minutes] = time.split(':')
      return `${hours}:${minutes}`
    },

    /**
     * Displays a success modal with a pre-defined title and message.
     * The modal navigates to 'admin-models-environments' on acceptance and clears localStorage.
     */
    showSuccessModal() {
      this.modal.open = true
      this.modal.type = 'success'
      this.modal.title = 'Información guardada'
      this.modal.message = 'La información se ha guardado correctamente'
      this.modal.forceOnAccept = true
      this.modal.onAccept = () => {
        this.$router.push({ name: 'admin-models-environments' })
        localStorage.clear()
      }
    },

    /**
     * Displays an error modal with the specified type, title, and message.
     *
     * @param {string} [type='error'] - The type of the modal (e.g., 'error', 'caution', etc.).
     * @param {string} [title='Error'] - The title of the modal.
     * @param {string} [msg='Ocurrió un error al guardar la información'] - The message to display.
     */
    showErrorModal(
      type = 'error',
      title = 'Error',
      msg = 'Ocurrió un error al guardar la información'
    ) {
      this.modal = {
        open: true,
        title,
        type,
        message: msg
      }
    },

    /**
     * Closes any currently open modal by setting the modal's `open` property to false.
     */
    closeModal() {
      this.modal.open = false
    }
  }
}
</script>

<style>
.form-number input {
  top: 0.6rem !important;
  left: 1rem !important;
}
</style>
