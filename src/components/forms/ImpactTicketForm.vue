<template>
  <v-row justify="center">
    <v-dialog
      v-model="dialog"
      persistent
      width="768"
    >
      <v-card>
        <v-card-title class="pl-10 pb-2 pt-4">
          <span class="title-form pt-3">
            Editar folio
          </span>
          <div class="float-right">
            <v-btn
              variant="text"
              size="x-small"
              @click="close"
              >
              <bbva-core-icon icon="bbva:close" size="m"></bbva-core-icon>
            </v-btn>
          </div>
        </v-card-title>
        <v-card-text>
          <v-container class="pt-0">
            <v-row>
              <div
                class="pr-6 pb-6"
                v-for="(row, index) in rows"
                :key="index"
                >
                <img src="/icons/flag.svg" alt="Icono de listado" class="vertical-middle"/>
                <span class="pl-1 fs-15 vertical-middle">
                  {{ row.label }}: {{ data[row.key] }}
                </span>
              </div>
            </v-row>
            <v-row>
              <v-col>
                <bbva-web-form-text
                  v-if="noSearch.includes(typeId)"
                  @input="(ev) => setValue('ticket', ev.target.value)"
                  class="text-input"
                  :value="inputs.ticket.value"
                  :invalid="Boolean(inputs.ticket.error)"
                  :error-message="inputs.ticket.error"
                  label="N° de Folio"></bbva-web-form-text>
              <bbva-form-input
                v-else
                type="search"
                id="search"
                :value="inputs.ticket.value"
                class="input-search"
                label="N° de folio"
                action-variant="no-background"
                ambient="dark100"
                :invalid="Boolean(inputs.ticket.error)"
                :error-message="inputs.ticket.error"
                @formSearchButtonSubmit="(ev) => searchTicket(ev.target.value)"
                @formFieldInputClear="clearTicket"
              ></bbva-form-input>
              </v-col>
              <v-col>
                <bbva-web-form-select
                  @change="(ev) => setValue('typeId', ev.target.value)"
                  :value="inputs.typeId.value"
                  :invalid="!!inputs.typeId.error"
                  :error-message="inputs.typeId.error"
                  label="Tipo">
                  <bbva-web-form-option
                    v-for="option in options"
                    :key="option.id"
                    :value="option.id">
                    <span class="pl-4">{{option.label}}</span>
                  </bbva-web-form-option>
                </bbva-web-form-select>
              </v-col>
            </v-row>
            <v-row v-if="typeId === ticketTypesIds.INCIDENTS ">
              <v-col  sm="12" md="12" lg="6" xl="6">
                <div class="fs-15 fw-500">Incidente por cambio</div>
                <div role="radiogroup" class="d-flex flex-row pt-2 ga-8">
                  <bbva-web-form-radio-button 
                    @change="() => setValue('incidentByChange', 1)"
                    :checked="inputs.incidentByChange.value === 1">
                    Si
                  </bbva-web-form-radio-button>
                  <bbva-web-form-radio-button 
                    @change="() => setValue('incidentByChange', 0)"
                    :checked="inputs.incidentByChange.value === 0">
                    No
                  </bbva-web-form-radio-button>
                </div>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions class="pl-10 pb-10">
          <bbva-button-default
            text="Continuar"
            :disabled="!valid"
            @click="onSubmit" ></bbva-button-default>
          <div class="pl-8">
            <bbva-button-default
              text="Cancelar"
              variant="link"
              class="h-75"
              @click="close"
              ></bbva-button-default>
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
  <overlay :open="dialog"></overlay>
</template>

<script>
// Components
import '@/components/bbva-web-components/bbva-web-form-text.js'
import '@/components/bbva-web-components/bbva-web-form-select.js'
import '@/components/bbva-web-components/bbva-button-default.js'
import '@/components/bbva-web-components/bbva-foundations-icons.js'
import '@/components/bbva-web-components/bbva-form-input.js';
import Overlay from "@/components/overlay/Overlay.vue"
import '@/components/bbva-web-components/bbva-web-form-radio-button.js'
// Utils
import {
  validateRequired, clearInputs, isThereError, validateAllFields, parseCatalog
} from '@/utils/form';
// Constants
import { rowsImpactTicketForm, ticketTypesIds } from '@/constants/impactTickets.js';
// Requests
import { getTicketsTypesAPI } from '@/requests/impactTickets.js'
import { searchTicketAPI } from '@/requests/impactAdjustments.js';


/*
 * This component is modal form for any resource to edit or create
 * that change the fields depending on the properties
 * 
 */
export default {
  data() {
    return {
      typeId: null,
      ticketTypesIds,
      noSearch: [
        ticketTypesIds.BASELINE,
        ticketTypesIds.DIAGNOSTIC_ERRORS,
      ],
      fieldKeys: ['ticket', 'typeId', 'incidentByChange'],
      /* flag to open the dialog */
      dialog: false,
      /* Save the inputs with the values */
      inputs: {},
      /* Flag, true if the form is valid*/
      valid: true,
      /* It has all the options used by the selects */
      options: [],
      /* It has a key name for every fields and the values are validations to execute,
       * example { email: (value) => validateRequired(value) || validateEmail(value) }
       */
       validations: {
         ticket: validateRequired,
         typeId: validateRequired,
         incidentByChange: () => ('')
       },
    }
  },
  beforeMount() {
    this.loadCatalogs();
  },
  computed: {
    rows() {
      if( !this.data.typeId ) {
        return [];
      }
      const key = Object.keys(ticketTypesIds).find(
        (item) => ticketTypesIds[item] === this.data.typeId
      );

      return rowsImpactTicketForm[key];
    }
  },
  methods: {
    /*
     * This method loads all the catalogs used by the form
     */
    loadCatalogs() {
      this.emitter.emit("load", { loading: true });
      getTicketsTypesAPI().then( (response) => {
        const exclude = [ticketTypesIds.BASELINE];
        this.options = parseCatalog( response.data ).filter(
          (option) =>  !exclude.includes(option.id)
        );
      }).catch( (error) => {
        this.emitter.emit('error', { action: 'cargar catalogos',  error });
      }).finally(() => {
        this.emitter.emit("load", { loading: false });
      });

    },
    /*
     * This method sets the values changed by the user
     * and execute the validations that the field has,
     * and if another field  of type select depends on this, then
     * reload the another field
     * 
     */
    setValue(name, value) {
      this.inputs[name] = {
        value,
        error: ''
      }
      if(name === 'typeId') {
        this.typeId = value;
      }

      const error = this.validations[name](value);

      if( error ) {
        setTimeout(() => {
          this.inputs[name].error = error;
        }, 100);
      }

      this.valid = !error;
    },
    /*
     * This method catch the submit form, check the validations for all the fields
     * and if everything is right then send the values submited to the parent component
     *
     */
    onSubmit() {
      const values = {};
      this.inputs = validateAllFields(this.validations, this.inputs);
      this.valid = isThereError( this.inputs );
      if(this.valid) {
        values['ticket'] = this.inputs.ticket.value;
        values['typeId'] = this.inputs.typeId.value;
        if( this.inputs.incidentByChange !== null) {
          values['incidentByChange'] = this.inputs.incidentByChange.value ? 1 : 0;
        }
        values.id = this.data.id;
        if (this.data.description) {
          values.description = this.data.description
        }
        this.save(values);
      }
    },
    /*
     * It clears the inpts data
     */
    clearTicket() {
      this.inputs.ticket = {name: 'ticket', value: '' };
    },
    /*
     * It searches a ticket given an input text
     * @param {String} value  Text with the ticket
     */
    searchTicket(value) {
      this.emitter.emit('load', { loading: true });
      searchTicketAPI(value, this.data.buId).then( (response) => {
        if( Object.keys(response.data).length ) {
          this.inputs.ticket.value = response.data.ticketId;
        } else {
          this.inputs.ticket.error = 'Ticket no encontrado.';
        }
        this.valid = isThereError( this.inputs );
        this.emitter.emit('load', { loading: false });
      }).catch( (error) => {
        this.emitter.emit('load', { loading: false });
        this.emitter.emit('error', { action: 'buscar ticket', error });
      });
    },
  },
  components: {
    Overlay
  },

  props: {
    /* Flag to open the modal */
    open: { type: Boolean, default: false },
    /* Function where is going to send the submited values */
    save: { type: Function, default: () => {} },
    /* Function to close the modal */
    close: { type: Function, default: () => {} },
    /* It has the data when you are going to edit some resource, it must be empty if you
     *  are going to create
     */
    data: { type: Function, default: () => ({}) },

  },
  watch: {
    /*
     * This method follows when the flag open is changed  and clear
     * the previuos data if it exists
     */
    open(value) {
      this.dialog = value;
      this.typeId = this.data.typeId;
      if( Object.keys(this.data).length ) {
        this.fieldKeys.forEach( (key) => {
            this.inputs[key] = { value: this.data[key], error: '' };
        });
      } else {
        this.inputs = clearInputs( this.fieldKeys );
      }
    },
  }
}
</script>

<style>
  .text-input input {
    position: absolute;
    top: 20%;
    left: 3%;
  }
  .title-form {
    font-weight: 700;
    font-size: 22px;
  }
  .select-multiple {
    height: 50px;
  }
</style>
