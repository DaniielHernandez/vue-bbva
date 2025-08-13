<template>
  <v-container
    :class="!option ? 'd-flex justify-center align-center' : ''"
    class="box-shadow h-100"
    fluid
  >
    <v-row v-if="option">
      <v-col cols="12" class="d-flex flex-row align-center ga-4">
        <img :src="documentIcon" :alt="'Icon' + documentIcon" />
        <div class="d-flex flex-column">
          <span class="fs-15 fw-500"> {{ option }} Folio </span>
          <span class="fs-12 font-weight-light" v-if="option === options.associate">
            Puedes asociar la incidencia a un impacto
          </span>
          <span class="fs-12 font-weight-light" v-else-if="option === options.create">
            Puedes crear un nuevo folio para el nuevo ajuste
          </span>
        </div>
      </v-col>
      <form ref="ticketForm" :id="nameForm" class="w-100" @submit.prevent="sendForm" validate-on="submit lazy" @input="validateForm">
        <v-col cols="12">
          <bbva-form-input
            v-if="option === options.associate"
            :form="nameForm"
            :required="true"
            :value="filters.ticketId"
            :invalid="!filters.ticketId"
            @formFieldInputClear="setFilters({ ticketId: null, description: null })"
            @formSearchButtonSubmit="(ev) => searchTicket(ev.target.value)"
            action-icon="bbva:search"
            action-variant="no-background"
            error-message="Folio requerido / No encontrado"
            label="N° de Folio"
            type="search"
          >
          </bbva-form-input>
          <bbva-form-input
            v-else-if="option === options.create"
            :form="nameForm"
            :required="true"
            :value="filters.ticketId"
            :invalid="!filters.ticketId"
            @form-field-input-blur="({ target: { value } }) => setFilters({ ticketId: value })"
            @formFieldInputClear="setFilters({ ticketId: null })"
            error-message="Folio requerido"
            label="N° de Folio"
            type="text"
          >
          </bbva-form-input>
        </v-col>
        <v-col cols="12">
          <base-text-area
            :form-id="nameForm"
            :disabled="option === options.associate"
            :max="150"
            :required="option === options.create"
            :show-max-counter="true"
            :value="filters.description"
            :invalid="!filters.description"
            @value-change="({ description }) => setFilters({ description })"
            label="Descripción"
            name="description"
          />
        </v-col>
        <v-col cols="12" class="d-flex flex-row align-center ga-4">
          <bbva-button-default
            :disabled="!formValid"
            :text="option === options.associate ? 'Asociar' : 'Crear y Asociar'"
            type="submit"
          >
          </bbva-button-default>
          <bbva-button-default @click="option = null" text="Cancelar" variant="link">
          </bbva-button-default>
        </v-col>
      </form>
    </v-row>
    <v-row v-else>
      <v-col cols="12" class="d-flex flex-column align-center justify-center">
        <img :src="icon" :alt="'Icon' + icon" />
        <span class="fs-20 font-weight-light">{{ title }}</span>
        <span class="fs-15 font-weight-light"> {{ subtitle }} </span>
      </v-col>
      <v-col cols="12" class="d-flex flex-row align-center justify-center ga-4">
        <bbva-button-default
          :disabled="!filters.adjustmentId"
          @click="option = options.associate"
          text="Asociar"
        >
        </bbva-button-default>
        <bbva-button-default
          :disabled="!filters.adjustmentId"
          @click="option = options.create"
          text="Crear y asociar"
        >
        </bbva-button-default>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
// Components
import '@/components/bbva-web-components/bbva-form-input.js'
import BaseTextArea from '@/components/forms/BaseTextArea.vue'

// Constants
const options = {
  associate: 'Asociar',
  create: 'Crear'
}

// Requests
import { searchTicketAPI, createTicketAPI, associateTicketAPI } from '@/requests/impactAdjustments'

// Utils

export default {
  name: 'TicketForm',
  components: {
    BaseTextArea
  },
  props: {
    data: {
      type: Object,
      required: true
    },
    buId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      // Constants
      icon: '/icons/Blockchain.svg',
      documentIcon: '/icons/VerifiedDocument.svg',
      title: 'Asociar o crear folio',
      subtitle: 'Haz un ajuste, asocialo a un folio o crealo',
      nameForm: 'impact-adjust-ticket-form',
      options,

      // Form
      formValid: false,

      // Variables
      option: null,
      filters: {
        ticketId: null,
        description: null,
        adjustmentId: null
      }
    }
  },
  methods: {
    /**
     * Set filters for the component.
     *
     * @param {Object} filters - The filters to be set for the component
     */
    setFilters(filters) {
      this.filters = { ...this.filters, ...filters }
    },
    /**
     * Asynchronously searches for a ticketId.
     *
     * @param {string} ticketId - the ticketId to search for
     * @return {void}
     */
    async searchTicket(ticketId) {
      try {
        this.emitter.emit('load', { loading: true })
        const { data: responseSearch } = await searchTicketAPI(ticketId, this.buId)
        if (responseSearch.ticketId) {
          this.filters = {
            ...this.filters,
            ticketId: responseSearch.ticketId,
            description: responseSearch.description
          }
        }
      } catch (error) {
        this.filters = { ...this.filters, ticketId: null, description: null }
      } finally {
        this.emitter.emit('load', { loading: false })
      }
    },
    /**
     * A function to associate ticket with the given adjustment ID and ticket ID.
     */
    async associateTicket() {
      const obj = {}
      try {
        this.emitter.emit('load', { loading: true })
        const newFilters = { ...this.filters, buId: this.buId }
        await associateTicketAPI(newFilters)
        obj.type = 'success'
        obj.title = 'Impacto Asociado'
        obj.message = `Se ha asociado la incidencia a el nº de folio ${this.filters.ticketId}`
      } catch (error) {
        obj.type = 'error'
        obj.title = 'Error al asociar el folio'
        obj.message = 'No se ha podido asociar la incidencia a el nº de folio'
      } finally {
        this.emitter.emit('load', { loading: false })
        this.emitter.emit('informational', obj)
      }
    },
    /**
     * Create a new ticket and associate it with an adjustment ID.
     */
    async createTicket() {
      const obj = {}
      try {
        this.emitter.emit('load', { loading: true })
        const newFilters = { ...this.filters, buId: this.buId }
        await createTicketAPI(newFilters)
        obj.type = 'success'
        obj.title = 'Folio creado y asociado'
        obj.message = `Se ha creado el nº de folio ${this.filters.ticketId} y asociado al incidente correctamente`
      } catch (error) {
        obj.type = 'error'
        obj.title = 'Error al crear y asociar el folio'
        obj.message = 'No se ha podido crear y asociar el nº de folio'
      } finally {
        this.emitter.emit('load', { loading: false })
        this.emitter.emit('informational', obj)
      }
    },
    /**
     * Function to handle form submission based on the selected option.
     */
    async sendForm() {
      try {
        if (this.option === options.associate) {
          await this.associateTicket()
        } else if (this.option === options.create) {
          await this.createTicket()
        }
      } finally {
        this.filters = {
          adjustmentId: null,
          ticketId: null,
          description: null
        }
        this.option = null
      }
    },
    /**
     * Validates the form by checking the validity of the ticketForm reference.
     *
     * @return {void} 
     */
    validateForm() {
      this.$nextTick(() => {
        this.formValid = this.$refs.ticketForm?.checkValidity()
      })
    },
  },
  computed: {
    /**
     * Check if the filters are valid for the given option.
     *
     * @return {boolean} true if the filters are valid, false otherwise
     */
    isValid() {
      const valid = Object.keys(this.filters).every(
        (key) => this.filters[key] !== null && this.filters[key] !== ''
      )
      return valid
    }
  },
  /**
   * The mounted hook is called after the instance has been mounted, where this.filters.adjustmentId is assigned the value of this.data.adjustmentId or null if it's falsy.
   *
   * @return {void}
   */
  mounted() {
    this.filters.adjustmentId = this.data.adjustmentId || null
  },
  watch: {
    'data.adjustmentId': {
      handler(newValue) {
        this.filters.adjustmentId = newValue
      }
    }
  }
}
</script>

<style scoped lang="scss">
.box-shadow {
  box-shadow: 0px 0px 3px 1px rgba(0, 0, 0, 0.25) !important;
}
</style>
