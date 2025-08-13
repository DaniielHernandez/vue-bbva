<template>
  <header-form-model stepValue="0" :onClose="onCancel" :onSubmit="preSubmit"/>
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
        <bbva-web-notification-message style="padding-top: 5px; padding-left: 10px;height: 35px;">
          <p>Todos los campos son obligatorios para poder avanzar</p>
        </bbva-web-notification-message>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <span class="title-section-form-model">Datos CFS</span>
      </v-col>
    </v-row>

    <v-row >
      <v-col  sm="6" md="4" lg="3">
        <bbva-web-form-select
          key="input-bu-select"
          @change="(ev) => setValue('buId', ev.target.value)"
          :value="data.buId"
          :invalid="!!errors.buId"
          :error-message="errors.buId"
          label="Business Unit">
          <bbva-web-form-option
            v-for="option in catalogs.buId"
            :key="option.id"
            :value="option.id"><span class="pl-4">{{option.label}}</span></bbva-web-form-option>
        </bbva-web-form-select>
      </v-col>
      <v-col  sm="6" md="4" lg="3">
        <bbva-web-form-select
          key="input-cfs-select"
          @change="(ev) => setValue('cfsId', ev.target.value)"
          :value="data.cfsId"
          :invalid="!!errors.cfsId"
          :error-message="errors.cfsId"
          label="CFS / Servicio">
          <bbva-web-form-option
            v-for="option in catalogs.cfsId"
            :key="option.id"
            :value="option.id"><span class="pl-4">{{option.label}}</span></bbva-web-form-option>
        </bbva-web-form-select>
      </v-col>
      <v-col  sm="6" md="4" lg="3">
        <bbva-web-form-select
          key="input-user-select"
          @change="(ev) => setValue('serviceOwnerId', ev.target.value)"
          :value="data.serviceOwnerId"
          :invalid="!!errors.serviceOwnerId"
          :error-message="errors.serviceOwnerId"
          label="Service Owner / Nombre y apellidos">
          <bbva-web-form-option
            v-for="option in catalogs.serviceOwnerId"
            :key="option.id"
            :value="option.id"><span class="pl-4">{{option.label}}</span></bbva-web-form-option>
        </bbva-web-form-select>
      </v-col>
      <v-col  sm="6" md="4" lg="3">
        <bbva-web-form-select
          key="input-criticality-select"
          @change="(ev) => setValue('criticalityId', ev.target.value)"
          :value="data.criticalityId"
          :invalid="!!errors.criticalityId"
          :error-message="errors.criticalityId"
          label="Clasificación de criticidad">
          <bbva-web-form-option
            v-for="option in catalogs.criticalityId"
            :key="option.id"
            :value="option.id"><span class="pl-4">{{option.label}}</span></bbva-web-form-option>
        </bbva-web-form-select>
      </v-col>
      <v-col sm="6" md="4" lg="3">
        <bbva-web-form-select
          key="input-entorno-select"
          @change="(ev) => setValue('environmentId', ev.target.value)"
          :value="data.environmentId"
          :invalid="!!errors.environmentId"
          :error-message="errors.environmentId"
          label="Entorno">
          <bbva-web-form-option
            v-for="option in catalogs.environmentId"
            :key="option.id"
            :value="option.id"><span class="pl-4">{{option.label}}</span></bbva-web-form-option>
        </bbva-web-form-select>
      </v-col>
      <v-col md="2" lg="1">
        <bbva-web-form-checkbox
          class="pt-3"
          @change="(ev) => setValue('rfoClp', ev.target.checked)"
          name="rfoClp" :checked="data.rfoClp">
          RFO/CLP
        </bbva-web-form-checkbox>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <span class="title-section-form-model">Ventanas General</span>
      </v-col>
    </v-row>

    <v-row v-for="(window, index) in data.windowsGeneral" :key="`row-window-${index}`">
      <v-col  sm="6" md="3" lg="2" xl="1">
        <bbva-form-time
          class="text-input"
          :required="true"
          :value="window.startHour"
          @input="(ev) => setWindowValue('startHour', index, ev.target.value)"
          :invalid="!!getWindowError('startHour', index)"
          :error-message="getWindowError('startHour', index)"
          label="Hora inicio"></bbva-form-time>
      </v-col>
      <v-col  sm="6" md="3" lg="2" xl="2">
        <bbva-web-form-select
          key="input-entorno-select"
          @change="(ev) => setWindowValue('startDay', index, ev.target.value)"
          :value="window.startDay"
          :invalid="!!getWindowError('startDay', index)"
          :error-message="getWindowError('startDay', index)"
          label="Día de inicio">
          <bbva-web-form-option
            v-for="option in catalogs.days"
            :key="option.id"
            :value="option.id"><span class="pl-4">{{option.label}}</span></bbva-web-form-option>
        </bbva-web-form-select>
      </v-col>

      <v-col  sm="6" md="3" lg="2" xl="1">
        <bbva-form-time
          class="text-input"
          :value="window.endHour"
          @input="(ev) => setWindowValue('endHour', index, ev.target.value)"
          :invalid="!!getWindowError('endHour', index)"
          :error-message="getWindowError('endHour', index)"
          label="Hora fin" :required="true"></bbva-form-time>
      </v-col>

      <v-col  sm="6" md="3" lg="2" xl="2">
        <bbva-web-form-select
          key="input-entorno-select"
          @change="(ev) => setWindowValue('endDay', index, ev.target.value)"
          :value="window.endDay"
          :invalid="!!getWindowError('endDay', index)"
          :error-message="getWindowError('endDay', index)"
          label="Día fin">
          <bbva-web-form-option
            v-for="option in catalogs.days"
            :key="option.id"
            :value="option.id"><span class="pl-4">{{option.label}}</span></bbva-web-form-option>
        </bbva-web-form-select>
      </v-col>
      <v-col  sm="6" md="3" lg="2" xl="1">
        <bbva-web-form-checkbox
          class="pt-3"
          @change="(ev) => setWindowValue( 'holidays', index,  ev.target.checked)"
          :invalid="!!getWindowError('holidays', index)"
          :error-message="getWindowError('holidays', index)"
          name="holidays" :checked="window.holidays">
          Días inhabiles
        </bbva-web-form-checkbox>
      </v-col>
      <v-col  sm="6" md="4" lg="2" xl="1">
        <bbva-button-default
           v-if="index != 0"
          text=""
          variant="link"
          style="color: #1973B8; padding-bottom: 10px"
          class="pt-3"
          icon="bbva:trash"
          @click="() => removeWindow(index)">
        </bbva-button-default>
      </v-col>
    </v-row> 

  <v-row> 
    <v-col cols="12">
      <bbva-button-default
        text="Añadir ventana"
        variant="link"
			  style="color: #1973B8; display: flex; gap: 8px;"
        icon="bbva:add"
        @click="addWindow">
      </bbva-button-default>
    </v-col>
  </v-row> 

    <v-row>
      <v-col cols="12">
        <span class="title-section-form-model">Datos de medición</span>
      </v-col>
    </v-row>

    <v-row>
      <v-col  sm="6" md="4" lg="3">
        <bbva-web-form-select
          key="input-bu-select"
          @change="(ev) => setModelStatus(ev.target.value)"
          :value="data.statusId"
          :invalid="!!errors.statusId"
          :error-message="errors.statusId"
          label="Estatus de modelo">
          <bbva-web-form-option
            v-for="option in catalogs.statusId"
            :key="option.id"
            :value="option.id"><span class="pl-4">{{option.label}}</span></bbva-web-form-option>
        </bbva-web-form-select>
      </v-col>
      <v-col  sm="6" md="4" lg="3">
        <bbva-web-form-select
          :if="data.measurementStatusId"
          key="input-status-measurement-select"
          @change="(ev) => setMeasurementStatus(ev.target.value)"
          :value="data.measurementStatusId"
          :invalid="!!errors.measurementStatusId"
          :error-message="errors.measurementStatusId"
          label="Estatus de medición">
          <bbva-web-form-option
            v-for="option in catalogs.measurementStatusId"
            :key="option.id"
            :value="option.id"><span class="pl-4">{{option.label}}</span></bbva-web-form-option>
        </bbva-web-form-select>
      </v-col>

      <v-col  sm="6" md="4" lg="3">
        <bbva-web-form-select
          key="input-tipo-modelo-select"
          @change="(ev) => setModelType(ev.target.value)"
          :value="data.typeModelId"
          :invalid="!!errors.typeModelId"
          :error-message="errors.typeModelId"
          label="Modelo">
          <bbva-web-form-option
            v-for="option in catalogs.typeModelId"
            :key="option.id"
            :value="option.id"><span class="pl-4">{{option.label}}</span></bbva-web-form-option>
        </bbva-web-form-select>
      </v-col>
      <v-col sm="6" md="4" lg="3">
        <bbva-web-form-select
          key="input-fuente-select"
          @change="(ev) => setValue('sourceId', ev.target.value)"
          :value="data.sourceId"
          :invalid="!!errors.sourceId"
          :error-message="errors.sourceId"
          label="Fuente">
          <bbva-web-form-option
            v-for="option in catalogs.sourceId"
            :key="option.id"
            :value="option.id"><span class="pl-4">{{option.label}}</span></bbva-web-form-option>
        </bbva-web-form-select>
      </v-col>
      <v-col  sm="6" md="4" lg="3">
        <bbva-form-field
          :required="true"
          key="input-version-text"
          class="text-input"
          allowed-pattern="[0-9.]"
          @input="(ev) => setValue('version' , parseFloat(ev.target.value ||  0 ))"
          :value="data.version"
          :invalid="!!errors.version"
          :error-message="errors.version"
          label="Versión"></bbva-form-field>
      </v-col>
      <v-col  sm="6" md="4" lg="3">
        <bbva-form-field
          :required="true"
          key="input-meta-disponibilidad-number"
          allowed-pattern="[0-9.]"
          class="text-input"
          @input="(ev) => setValue('metaAvailability', parseFloat(ev.target.value || 0) )"
          :value="data.metaAvailability"
          :invalid="!!errors.metaAvailability"
          :error-message="errors.metaAvailability"
          label="Meta disponibilidad(%)"></bbva-form-field>
      </v-col>
      <v-col  sm="6" md="4" lg="3">
         <bbva-form-field
          :required="true"
          allowed-pattern="[0-9.]"
          class="text-input"
          key="input-meta-respuesta-number"
          @input="(ev) => setValue('metaTimeResponse', parseFloat(ev.target.value || 0) )"
          :value="data.metaTimeResponse"
          :invalid="!!errors.metaTimeResponse"
          :error-message="errors.metaTimeResponse"
          label="Meta tiempo de respuesta(%)"></bbva-form-field>
      </v-col>
      <v-col sm="6" md="4" lg="3" xl="2">
        <bbva-web-form-checkbox
          class="pt-3"
          @change="(ev) => setValue('levelsService', ev.target.checked)"
          name="levelsService" :checked="data.levelsService">
          Niveles de servicio
        </bbva-web-form-checkbox>
      </v-col>
      <v-col sm="6" md="4" lg="3" xl="2">
        <bbva-web-form-checkbox
          class="pt-3"
          @change="(ev) => setValue('timesAnswer', ev.target.checked)"
          name="timesAnswer" :checked="data.timesAnswer">
          Tiempos de respuesta
        </bbva-web-form-checkbox>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <span class="title-section-form-model">Fechas</span>
      </v-col>
    </v-row>

    <v-row>
      <v-col sm="6" md="4" lg="3">
        <date-picker
          label="Fecha de alta"
          :value="data.dischargeDate"
          :disabled="true"
          :invalid="!!errors.dischargeDate"
          :errorMessage="errors.dischargeDate"
          @value-change="(ev) => setValue('dischargeDate', ev.target.value)"
        />
      </v-col>
      <v-col sm="6" md="4" lg="3">
        <date-picker
          label="Fecha de activación"
          :value="data.activationDate"
          :disabled="disabledFields.activationDate"
          :invalid="!!errors.activationDate"
          :errorMessage="errors.activationDate"
          @value-change="(ev) => setValue('activationDate', ev.target.value)"
        />
      </v-col>
      <v-col sm="6" md="4" lg="3">
        <date-picker
          label="Fecha de inicio Periodo de Garantía"
          :value="data.datePeriodWarranty"
          :disabled="disabledFields.datePeriodWarranty"
          :invalid="!! errors.datePeriodWarranty"
          :errorMessage="errors.datePeriodWarranty"
          @value-change="(ev) => setValue('datePeriodWarranty', ev.target.value)"
        />
      </v-col>
      <v-col sm="6" md="4" lg="3">
        <date-picker
          label="Fecha de inicio Oficial"
          :disabled="disabledFields.dateStartOfficial"
          :value="data.dateStartOfficial"
          :invalid="!!errors.dateStartOfficial"
          :errorMessage="errors.dateStartOfficial"
          @value-change="(ev) => setValue('dateStartOfficial', ev.target.value)"
        />
      </v-col>
      <v-col sm="6" md="4" lg="3">
        <date-picker
          label="Fecha de inactivación"
          :value="data.inactivationDate"
          :disabled="disabledFields.inactivationDate"
          :invalid="!!errors.inactivationDate"
          :errorMessage="errors.inactivationDate"
          @value-change="(ev) => setValue('inactivationDate', ev.target.value)"
        />
      </v-col>
      <v-col sm="6" md="4" lg="3">
        <date-picker
          label="Fecha de inicio de versión"
          :value="data.dateStartVersion"
          :invalid="!!errors.dateStartVersion"
          :errorMessage="errors.dateStartVersion"
          @value-change="(ev) => setValue('dateStartVersion', ev.target.value)"
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <span class="title-section-form-model">Partnership</span>
      </v-col>
    </v-row>

    <v-row>
      <v-col sm="6" md="4" lg="3">
        <bbva-web-form-select
          key="partnershipSelect"
          @change="(ev) => setPartnership(ev.target.value)"
          :value="data.partnershipId"
          :invalid="!!errors.partnershipId"
          :error-message="errors.partnershipId"
          label="Partnership">
          <bbva-web-form-option
            v-for="option in catalogs.partnershipId"
            :key="option.id"
            :value="option.id"><span class="pl-4">{{option.label}}</span></bbva-web-form-option>
        </bbva-web-form-select>
      </v-col>
      <v-col sm="6" md="4" lg="3">
        <bbva-web-form-select
          :disabled="disabledFields.measurementStatusPartnershipId"
          key="measurementStatusPartnershipId"
          @change="(ev) => setValue('measurementStatusPartnershipId', ev.target.value)"
          :value="data.measurementStatusPartnershipId"
          :invalid="!!errors.measurementStatusPartnershipId"
          :error-message="errors.measurementStatusPartnershipId"
          label="Estatus Medición Partnership">
          <bbva-web-form-option
            v-for="option in catalogs.measurementStatusPartnershipId"
            :key="option.id"
            :value="option.id"><span class="pl-4">{{option.label}}</span></bbva-web-form-option>
        </bbva-web-form-select>
      </v-col>
      <v-col  sm="6" md="4" lg="3">
        <bbva-web-form-text
          :disabled="disabledFields.metaPartnershipExpected"
          key="input-metaPartnershipExpected-text"
          class="text-input"
          @input="(ev) => setValue('metaPartnershipExpected', ev.target.value)"
          :value="data.metaPartnershipExpected"
          :invalid="!!errors.metaPartnershipExpected"
          :error-message="errors.metaPartnershipExpected"
          label="Meta Partnership Expected SLA"></bbva-web-form-text>
      </v-col>
      <v-col sm="6" md="4" lg="3">
        <bbva-web-form-text
          :disabled="disabledFields.metaPartnershipMinimum"
          class="text-input"
          key="input-metaPartnershipMinimum-text"
          @input="(ev) => setValue('metaPartnershipMinimum', ev.target.value)"
          :value="data.metaPartnershipMinimum"
          :invalid="!!errors.metaPartnershipMinimum"
          :error-message="errors.metaPartnershipMinimum"
          label="Meta Partnership Minimum SLA"></bbva-web-form-text>
      </v-col>
      <v-col sm="6" md="4" lg="3">
        <date-picker
          :disabled="disabledFields.dateStartPartnershipInitial"
          label="Fecha de inicio partnership Initial"
          :value="data.dateStartPartnershipInitial"
          :invalid="!!errors.dateStartPartnershipInitial"
          :errorMessage="errors.dateStartPartnershipInitial"
          @value-change="(ev) => setValue('dateStartPartnershipInitial', ev.target.value)"
        />
      </v-col>
      <v-col sm="6" md="4" lg="3">
        <date-picker
          label="Fecha de inicio partnership As Is"
          :disabled="disabledFields.dateStartPartnershipAsIs"
          :value="data.dateStartPartnershipAsIs"
          :invalid="!!errors.dateStartPartnershipAsIs"
          :errorMessage="errors.dateStartPartnershipAsIs"
          @value-change="(ev) => setValue('dateStartPartnershipAsIs', ev.target.value)"
        />
      </v-col>
    </v-row>

    <v-row align-content="center">
      <v-col sm="6" md="2" lg="1" xl="1" class="d-flex">
        <bbva-button-default
          text="Continuar"
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
import {
  dataVentana, partnershipNA, modelStatus,
  validateFirstSection, validationsVentana, measurementStatus, typeModel
} from '@/constants/model';
import '@/components/bbva-web-components/bbva-web-form-select.js'
import '@/components/bbva-web-components/bbva-web-form-checkbox.js';
import '@/components/bbva-web-components/bbva-web-form-text.js'
import '@/components/bbva-web-components/bbva-form-input.js';
import DatePicker from '@/components/forms/DatePicker.vue'
import '@/components/bbva-web-components/bbva-button-default.js'
import '@/components/bbva-web-components/bbva-web-notification-message.js'
import { validateRequired } from '@/utils/form';
import { getModelsAPI } from '@/requests/models.js';
import HeaderFormModel from '@/components/headers/HeaderFormModel.vue'
import { nextTick } from 'vue'

/*
 * It's the form used by the first part of the model form
 *
 */
export default {
  data() {
    return {
      /* Model's ID */
      id: null,
      /* Data of the first part of the form if it's being edited */
      data: {},
      /* Flag, true if the form is valid */
      valid: true,
      /* Object the save the error of the fields */
      errors: {},
      /* It has the the fields that are disabled*/
      disabledFields: {},
      /* It has the validations to apply to the fields */
      validations: {...validateFirstSection},
      /* It has the validtions for general windows*/
      validationsWindows: {...validationsVentana},
      /* It has the general windows to be removed */
      removedWindows: [],
    };
  },
  props: {
    /* Function set the form data */
		setData: { type: Function, default: () => { } },
    /* Function to handle when user cancel the form */
    onCancel: { type: Function, default: () => {} },
    /* Function to handle when user advance to the next section of the form*/
    nextStep: { type: Function, default: () => {} },
    /* Function to send the values when submit the first part of the model */
    onSubmit: { type: Function, default: () => {} },
    /* Previous form data */
    previousData: { type: Object, default: {} },
    /* It has the catalogs useb by the fields type select */
    catalogs: { type: Object, default: {} },
    /* Function to handle if it has errors on requests */
    requestError: { type: Function, default: () => {} },

  },
  beforeMount() {
    this.data = {...this.previousData};
    this.id = this.$route.params.id;
    this.disable(
      [
        'measurementStatusPartnershipId', 'dateStartPartnershipAsIs',
        'metaPartnershipExpected', 'metaPartnershipMinimum',
        'dateStartPartnershipInitial', 'activationDate', 'inactivationDate',
        'dateStartOfficial', 'datePeriodWarranty'
      ]
    );

    if( this.id ) {
      this.setEditValidations();
    }
  },
  components: {
    DatePicker,
    HeaderFormModel
  },
  methods: {
    /*
     * set the validations when is editing the resource
     */
    setEditValidations(){
      this.setModelStatus( this.data.statusId );
      this.setMeasurementStatus( this.data.measurementStatusId );
      this.setPartnership( this.data.partnershipId );
    },
    /*
     * Disable the fields received
     * @param {String[]} fields Fields names to be disabled
     */
    disable(fields) {
      fields.forEach( (field) => {
        this.disabledFields[field] = true;
        this.validations[field] = () => '';
        this.errors[fields] = '';
      });
    },
    /*
     * Remove window from the form
     * @param {Number}  index Window's index to be removed
     */
    removeWindow(index) {
      const item = this.data.windowsGeneral.splice(index,1)[0];
      if(this.id && item.id) {
        this.removedWindows.push(item.id);
      }
    },
    /*
     * Add a windows to the form
     */
    addWindow() {
      const item = { ...dataVentana };
      if( this.id ) {
        item.id = null;
      }
      this.data.windowsGeneral.push( item );
    },
    /*
     * Inactivate the field status model
     */
    inactiveStatusModel(){
      this.validations.inactivationDate = validateRequired;
      this.disabledFields.inactivationDate = false;

      this.validations.activationDate = () => '';
      this.disabledFields.activationDate = true;

      this.setMeasurementStatus(measurementStatus.unsubscribe);

      this.disabledFields.measurementStatusId = true;
      if( !this.id ) {
        this.data.activationDate = '';
      }
    },
    /*
     * Activate the field status model
     */
    activeStatusModel(){
      this.validations.activationDate = validateRequired;
      this.validations.inactivationDate = () => '';
      this.disabledFields.inactivationDate = true;
      this.disabledFields.activationDate = false;
      this.disabledFields.measurementStatusId = false;


      if( !this.id ) {
        this.data.inactivationDate = '';
      }
    },
    /*
     * Set the status model to draft
     */
    draftStatusModel(){
      this.validations.inactivationDate = () => '';
      this.validations.activationDate = () => '';
      this.disabledFields.inactivationDate = true;
      this.disabledFields.activationDate = true;
      this.disabledFields.measurementStatusId = false;

      if( !this.id ) {
        this.data.activationDate = '';
        this.data.inactivationDate = '';
      }
    },
    /*
     * Set the model type
     * @param {String} value New value for the model type
     */
    setModelType(value) {
      this.data.typeModelId = value;
      if( typeModel.rum === value) {
        this.data.timesAnswer = true;
        this.data.levelsService = true;
      }
    },
    /*
     * Set the model status
     * @param {String} value New value for the model status
     */
    setModelStatus(value) {
      this.data.statusId = value;

      this.validateField('statusId', value);
      if(value === modelStatus.inactive) { // inactive
        this.inactiveStatusModel();
      } else if(value === modelStatus.active) {//active
        this.activeStatusModel();
      } else {// borrador
        this.draftStatusModel();
      }
    },
    /*
     * Set the partnership field
     * @param {String} value New value for the partnership
     */
    setPartnership(value) {
      this.data.partnershipId = value;
      if( value === partnershipNA ) {
        [
          'measurementStatusPartnershipId', 'dateStartPartnershipAsIs',
          'metaPartnershipExpected', 'metaPartnershipMinimum',
          'dateStartPartnershipInitial'
        ].forEach( (key) => {
          this.data[key] = null;
          this.errors[key] = '';
          this.validations[key] = () => '';
          this.disabledFields[key] = true;
        });
      } else {
        [
          'measurementStatusPartnershipId', 'dateStartPartnershipAsIs',
          'metaPartnershipExpected', 'metaPartnershipMinimum',
          'dateStartPartnershipInitial'
        ].forEach((key) => {
          this.errors[key] = '';
          this.validations[key] = validateRequired;
          this.disabledFields[key] = false;
        });
      }

    },
    /*
     * Validate if the model is duplicated
     */
    validateDuplicateOficialModel(){
      if(
        this.data.measurementStatusId !== measurementStatus.official ||
        this.data.buId || this.data.cfsId || this.data.statusId ||
        this.data.measurementStatusId
      ) {
        return;
      }
      const filters = [
        { name: 'buId', value: this.data.buId},
        { name: 'cfsId', value: this.data.cfsId},
        { name: 'measurementStatusId', value: this.data.measurementStatusId },
        { name: 'statusId', value: this.data.statusId },
      ];
      getModelsAPI(1,1,filters).then(async (response) => {
        if( response.data.items.length && this.id !== response.data.items[0].id ) {
          this.errors.measurementStatusId = 'Ya existe modelo';

          await nextTick();
        }
      });
    },
    /*
     * Set the measurement status
     * @param {Boolean} value  Nalue for the Measurement status
     */
    setMeasurementStatus (value) {
      this.data.measurementStatusId = value;

      this.validateField('measurementStatusId', this.data.measurementStatusId);

      this.validateDuplicateOficialModel();

      if( value === measurementStatus.warrantyPeriod ) {// periodo de garantía
        this.validations.datePeriodWarranty = validateRequired;
        this.disabledFields.dateStartOfficial = true;
        this.disabledFields.datePeriodWarranty = false;
        this.validations.dateStartOfficial = () => '';

        if( !this.id ) {
          this.data.dateStartOfficial = '';
        }
      } else if ( value === measurementStatus.official ) {
        this.validations.dateStartOfficial = validateRequired;
        this.disabledFields.datePeriodWarranty = true;
        this.disabledFields.dateStartOfficial = false;
        this.validations.datePeriodWarranty = () => '';

        if( !this.id ) {
          this.data.datePeriodWarranty = '';
        }
      } else {
        this.validations.datePeriodWarranty = () => '';
        this.validations.dateStartOfficial = () => '';
        this.disabledFields.datePeriodWarranty = true;
        this.disabledFields.dateStartOfficial = true;

        if( !this.id ) {
          this.data.dateStartOfficial = '';
          this.data.datePeriodWarranty = '';
        }
      }
    },
    /*
     * Validate a field
     * @param {String} key   Field's name 
     * @param {String} value Field's value
     */
    validateField(key, value) {
      if( this.validations[key] ) { 
        this.errors[key] = this.validations[key](value);
      }

      if(['buId', 'cfsId', 'measurementStatusId', 'statusId' ].includes(key)) {
        this.validateDuplicateOficialModel();
      }
    },
    /*
     * Set a value for a field and validate it
     * @param {String} key   Field's name 
     * @param {String} value Field's value
     */
    setValue(key, value) {
      this.data[key] = value;
      this.validateField(key, value);
    },
    /*
     * Add a window field value
     * @param {String} key   Field's name 
     * @param {Number} index Field's index
     * @param {String} value Field's value
     */
    async setWindowValue(key, index, value) {
      this.data.windowsGeneral[index][key] = value;
      await nextTick();
      this.validateWindow( key, index, value);
    },
    /*
     * Get a window error
     * @param {String} key   Field's name
     * @param {Number} index Window's index
     */
    getWindowError(key, index) {
      const indexKey = `${index}`;
      if( this.errors?.windowsGeneral && this.errors.windowsGeneral[indexKey] ) {
        return this.errors.windowsGeneral[indexKey][key];
      }
      return '';
    },
    /*
     * Validates a general window
     * @param {String} key   Field's name 
     * @param {Number} index Field's index
     * @param {String} value Field's value
     */
    validateWindow(key, index, value) {
      const keys = [ 'startDay', 'startHour', 'endDay',  'endHour', 'holidays' ];

      if( !keys.includes(key) ) {
        return;
      }

      const indexKey = `${index}`;

      if( !this.errors.windowsGeneral ) {
        this.errors.windowsGeneral = {};
      }
      if( !this.errors.windowsGeneral[indexKey] ) {
        this.errors.windowsGeneral[indexKey] = {};
      }

      this.errors.windowsGeneral[indexKey][key] = this.validationsWindows[key](value);
    },
    /*
     * Validates if any input has an error
     */
    isThereError() {
      Object.keys(this.errors).every( (key) => {
        if( key !== 'windowsGeneral') {
           this.valid = ! this.errors[key];
        } else {
          Object.values(this.errors.windowsGeneral).forEach( (item) => {
            Object.keys(item).every( (field) => {
              this.valid = ! item[field];
              return this.valid;
            });
          });
        }

        return this.valid;
      });
      return this.valid;
    },
    /*
     * Validate the general windows 
     */
    validateWindows() {
      this.data.windowsGeneral.forEach( (item, index) => {
        Object.keys(item).forEach( (field) => {
          if(field !== 'id') {
            this.validateWindow(field, index, this.data.windowsGeneral[index][field])
          }
        })
      });
    },
    /*
     * Validate all the fields on this form section
     */
    validateAll() {
      Object.keys(this.data).forEach((key) => {
        if( key !== 'windowsGeneral') {
          this.validateField(key, this.data[key]);
        } else {
          this.validateWindows();
        }
      });
      this.isThereError();

      if( this.errors.version ) {
        const error = this.errors.version;
        this.errors.version = ''

        setTimeout( () => {
          this.errors.version = error;
        }, 300);
      }
    },
    /*
     * This method validates the fields, set the form data prevously
     * to be submited
     */
    preSubmit() {
      this.validateAll();
      if(this.valid) {
        this.setData( this.data, this.removedWindows );
        this.onSubmit();
      }
    },
    /*
     * This methods saves the data form and advance to the next section form
     */
    save() {
      this.validateAll();
      if(this.valid) {
        this.nextStep( this.data, this.removedWindows );
      }
    },
  },
  watch: {
    /*
     * It follows the previous data pf this section form
     */
    previousData(values) {
      this.data = {...values};

      if( this.id ) {
        this.setEditValidations();
      }
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
	.fs-14 {
		font-size: 14px;
	}
  .btn-cancel {
    margin: 15px 45px;
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
