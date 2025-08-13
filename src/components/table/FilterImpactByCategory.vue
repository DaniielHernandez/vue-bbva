<template>
  <v-container
    fluid
    class="pl-0">
    <v-row justify="start">
      <v-col
        sm="12"
        md="6" lg="2" xl="2"
       >
        <bbva-web-form-select
          @change="(ev) => setValue('buId', ev.target.value)"
          :invalid="!!inputs.buId.error"
          :error-message="inputs.buId.error"
          label="Business Unit">
          <bbva-web-form-option
            v-for="(option, index) in options.buId"
            :key="index"
            :selected="inputs.buId.value === option.id"
            :value="option.id">
            <span class="pl-4 d-inline-block">{{option.label}}</span>
          </bbva-web-form-option>
        </bbva-web-form-select>
      </v-col>
      <v-col
        sm="12"
        md="6" lg="2" xl="2">
        <bbva-web-form-select
          @change="(ev) => setValue('criticalityId', ev.target.value)"
          :invalid="!!inputs.criticalityId.error"
          :error-message="inputs.criticalityId.error"
          label="Criticidad">
          <bbva-web-form-option
            v-for="(option, index) in options.criticalityId"
            :key="index"
            :selected="inputs.criticalityId.value === option.id"
            :value="option.id">
            <span class="pl-4 d-inline-block">{{option.label}}</span>
          </bbva-web-form-option>
        </bbva-web-form-select>
      </v-col>
      <v-col
        sm="12"
        md="6" lg="2" xl="1">
        <bbva-web-form-select
          @change="(ev) => setValue('year', ev.target.value)"
          :invalid="!!inputs.year.error"
          :error-message="inputs.year.error"
          label="Año">
          <bbva-web-form-option
            v-for="(option, index) in options.years"
            :key="index"
            :selected="inputs.year.value === option.id"
            :value="option.id">
            <span class="pl-4 d-inline-block">{{option.label}}</span>
          </bbva-web-form-option>
        </bbva-web-form-select>
      </v-col>
      <v-col
        sm="12"
        md="6" lg="2" xl="2">
        <div class="pb-sm-12">
          <bbva-web-form-select-multiple
            class="select-multiple"
            :invalid="!!inputs.months.error"
            :error-message="inputs.months.error"
            @change="(ev) => setValue('months', ev.target.selectedOptionsValues)"
            label="Meses">
            <bbva-web-form-option-multiple
              v-for="(option, index) in options.months"
              :key="index"
              :selected="inputs.months.value?.includes(option.id) || false"
              :value="`${option.id}`">
              <span class="pl-4 d-inline-block">{{option.label}}</span>
            </bbva-web-form-option-multiple>
          </bbva-web-form-select-multiple>
        </div>
      </v-col>
      <v-col sm="12" md="2" lg="2" xl="2">
        <bbva-button-default
          active=""
          text="Buscar"
          class="w-100"
          @click="searchFilter" ></bbva-button-default>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
// Components
import '@/components/bbva-web-components/bbva-web-form-select.js';
import '@/components/bbva-web-components/bbva-web-form-select-multiple.js';
import '@/components/bbva-web-components/bbva-button-default.js';
// Utils
import { validateRequired, isThereError, validateAllFields, parseCatalog } from '@/utils/form';
// Requests
import { getBusinessUnitsAPI } from '@/requests/businessUnit';
import { getCriticalitiesAPI  } from '@/requests/criticality';

export default {
  data() {
    return {
      /*
       * It has the validations for the inputs
       */
      validations: {
        buId: validateRequired,
        criticalityId: validateRequired,
        year: validateRequired,
        months: validateRequired,
      },
      /* It has the inputs with the fields, values and errors,  example
       * { buId: [ value: 3, error: '' ] }
       */
      inputs: {
        buId: { name: 'buId', value: null },
        criticalityId: { name: 'criticalityId', value: null },
        year: { name: 'year', value: null },
        months: { name: 'months', value: null },
      },
      options: {
        criticalityId: [],
        buId: [],
        years: [],
        months: [
          {id: 1, label: 'Enero' },
          {id: 2, label: 'Febrero' },
          {id: 3, label: 'Marzo' },
          {id: 4, label: 'Abril' },
          {id: 5, label: 'Mayo' },
          {id: 6, label: 'Junio' },
          {id: 7, label: 'Julio' },
          {id: 8, label: 'Agosto' },
          {id: 9, label: 'Septiembre' },
          {id: 10, label: 'Octubre' },
          {id: 11, label: 'Noviembre' },
          {id: 12, label: 'Diciembre' },
        ]
      }
    }
  },
  beforeMount() {
    this.loadCatalogs();
    this.initialValues();
  },
  methods: {
    initialValues() {
      if( this.values.length ) {
        this.values.forEach((item) => {
            this.inputs[item.name].value = item.value;
        });
      }
    },
    getYears() {
      const data = [];
      const year = (new Date()).getFullYear();

      for( let i = year; i >= year - 20; i-- ) {
        data.push({ label: i, id: i });
      }
      return data;
    },
    loadCatalogs() {
      this.emitter.emit("load", { loading: true });
      Promise.all([
        getBusinessUnitsAPI(1, 3000),
        getCriticalitiesAPI(1, 3000)
      ]).then((values) => {
        this.options = {
          ...this.options,
          buId: parseCatalog( values[0].data ),
          criticalityId: parseCatalog( values[1].data ),
          years: this.getYears()
        };
        this.emitter.emit("load", { loading: false });
      }).catch((error) => {
        this.emitter.emit("load", { loading: false });
        this.emitter.emit('error', { action: 'cargar catalogos',  error });
      });
    },
    /*
     * This method sets the value into a field
     * @param {String} name   Field's name
     * @param {String} value  Field's value
     */
    setValue(name, value) {
      this.inputs[name] = {
        value,
        name,
      }
    },
    /*
     * This method validate all fields , check is there is any a error
     * and if everything is right, then send the values to the search method
     */
    searchFilter() {
      const values = [];

      this.inputs = validateAllFields(this.validations, this.inputs);

      Object.values(this.inputs).forEach( (input) => {
        if( input.value ) {
          if( Array.isArray(input.value) ) {
            values.push({
              name: input.name,
              value: input.value.map( (id) => parseInt(id) )
            });
          } else {
            values.push(input);
          }
        }
      });
      if( isThereError(this.inputs) ) {
        this.search(values);
      }
    },
  },
  props: {
    withoutPadding: { type: Boolean, default: false },
    /*
     * Function to send the filters when the submit the form
     * It send an array with the next formar
     * [
     *  { name: 'buId', value: 2 }
     * ]
     */
    search: {
      type: Function,
      default: () => {}
    },
    /* Initial values for the filter */
    values: { type: Function, default: () => ([]) }
  },
};
</script>

<style>
  .select-multiple {
    height: 0px;
    --_options-z-index: var(--bbva-web-form-select-multiple-options-z-index, 30);
  }
</style>
