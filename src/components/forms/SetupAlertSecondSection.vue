<template>
  <header-form-setup-alert stepValue="50" :onClose="onCancel"/>
  <v-container class="pl-8 pb-12" fluid>
    <v-row>
      <v-col cols="12" align="center">
        <bbva-button-default variant="secondary" class="btn-preview" icon="bbva:up" text="Anterior" @click="back">
        </bbva-button-default>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <span class="text-step-form">2 de 2</span>
     </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <span class="title-form-model">Elementos adicionales</span>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" class="pb-0">
        <span class="fs-15 font-weight-black">Resumen paso 1</span>
      </v-col>
      <v-col cols="12" class="pt-0">
        <span class="fs-14">
          Elemento a Alertar: {{ elementToAlert }} &nbsp;&nbsp; Nombre de la alerta: {{ name }} 
        </span>
      </v-col>
    </v-row>

    <v-row>
      <v-col sm="12" md="4" lg="3" xl="3" v-if="elementToAlertFields[elementToAlertId].includes('buId')">
        <bbva-web-form-select
          key="buId"
          @change="(ev) => setValue('buId', ev.target.value)"
          :value="data.buId"
          :invalid="!!errors.buId"
          :error-message="errors.buId"
          label="Business Unit">
          <bbva-web-form-option
            v-for="option in options.bu"
            :key="option.id"
            :value="option.id"><span class="pl-4">{{option.label}}</span></bbva-web-form-option>
        </bbva-web-form-select>
      </v-col>
      <v-col sm="12" md="4" lg="3" xl="3" v-if="elementToAlertFields[elementToAlertId].includes('modelId')">
        <bbva-web-form-select
          key="modelId"
          :disabled="!data.buId || options.cfs.length === 0"
          @change="(ev) => setValue('modelId', ev.target.value)"
          :value="data.modelId"
          :invalid="!!errors.modelId"
          :error-message="errors.modelId"
          label="CFS">
          <bbva-web-form-option
            v-for="option in options.cfs"
            :key="option.id"
            :value="option.id"><span class="pl-4">{{option.label}}</span></bbva-web-form-option>
        </bbva-web-form-select>
      </v-col>
      <v-col sm="12" md="4" lg="3" xl="3" v-if="elementToAlertFields[elementToAlertId].includes('operativeId')">
        <bbva-web-form-select
          key="operativeId"
          @change="(ev) => setValue('operativeId', ev.target.value)"
          :value="data.operativeId"
          :disabled="!data.modelId || options.operatives.length === 0"
          :invalid="!!errors.operativeId"
          :error-message="errors.operativeId"
          label="Operativa">
          <bbva-web-form-option
            v-for="option in options.operatives"
            :key="option.id"
            :value="option.id"><span class="pl-4">{{option.label}}</span></bbva-web-form-option>
        </bbva-web-form-select>
      </v-col>
    </v-row>

    <v-row>
      <v-col sm="12" md="4" lg="3" xl="3" v-if="elementToAlertFields[elementToAlertId].includes('operatorId')">
        <bbva-web-form-select
          key="operatorId"
          @change="(ev) => setValue('operatorId', ev.target.value)"
          :value="data.operatorId"
          :invalid="!!errors.operatorId"
          :error-message="errors.operatorId"
          label="Operador">
          <bbva-web-form-option
            v-for="option in operatorOptions"
            :key="option.id"
            :value="option.id"><span class="pl-4">{{option.label}}</span></bbva-web-form-option>
        </bbva-web-form-select>
      </v-col>
      <v-col sm="12" md="4" lg="3" xl="3" v-if="elementToAlertFields[elementToAlertId].includes('value1') || elementToAlertFields[elementToAlertId].includes('measurementStatusId')">
         <bbva-form-field
          v-if="elementToAlertId !== 11"
          :required="true"
          class="text-input"
          allowed-pattern="[0-9.]"
          key="value1"
          @input="(ev) => setValue('value1', ev.target.value )"
          :value="data.value1"
          :invalid="!!errors.value1"
          :error-message="errors.value1"
          label="Valor 1"></bbva-form-field>

        <bbva-web-form-select
          v-else
          key="measurementStatusId"
          @change="(ev) => setValue('measurementStatusId', ev.target.value)"
          :value="data.measurementStatusId"
          :invalid="!!errors.measurementStatusId"
          :error-message="errors.measurementStatusId"
          label="Estatus de medición">
          <bbva-web-form-option
            v-for="option in options.measurementStatuses"
            :key="option.id"
            :value="option.id"><span class="pl-4">{{option.label}}</span></bbva-web-form-option>
        </bbva-web-form-select>
      </v-col>
      <v-col sm="12" md="4" lg="3" xl="3" v-if="elementToAlertFields[elementToAlertId].includes('value2')">
         <bbva-form-field
          :required="true"
          class="text-input"
          :disabled="this.data.operatorId !== 4"
          allowed-pattern="[0-9.]"
          key="value2"
          @input="(ev) => setValue('value2', ev.target.value )"
          :value="data.value2"
          :invalid="!!errors.value2"
          :error-message="errors.value2"
          label="Valor 2"></bbva-form-field>
      </v-col>
    </v-row>

    <v-row v-if="elementToAlertFields[elementToAlertId].includes('executionPeriodId')">
      <v-col sm="12" md="4" lg="3" xl="3">
        <bbva-web-form-select
          key="executionPeriodId"
          @change="(ev) => setValue('executionPeriodId', ev.target.value)"
          :value="data.executionPeriodId"
          :invalid="!!errors.executionPeriodId"
          :error-message="errors.executionPeriodId"
          label="Periodo de ejecución">
          <bbva-web-form-option
            v-for="option in executionPeriodOptions"
            :key="option.id"
            :value="option.id"><span class="pl-4">{{option.label}}</span></bbva-web-form-option>
        </bbva-web-form-select>
      </v-col>
      <v-col sm="12" md="8" lg="9" xl="9" v-if="data.executionPeriodId === 3" class="d-flex">
        <bbva-form-radio-button
          class="pr-4"
          v-for="day in Object.keys(week)"
          :key="`radio-week-${day}`"
          name="dayOfWeek"
          :checked="week[day] === data.dayOfWeek"
          :onClick="() => setValue('dayOfWeek', week[day])"
          value="day">{{day}}</bbva-form-radio-button>
      </v-col>
      <v-col sm="12" md="4" lg="3" xl="3" v-if="data.executionPeriodId === 4" >
        <date-picker
          @value-change="(ev) => setValue('endDate', ev.target.value)"
          :invalid="!!errors.endDate"
          :errorMessage="errors.endDate"
          label="Fecha fin"
          :value="data.endDate"
          />
      </v-col>
    </v-row>

    <v-row>
      <v-col sm="12" md="4" lg="3" xl="3" v-if="elementToAlertFields[elementToAlertId].includes('timePeriodId')">
        <bbva-web-form-select
          key="timePeriodId"
          @change="(ev) => setValue('timePeriodId', ev.target.value)"
          :value="data.timePeriodId"
          :invalid="!!errors.timePeriodId"
          :error-message="errors.timePeriodId"
          label="Periodo de tiempo">
          <bbva-web-form-option
              v-for="option in timePeriodsOptions"
            :key="option.id"
            :value="option.id"><span class="pl-4">{{option.label}}</span></bbva-web-form-option>
        </bbva-web-form-select>
      </v-col>
    </v-row>
    <v-row>
      <v-col sm="12" md="4" lg="3" xl="3" v-if="elementToAlertFields[elementToAlertId].includes('triggerAlert')">
        <bbva-web-form-checkbox
          class="pt-3"
          @change="(ev) => setValue('triggerAlert', ev.target.checked)"
          name="triggerAlert" :checked="data.triggerAlert">
          Disparar alerta folio(agata)
        </bbva-web-form-checkbox>
      </v-col>

    </v-row>


    <v-row align-content="center">
      <v-col sm="6" md="2" lg="1" xl="1" class="d-flex">
        <bbva-button-default
          text="Continuar"
          :disabled="!valid"
          @click="save">
        </bbva-button-default>
        <bbva-button-default
          text="Cancelar"
          variant="link"
          class="btn-cancel font-weight-black ml-8"
          @click="onCancel">
        </bbva-button-default>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
/* Components */
import '@/components/bbva-web-components/bbva-button-default.js'
import '@/components/bbva-web-components/bbva-foundations-microillustrations.js'
import HeaderFormSetupAlert from '@/components/headers/HeaderFormSetupAlert.vue'
import '@/components/bbva-web-components/bbva-form-input.js';
import '@/components/bbva-web-components/bbva-form-radio-button.js';
import '@/components/bbva-web-components/bbva-web-form-select.js'
import DatePicker from '@/components/forms/DatePicker.vue';
import '@/components/bbva-web-components/bbva-web-form-checkbox.js';
/* utils */
import { validateRequired } from '@/utils/form';
import { parseCatalog } from '@/utils/form';
import { stringToday } from '@/utils/general';
/* constants */
import { elementsToAlertIds } from '@/constants/elementsToAlert.js'
import {
  timePeriodsIds,
  executionPeriodsIds,
  operatorsIds
} from '@/constants/setupAlerts.js';
/* Requests */
import { getCfsModelAPI } from '@/requests/cfs.js'
import { getOperationsByCfsId } from '@/requests/impactAdjustments.js';

export default {
  data() {
    return {
      today: stringToday(),
      /* Week's keys with its index */
      week: {L: 'Lunes', M: 'Martes', X: 'Miércoles', J: 'Jueves', V: 'Viernes', S: 'Sábado', D:  'Domingo'},
      /* Setup Alert's ID */
      id: null,
      /* Data of the first part of the form if it's being edited */
      data: {},
      /* Flag, true if the form is valid */
      valid: false,
      /* Object the save the error of the fields */
      errors: {},
      /* It has the options to exclude given the element alert id */
      excludedOptions: {
        // Activity
        1: { executionPeriods: [2,3,7], timePeriods: [1,4], operators: [4,5] },
        // Errors
        2: { executionPeriods: [2,3,7], timePeriods: [1, 4], operators: [3,4,5] },
        // Slow operations
        3: { executionPeriods: [2,3,7], timePeriods: [1,4], operators: [3,4,5] },
        // Simple unavailability
        4: { executionPeriods: [2,3,7], timePeriods: [1,4], operators: [3,4] },
        // Weighing unavailability 
        5: { executionPeriods: [2,3,7], timePeriods: [1,2,4], operators: [3,4] },
        // acumulated unavailability
        6: { executionPeriods: [4,7], timePeriods: [2,3], operators: [3,5] },
        // Weighing response times
        7: { executionPeriods: [2,3,7], timePeriods: [1,2,4], operators: [3,4] },
        // Simple response times
        8: { executionPeriods: [2,3,7], timePeriods: [1,4], operators: [3,4] },
        // Contribution d+1
        9: { executionPeriods: [2,3,4,5,6,7], timePeriods: [1,2,4], operators: [2,3,5] },
        // Monthly contribution
        10: { executionPeriods: [4,5,6,7], timePeriods: [2,3], operators: [3,5] },
        // Configuration/models
        11: { executionPeriods: [1,2,3,5,6,7], timePeriods: [1,2,4], operators: [1,2,4] },
        // Baseline
        12: { executionPeriods: [4,5,6,7], timePeriods: [2,3], operators: [3,5] },
        // Tickets(agata)
        13: { executionPeriods: [1,2,3,5,6,7], timePeriods: [1,2,3,4], operators: [1,2,3,4,5] },
      },
      /* Fields to show given the element to alert choosen */
      elementToAlertFields: {
        // Activity
        1: ['buId', 'modelId', 'operativeId', 'operatorId', 'executionPeriodId', 'timePeriodId', 'triggerAlert', 'value1', 'value2', 'endDate'],
        // Errors
        2: ['buId', 'modelId', 'operativeId', 'operatorId', 'executionPeriodId', 'timePeriodId', 'triggerAlert', 'value1', 'value2', 'endDate'],
        // Slow operations
        3: ['buId', 'modelId', 'operativeId', 'operatorId', 'executionPeriodId', 'timePeriodId', 'triggerAlert', 'value1', 'value2', 'endDate'],
        // Simple unavailability
        4: ['buId', 'modelId', 'operativeId', 'operatorId', 'executionPeriodId', 'timePeriodId', 'triggerAlert', 'value1', 'value2', 'endDate'],
        // Weighing unavailability 
        5: ['buId', 'modelId', 'operativeId', 'operatorId', 'executionPeriodId', 'timePeriodId', 'value1', 'value2', 'endDate', 'triggerAlert'],
        // acumulated unavailability
        6: ['buId', 'modelId', 'operativeId', 'operatorId', 'executionPeriodId', 'timePeriodId', 'value1', 'value2', 'dayOfWeek'],
        // Weighing response times
        7: ['buId', 'modelId', 'operativeId', 'operatorId', 'executionPeriodId', 'timePeriodId', 'value1', 'value2', 'endDate'],
        // Simple response times
        8: ['buId', 'modelId', 'operativeId', 'operatorId', 'executionPeriodId', 'timePeriodId', 'triggerAlert', 'value1', 'value2', 'endDate'],
        // Contribution d+1
        9: ['buId', 'modelId', 'operatorId', 'executionPeriodId', 'timePeriodId', 'value1', 'value2', 'dayOfWeek'],
        // Monthly contribution
        10: ['buId', 'modelId', 'operatorId', 'executionPeriodId', 'timePeriodId', 'value1', 'value2'],
        // Configuration/models
        11: ['buId', 'modelId', 'operatorId', 'executionPeriodId', 'timePeriodId', 'measurementStatusId', 'endDate'],
        // Baseline
        12: ['buId', 'modelId', 'operatorId', 'executionPeriodId', 'timePeriodId', 'value1', 'value2', 'dayOfWeek'],
        // Tickets(agata)
        13: ['buId'],
      },
      /* It helps to filter nested options */
      filteredOptions: {},
      /* It has the validations to apply to the fields */
      validations: {
        buId: { validation: validateRequired },
        modelId: { validation: validateRequired },
        operativeId: {validation: () => '' },
        operatorId: { validation: validateRequired, nested: {
          1: { value1: validateRequired },
          2: { value1: validateRequired },
          3: { value1: validateRequired },
          4: { value1: validateRequired, value2: validateRequired },
          5: { value1: validateRequired }
        }},
        executionPeriodId: { validation: validateRequired, nested: {
            3: { dayOfWeek: validateRequired },
            4: { endDate: validateRequired }
        }},
        timePeriodId: { validation: validateRequired, nested: {
        } }
      },
    }
  },
  props: {
    /* Element to alert's id */
    elementToAlertId: { type: Number, default: 0 },
    /* Setup Alert's name */
    name: { type: String, default: '' },
    /* Element to alert ' name */
    elementToAlert: {type: String, default: ''},
    /* Function to update the form step */
    updateStep: { type: Function, default: () =>{} },
    /* Function to send the values when submit the first part of the model */
    onSubmit: { type: Function, default: () => {} },
    /* Function to handle when user cancel the form */
    onCancel: { type: Function, default: () => {} },
    /* It has the options useb by the fields type select */
    options: { type: Object, default: { elementsToAlertId: []} },
    /* Previous form data */
    previousData: { type: Object, default: {} },
    /* It sets the form data of this section*/
    setData: { type: Function, default: () => {}}
  },
  beforeMount() {
    this.data = {...this.previousData};
    this.id = this.$route.params.id;
    this.clearFields();
    this.validateAll(false);
  },
  computed: {
    /*
     * It gets the operator's options
     */
    operatorOptions() {
      let items = this.options.operators.filter(
        (item) => !this.excludedOptions[this.elementToAlertId].operators.includes(item.id)
      )

      return items;
    },
    /*
     * It gets the execution period's options
     */
    executionPeriodOptions(){
     let items = this.options.executionPeriods.filter(
        (item) => !this.excludedOptions[this.elementToAlertId].executionPeriods.includes(item.id)
      )
      return items;
    },
    /*
     * It gets the time period's options
     */
    timePeriodsOptions() {
      let items = this.options.timePeriods.filter(
        (item) => !this.excludedOptions[this.elementToAlertId].timePeriods.includes(item.id)
      )
      if([1,2,3].includes(this.elementToAlertId) && !this.data.operativeId ) {
        items =  items.filter( (item) => item.id !== 2 )
      } else if(this.elementToAlertId === 6 ) {
        if( [1,3,5,6].includes(this.data.executionPeriodId) ) {
          items =  items.filter( (item) => item.id !== 4 )
        } else {
          items =  items.filter( (item) => item.id !== 1 )
        }
      } else if(this.elementToAlertId === 10 ) {
        if( [1,3].includes(this.data.executionPeriodId) ) {
          items =  items.filter( (item) => item.id !== 4 )
        } else {
          items =  items.filter( (item) => item.id !== 1 )
        }
      } else if(this.elementToAlertId === 12 ) {
        if( [1,3].includes(this.data.executionPeriodId) ) {
          items =  items.filter( (item) => item.id !== 4 )
        } else {
          items =  items.filter( (item) => item.id !== 1 )
        }
      }
      return items;
    }
  },
  methods: {
    /*
     * It get the cfs's options given a bu's id 
     */
    setCfs(value) {
      if( !this.elementToAlertFields[this.elementToAlertId].includes('modelId') ) return;

      this.emitter.emit("load", { loading: true });
      getCfsModelAPI(1, 3000, [{ name: 'buId', value }]).then((response) => {
        this.options.cfs = parseCatalog(response.data.items);
        this.data.modelId = null;
        if( this.data.operativeId ) this.data.operativeId = null;
        this.options.operatives = [];
      }).catch( (error) => {
        this.emitter.emit('error', { action: 'cargar catalogos',  error });
      }).finally(() => {
        this.emitter.emit("load", { loading: false });
      });
    },
    /*
     * It get the operatives's options given a model's id 
     */
    setOperatives(value) {
      if( !this.elementToAlertFields[this.elementToAlertId].includes('operativeId') ) return;

      this.emitter.emit("load", { loading: true });
      getOperationsByCfsId({ cfsId: value }).then((response) => {
        this.options.operatives = parseCatalog(response.data.operations);
        this.data.operativeId = null;
      }).catch( (error) => {
        this.emitter.emit('error', { action: 'cargar catalogos',  error });
      }).finally(() => {
        this.emitter.emit("load", { loading: false });
      });
    },
    /*
     * It come back to the previous step
     */
    back() {
      const values = {}
      Object.keys(this.data).forEach((field) => {
        if( ![null, undefined].includes(this.data[field]) ) {
          values[field] = this.data[field];
        }
      });
      this.setData(values);
      this.updateStep(1);
    },
    /*
     * It sets the value for the field to remove
     */
    removeFieldErrors() {
      const currentFields = this.elementToAlertFields[this.elementToAlertId];
      Object.keys(this.errors).forEach((field) => {
        if(!currentFields.includes(field) && this.errors[field] ) {
          delete this.errors[field];
        }
      });
      if( this.errors.value2 && this.data.operatorId !== 4) {
        delete this.errors.value2;
      }
    },
    /*
     * It validates the nested fields
     * @param {String} field   Field's name 
     * @param {String} value Field's value
     *
     * @return Boolean, true if everything is right
     */
    validateNesteField(field, value, safeError = true) {
      let valid = true;
      if( typeof(value) !== 'number' || (field === 'operatorId' && this.elementToAlertId === 11)) {
        return valid;
      }
      const fieldId = value.toString();
      if( !this.validations[field].nested  || !this.validations[field].nested[fieldId]) {
        return valid;
      }
      Object.keys(this.validations[field].nested[fieldId]).every(
        (nestedField) => {
          const error = this.validations[field].nested[fieldId][nestedField](
            this.data[nestedField]
          )
          if( safeError ) {
            this.errors[nestedField] = error;
          }
          valid = !error;
          return valid;
        }
      );
      return valid;
    },
    /*
     * It validates all fields
     * @param {Boolean} saveError True if the errors musr be saved and showed
     */
    validateAll( saveError = true ) {
      this.removeFieldErrors();
      this.valid = true;
      this.elementToAlertFields[this.elementToAlertId].every( (field) => {
        this.valid = this.validateField(field, this.data[field], saveError );
        if( ['value1', 'value2'].includes(field) && this.valid ) {
          if(this.data.value2) delete this.errors.value2;
          this.valid = this.validateValues();
        }
        return this.valid;
      });
    },
    /*
     * It checks if any field has an error
     */
    isThereError() {
      this.valid = true;
      this.elementToAlertFields[this.elementToAlertId].every( (field) => {
        this.valid = this.validateField(field, this.data[field], false );
        return this.valid;
      });
    },
    /*
     * It validates all fields before to submit the form
     */
    save() {
      this.validateAll();
      if(this.valid) {
        const values = {}
        Object.keys(this.data).forEach((field) => {
          if( ![null, undefined].includes(this.data[field]) ) {
            values[field] = this.data[field];
          }
        });
        this.setData(values);
        this.onSubmit();
      }
    },
    /*
     * Set a value for a field and validate it
     * @param {String} key   Field's name 
     * @param {String} value Field's value
     */
    setValue(key, value) {
      this.data[key] = value;
      this.validateField(key, value, false);
      this.removeFieldErrors();
      if(key === 'executionPeriodId') {
        this.setExecutionPeriod(value);
      } else if(key === 'buId') {
        this.setCfs(value);
      } else if(key === 'modelId') {
        this.setOperatives(value);
      } else if( ['value1', 'value2'].includes(key) ) {
        if(this.data.value2) delete this.errors.value2;
        this.validateValues();
      } else if( key === 'operatorId' ) {
        if(value !== 4 && this.data.value2) {
          delete this.data.value2;
          delete this.errors.value1;
          delete this.errors.value2;
        }
      }

      this.isThereError();
    },
    /*
     * It validates that value1 be lower than value2
     */
    validateValues() {
      if(
        ![null, undefined].includes(this.data.value1) && 
        ![null, undefined].includes(this.data.value2) && 
        this.data.value1 >= this.data.value2
      ) {
        this.errors.value1 = 'No puede ser mayor o igual que valor 2';
      } else {
        this.errors.value1 = '';
      }
      return !this.errors.value1;
    },
    /*
     * It sets the execution period option
     */
    setExecutionPeriod(value) {
      if( value === 3 ) {
        this.data.dayOfWeek = [false, false, false,false, false, false,false]
        delete this.data.endDate;
        delete this.errors.endDate;
      } else if(value === 4) {
        this.data.endDate = '';
        delete this.data.dayOfWeek;
        delete this.errors.dayOfWeek;
      } else {
        delete this.data.dayOfWeek;
        delete this.data.endDate;
        delete this.errors.endDate;
        delete this.errors.dayOfWeek;
      }
    },
    /*
     *  It validates an specific field
     * @param {String} field   Field's name 
     * @param {String} value Field's value
     * @return Boolean, true if everything is right
     */
    validateField(field, value, saveError = true) {
      let valid = true;
      if( !this.validations[field] ) return valid;

      let error = this.validations[field].validation(value);
      valid = !error;
      if( saveError ) {
        this.errors[field] = error;
      }
      if( !error ) {
        valid = this.validateNesteField(field, value, saveError);
      }
      return valid;
    },
    /*
     * It clear all the form's fields
     */
    clearFields() {
      const currentFields = this.elementToAlertFields[this.elementToAlertId];
      Object.keys(this.data).forEach((field) => {
        if(!currentFields.includes(field) && this.data[field]) {
            delete this.data[field];
         }
      });
      this.errors = {};
      if( this.elementToAlertId === 11) {
          if( this.data.value1 ) delete this.data.value1;
          if( this.data.value2 ) delete this.data.value2;
      }
    }
  },
  watch: {
    'data.operativeId': (value) => {
      if( [1,2,3].includes(this.elementToAlertId) && value === null) {
        this.data.timePeriodId = null;
      }
    }
  },
  components: {
    HeaderFormSetupAlert,
    DatePicker
  },
}
</script>
<style>
  .step-bar span {
    background-color: #E9E9E9 !important;
  }
  .btn-cancel {
    margin: 15px 45px;
	}
  .text-input input {
    position: absolute;
    top: 20%;
    left: 5%;
  }
  .title-form-model {
    font-size: 26px;
    font-weight: 700 !important;
  }

  .text-step-form {
    font-size: 15px !important;
    font-style: italic !important;
    color: #666666 !important;
  }
  .btn-preview {
    border-radius: 30px;
    color: #004481;
    height: 40px;
  }

</style>
