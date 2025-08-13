<template>
  <header-form-setup-alert stepValue="0" :onClose="onCancel"/>
  <v-container class="pl-8 pb-12" fluid>
    <v-row>
      <v-col cols="12">
        <span class="text-step-form">1 de 2</span>
     </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <span class="title-form-model">Elemento a alertar</span>
      </v-col>
    </v-row>

    <v-row>
      <v-col sm="12" md="4" lg="3" xl="3" >
        <bbva-web-form-select
          key="elementToAlertId"
          @change="(ev) => setValue('elementToAlertId', ev.target.value)"
          :value="data.elementToAlertId"
          :disabled="!!id"
          :invalid="!!errors.elementToAlertId"
          :error-message="errors.elementToAlertId"
          label="Elemento a alertar">
          <bbva-web-form-option
            v-for="option in options.elementsToAlert"
            :key="option.id"
            :value="option.id"><span class="pl-4">{{option.label}}</span></bbva-web-form-option>
        </bbva-web-form-select>
      </v-col>
      <v-col sm="12" md="4" lg="3" xl="3">
         <bbva-form-field
          :required="true"
          class="text-input"
          key="alertName"
          @input="(ev) => setValue('alertName', ev.target.value )"
          :value="data.alertName"
          :invalid="!!errors.alertName"
          :error-message="errors.alertName"
          label="Nombre de la alerta"></bbva-form-field>
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
import HeaderFormSetupAlert from '@/components/headers/HeaderFormSetupAlert.vue'
import '@/components/bbva-web-components/bbva-form-input.js';
import '@/components/bbva-web-components/bbva-web-form-select.js'
/* utils */
import { validateRequired } from '@/utils/form';

export default {
  data() {
    return {
      /* Setup Alert's ID */
      id: null,
      /* Data of the first part of the form if it's being edited */
      data: {},
      /* Flag, true if the form is valid */
      valid: false,
      /* Object the save the error of the fields */
      errors: { elementToAlert: '', alertName: '' },
      /* It has the validations to apply to the fields */
      validations: {
        elementToAlertId: validateRequired,
        alertName: validateRequired
      },

    }
  },
  props: {
    /* Function to handle when user cancel the form */
    onCancel: { type: Function, default: () => {} },
    /* Function set the form data */
		setData: { type: Function, default: () => { } },
    /* Previous form data */
    previousData: { type: Object, default: {} },
    /* It has the options useb by the fields type select */
    options: { type: Object, default: { elementsToAlertId: []} },
  },
  beforeMount() {
    this.data = { ...this.previousData };
    this.id = this.$route.params.id;
    this.isThereError();
  },
  components: {
    HeaderFormSetupAlert
  },
  methods: {
    /*
     * It validate all the form's fields
     */
    validateAll() {
      let valid = true;
      Object.keys(this.validations).forEach( (key) => {
        this.validateField(key, this.data[key] );
        if( this.errors[key]  ) {
          valid = false;
        }
      });
      this.valid = valid;
    },
    /*
     * It validates the form fields, save the current data and set the step
     */
    save() {
      this.validateAll();
      if(this.valid) {
        this.setData( this.data);
      }
    },
    /* Check if there is any error */
    isThereError() {
      let valid = true;
      Object.keys(this.validations).forEach( (key) => {
        if( this.validations[key]( this.data[key] )  ) {
          valid = false;
        }
      });
      this.valid = valid;
    },
    /*
     * Set a value for a field and validate it
     * @param {String} key   Field's name 
     * @param {String} value Field's value
     */
    setValue(key, value) {
      this.data[key] = value;
      this.validateField(key, value);
      this.isThereError();
    },
    /*
     * It validates a field
     */
    validateField(field, value) {
      this.errors[field] = this.validations[field](value);
    }
  }
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
</style>

