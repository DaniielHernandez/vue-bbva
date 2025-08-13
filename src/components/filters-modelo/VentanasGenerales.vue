<template>
  <div>
    <h3 class="p-4">Ventanas Generales</h3>
    <div v-for="(ventana, index) in generalWindows" :key="index" class="ml-4">
      <v-row class="mb-3" justify="start">
        <v-col cols="12" sm="6" md="3" lg="2" class="mb-2 mt-2">
          <bbva-form-time
            class="text-input"
            :required="true"
            :value="ventana.horaInicio"
            name="horaInicio"
            :label="'Hora Inicio ' + (index + 1)"
            @input="(ev) => onWindowChange(index, { horaInicio: ev.target.value }, 'horaInicio')"
            :invalid="errors[`ventana-${index}-horaInicio`] && !ventana.horaInicio"
            error-message="Campo requerido"
            :disabled="checkStatusModel"
          ></bbva-form-time>
        </v-col>
        <v-col cols="12" sm="6" md="3" lg="2" class="mb-2 mt-2">
          <base-select
            :form-id="nameForm"
            :disabled="checkStatusModel"
            :options="options.weekDays"
            :value="ventana.diaInicio"
            name="diaInicio"
            :label="'Día Inicio ' + (index + 1)"
            :invalid="errors[`ventana-${index}-diaInicio`] && !ventana.diaInicio"
            error-message="Campo requerido"
            @value-change="onWindowChange(index, { diaInicio: $event.diaInicio }, 'diaInicio')"
          />
        </v-col>
        <v-col cols="12" sm="6" md="3" lg="2" class="mb-2 mt-2">
          <bbva-form-time
            class="text-input"
            :form-id="nameForm"
            :disabled="checkStatusModel"
            :value="ventana.horaFin"
            name="horaFin"
            :label="'Hora Fin ' + (index + 1)"
            error-message="La hora fin debe ser mayor a la hora de inicio"
            @input="(ev) => onWindowChange(index, { horaFin: ev.target.value }, 'horaFin')"
            :invalid="errors[`ventana-${index}-horaFin`]"
            :key="hourEndKey"
          ></bbva-form-time>
        </v-col>
        <v-col cols="12" sm="6" md="3" lg="2" class="mb-2 mt-2">
          <base-select
            :form-id="nameForm"
            :disabled="checkStatusModel"
            :options="options.weekDays"
            :value="ventana.diaFin"
            name="diaFin"
            :label="'Día Fin ' + (index + 1)"
            :invalid="errors[`ventana-${index}-diaFin`]"
            error-message="El dia fin no puede ser menor al dia de inicio"
            @value-change="onWindowChange(index, { diaFin: $event.diaFin }, 'diaFin')"
            :key="dateEndKey"
          />
        </v-col>
        <v-col cols="12" sm="6" md="3" lg="2" class="mb-2 mt-2" align-self="center">
          <bbva-web-form-checkbox
            :disabled="checkStatusModel"
            :checked="ventana.excluirDiasInhabiles"
            name="excluirDiasInhabiles"
            @change="onWindowChange(index, { excluirDiasInhabiles: $event.target.checked })"
          >
            Excluir días inhábiles
          </bbva-web-form-checkbox>
        </v-col>

        <v-col
          cols="12"
          sm="6"
          md="3"
          lg="2"
          class="d-flex align-center justify-start mb-2 mt-2"
          v-if="index > 0 && !checkStatusModel"
        >
          <bbva-button-default text="Eliminar" size="small" @click="removeWindow(index)" />
        </v-col>
      </v-row>
    </div>

    <v-row>
      <v-col cols="12">
        <span
          class="d-inline-flex align-items-center text-primary cursor-pointer"
          @click="addWindow"
          v-if="!checkStatusModel"
        >
          <b-icon icon="plus-circle" class="mr-2"></b-icon>
          Añadir ventana
        </span>
      </v-col>
    </v-row>

    <h3 class="p-4 mt-5">Datos de medición</h3>
    <v-row class="mb-5 mt-4 ml-4">
      <v-col cols="3">
        <span class="pl-1 font-catalog">Vigencia modelo:</span>
      </v-col>
      <v-col cols="12" sm="6" md="3" lg="2" class="mb-2 mt-2">
        <date-picker
          :form-id="nameForm"
          :disabled="checkStatusModel"
          label="Fecha inicio"
          name="fechaInicio"
          :value="measurementData.fechaInicio"
          :invalid="errors['fechaInicio']"
          error-message="Campo requerido"
          @value-change="onMeasurementDataChange({ fechaInicio: $event.target.value })"
        />
      </v-col>
      <v-col cols="12" sm="6" md="3" lg="2" class="mb-2 mt-2">
        <date-picker
          :form-id="nameForm"
          :disabled="checkStatusModel || !measurementData.fechaInicio"
          :min="dateEndMin"
          label="Fecha fin"
          name="fechaFin"
          :value="measurementData.fechaFin"
          error-message="Campo requerido"
          :invalid="errors['fechaFin']"
          @value-change="onMeasurementDataChange({ fechaFin: $event.target.value })"
          :key="fechaFinKey"
        />
      </v-col>
    </v-row>

    <v-row class="mb-5 ml-4">
      <v-col cols="12" sm="6" md="3" lg="2" class="mb-2 mt-2">
        <bbva-web-form-text
          :form-id="nameForm"
          :value="measurementData.version"
          @change="(ev) => onMeasurementDataChange({ version: ev.target.value })"
          class="form-number"
          error-message="La versión debe ser un numero entero"
          label="Versión"
          :invalid="Boolean(errors.version)"
          :key="versionKey"
          :disabled="checkStatusModel"
        >
        </bbva-web-form-text>
      </v-col>
      <v-col cols="12" sm="6" md="3" lg="2" class="mb-2 mt-2">
        <bbva-web-form-text
          :form-id="nameForm"
          :value="measurementData.disponibilidad"
          @change="(ev) => onMeasurementDataChange({ disponibilidad: ev.target.value })"
          class="form-number"
          error-message="El porcentaje debe ser un valor entre 0 y 100"
          label="Meta Disponibilidad (%)"
          :invalid="errors.disponibilidad"
          :key="disponibilidadKey"
        >
        </bbva-web-form-text>
      </v-col>
      <v-col cols="12" sm="6" md="3" lg="2" class="mb-2 mt-2">
        <base-select
          :form-id="nameForm"
          :disabled="true"
          :options="options.status"
          :value="measurementData.estatusModelo"
          name="estatusModelo"
          :invalid="errors['estatusModelo']"
          @value-change="onMeasurementDataChange({ estatusModelo: $event.estatusModelo })"
          label="Estatus Modelo"
        />
      </v-col>
    </v-row>
  </div>
</template>
<script>
// Components
import '@/components/bbva-web-components/bbva-form-input.js'
import '@/components/bbva-web-components/bbva-web-form-checkbox.js'
import BaseSelect from '@/components/forms/BaseSelect.vue'
import DatePicker from '@/components/forms/DatePicker.vue'
import '@/components/bbva-web-components/bbva-web-form-number.js'
import '@/components/bbva-web-components/bbva-web-form-text.js'

// Constants
import {
  weekDays,
  percentageWithThreeDecimalsPattern,
  integerPattern
} from '@/constants/modelsEnvironments'

export default {
  components: {
    BaseSelect,
    DatePicker
  },
  data() {
    return {
      // Name of the form
      nameForm: 'adminModels',
      // Indicates if the model status is active (true) or not (false)
      checkStatusModel: false,
      // Minimum date allowed for the end date picker
      dateEndMin: '',
      // Array to store general window settings
      generalWindows: [
        {
          horaInicio: '',
          diaInicio: '',
          horaFin: '',
          diaFin: '',
          excluirDiasInhabiles: false
        }
      ],
      // Object to store measurement data
      measurementData: {
        fechaInicio: '',
        fechaFin: '',
        version: '0',
        disponibilidad: '0',
        estatusModelo: ''
      },

      // Options used in dropdown menus and other components
      options: {
        // Array of weekdays
        weekDays,
        // Status options for the model
        status: [
          { id: 1, label: 'Activo' },
          { id: 2, label: 'Inactivo' }
        ]
      },

      // Object to store validation errors for fields
      errors: {
        fechaInicio: false,
        fechaFin: false,
        version: false,
        disponibilidad: false
      },
      percentageWithThreeDecimalsPattern,
      integerPattern,
      versionKey: 0,
      disponibilidadKey: 0,
      hourEndKey: 0,
      dateEndKey: 0,
      fechaFinKey: 0
    }
  },

  /**
   * Handles changes in the measurement data object (`measurementData`).
   * It updates the `measurementData` property with the provided changes,
   * recalculates certain fields like the minimum end date (`dateEndMin`)
   * and model status (`estatusModelo`), and emits events to inform
   * parent components about the updated data.
   *
   * @emits 'datos-medicion-change' - Emitted with the updated `measurementData` object.
   */
  created() {
    const initialModel = JSON.parse(localStorage.getItem('initialModel')) || null
    const ventanasGenerales = JSON.parse(localStorage.getItem('ventanas')) || null
    const measurementData = JSON.parse(localStorage.getItem('datosMedicion')) || null
    const flagClone = JSON.parse(localStorage.getItem('clonedModel')) || false

    this.checkStatusModel = initialModel ? initialModel.status === 1 : false

    if (initialModel) {
      const { startDate, endDate } = initialModel
      this.generalWindows = initialModel.windows.map((ventana) => ({
        horaInicio: ventana.startTime,
        horaFin: ventana.endTime,
        diaInicio: +ventana.startDay,
        diaFin: +ventana.endDay,
        excluirDiasInhabiles: !!ventana.nonBusinessDays
      }))

      this.measurementData = {
        fechaInicio: startDate,
        fechaFin: endDate,
        version: flagClone ? initialModel.version + 1 : initialModel.version,
        disponibilidad: initialModel.availabilityTarget,
        estatusModelo: initialModel.status
      }
      this.measurementData.estatusModelo = startDate && endDate ? this.validationStatus() : null
      this.$emit('ventana-change', this.generalWindows)
      this.$emit('datos-medicion-change', this.measurementData)
      return
    }

    if (ventanasGenerales && measurementData) {
      this.generalWindows = ventanasGenerales
      this.measurementData = measurementData
      this.$emit('ventana-change', this.generalWindows)
      this.$emit('datos-medicion-change', this.measurementData)
    }
  },
  methods: {
    /**
     * Updates the general window settings at a specific index with provided changes.
     * Emits the `ventana-change` event with the updated windows array.
     *
     * @param {number} index - Index of the window to update.
     * @param {Object} changes - Object containing the changes to apply.
     * @param {Object} param - Object containing the param to apply.
     */
    onWindowChange(index, changes, param = '') {
      this.generalWindows[index] = { ...this.generalWindows[index], ...changes }

      if (param === 'horaFin' || param === 'horaInicio') {
        this.validateTimeRange(index)
      }

      if (param === 'diaFin' || param === 'diaInicio') {
        this.validateDay(index)
      }
      this.$emit('ventana-change', this.generalWindows)
    },

    validateDay(index) {
      const startDay = this.generalWindows[index].diaInicio
      const endDay = this.generalWindows[index].diaFin

      this.errors = {
        ...this.errors,
        [`ventana-${index}-diaFin`]: false
      }
      if (endDay < startDay) {
        this.errors = {
          ...this.errors,
          [`ventana-${index}-diaFin`]: true
        }
        this.dateEndKey += 1
      }
    },

    /**
     * Updates the `measurementData` object with the provided changes.
     * Recalculates the minimum end date and status (`estatusModelo`) if necessary.
     * Emits the `datos-medicion-change` event with the updated `measurementData` object.
     *
     * @param {Object} changes - Object containing the changes to apply.
     */
    onMeasurementDataChange(changes) {
      this.measurementData = { ...this.measurementData, ...changes }

      const { fechaInicio, fechaFin, version, disponibilidad } = this.measurementData

      if (fechaInicio) {
        this.dateEndMin = this.getDateEndMin()
        this.measurementData.estatusModelo = fechaFin ? this.validationStatus() : null
      }

      if (changes.version !== undefined) {
        delete this.errors.version
        const isValidVersion = this.integerPattern.test(version)
        this.errors.version = !isValidVersion
        this.versionKey += 1
      }

      if (changes.disponibilidad !== undefined) {
        this.errors.disponibilidad = false
        const isValidDisponibilidad = this.percentageWithThreeDecimalsPattern.test(disponibilidad)
        this.errors.disponibilidad = !isValidDisponibilidad
        this.disponibilidadKey += 1
      }

      if (changes.fechaFin !== undefined) {
        this.errors.fechaFin = false
        this.errors.fechaFin = !this.measurementData.fechaFin
        this.fechaFinKey += 1
      }

      this.$emit('datos-medicion-change', this.measurementData)
    },

    /**
     * Adds a new window to the `generalWindows` array with default values.
     */
    addWindow() {
      this.generalWindows.push({
        horaInicio: '',
        diaInicio: '',
        horaFin: '',
        diaFin: '',
        excluirDiasInhabiles: false
      })
    },

    /**
     * Removes a window from the `generalWindows` array at the specified index.
     *
     * @param {number} index - Index of the window to remove.
     */
    removeWindow(index) {
      this.generalWindows.splice(index, 1)

      // Delete window params from errors object
      const prefix = `ventana-${index}-`
      for (const key in this.errors) {
        if (key.startsWith(prefix)) {
          delete this.errors[key]
        }
      }
    },

    /**
     * Validates the status (`estatusModelo`) of the measurement data.
     * Determines if the current date is within the start and end date range.
     *
     * @returns {number} - Returns 1 if the current date is valid, otherwise returns 2.
     */
    validationStatus() {
      const fechaActual = new Date()
      const fechaInicio = new Date(`${this.measurementData.fechaInicio}T00:00:00`)
      const fechaFin = new Date(`${this.measurementData.fechaFin}T23:59:59`)
      return fechaActual >= fechaInicio && fechaActual <= fechaFin ? 1 : 2
    },

    /**
     * Calculates and returns the minimum allowable end date based on the start date.
     *
     * @returns {string} - The minimum end date in the format `YYYY-MM-DD`.
     */
    getDateEndMin() {
      const fechaInicio = new Date(`${this.measurementData.fechaInicio}T00:00:00`)
      fechaInicio.setDate(fechaInicio.getDate() + 1)
      let yyyy = fechaInicio.getFullYear()
      let mm = String(fechaInicio.getMonth() + 1).padStart(2, '0') // Mes en 2 dígitos
      let dd = String(fechaInicio.getDate()).padStart(2, '0') // Día en 2 dígitos
      return `${yyyy}-${mm}-${dd}`
    },

    /**
     * Validates a time range by checking if the end time is later than the start time.
     *
     * @param {string} index - The position window.
     */
    validateTimeRange(index) {
      this.errors = {
        ...this.errors,
        [`ventana-${index}-horaInicio`]: false,
        [`ventana-${index}-horaFin`]: false
      }
      const startTime = this.generalWindows[index].horaInicio
      const endTime = this.generalWindows[index].horaFin

      this.errors = {
        ...this.errors,
        [`ventana-${index}-horaInicio`]: startTime.length === 0,
        [`ventana-${index}-horaFin`]: endTime.length === 0
      }

      const toMinutes = (time) => {
        const [hours, minutes] = time.split(':').map(Number)
        return hours * 60 + minutes
      }

      const startMinutes = toMinutes(startTime)
      const endMinutes = toMinutes(endTime)

      if (endMinutes <= startMinutes) {
        this.errors = {
          ...this.errors,
          [`ventana-${index}-horaFin`]: true
        }
        this.hourEndKey += 1
      }
    },

    /**
     * Validates the entire form, including `measurementData` and `generalWindows`.
     * Updates the `errors` object with validation results.
     *
     * @returns {boolean} - Returns true if the form is valid, otherwise false.
     */
    validateForm() {
      this.errors = {
        ...this.errors,
        fechaInicio: !this.measurementData.fechaInicio,
        fechaFin: !this.measurementData.fechaFin
      }

      // Validate general windows
      this.generalWindows.forEach((ventana, index) => {
        this.errors = {
          ...this.errors,
          [`ventana-${index}-horaInicio`]: !ventana.horaInicio,
          [`ventana-${index}-diaInicio`]: !ventana.diaInicio
        }
      })
      return !Object.values(this.errors).some((error) => error)
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
</style>
