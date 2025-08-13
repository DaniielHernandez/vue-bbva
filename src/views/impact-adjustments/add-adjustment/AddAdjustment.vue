<template>
  <app-bar />
  <v-container class="pt-8">
    <v-row>
      <v-col>
        <span class="pl-1 fs-18 fw-500">
          Ajustes - Disponibilidad - {{ bu.name + ' - ' + cfs.name}}
        </span>
      </v-col>
    </v-row>
    <v-row class="pt-6">
      <v-col sm="12" md="12" lg="6" xl="6" class="border-rounded mr-4">
          <v-container>
            <v-row class="pt-4" align="center">
              <v-col cols="auto">
                <div class="d-flex">
                  <img src="/icons/Calendar.svg" alt="Icono"/>
                  <span class="fw-500 fs-15 pt-1 pl-2" >Asociación de impactos</span>
                </div>
              </v-col>
              <v-spacer></v-spacer>
              <v-col cols="auto">
                <bbva-web-link
                  class="primary fw-500"
                  icon="bbva:show"
                  @click="showImpacts">
                  Consultar impactos
                </bbva-web-link>
              </v-col>
            </v-row>
            <v-row>
              <v-col sm="12" md="6" lg="6" xl="6">
                <bbva-web-form-select
                  v-if="!!options.stages"
                  @change="(ev) => setValue('stage', ev.target.value)"
                  :disabled="true"
                  :value="inputs?.stage?.value"
                  :invalid="!!inputs?.stage?.error"
                  :error-message="inputs?.stage?.error"
                  label="Escenario">
                  <bbva-web-form-option
                    v-for="option in options.stages"
                    :key="option.id"
                    :value="option.id"><span class="pl-4">{{option.label}}</span></bbva-web-form-option>
                </bbva-web-form-select>
              </v-col>
              <v-col sm="12" md="6" lg="6" xl="6">
                <div class="select-multiple">
                  <bbva-web-form-select-multiple
                    v-if="optionsOperatives?.length"
                    :invalid="!!inputs?.operativeId?.error"
                    id="operativeId"
                    :error-message="inputs?.operativeId?.error"
                    @change="(ev) => setValue('operativeId', ev.target.selectedOptionsValues)"
                    label="Operativas">
                    <bbva-web-form-option-multiple
                      v-for="option in optionsOperatives"
                      :selected="inputs.operativeId.value.includes(option.id)"
                      :key="option.id"
                      :value="`${option.id}`">
                      <span class="pl-4">{{option.label}}</span>
                    </bbva-web-form-option-multiple>
                  </bbva-web-form-select-multiple>
                </div>
              </v-col>
            </v-row>
            <v-row>
              <v-col  sm="6" md="6" lg="3" xl="3">
                <bbva-form-input
                  type="time"
                  class="input-time"
                  id="startHour"
                  @formInputValueChange="(ev) => setValue('startHour', ev.target.value)"
                  :invalid="!!inputs?.startHour?.error"
                  :error-message="inputs?.startHour?.error"
                  label="Hora inicio"></bbva-form-input>
              </v-col>
              <v-col  sm="6" md="6" lg="3" xl="3">
                <bbva-form-input
                  type="time"
                  id="endHour"
                  class="input-time"
                  @formInputValueChange="(ev) => setValue('endHour', ev.target.value)"
                  :invalid="!!inputs?.endHour?.error"
                  :error-message="inputs?.endHour?.error"
                  ambient="primary"
                  label="Hora fin "></bbva-form-input>
              </v-col>
              <v-col  sm="12" md="12" lg="6" xl="6">
                <multi-calendar
                  infoMessage="Puedes añadir más días de impacto"
                  label="Días de impactos"
                  :value="inputs?.days?.value"
                  :invalid="!!inputs?.days?.error"
                  :errorMessage="inputs?.days?.error"
                  @value-change="(ev) => setValue('days', ev.target.value)"
                />
              </v-col>
            </v-row>
          </v-container>
      </v-col>
      <v-col sm="12" md="12" lg="5" xl="5" class="border-rounded">
        <v-container v-if="!associateChoosen">
          <v-row justify="center">
            <v-col class="pb-0" align="center">
              <img src="/icons/Blockchain.svg" alt="Icono"/>
            </v-col>
          </v-row>
          <v-row justify="center">
            <v-col class="pb-0 pt-0" align="center">
              <span class="fs-20">Asociar o crear folio</span>
            </v-col>
          </v-row>
          <v-row justify="center">
            <v-col class="pb-0 pt-0" align="center">
              <span class="fs-15">Haz un ajuste, asocialo a un folio o crealo</span>
            </v-col>
          </v-row>
          <v-row justify="center">
            <v-col align="right" cols="6">
              <bbva-button-default
                text="Asociar"
                class="height-button"
                @click="() => chooseAssociate(false)"
                ></bbva-button-default>
            </v-col>
            <v-col align="left" cols="6">
              <div class="pl-4">
                <bbva-button-default
                  text="Crear y asociar"
                  class="height-button"
                  @click="() => chooseAssociate(true)"
                  ></bbva-button-default>
              </div>
            </v-col>

          </v-row>
        </v-container>
        <v-container v-else>
          <v-row class="pt-4">
            <v-col class="d-flex">
              <img src="/icons/file.svg" alt="Icono"/>
              <div style="display: grid;" class="pl-2">
                <span class="fs-15 fw-500">{{ create ? 'Crear folio' : 'Asociar folio'}}</span>
                <span class="fs-12">
                  Puedes {{ create ? 'crear un nuevo':'asociar un'}} folio para el nuevo ajueste
                </span>
              </div>
            </v-col>
          </v-row>
          <v-row v-if="!create">
            <v-col cols="12">
              <bbva-form-input
                type="search"
                id="search"
                class="input-search"
                label="No. de folio"
                action-variant="no-background"
                ambient="dark100"
                :invalid="Boolean(inputs?.ticket?.error)"
                :error-message="inputs?.ticket?.error"
                @formSearchButtonSubmit="(ev) => searchTicket(ev.target.value)"
                @formFieldInputClear="clearTicket"
              ></bbva-form-input>
            </v-col>
          </v-row>
          <v-row v-else>
            <v-col cols="12">
              <bbva-web-form-text
                @input="(ev) => setValue('ticket', ev.target.value)"
                class="text-input"
                :value="inputs?.ticket?.value"
                :invalid="Boolean(inputs?.ticket?.error)"
                :error-message="inputs?.ticket?.error"
                label="No. de folio"></bbva-web-form-text>
            </v-col>
          </v-row>
          <v-row >
            <v-col cols="12">
              <bbva-web-form-textarea
                :disabled="!create"
                class="textarea"
                @change="(ev) => setValue('description', ev.target.value)"
                :value="inputs?.description?.value"
                :invalid="Boolean(inputs?.description?.error)"
                :error-message="inputs?.description?.error"
                label="Descripción"></bbva-web-form-textarea>
            </v-col>
          </v-row>

          <v-row >
            <v-col cols="12">
              <div class="d-flex">
                <img src="/icons/bullet.svg" alt="Icono"/>
                <span class="fs-15 pl-2">
                  CFS: {{ cfs.name }}
                </span>
              </div>

              <div class="d-flex">
                <img src="/icons/bullet.svg" alt="Icono"/>
                <span class="fs-15 pl-2">
                  BU: {{ bu.name }}
                </span>
              </div>
              <div class="d-flex">
                <img src="/icons/bullet.svg" alt="Icono"/>
                <span class="fs-15 pl-2">
                  Operativas: {{ operatives }}
                </span>
              </div>
              <div class="d-flex">
                <img src="/icons/bullet.svg" alt="Icono"/>
                <span class="fs-15 pl-2">
                  Hora de inicio: {{ inputs.startHour.value }}
                </span>
              </div>
              <div class="d-flex">
                <img src="/icons/bullet.svg" alt="Icono"/>
                <span class="fs-15 pl-2">
                  Hora de fin: {{ inputs.endHour.value }}
                </span>
              </div>
            </v-col>
          </v-row>
          <v-row >
            <v-col cols="12" class="d-flex pt-0">
               <bbva-button-default
                 :disabled="!valid"
                  class="height-button"
                 :text="create ? 'Crear y asociar' : 'Asociar' "
                 @click="onSubmit" ></bbva-button-default>
               <div class="pl-8">
                 <bbva-button-default
                   text="Cancelar"
                   variant="link"
                   class="height-button"
                   @click="close"
                   ></bbva-button-default>
               </div>
            </v-col>
          </v-row>
        </v-container>
      </v-col>
    </v-row>
  </v-container>
   <v-dialog v-model="dialog" opacity="85" scrim="#043263" max-width="950" >
    <impact-adjustments-summary @close="closeDialog"></impact-adjustments-summary>
   </v-dialog>
</template>

<script>
/* Components */
import AppBar from "@/components/AppBar/AppBar.vue";
import '@/components/bbva-web-components/bbva-web-link.js';
import '@/components/bbva-web-components/bbva-web-form-select.js';
import '@/components/bbva-web-components/bbva-web-form-select-multiple.js';
import '@/components/bbva-web-components/bbva-button-default.js';
import '@/components/bbva-web-components/bbva-web-form-text.js';
import '@/components/bbva-web-components/bbva-web-form-textarea.js';
import '@/components/bbva-web-components/bbva-form-input.js';
import ImpactAdjustmentsSummary from '@/components/table/ImpactAdjustmentsSummary.vue'

import MultiCalendar from '@/components/forms/MultiCalendar.vue';
/* utils */
import {
  validateRequired, isThereError, validateAllFields
} from '@/utils/form';
import { parseCatalog } from '@/utils/form';
/* Requests */
import {
  searchTicketAPI, getOperationsByCfsId, createTicketAPI, associateTicketAPI, getScenarios,
  createAdjustmentImpact
} from '@/requests/impactAdjustments.js';

export default {
  data() {
    return {
      /* Field to handle the dialog */
      dialog: false,
      /* BU's data */
      bu: {
        id: null,
        name: ''
      },
      /* Cfs's data */
      cfs: {
        id: null,
        name:''
      },
      /* Flag, true if the form is valid */
      valid: false,
      /* Flag, true if the user has clicked on associate o create ticket */
      associateChoosen: false,
      /* CFS title header */
      title: '',
      /* Flag, true if the user clicked on create ticket */
      create: false,
      /* It has all the inputs with its values */
      inputs: {},
      /* It has all the validations for every input */
      validations: {
        days: validateRequired,
        stage: validateRequired,
        operativeId: validateRequired,
        startHour: validateRequired,
        endHour: validateRequired,
        ticket: validateRequired,
      },
      optionsOperatives: null,
      /* It has the optiosn for inputs that are selects */
      options: {
        stages: null,
      }
    };
  },
  beforeMount() {
    this.loadCatalogs();
    this.loadInitialData();
  },
  mounted() {
    document.querySelector( '#endHour').value = this.$route.query.endHour;
    document.querySelector( '#startHour').value = this.$route.query.startHour;
  },
  components: {
    AppBar,
    MultiCalendar,
    ImpactAdjustmentsSummary
  },
  computed: {
    operatives() {
      if( !this.inputs?.operativeId?.value || this.optionsOperatives?.length === 0) {
        return '';
      }
      let names = '';
      this.inputs.operativeId.value.forEach( (id, index) => {
        names += index ? ',' : '';
        names += this.optionsOperatives.find( (op) => parseInt(op.id) === parseInt(id) ).label;
      });
      return names;
    }
  },
  methods: {
    closeDialog(){
      this.dialog = false;
    },
    /*
     * It loads the data to get from the query params
     */
    loadInitialData() {
      this.cfs.id = this.$route.query.cfsId;
      this.bu.id = this.$route.query.buId;
      this.bu.name = this.$route.query.bu;

      this.inputs = {
        stage: { value: 1, error: '' },
        operativeId: { value: [], error: '' },
        ticket: { value: '', error: '' },
        description: { value: '', error: '' },
        days: { value: this.$route.query.date, error: '' },
        startHour: { value: this.$route.query.startHour, error: '' },
        endHour: { value: this.$route.query.endHour, error: '' },
      }
    },
    /*
     * It clears the input's values
     */
    clearValues() {
      document.querySelector('#endHour').value = '';
      document.querySelector('#startHour').value = '';
      document.querySelector('#operativeId').value = [];
      if( !this.create ) {
        document.querySelector('#search').value = '';
      }
      this.inputs = {
        stage: { value: 1, error: '' },
        ticket: { value: '', error: '' },
        operativeId: { value: [], error: '' },
        description: { value: '', error: '' },
        days: { value: '', error: '' },
        startHour: { value: '', error: '' },
        endHour: { value: '', error: '' },
      }
      this.close();
    },
    /*
     * It closes the second form to associate or create a ticket
     */
    close() {
      this.associateChoosen = false;
      this.create = false;
    },
    /*
     * It creates the adjustment and after associate and/or creates the ticket to and adjustment
     * @param {Object} values              Values to create the ticket
     * @param {String} values.days          Adjustment's days    
     * @param {String} values.stage         Adjustment's stage
     * @param {String} values.operativeId   Adjustment's operatives's ids
     * @param {String} values.startHour     Adjustment's start hour
     * @param {String} values.endHour       Adjustment's end hour
     * @param {String} values.id            Ticket's id
     * @param {String} values.ticket         Ticket
     * @param {string} values.description   Ticket's description
     */
    save(values) {
      const ticket = {
        ticketId: values.ticket,
        description: values.description
      };
      const data = {
        idScenery: values.stage,
        buId: parseInt(this.bu.id),
        cfsId: parseInt(this.cfs.id),
        operativesIds: [],
        timeZones: []
      };
      values.days.split(',').forEach( (date) => {
        data.timeZones.push( { 
          date: {
            start: date,
            end: date
          },
          time: {
            start: values.startHour,
            end: values.endHour
          }
        });
      });

      values.operativeId.forEach( (id) => {
        data.operativesIds.push( parseInt( id ) );
      });

      this.saveAssociate(data, ticket)
    },
    /*
     * It associates and/or creates the ticket to and adjustment
     * @param {Object} values              Values to create the ticket
     * @param {String} values.id        Ticket's id
     * @param {String} values.ticket        Ticket
     * @param {string} values.description  Ticket's description
     */
    saveAssociate(data, ticket) {
      if( this.create ) {
        this.createAdjustment(data, ticket);
      } else {
        this.addTicket(data, ticket);
      }
    },
    /*
     * Associate a ticket to an adjustment
     *
     * @param {Object} data                Adjustment data
     * @param {Object} ticket              Ticket's data
     */
    addTicket(data, ticket) {
      this.emitter.emit('load', { loading: true });
      createAdjustmentImpact(
        data
      ).then( ({ data: { id: adjustmentId }}) => {
        associateTicketAPI({adjustmentId, ...ticket, buId: parseInt(this.bu.id) }).then( () => {
          this.emitter.emit('load', { loading: false });
          this.emitter.emit(
            'informational',
            {
              type: 'success',
              title: 'Asociación de folio',
              message: `Has asociado correctamente el folio no. ${this.inputs.ticket.value}`
            }
          );
          this.clearValues();
        }).catch((error) => {
          this.emitter.emit('load', { loading: false });
          this.emitter.emit('error', { action: 'Asociar folio',  error });
        });
      }).catch( (error) => {
        this.emitter.emit('load', { loading: false });
        this.emitter.emit('error', { action: 'Crear Ajuste',  error });
      });;
    },
    /*
     * It creates a ticket and after associates the ticket to and adjustment
     * @param {Object} values              Values to create the ticket
     * @param {String} values.ticket        Ticket
     * @param {string} values.description  Ticket's description
     */
    createAdjustment(data, ticket) {
      this.emitter.emit('load', { loading: true });
      createAdjustmentImpact(
        data
      ).then( ({ data: { id: adjustmentId }}) => {
        createTicketAPI(
          {adjustmentId, ...ticket, buId: this.bu.id}
        ).then( () => {
            this.emitter.emit('load', { loading: false });
            this.emitter.emit(
              'informational',
              {
                type: 'success',
                title: 'Creación y asociación de ticket',
                message: `Has creado y asociado correctamente el ticket no. ${ticket.ticketId}`
              }
            );
            this.clearValues();
        }).catch( (error) => {
          this.emitter.emit('load', { loading: false });
          this.emitter.emit('error', { action: 'Crear ticket',  error });
        })
      }).catch( (error) => {
        this.emitter.emit('load', { loading: false });
        this.emitter.emit('error', { action: 'Crear Ajuste',  error });
      });
    },
    /*
     * It validates all the values and if everthning is fine , then send them to the function save
     */
    onSubmit() {
      const values = {};

      this.inputs = validateAllFields(this.validations, this.inputs);

      if(!this.create && !this.inputs.ticket.value) {
        this.inputs.ticket.error = 'Necesita validar ticket.';
        this.inputs.description.error = '';
        this.valid = false;
        return;
      }


      this.valid = isThereError( this.inputs );

      if(this.valid) {
        if( !this.validateHours() && this.validateFiveMinutes('startHour') && this.validateFiveMinutes('endHour') ) {
          this.valid = false;
          return;
        }
        Object.keys(this.inputs).forEach( (key) => values[key] = this.inputs[key].value );

        this.save(values);
      }
    },
    /*
     * It searches a ticket given an input text
     * @param {String} value  Text with the ticket
     */
    searchTicket(value) {
      this.emitter.emit('load', { loading: true });
      searchTicketAPI(value, this.bu.id).then( (response) => {
        if( Object.keys(response.data).length ) {
          this.inputs.ticket.value = response.data.ticketId;
          this.inputs.ticket.error = '';
          this.inputs.description.value = response.data.description;
          this.inputs.description.error = '';
        } else {
          this.inputs.ticket.error = 'Ticket no encontrado.';
          this.inputs.description.value = '';
        }
          this.valid = isThereError( this.inputs );
        this.emitter.emit('load', { loading: false });
      }).catch( (error) => {
        this.emitter.emit('load', { loading: false });
        if( error?.response?.status === 409) {
          this.inputs.ticket.error = 'Ticket no encontrado.';
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
      this.inputs.ticket = {name: 'ticket', value: '' };
      this.inputs.description = {name: 'description', value: '' };
    },
    /*
     * It sets the values and executes the validations
     * @param {String} name   Field's name
     * @param {String} value  Field's value
     */
    setValue(name, value) {
      this.inputs[name] = {
        name, value, error: this.validations[name](value)
      };
      if( ['startHour', 'endHour'].includes(name) ) {
        if( this.validateHours() ) {
          this.validateFiveMinutes(name);
        }
      }

      this.valid = isThereError( this.inputs );
    },
    /*
     * It validates if the hours are between periods of 5 minutes
     * @param Boolean, true if it is valid
     */
    validateFiveMinutes(field) {
      if( parseInt( this.inputs[field].value.split(':')[1] ) % 5 === 0 || 
        ( field === 'endHour' && this.inputs[field].value === '23:59')
      ) {
        this.inputs[field].error = ''
      } else {
        this.inputs[field].error = 'Valor en periodo de 5min'
      }
      return !this.inputs[field].error;
    },
    /*
     * It converts a string hour  to minutes
     * @param {String} Hour Hour format HH:MM
     * @return Number
     */
    stringHoursToMinutes(hour) {
      return ( parseInt( hour.split(':')[0] ) * 60 ) + parseInt( hour.split(':')[1] );
    },
    /*
     * It validates start hour must be lower than the end hour
     * @param Boolean, true if it is valid
     */
    validateHours() {
      const start = this.stringHoursToMinutes(this.inputs.startHour.value); 
      const end = this.stringHoursToMinutes(this.inputs.endHour.value); 
      if( start >= end ) {
        this.inputs.startHour.error = 'La hora de inicio debe ser menor a la final';
      } else {
        this.inputs.startHour.error = '';
      }
      return !this.inputs.startHour.error;
    },
    /*
     * It handles the click whe the user choose between associate or create ticket
     * @param {Boolean} create  Flag, true if it is creating a ticket
     */ 
    chooseAssociate(create) {
      this.clearTicket();
      this.associateChoosen = true;
      this.create = create;
      
    },
    /*
     * It loads the catalogs for the inputs type select
     */
    loadCatalogs() {
      this.emitter.emit('load', { loading: true });
      Promise.all([
        getOperationsByCfsId({ cfsId: this.$route.query.cfsId }),
        getScenarios()
      ]).then ( (responses) => {
        this.optionsOperatives = parseCatalog( responses[0].data.operations );
        this.options.stages = parseCatalog( responses[1].data );
        this.cfs.name = responses[0].data.cfs;
        this.emitter.emit('load', { loading: false });
        this.inputs.operativeId = { value: [ parseInt(this.$route.query.operativeId)], error: '' };
      }).catch ( (error) => {
        this.emitter.emit('load', { loading: false });
        this.emitter.emit('error', { action: 'obtener catalogos', error });
      });;
    },
    /*
     * It open the modal to show the impacts
     */
    showImpacts() {
      this.dialog = true;
    }
  },
  watch: {
    create(value) {
      if( value ) {
        this.validations.description = validateRequired;
      } else {
        delete this.validations.description;
      }

    }
  }
};
</script>
<style>
  .height-button {
    height: 48px;
  }
  .select-multiple {
    height: 0px;
  }
  .border-rounded {
    border-radius: 5px;
    border: 2px solid #D3D3D3;
 }
 .input-time {
   --bbva-form-field--_ambient--bg-color: #F4F4F4;
   --bbva-form-time--_ambient--clear-icon-color: #1973b8;
 }
 .input-search {
   --bbva-form-field--_ambient--bg-color: #F4F4F4;
 }
.text-input input {
  position: absolute;
  top: 20%;
  left: 3%;
}
.textarea textarea {
  left: 16px;
}
.field-input input {
    top: unset !important;
    left: unset !important;
    padding-left: 1rem !important;
    padding-top: 1rem !important;
}
</style>
