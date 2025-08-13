<template>
  <v-row class="mb-3">
    <v-col cols="12">
      <span
        class="d-inline-flex align-items-center text-primary cursor-pointer"
        @click="addOperative"
        v-if="!checkStatusModel"
      >
        Añadir operativa
      </span>
    </v-col>
  </v-row>

  <!-- Lista de operativas -->
  <div v-for="(operative, opIndex) in operatives" :key="'operative-' + opIndex" class="mb-4">
    <v-row class="mb-2">
      <v-col cols="12" sm="6" md="3" lg="3" class="mb-2 mt-2 d-flex align-center">
        <p class="mr-2 fit-content">Operativa {{ opIndex + 1 }}</p>
        <bbva-form-input
          :form-id="nameForm"
          type="text"
          label="Nombre Operativa"
          name="nombre"
          :value="operative.nombre"
          :invalid="errors[`operative-${opIndex}-nombre`] && !operative.nombre"
          error-message="Campo requerido"
          @formInputValueChange="handleOperative(opIndex, { nombre: $event.target.value })"
        />
      </v-col>
      <v-col cols="12" sm="6" md="3" lg="3" class="mb-2 mt-2 d-flex align-center">
        <p class="mr-2 fit-content">Peso Operativa {{ opIndex + 1 }}</p>
        <bbva-web-form-text
          :form-id="nameForm"
          label="Peso"
          name="peso"
          class="form-number"
          :value="operative.peso"
          error-message="El peso debe ser un valor entre 0 y 100"
          :invalid="errors[`operative-${opIndex}-peso`]"
          @change="(ev) => handleOperative(opIndex, { peso: ev.target.value })"
          :key="weightKey"
        >
        </bbva-web-form-text>
      </v-col>

      <v-col cols="12" sm="6" md="3" lg="3" class="mb-2 mt-2 d-flex align-center">
        <span
          class="d-inline-flex align-items-center text-primary cursor-pointer"
          v-if="!checkStatusModel"
          @click="addConfiguration(opIndex)"
        >
          <b-icon icon="plus-circle" class="mr-2"></b-icon>
          Añadir Elemento de Configuración
        </span>
      </v-col>

      <v-col
        cols="12"
        sm="6"
        md="3"
        lg="3"
        class="d-flex align-center justify-end mb-2 mt-2"
        v-if="opIndex > 0 && !checkStatusModel"
      >
        <bbva-button-default text="Eliminar" size="small" @click="removeOperative(opIndex)" />
      </v-col>
    </v-row>

    <div
      v-for="(config, confIndex) in operative.configurations"
      :key="'config-' + opIndex + '-' + confIndex"
      class="ml-4 mb-2"
    >
      <v-row>
        <v-col cols="3"></v-col>

        <v-col cols="12" sm="6" md="3" lg="3" class="mb-2 mt-2 d-flex align-center justify-end">
          <p class="mr-2 fit-content">
            Elemento de configuración {{ opIndex + 1 }}.{{ confIndex + 1 }}
          </p>
          <bbva-form-input
            :form-id="nameForm"
            type="text"
            label="Elemento"
            name="elementoNombre"
            :value="config.elementoNombre"
            :invalid="
              errors[`config-${opIndex}-${confIndex}-elementoNombre`] && !config.elementoNombre
            "
            error-message="Campo requerido"
            @formInputValueChange="
              handleConfiguration(opIndex, confIndex, { elementoNombre: $event.target.value })
            "
          />
        </v-col>
        <v-col cols="12" sm="6" md="3" lg="3" class="mb-2 mt-2 d-flex align-center justify-end">
          <p class="mr-2 fit-content">Capa {{ opIndex + 1 }}.{{ confIndex + 1 }}</p>
          <bbva-form-input
            :form-id="nameForm"
            type="text"
            label="Capa"
            name="elemento"
            :value="config.elemento"
            :invalid="errors[`config-${opIndex}-${confIndex}-elemento`] && !config.elemento"
            error-message="Campo requerido"
            @formInputValueChange="
              handleConfiguration(opIndex, confIndex, { elemento: $event.target.value })
            "
          />
        </v-col>
        <v-col
          cols="12"
          sm="6"
          md="3"
          lg="3"
          class="mb-2 mt-2 d-flex align-center justify-end"
          v-if="confIndex > 0 && !checkStatusModel"
        >
          <bbva-button-default
            text="Eliminar"
            size="small"
            @click="removeConfiguration(opIndex, confIndex)"
          />
        </v-col>
      </v-row>
    </div>
    <hr />
  </div>
</template>
<script>
import { percentageWithTwoDecimalsPattern } from '@/constants/modelsEnvironments'

export default {
  data() {
    return {
      // ID of the form used in the template
      nameForm: 'operativesForm',
      // Object to store validation errors for operatives and configurations
      errors: {},
      // List of operative objects containing properties like name, weight, and configurations
      operatives: [
        {
          nombre: '',
          peso: '',
          configurations: [
            {
              elementoNombre: '',
              elemento: ''
            }
          ]
        }
      ],
      // Boolean to determine if the model is active or inactive
      checkStatusModel: false,
      percentageWithTwoDecimalsPattern,
      weightKey: 0
    }
  },

  /**
   * Validates the form inputs for operatives and their configurations.
   *
   * The method checks that all required fields for operatives and their associated
   * configurations are filled.
   * If a field is empty or invalid, it adds an appropriate
   * error message to the `errors` object.
   * @returns {boolean} - Returns `true` if the form is valid (i.e., no validation errors exist),
   *                      otherwise returns `false` indicating there are errors.
   */
  async created() {
    const initialModel = JSON.parse(localStorage.getItem('initialModel')) || null
    // 1 = Active, 0 = Inactive
    this.checkStatusModel = initialModel ? initialModel.status === 1 : false

    if (initialModel) {
      const { operatives } = initialModel
      this.operatives = operatives.map((op) => ({
        nombre: op.operativeEEPP.name,
        peso: op.operativeWeight,
        configurations: op.configurationElements.map((conf) => ({
          elementoNombre: conf.configurationName,
          elemento: conf.element
        }))
      }))
      this.$emit('operativas-change', this.operatives)
    }
  },
  methods: {
    /**
     * Updates specific properties of an operative at the given index.
     *
     * @param {number} index - The index of the operative to update.
     * @param {Object} changes - An object containing the properties and values to update.
     */
    handleOperative(index, changes) {
      this.operatives[index] = { ...this.operatives[index], ...changes }

      if (changes.peso !== undefined) {
        this.validateWeight(index)
      }
      this.emitOperative()
    },
    /**
     * Validates the weight of an operative at the given index.
     * Updates the `errors` object with validation results.
     * Increments the `weightKey` to trigger reactivity.
     *
     * @param {number} index - The index of the operative to validate.
     */
    validateWeight(index) {
      const weight = this.operatives[index].peso
      this.errors[`operative-${index}-peso`] = false
      const isValidWeight = this.percentageWithTwoDecimalsPattern.test(weight)
      this.errors = {
        ...this.errors,
        [`operative-${index}-peso`]: !isValidWeight
      }
      this.weightKey += 1
    },

    /**
     * Updates specific properties of a configuration within an operative.
     *
     * @param {number} opIndex - The index of the operative containing the configuration.
     * @param {number} confIndex - The index of the configuration to update.
     * @param {Object} changes - An object containing the properties and values to update.
     */
    handleConfiguration(opIndex, confIndex, changes) {
      this.operatives[opIndex].configurations[confIndex] = {
        ...this.operatives[opIndex].configurations[confIndex],
        ...changes
      }
      this.emitOperative()
    },

    /**
     * Adds a new operative to the `operatives` array.
     * The new operative contains default values.
     */
    addOperative() {
      this.operatives.push({
        nombre: '',
        peso: '',
        configurations: [{ elementoNombre: '', elemento: '' }]
      })
      this.emitOperative()
    },

    /**
     * Removes an operative at the specified index.
     *
     * @param {number} index - The index of the operative to remove.
     */
    removeOperative(index) {
      this.operatives.splice(index, 1)

      // Delete operative params from errors object
      const prefix = `operative-${index}-`
      for (const key in this.errors) {
        if (key.startsWith(prefix)) {
          delete this.errors[key]
        }
      }
      const prefix2 = `config-${index}-`
      for (const key in this.errors) {
        if (key.startsWith(prefix2)) {
          delete this.errors[key]
        }
      }
      this.emitOperative()
    },

    /**
     * Adds a new configuration to the specified operative.
     *
     * @param {number} opIndex - The index of the operative to add the configuration to.
     */
    addConfiguration(opIndex) {
      this.operatives[opIndex].configurations.push({ elementoNombre: '', elemento: '' })
      this.emitOperative()
    },

    /**
     * Removes a configuration from an operative's configuration list.
     *
     * @param {number} opIndex - The index of the operative containing the configuration.
     * @param {number} confIndex - The index of the configuration to remove.
     */
    removeConfiguration(opIndex, confIndex) {
      this.operatives[opIndex].configurations.splice(confIndex, 1)
      this.emitOperative()
    },

    /**
     * Emits an event to notify parent components about the changes in the `operatives` array.
     */
    emitOperative() {
      this.$emit('operativas-change', this.operatives)
    },

    /**
     * Validates the form inputs for operatives and their configurations.
     * Populates the `errors` object with validation results for each field.
     *
     * @returns {boolean} - Returns `true` if the form is valid, otherwise `false` if there are errors.
     */
    validateForm() {
      this.operatives.forEach((operative, opIndex) => {
        this.errors = {
          ...this.errors,
          [`operative-${opIndex}-nombre`]: !operative.nombre,
          [`operative-${opIndex}-peso`]: !this.percentageWithTwoDecimalsPattern.test(operative.peso)
        }

        operative.configurations.forEach((config, confIndex) => {
          this.errors = {
            ...this.errors,
            [`config-${opIndex}-${confIndex}-elementoNombre`]: !config.elementoNombre,
            [`config-${opIndex}-${confIndex}-elemento`]: !config.elemento
          }
        })
      })
      console.log('Errors: ', this.errors)

      return !Object.values(this.errors).some((error) => error)
    }
  }
}
</script>
<style scoped>
.fit-content {
  min-width: fit-content;
}

.form-number input {
  top: 0.6rem !important;
  left: 1rem !important;
}
</style>
