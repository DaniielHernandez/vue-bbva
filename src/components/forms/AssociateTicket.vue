<template>
  <v-row justify="center">
    <v-dialog
      v-model="dialog"
      persistent
      width="608"
    >
      <v-card>
        <v-card-title class="pl-10 pb-2 pt-4">
          <span class="title-form pt-3">
            {{ create ? 'Crear folio y asociar' : 'Asociar folio' }}
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
        <v-card-text class="pt-0">
          <v-container class="pt-0">
            <v-row class="pb-3">
                <div class="pt-3 pb-1 pr-6">
                  <img src="/icons/flag.svg" alt="Icono"
                    class="vertical-middle"
                  />
                  <span class="fs-15 pl-1 vertical-middle">
                    CFS: {{ data.cfs }}
                  </span>
                </div>
                <div class="pr-6 pt-3">
                  <img src="/icons/flag.svg" alt="Icono"
                    class="vertical-middle"
                  />
                  <span class="fs-15 pl-1 vertical-middle">
                    BU: {{ data.bu }}
                  </span>
                </div>
                <div class="pr-6 pt-3">
                  <img src="/icons/flag.svg" alt="Icono"
                    class="vertical-middle"
                  />
                  <span class="fs-15 pl-1 vertical-middle">
                    Operativas: {{ data.operatives }}
                  </span>
                </div>
                <div class="pr-6 pt-3">
                  <img src="/icons/flag.svg" alt="Icono"
                    class="vertical-middle"
                  />
                  <span class="fs-15 pl-1 vertical-middle">
                    Hora de inicio: {{ data.startHour }}
                  </span>
                </div>
                <div class="pr-6 pt-3">
                  <img src="/icons/flag.svg" alt="Icono"
                    class="vertical-middle"
                  />
                  <span class="fs-15 pl-1 vertical-middle ">
                    Hora de fin: {{ data.endHour }}
                  </span>
                </div>
            </v-row>
            <v-row v-if="!create">
              <v-col cols="12" class="pl-0">
                <bbva-form-input
                  type="search"
                  class="search-input"
                  label="Introduce un folio"
                  action-variant="no-background"
                  ambient="dark100"
                  :invalid="Boolean(inputs.ticketId.error)"
                  :error-message="inputs.ticketId.error"
                  @formSearchButtonSubmit="(ev) => searchTicket(ev.target.value)"
                  @formFieldInputClear="clearTicket"
                ></bbva-form-input>
              </v-col>
            </v-row>
            <v-row v-else>
              <v-col cols="12" class="pl-0">
                <bbva-web-form-text
                  @input="(ev) => setValue('ticketId', ev.target.value)"
                  class="text-input"
                  :value="inputs.ticketId.value"
                  :invalid="Boolean(inputs.ticketId.error)"
                  :error-message="inputs.ticketId.error"
                  label="No. de folio"></bbva-web-form-text>
              </v-col>
            </v-row>
            <v-row >
              <v-col cols="12" class="pl-0">
                <bbva-web-form-textarea
                  class="textarea"
                  :disabled="!create"
                  @change="(ev) => setValue('description', ev.target.value)"
                  :value="inputs.description.value"
                  :invalid="Boolean(inputs.description.error)"
                  :error-message="inputs.description.error"
                  label="Descripción"></bbva-web-form-textarea>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions class="pl-7 pb-10">
          <bbva-button-default
            :disabled="!valid"
            :text="create ? 'Crear y asociar' : 'Asociar' "
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
</template>

<script>

//  Components
import '@/components/bbva-web-components/bbva-web-form-text.js'
import '@/components/bbva-web-components/bbva-web-form-textarea.js'
import '@/components/bbva-web-components/bbva-button-default.js'
import '@/components/bbva-web-components/bbva-foundations-icons.js'
import '@/components/bbva-web-components/bbva-form-input.js'
/* Utils */
import {
  validateRequired, clearInputs, isThereError, validateAllFields
} from '@/utils/form';
/* Requests */
import { searchTicketAPI } from '@/requests/impactAdjustments.js';

export default {
  data() {
    return {
      /* Flag, true fi the searh ticket return a value */
      validTicket: null,
      /* Flag, true if the dialog must be open */
      dialog: false,
      /* It saves the inputs, to name but a few
       * inputs = {
       *   ticketId: { name: 'ticketId', value: 'Some', error: '' },
       *   description: { name: 'description', value: 'Some', error: '' },
       * }
       */
      inputs: {},
      /* Flag, true if the form is valid */
      valid: true,
      /* It has the validations for every field */
      validations: {
        ticketId: (value) => validateRequired(value),
      },
      /* It has the keys for the fields */
      fieldKeys: [ 'ticketId', 'description' ],
    }
  },
  methods: {
    /*
     * It searches a ticket given an input text
     * @param {String} value  Text with the ticket
     */
    searchTicket(value) {
      this.emitter.emit('load', { loading: true });
      searchTicketAPI(value, this.data.buId).then( (response) => {
        if( Object.keys(response.data).length ) {
          this.validTicket =  true;
          this.inputs.ticketId.value = response.data.ticketId;
          this.inputs.ticketId.error = '';
          this.inputs.description.value = response.data.description;
          this.valid = true;
        } else {
          this.validTicket = false;
          this.inputs.ticketId.error = 'Ticket no encontrado.';
          this.inputs.description.value = '';
        }
        this.emitter.emit('load', { loading: false });
      }).catch( (error) => {
        this.emitter.emit('load', { loading: false });
        if( error?.response?.status === 409) {
          this.validTicket = false;
          this.inputs.ticketId.error = 'Ticket no encontrado.';
          this.inputs.description.value = '';
        }  else {
          this.emitter.emit('error', { action: 'buscar ticket', error });
        }
      });
    },
    /*
     * It clears the inpts data
     */
    clearTicket() {
      this.inputs = clearInputs( this.fieldKeys );
      this.validTicket = null;
    },
    /*
     * It sets the values and executes the validations
     */
    setValue(name, value) {
      this.inputs[name] = { value, name, error: this.validations[name](value), touch: true };
      this.valid = isThereError( this.inputs );
    },
    /*
     * It validates all the values and if everthning is fine , then send them to the function save
     */
    onSubmit() {
      const values = {};

      if(!this.create && !this.validTicket) {
        this.inputs.ticketId.error = 'Necesita validar ticket.';
        this.inputs.description.error = '';
        this.valid = false;
        return;
      }

      this.inputs = validateAllFields(this.validations, this.inputs);

      this.valid = isThereError( this.inputs );

      if(this.valid) {
        this.fieldKeys.forEach( (key) => values[key] = this.inputs[key].value );
        values.buId = this.data.buId;

        this.save(values);
      }
    },
  },
  props: {
    /* Flag, true is the form is to create a ticket */
    create: { type: Boolean, default: false },
    /* Function that opens the modal */
    open: { type: Boolean, default: false },
    /* This function receives the submited values */
    save: { type: Function, default: () => {} },
    /* Function that closes the modal */
    close: { type: Function, default: () => {} },
    /* It has the data abou ajustment impact */
    data: { type: Object, default: () => ({}) }
  },
  watch: {
    open(value) {
      this.dialog = value;
      this.valid = true;
      this.inputs = clearInputs( this.fieldKeys );
    },
    create(value) {
      if( value ) {
        this.validations.description = validateRequired;
      } else {
        delete this.validations.description;
      }
    }
  }
}
</script>

<style>
  .title-form {
    font-weight: 700;
    font-size: 22px;
  }
  .search-input {
     --_form-field-bg-color: var(--bbva-form-field--_ambient--bg-color, var(--bbva-form-field--custom--primary-ambient--bg-color, var(--color-primary-form-input-background-default, #f4f4f4)));
   }

  .search-input  bbva-form-search {
     --_form-field-bg-color: var(--bbva-form-field--_ambient--bg-color, var(--bbva-form-field--custom--primary-ambient--bg-color, var(--color-primary-form-input-background-default, #f4f4f4)));
  }
  .textarea textarea {
    padding-top: 0.6rem;
    padding-inline: 1rem;
  }
</style>
