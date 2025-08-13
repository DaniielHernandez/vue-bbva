<template>
  <v-row justify="center">
    <v-dialog
      v-model="dialog"
      persistent
      width="600"
    >
      <v-card>
        <v-card-title class="pl-10 pb-2 pt-4">
          <span class="title-form pt-3">
            {{ Object.keys(data).length ? 'Editar día inhábil' : 'Crear día inhábil' }}
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
            <v-row v-for="(field, index) in fields.select" :key="`select-input-user-${index}`">
              <v-col cols="12">
                <bbva-web-form-select
                  @change="(ev) => setValue(field.name, ev)"
                  :value="inputs[field.name].value"
                  :invalid="!!inputs[field.name].error"
                  :error-message="inputs[field.name].error"
                  :label="field.label">
                  <bbva-web-form-option
                    v-for="option in catalogs[field.name]"
                    :key="option.id"
                    :value="option.id"><span class="pl-4">{{option.label}}</span></bbva-web-form-option>
                </bbva-web-form-select>
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
</template>

<script>

import '@/components/bbva-web-components/bbva-web-form-text.js'
import '@/components/bbva-web-components/bbva-web-form-select.js'
import '@/components/bbva-web-components/bbva-button-default.js'
import '@/components/bbva-web-components/bbva-foundations-icons.js'
import {
  validateRequired, clearInputs, isThereError, validateAllFields, parseCatalog
} from '@/utils/form';
import { getBusinessUnitsAPI } from '@/requests/businessUnit';
import { yearsOptions, monthsOptions, daysOptions } from '@/utils/nonWorkingDays';

export default {
  data() {
    return {
      /* Flag, true if the dialog is open */
      dialog: false,
      /* Form's inputs */
      inputs: {},
      /* Flag, true is the form is valid */
      valid: true,
      /* Catalogs used in selects */
      catalogs: {},
      /* It has the form's validation */
      validations: {
        buId: (value) => validateRequired(value),
        year: (value) => validateRequired(value),
        month: (value) => validateRequired(value),
        day: (value) => validateRequired(value),
      },
      /* It has the form's fields keys */
      fieldKeys: [ 'buId', 'year', 'month', 'day' ],
      /* It has the select fields  names and labels */
      fields: {
        select: [
          { name: 'buId', label: 'Business Unit' },
          { name: 'year', label: 'Año' },
          { name: 'month', label: 'Mes' },
          { name: 'day', label: 'Día' },
        ]
      }
    }
  },
  beforeMount() {
    this.loadCatalogs();
  },
  methods: {
    /*
     * It load the catalogs used by selects 
     */
    loadCatalogs() {
      getBusinessUnitsAPI().then((response) => {
        this.catalogs.buId = parseCatalog(response.data) ;
      }).catch((error) => {
        this.requestError('cargar catálogos', error);
      });

      this.catalogs.year = yearsOptions();
      this.catalogs.month = monthsOptions();
      this.catalogs.day = [];
    },
    /*
     * It sets the field values
     */
    setValue(name, ev) {
      const value = ev.target.value
      this.inputs[name] = { value, name, error: this.validations[name](value), touch: true };
      this.valid = isThereError( this.inputs );
    },
    /*
     * It submit the values
     */
    onSubmit() {
      this.inputs = validateAllFields(this.validations, this.inputs);
      const values = {};

      this.valid = isThereError( this.inputs );

      if(this.valid) {
        this.fieldKeys.forEach( (key) => values[key] = this.inputs[key].value );
        this.save(values);
      }
    },
    /*
     * It clears the days
     */
    clearDay() {
      const year = this.inputs.year.value;
      const month = this.inputs.month.value;
      if( month && year ) {
        this.catalogs.day = daysOptions( year, month );
      }
      this.inputs.day.value = '';
    }
  },
  props: {
    /* Flag, true is the modal is open */
    open: { type: Boolean, default: false },
    /* Function to save form's data */
    save: { type: Function, default: () => {} },
    /* It closes the modal */
    close: { type: Function, default: () => {} },
    /* It handles the error */
    requestError: { type: Function, default: () => {} },
    /* Form's data */
    data: { type: Function, default: () => ({}) }
  },
  watch: {
    open(value) {
      this.dialog = value;
      if( Object.keys(this.data).length ) {
        this.catalogs.day = daysOptions( this.data.year, this.data.month );
        this.fieldKeys.forEach( (key) => {
          this.inputs[key] = { value: this.data[key], error: '', touch: false };
        });
      } else {
        this.inputs = clearInputs( this.fieldKeys );
      }
    },
    'inputs.month': function() {
      if( this.inputs.month.touch ) {
        this.clearDay();
      }
    },
    'inputs.year': function() {
      if( this.inputs.year.touch ) {
        this.clearDay();
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
</style>
