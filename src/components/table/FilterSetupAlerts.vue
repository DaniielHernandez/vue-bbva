<template>
  <v-card
    v-show="showMoreFilters"
    position="absolute"
    min-width="94%"
    style="overflow: initial; z-index: 50;"
    class="mt-0 ml-xl-10 ml-lg-6">
    <v-container
      fluid
     class="pl-xl-12 pl-lg-12 ml-0 mr-0">
      <v-row>
        <v-col cols="12">
          <div class="float-right pr-5">
            <v-btn
              variant="text"
              size="x-small"
              @click="showMoreFilters = false" 
              ><img src="/icons/close.svg" alt="Cerrar"></v-btn>
          </div>
        </v-col>

        <v-col  sm="12" md="6" lg="6" xl="6">
          <bbva-web-form-select
            @change="(ev) => setValue('operatorId', ev.target.value)"
            :value="inputs.operatorId.value"
            :invalid="!!inputs.operatorId.error"
            :error-message="inputs.operatorId.error"
            label="Operador">
            <bbva-web-form-option
              v-for="option in options.operators"
              :selected="option.id === inputs.operatorId.value"
              @change="(ev) => setValue('operatorId', ev.target.value)"
              :key="option.id"
              :value="option.id"><span class="pl-4">{{option.label}}</span></bbva-web-form-option>
          </bbva-web-form-select>
        </v-col>
        <v-col  sm="12" md="6" lg="6" xl="6">
          <bbva-web-form-select
            @change="(ev) => setValue('userId', ev.target.value)"
            :value="inputs.userId.value"
            :invalid="!!inputs.userId.error"
            :error-message="inputs.userId.error"
            label="Autor">
            <bbva-web-form-option
              v-for="option in options.users"
              :selected="option.id === inputs.userId.value"
              @change="(ev) => setValue('userId', ev.target.value)"
              :key="option.id"
              :value="option.id"><span class="pl-4">{{option.label}}</span></bbva-web-form-option>
          </bbva-web-form-select>
        </v-col>

      </v-row>
      <v-row>
        <v-col  sm="12" md="6" lg="6" xl="6">
          <bbva-web-form-select
            @change="(ev) => setValue('executionPeriodId', ev.target.value)"
            :value="inputs.executionPeriodId.value"
            :invalid="!!inputs.executionPeriodId.error"
            :error-message="inputs.executionPeriodId.error"
            label="Periodo de ejecución">
            <bbva-web-form-option
              v-for="option in options.executionPeriods"
              :selected="option.id === inputs.executionPeriodId.value"
              @change="(ev) => setValue('executionPeriodId', ev.target.value)"
              :key="option.id"
              :value="option.id"><span class="pl-4">{{option.label}}</span></bbva-web-form-option>
          </bbva-web-form-select>

        </v-col>
        <v-col  sm="12" md="6" lg="6" xl="6">
          <bbva-web-form-select
            @change="(ev) => setValue('timePeriodId', ev.target.value)"
            :value="inputs.timePeriodId.value"
            :invalid="!!inputs.timePeriodId.error"
            :error-message="inputs.timePeriodId.error"
            label="Periodo de tiempo">
            <bbva-web-form-option
              v-for="option in options.timePeriods"
              :selected="option.id === inputs.timePeriodId.value"
              @change="(ev) => setValue('timePeriodId', ev.target.value)"
              :key="option.id"
              :value="option.id"><span class="pl-4">{{option.label}}</span></bbva-web-form-option>
          </bbva-web-form-select>
        </v-col>
      </v-row>
      <v-row>
        <v-col sm="12" md="2" lg="2" xl="1">
          <bbva-button-default
            active=""
            text="Buscar"
            class="w-100"
            @click="searchFilter" ></bbva-button-default>
        </v-col>
        <v-col sm="12" md="3" lg="2" xl="1">
          <div class="pt-3">
          <bbva-button-default
            text="Borrar filtros"
            variant="link"
            class="h-75"
            @click="clearFilter" ></bbva-button-default>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
  <v-container
    fluid
    class="ml-0 mr-0 pl-10 pr-4 pt-8 pb-0">
    <v-row>
      <v-col cols="12">
        <bbva-form-toggle
          class="toggle-alerts"
          :checked="myAlerts"
          @formToggleSwitchChange="switchMyAlerts"
            ><span class="pl-2">Tus alertas</span></bbva-form-toggle>
      </v-col>
    </v-row>
    <v-row justify="start">

      <v-col
        sm="12"
        md="6" lg="3" xl="3"
      >
        <bbva-web-form-select
          @change="(ev) => setValue('buId', ev.target.value)"
          :value="inputs.buId.value"
          :invalid="!!inputs.buId.error"
          :error-message="inputs.buId.error"
          label="Business Unit">
          <bbva-web-form-option
            v-for="option in options.bu"
            :selected="option.id === inputs.buId.value"
            @change="(ev) => setValue('buId', ev.target.value)"
            :key="option.id"
            :value="option.id"><span class="pl-4">{{option.label}}</span></bbva-web-form-option>
        </bbva-web-form-select>
      </v-col>
      <v-col
        sm="12"
        md="6" lg="3" xl="3"
      >
        <bbva-web-form-select
          @change="(ev) => setValue('cfsId', ev.target.value)"
          :value="inputs.cfsId.value"
          :invalid="!!inputs.cfsId.error"
          :error-message="inputs.cfsId.error"
          label="CFS">
          <bbva-web-form-option
            v-for="option in options.cfs"
            :selected="option.id === inputs.cfsId.value"
            @change="(ev) => setValue('cfsId', ev.target.value)"
            :key="option.id"
            :value="option.id"><span class="pl-4">{{option.label}}</span></bbva-web-form-option>
        </bbva-web-form-select>
      </v-col>
      <v-col
        sm="12"
        md="6" lg="3" xl="3"
      >
        <bbva-web-form-select
          @change="(ev) => setValue('elementToAlertId', ev.target.value)"
          :value="inputs.elementToAlertId.value"
          :invalid="!!inputs.elementToAlertId.error"
          :error-message="inputs.elementToAlertId.error"
          label="Elemento a alertar">
          <bbva-web-form-option
            v-for="option in options.elementsToAlert"
            :selected="option.id === inputs.elementToAlertId.value"
            @change="(ev) => setValue('elementToAlertId', ev.target.value)"
            :key="option.id"
            :value="option.id"><span class="pl-4">{{option.label}}</span></bbva-web-form-option>
        </bbva-web-form-select>
      </v-col>
      <v-col sm="12" md="2" lg="1" class="pl-lg-0">
        <div class="pt-3 pl-xl-4">
          <bbva-button-default
            text="Ver más filtros"
            variant="link"
            class="h-75"
            @click="showMoreFilters = true"></bbva-button-default>
        </div>
      </v-col>

      <v-col sm="12" md="2" lg="2" xl="1">
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
/* Components */
import '@/components/bbva-web-components/bbva-web-form-select-multiple.js';
import '@/components/bbva-web-components/bbva-web-form-select.js';
import '@/components/bbva-web-components/bbva-button-default.js';
import '@/components/bbva-web-components/bbva-form-toggle.js';
/* utils */
import { parseCatalog } from '@/utils/form';
import { validateRequired } from '@/utils/form.js';
/* requests */
import { getBusinessUnitsAPI } from '@/requests/businessUnit.js'
import { getCfsModelAPI } from '@/requests/cfs.js'
import {
  getTimePeriodsAPI, getExecutionPeriodAPI, getOperatorsAPI, getElementsToAlertAPI, getAlertAuthors
} from '@/requests/alerts.js'

export default {
  data() {
    return {
      /* Filter my alerts */
      myAlerts: false, 
      /* Flag, true to show more filters when those are more than 3 */
      showMoreFilters: false,
      /* It has the inputs with the fields, values and errors,  example
       * { buId: [ value: 3, error: '' ] }
       */
      inputs: {
        buId: { value: '', error: '' },
        cfsId: { value: '', error: '' },
        timePeriodId: { value: '', error: '' },
        executionPeriodId: { value: '', error: '' },
        operatorId: { value: '', error: '' },
        elementToAlertId: { value: '', error: '' },
        userId: { value: '', error: '' }
      },
      /* Optios for the selects */
      options: {
        bu: [], cfs: [], timePeriods: [], executionPeriods: [], operators: [], elementsToAlert: [],
        users: []
      },
    }
  },
  beforeMount() {
    this.loadOptions();
    if( this.values.length ) {
      this.values.forEach((item) => {
        this.inputs[item.name].value = item.value;
      });
    }
  },
  methods: {
    switchMyAlerts() {
      this.myAlerts = !this.myAlerts;
      this.searchFilter();
    },
    /*
     * this method load the catalog for the inputs selects
     */
    loadOptions() {
      this.emitter.emit("load", { loading: true });
      Promise.all([
        getBusinessUnitsAPI(1,3000),
        getCfsModelAPI(1,3000),
        getTimePeriodsAPI(),
        getExecutionPeriodAPI(),
        getOperatorsAPI(),
        getElementsToAlertAPI(),
        getAlertAuthors()
      ]).then( (responses) => {
        this.options.bu = parseCatalog(responses[0].data.items);
        this.options.cfs = parseCatalog(responses[1].data.items);
        this.options.timePeriods = parseCatalog(responses[2].data.items);
        this.options.executionPeriods = parseCatalog(responses[3].data.items);
        this.options.operators = parseCatalog(responses[4].data.items);
        this.options.elementsToAlert = parseCatalog(responses[5].data.items);
        this.options.users = parseCatalog(responses[6].data);
      }).catch( (error) => {
        this.emitter.emit('error', { action: 'cargar catalogos',  error });
      }).finally(() => {
        this.emitter.emit("load", { loading: false });
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
      if( name === 'buId' ) {
        this.inputs.cfsId.value = null;
        this.emitter.emit("load", { loading: true });
        getCfsModelAPI(1, 3000, [{ name: 'buId', value: value }]).then((response) => {
          this.options.cfs = parseCatalog(response.data.items);
        }).catch( (error) => {
          this.emitter.emit('error', { action: 'cargar catalogos',  error });
        }).finally(() => {
          this.emitter.emit("load", { loading: false });
        });

      }
    },
    /*
     * This method validate all fields , check is there is any a error
     * and if everything is right, then send the values to the search method
     */
    searchFilter() {

      const values = [];

      Object.keys(this.inputs).forEach( (field) => {
        if( this.inputs[field].value) {
          if( Array.isArray(this.inputs[field].value) ) {
            if( this.inputs[field].value.length ) {
              values.push({ name: field, value: this.inputs[field].value });
            }
          } else {
            values.push({ name: field, value: this.inputs[field].value });
          }
        }
      });

      values.push( { name: 'myAlerts', value: this.myAlerts } )
      this.search(values);
      this.showMoreFilters = false;
    },
    /*
     *  This method clear all the values
     */
    clearFilter() {
      this.inputs = {
        buId: { value: '', error: '' },
        cfsId: { value: '', error: '' },
        timePeriodId: { value: '', error: '' },
        executionPeriodId: { value: '', error: '' },
        operatorId: { value: '', error: '' },
        elementToAlertId: { value: '', error: '' },
        userId: { value: '', error: '' }
      };
      this.showMoreFilters = false;
      this.search([{ name: 'myAlerts', value: this.myAlerts }]);
    }
  },
  props: {
    /*
     * Function to send the filters when the submit the form
     * It send an array with the next format
     * [
     *  { name: 'buId', value: 2 }
     * ]
     */
    search: {
      type: Function,
      default: () => {}
    },
    values: { type: Function, default: () => ([]) }
  },
};
</script>

<style>
.toggle-alerts {
  width: 170px;
}

</style>
