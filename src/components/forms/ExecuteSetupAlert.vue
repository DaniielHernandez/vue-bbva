<template>
  <v-container>
  <v-row justify="center">
    <v-dialog
      v-model="dialog"
      persistent
      width="600"
    >
      <v-card style="overflow: unset">
        <v-card-title class="pl-10 pb-2 pt-4">
          <span class="title-form pt-3">
            Ejecutar alerta
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
            <v-row >

              <v-col cols="12">
                <bbva-web-form-select
                  @change="(ev) => setValue('buId', ev)"
                  :value="inputs.buId.value"
                  :invalid="!!inputs.buId.error"
                  :disabled="true"
                  :error-message="inputs.buId.error"
                  label="Business unit">
                  <bbva-web-form-option
                    v-for="option in catalogs.buId"
                    :key="option.id"
                    :value="option.id"><span class="pl-4">{{option.label}}</span></bbva-web-form-option>
                </bbva-web-form-select>
              </v-col>
              <v-col cols="12">
                <bbva-web-form-select
                  @change="(ev) => setValue('modelId', ev)"
                  :value="inputs.modelId.value"
                  :invalid="!!inputs.modelId.error"
                  :disabled="catalogs.modelId.length === 0"
                  :error-message="inputs.modelId.error"
                  label="CFS">
                  <bbva-web-form-option
                    v-for="option in catalogs.modelId"
                    :key="option.id"
                    :value="option.id"><span class="pl-4">{{option.label}}</span></bbva-web-form-option>
                   
                </bbva-web-form-select>
                 
              </v-col>
              <v-col cols="8">
                <date-picker
                  :required="true"
                  :max="today"
                  :value="inputs.startDate.value"
                  @value-change="(ev) => setValue('startDate', ev)"
                  :errorMessage="inputs.startDate.error"
                  :invalid="!!inputs.startDate.error"
                  label="Fecha inicio"
                />
              </v-col>
              <v-col cols="4">
                <bbva-form-input
                  type="time"
                  class="input-time"
                  id="startHour"
                  @formInputValueChange="(ev) => setValue('startHour',  ev)"
                  :invalid="!!inputs?.startHour?.error"
                  :error-message="inputs?.startHour?.error"
                  label="Hora inicio"></bbva-form-input>
              </v-col>
              <v-col cols="8">
                <date-picker
                  :required="true"
                  :value="inputs.endDate.value"
                  :max="today"
                  @value-change="(ev) => setValue('endDate', ev)"
                  :errorMessage="inputs.endDate.error"
                  :invalid="!!inputs.endDate.error"
                  label="Fecha de fin"
                />
              </v-col>
              <v-col cols="4">
                <bbva-form-input
                  type="time"
                  id="endHour"
                  class="input-time"
                  @formInputValueChange="(ev) => setValue('endHour', ev)"
                  :invalid="!!inputs?.endHour?.error"
                  :error-message="inputs?.endHour?.error"
                  ambient="primary"
                  label="Hora fin "></bbva-form-input>
              </v-col>

            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions class="pl-10 pb-10">
          <bbva-button-default
            :disabled="!valid"
            text="Continuar"
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
  </v-container>
</template>

<script>
/* Components */
import '@/components/bbva-web-components/bbva-web-form-text.js'
import '@/components/bbva-web-components/bbva-web-form-select.js'
import '@/components/bbva-web-components/bbva-button-default.js'
import '@/components/bbva-web-components/bbva-foundations-icons.js'
import '@/components/bbva-web-components/bbva-form-input.js';
import DatePicker from '@/components/forms/DatePicker.vue'
/* Requests */
import { getProfilesAPI } from '@/requests/profiles';
import { getAreasAPI } from '@/requests/areas';
import { getBusinessUnitsAPI } from '@/requests/businessUnit';
import { getGeographyN1sAPI } from '@/requests/geographyN1';
import { getRolesAPI } from '@/requests/roles';
import { getCfsModelAPI } from '@/requests/cfs.js';
/* Constants */
import { validationsExecuteForm } from '@/constants/setupAlerts.js'
import { ref } from 'vue';
/* Utils */
import {
  clearInputs, isThereError, validateAllFields, parseCatalog
} from '@/utils/form';
const fields = [
  'buId', 'modelId', 'startDate', 'endDate', 'startHour', 'endHour'
]
import { stringToday, compareStringDates } from '@/utils/general.js'

export default {
  data() {
    return {
      /* Current day */
      today: stringToday(),
      /* Flag, true if the dialog is open*/
      dialog: false,
      /* Form's inputs */
      inputs: {},
      /* Flag, true is the form is valid */
      valid: false,
      /* Select's catalog  */
      catalogs: { buId: [], modelId: []},
      /* Form's validations */
      validations: { ...validationsExecuteForm},
      /* Field's keys */
      fieldKeys: [...fields],
    }
  },
  components: {
    DatePicker
  },
  beforeMount() {
    this.loadCatalogs();
  },
  methods: {
    /*
     * It gets the catalogs used by the catalogs
     */
    loadCatalogs() {
      this.emitter.emit("load", { loading: true });
      getBusinessUnitsAPI().then((response) => {
        this.catalogs.buId = parseCatalog(response.data) ;
        this.emitter.emit("load", { loading: false });
      }).catch((error) => {
         this.emitter.emit("load", { loading: false });
         this.emitter.emit('error', { action: 'cargar catálogos',  error });
      });
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
      if( ! hour ) {
        return null;
      }
      return ( parseInt( hour.split(':')[0] ) * 60 ) + parseInt( hour.split(':')[1] );
    },
    /*
     * It validates start date must be lower or equals than the end date
     * @return Boolean, true if it is valid
     */
    validateDates() {
      const { startDate: { value: start }, endDate: { value: end } } = this.inputs;
      if( !start || !end || start === end ) {
        this.inputs.startDate.error = '';
        return;
      }

      if( compareStringDates(start, end) === -1) {
        this.inputs.startDate.error = 'La fecha de inicio no debe ser mayor a la fecha de fin';
      } else if( start ){
        this.inputs.startDate.error = '';
      }

      return !this.inputs.startDate.error;
    },
    /*
     * It validates start hour must be lower than the end hour
     * @return Boolean, true if it is valid
     */
    validateHours() {
      const { startDate, endDate } = this.inputs;
      if( !(startDate.value && endDate.value) || !(startDate.value === endDate.value) ) {
        this.inputs.startHour.error = '';
        return true;
      }
      const start = this.stringHoursToMinutes(this.inputs.startHour.value); 
      const end = this.stringHoursToMinutes(this.inputs.endHour.value); 
      if( start !== null && end !== null && start >= end ) {
        this.inputs.startHour.error = 'La hora de inicio debe ser menor a la final';
      } else {
        this.inputs.startHour.error = '';
      }
      return !this.inputs.startHour.error;
    },
    /*
     * It sets the values
     */
    setValue(name, ev) {
      const value = ev.target.value
      this.inputs[name] = {
        name, value, error: this.validations[name](value)
      };

      if( this.validateHours() && ['startHour', 'endHour'].includes(name) ) {
        this.validateFiveMinutes(name);
      }

      this.applyNestedFields(name, value);
      this.validateDates();

      this.valid = isThereError( this.inputs );
    },
    /*
     * This method executes the nested fields for BU
     * @param {String} name   Field's name
     * @param {String} value  Field's value
     */
    applyNestedFields(name, value) {
      if( name !== 'buId' ) {
        return;
      }
      const filter = value ? [ { name, value } ] : null;
      
      this.emitter.emit("load", { loading: true });
      this.inputs.modelId = { value: '',  error: null, touch: false};
      getCfsModelAPI(
        1, 3000, filter
      ).then((response) => {
          this.catalogs.modelId = parseCatalog(response.data.items) ;
      }).catch((error) => {
        this.emitter.emit('error', { action: 'Cargar catalogos',  error });
      }).finally(() => {
        this.emitter.emit("load", { loading: false });
      });
    },
    /*
     * It handles the form's submit
     */
    onSubmit() {
      this.inputs = validateAllFields(this.validations, this.inputs);
      const values = {};

      this.valid = isThereError( this.inputs );

      if(this.valid) {
        if(
            !this.validateHours() &&
            this.validateFiveMinutes('startHour') &&
            this.validateFiveMinutes('endHour') &&
            !this.validateDates()
        ) {
          this.valid = false;
        }
      }

      if(this.valid) {
        this.fieldKeys.forEach( (key) => values[key] = this.inputs[key].value );
        this.save(values);
      }
    },
  },
  props: {
    /* Business unit's ID */
    buId: { type: Number, default: 0 }, 
    /* Flag, true if the modal is open*/
    open: { type: Boolean, default: false },
    /* Function to save the data */
    save: { type: Function, default: () => {} },
    /* It closes the modal */
    close: { type: Function, default: () => {} },
  },
  watch: {
    open(value) {
      this.dialog = value;
      this.inputs = clearInputs( this.fieldKeys );

    },
    buId(value) {
      if(value) {
        this.inputs.buId.value = value;
        this.applyNestedFields('buId', value);
      }
    }
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
 .input-time {
   --bbva-form-field--_ambient--bg-color: #F4F4F4;
   --bbva-form-time--_ambient--clear-icon-color: #1973b8;
 }

</style>
