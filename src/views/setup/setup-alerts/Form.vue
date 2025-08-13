<template>
  <setup-alert-first-section
      v-if="step === 1"
      :onCancel="onCancel"
      :setData="setFirstSection"
      :previousData="data.first"
      :options="options"
    />
  <setup-alert-second-section
      v-if="step === 2"
      :name="data.first.alertName"
      :elementToAlert="elementToAlert"
      :elementToAlertId="data.first.elementToAlertId"
      :updateStep="updateStep"
      :onSubmit="onSubmit"
      :setData="setSecondSection"
      :previousData="data.second"
      :options="options"
     :onCancel="onCancel"
    />
</template>
<script>
/* utils */
import { parseCatalog } from '@/utils/form';
/* Request */
import {
  getTimePeriodsAPI, getExecutionPeriodAPI, getOperatorsAPI, getElementsToAlertAPI,
  createSetupAlertAPI, updateSetupAlertAPI, getSetupAlertAPI
} from '@/requests/alerts.js';
import { getCfsModelAPI } from '@/requests/cfs.js'
import { getOperationsByCfsId } from '@/requests/impactAdjustments.js';
import { getBusinessUnitsAPI } from '@/requests/businessUnit.js'
import { getMeasurementStatusesAPI } from '@/requests/measurementStatus.js'
/* Components */
import SetupAlertFirstSection from '@/components/forms/SetupAlertFirstSection.vue'
import SetupAlertSecondSection from '@/components/forms/SetupAlertSecondSection.vue';


export default {
  data() {
    return {
      /* Elemen to alert chosen */
      elementToAlert: { type: String, default: '' },
      /* It has the data of the setup alert */
      data: {
        first: {},
        second: {},
      },
      /* Number of the form step */
      step: 0,
      /* Flag, it is true if the form is valid */
      valid: true,
      /* it contains the inputs errors */
      errors: {},
      /* Optios for the selects */
      options: {
        bu: [], cfs: [], timePeriods: [], executionPeriods: [], operators: [], elementsToAlert: [], measurementStatuses: [], operatives: []
      },
    }
  },
  components: {
    SetupAlertFirstSection,
    SetupAlertSecondSection
  },
  beforeMount() {
    if(this.$route.params.id) {
      this.id = parseInt(this.$route.params.id);
    } else {
      this.step = 1;
    }

    this.loadOptions();
  },
  methods: {
    /*
     * It load the initial data of the form
     */
    loadInitialData() {
      this.emitter.emit("load", { loading: true });
      getSetupAlertAPI(this.id).then( (response) => {
        const initialData = response.data.items[0];
        this.data.first.elementToAlertId = initialData.elmentToAlertId;
        this.data.first.alertName =  initialData.name;

        [
          'buId', 'modelId', 'operativeId', 'operatorId',
          'value1', 'value2', 'executionPeriodId', 'timePeriodId',
          'measurementStatusId', 'triggerAlert', 'dayOfWeek',
          'endDate', 'triggerAlert'
        ].forEach((field) => {
          if( initialData[field] ) {
            this.data.second[field] = initialData[field];
          }
        });

        this.step = 1;
      }).catch( (error) => {
        this.emitter.emit('error', { action: 'cargar configuración de alerta',  error });
      }).finally(() => {
        this.emitter.emit("load", { loading: false });
        if(this.data.first.elementToAlertId !== 13) {
          this.loadCfs();
        }
      });
    },
    /*
     * It sets the second section of the form
     */
    setSecondSection(data) {
      this.data.second = data;
    },
    /* 
     * It opens the modal to cancel the form
     */
    onCancel() {
      this.emitter.emit(
        'informational',
        {
          title: '¿Seguro que quieres salir del proceso?',
          type: 'caution',
          confirmation: true,
          message: 'Vas a salir del proceso y todos los datos se perderan',
          onAccept: () => this.closeExit(),
          forceOnAccept: true
        }
      )
    },
    /* 
     * It returns to the  table setup alerts
     */
    closeExit() {
      this.emitter.emit( 'informational', { open: false, title:  '', type: '', message: '' } );
      this.$router.push('/setup/setup-alerts');
    },
    /*
     * It update the crrent form's step
     */
    updateStep(step) {
      this.step = step;
    },
    /*
     * This creates a setuo alert
     */
    createSetupAlert() {
      this.emitter.emit("load", { loading: true });
      createSetupAlertAPI(this.getData()).then( () => {
        this.emitter.emit(
          'informational',
          {
            title:  'Alerta creada.',
            type: 'success',
            message: 'Se ha creado la alerta correctamente',
            onAccept: this.finishForm,
            forceOnAccept: true
          }
        )
      }).catch( (error) => {
        this.emitter.emit('error', { action: 'crear alerta',  error });
      }).finally(() => {
        this.emitter.emit("load", { loading: false });
      });

    },
    getData() {
      const data = {...this.data.first, ...this.data.second };
      if( data.value1 ) data.value1 = parseFloat(data.value1);
      if( data.value2 ) data.value2 = parseFloat(data.value2);

      return data;
    },
    /*
     * This update a setup alter
     */
    updateSetupAlert() {
      this.emitter.emit("load", { loading: true });
      updateSetupAlertAPI(this.id, this.getData()).then( () => {
        this.emitter.emit(
          'informational',
          {
            title:  'Alerta editada.',
            type: 'success',
            message: 'Se ha editado la alerta correctamente',
            onAccept: this.finishForm,
            forceOnAccept: true
          }
        )
      }).catch( (error) => {
        this.emitter.emit('error', { action: 'editar alerta',  error });
      }).finally(() => {
        this.emitter.emit("load", { loading: false });
      });
    },
    /*
     * this method handles the submit when it is creating or editing
     */
    onSubmit() {
      const duplicate = !!this.$route.query.duplicate;
      if(this.id && !duplicate) {
        this.updateSetupAlert();
      } else {
        this.createSetupAlert();
      }
    },
    finishForm() {
      this.$router.push('/setup/setup-alerts');
    },
    /*
     * It get the cfs's options given a bu's id 
     */
    loadCfs() {
      getCfsModelAPI(1, 3000, [{ name: 'buId', value: this.data.second.buId }]).then((response) => {
        this.options.cfs = parseCatalog(response.data.items);
      }).catch( (error) => {
        this.emitter.emit('error', { action: 'cargar catalogos',  error });
      }).finally(() => {
        this.emitter.emit("load", { loading: false });
        this.setOperatives();
      });
    },
    /*
     * It get the operatives's options given a model's id 
     */
    setOperatives() {
      this.emitter.emit("load", { loading: true });
      getOperationsByCfsId({ cfsId: this.data.second.modelId }).then((response) => {
        this.options.operatives = parseCatalog(response.data.operations);
      }).catch( (error) => {
        this.emitter.emit('error', { action: 'cargar catalogos',  error });
      }).finally(() => {
        this.emitter.emit("load", { loading: false });
      });
    },
    /*
     * It loads the  catalogs used by the forms
     */
    loadOptions() {
      this.emitter.emit("load", { loading: true });
      Promise.all([
        getBusinessUnitsAPI(1,3000),
        getTimePeriodsAPI(),
        getExecutionPeriodAPI(),
        getOperatorsAPI(),
        getElementsToAlertAPI(),
        getMeasurementStatusesAPI(),
      ]).then( (responses) => {
        this.options.bu = parseCatalog(responses[0].data.items);
        this.options.timePeriods = parseCatalog(responses[1].data.items);
        this.options.executionPeriods = parseCatalog(responses[2].data.items);
        this.options.operators = parseCatalog(responses[3].data.items);
        this.options.elementsToAlert = parseCatalog(responses[4].data.items);
        this.options.measurementStatuses = parseCatalog(responses[5].data);
      }).catch( (error) => {
        this.emitter.emit('error', { action: 'cargar catalogos',  error });
      }).finally(() => {
        this.emitter.emit("load", { loading: false });
        if(this.id) {
          this.loadInitialData();
        }

      });
    },
    /*
     * It saves the first section of the form
     * @param {Object}   values          Fields's values
     */
    setFirstSection(values) {
      this.data.first = {...values};
      this.elementToAlert = this.options.elementsToAlert.find((item) => values.elementToAlertId === item.id).label;
      this.step = 2;
    },
  }
};
</script>
