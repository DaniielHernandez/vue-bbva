<template>
  <v-card
    v-show="showMoreFilters"
    position="absolute"
    min-width="94%"
    style="overflow: initial; z-index: 50;"
    class="mt-0 ml-xl-0 ml-lg-0">
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
        <v-col  sm="12" md="4" lg="4" xl="4">
          <bbva-web-form-select
            @change="(ev) => setValue('typeId', ev.target.value)"
            :value="inputs.typeId.value"
            :invalid="!!inputs.typeId.error"
            :error-message="inputs.typeId.error"
            label="Tipo">
            <bbva-web-form-option
              v-for="option in options.type"
              :selected="option.id === inputs.typeId.value"
              @change="(ev) => setValue('typeId', ev.target.value)"
              :key="option.id"
              :value="option.id"><span class="pl-4">{{option.label}}</span></bbva-web-form-option>
          </bbva-web-form-select>
        </v-col>
        <v-col  sm="12" md="4" ld="4" xl="4">
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
        <v-col  sm="12" md="4" lg="4" xl="4">
          <bbva-web-form-select
            @change="(ev) => setValue('criticalityId', ev.target.value)"
            :value="inputs.criticalityId.value"
            :invalid="!!inputs.criticalityId.error"
            :error-message="inputs.criticalityId.error"
            label="Criticidad">
            <bbva-web-form-option
              v-for="option in options.criticality"
              :selected="option.id === inputs.criticalityId.value"
              @change="(ev) => setValue('criticalityId', ev.target.value)"
              :key="option.id"
              :value="option.id"><span class="pl-4">{{option.label}}</span></bbva-web-form-option>
          </bbva-web-form-select>
        </v-col>
      </v-row>
      <v-row>
        <v-col  sm="12" md="3" lg="3" xl="2" class="radio-input text-left">
          <div class="fs-15 fw-500">Incidente por cambio</div>
          <div role="radiogroup" class="radio-custom-grid text-left">
            <bbva-web-form-radio-button 
              @input="() => setValue('incidentByChange', 1)"
              name="incidentByChange"
              :checked="inputs?.incidentByChange?.value === 1">
              Si
            </bbva-web-form-radio-button>
            <bbva-web-form-radio-button 
              class="pl-8"
              name="incidentByChange"
              @input="() => setValue('incidentByChange', 0)"
              :checked="inputs?.incidentByChange?.value === 0">
              No
            </bbva-web-form-radio-button>
          </div>
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
    class="ml-0 mr-0 pl-0 pr-0 pt-0 pb-0">
    <v-row justify="start">
      <v-col
        sm="12"
        md="6" lg="3" xl="3"
      >
        <bbva-web-form-date-range
          class="date-range"
          :from="inputs.date.from"
          :to="inputs.date.to"
          @date-range-change="(ev) => setRangeDate('date', ev)"
          :invalid="!!inputs.date.error"
          :error-message="inputs.date.error"
          >
        </bbva-web-form-date-range>
      </v-col>

      <v-col
        sm="12"
        md="6" lg="3" xl="3"
      >
        <div class="select-multiple" >
          <bbva-web-form-select-multiple
            @change="(ev) => setValue('buIds', ev.target.selectedOptionsValues)"
            :invalid="!!inputs.buIds.error"
            :error-message="inputs.buIds.error"
            label="Business Unit">
            <bbva-web-form-option-multiple
              v-for="option in options.bu"
              :key="`multi-option-${option.id}`"
              :selected="inputs?.buIds?.value?.includes(`${option.id}`) || false"
              :value="`${option.id}`">
              <span class="pl-4">{{option.label}}</span>
            </bbva-web-form-option-multiple>
          </bbva-web-form-select-multiple>
        </div>
      </v-col>
      <v-col
        sm="12"
        md="6" lg="3" xl="3"
      >
        <bbva-web-form-text
          class="text-input"
          @input="(ev) => setValue('ticket', ev.target.value)"
          :value="inputs.ticket.value"
          :invalid="!!inputs.ticket.error"
          :error-message="inputs.ticket.error"
          label="N° de folio"></bbva-web-form-text>
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
/* Components */
import '@/components/bbva-web-components/bbva-web-form-select-multiple.js';
import '@/components/bbva-web-components/bbva-web-form-radio-button.js'
import '@/components/bbva-web-components/bbva-web-form-text.js';
import '@/components/bbva-web-components/bbva-web-form-select.js';
import '@/components/bbva-web-components/bbva-button-default.js';
import '@/components/bbva-web-components/bbva-web-form-date-range.js';
/* utils */
import { isThereError, validateAllFields, parseCatalog } from '@/utils/form';
import { formatDateWhitDash } from '@/utils/general.js';
import { validateRequired } from '@/utils/form.js';
/* requests */
import { getCriticalitiesAPI } from '@/requests/criticality.js'
import { getBusinessUnitsAPI } from '@/requests/businessUnit.js'
import { getCfsModelAPI } from '@/requests/cfs.js'
import { getTicketsTypesAPI } from '@/requests/impactTickets.js'

export default {
  data() {
    return {
      /* Flag, true to show more filters when those are more than 3 */
      showMoreFilters: false,
      /* It has the inputs with the fields, values and errors,  example
       * { buIds: [ value: 3, error: '' ] }
       */
      inputs: {
        date: { to: '', from: '', error: '' },
        buIds: { value: [], error: '' },
        cfsId: { value: '', error: '' },
        typeId: { value: '', error: '' },
        ticket: { value: '', error: '' },
        criticalityId: { value: '', error: '' },
        incidentByChange: { value: null, error: ''}
      },
      /* Optios for the selects */
      options: {
        bu: [], criticality: [], type: [], cfs: []
      },
      /*
       * It has the validations when some filters have anyone
       * example
       * {
       *   buIds: (value) => validateRequired(value),
       *   ticket: (value) => validateRequired(value),
       * }
       */
      validations: {
      },
    }
  },
  beforeMount() {
    this.loadOptions();
    if( this.values.length ) {
      this.values.forEach((item) => {
        if( 'endDate' === item.name ) {
          this.inputs.date.to = item.value;
        } else if( 'startDate' === item.name ) {
          this.inputs.date.from = item.value;
        } else {
          this.inputs[item.name].value = item.value;
        }
      });
    }
  },
  methods: {
    /*
     * this method load the catalog for the inputs selects
     */
    loadOptions() {
      this.emitter.emit("load", { loading: true });
      Promise.all([
        getBusinessUnitsAPI(1,3000),
        getCfsModelAPI(1,3000),
        getCriticalitiesAPI(),
        getTicketsTypesAPI()
      ]).then( (responses) => {
        this.options.bu = parseCatalog(responses[0].data.items);
        this.options.cfs = parseCatalog(responses[1].data.items);
        this.options.criticality = parseCatalog(responses[2].data);
        this.options.type = parseCatalog(responses[3].data);
      }).catch( (error) => {
        this.emitter.emit('error', { action: 'cargar catalogos',  error });
      }).finally(() => {
        this.emitter.emit("load", { loading: false });
      });
    },
    /*
     *  It sets the value for the range date
     * @param {String} name      Field's name
     * @param {Object} ev        Event
     * @param {String} ev.to     Event's date to
     * @param {String} ev.from   Event's date from
     */
    setRangeDate(name, ev) {
      this.inputs[name] = {
       name, 
       from: ev.target.from,
       to: ev.target.to,
       value: ev.target.from
      };
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
      this.dynamicValidations(name, value);
      this.applyNestedFields(name, value);
    },
    /*
     * This method executes the nested fields for BU
     * example
     * business unit depends of geography
     * @param {String} name   Field's name
     * @param {String} value  Field's value
     */
    applyNestedFields(name, value) {
      if( name !== 'buIds' ) {
        return;
      }
      const filter = value ? [ { name, value: value.map( (item) => parseInt(item) )} ] : [];
      
      this.emitter.emit("load", { loading: true });
      this.inputs.cfsId = { value: '',  error: null, touch: false};
      getCfsModelAPI(
        1, 3000, filter
      ).then((response) => {
          this.options.cfs = parseCatalog(response.data) ;
      }).catch((error) => {
        this.emitter.emit('error', { action: 'Cargar catalogos de filtros',  error });
      }).finally(() => {
        this.emitter.emit("load", { loading: false });
      });
    },
    /*
     * It sets the dynamic validations between the fields
     */
    dynamicValidations(name, value){
      const validateDate = [ 'buIds', 'typeId', 'cfsId', 'criticalityId',  'incidentByChange']
      const validateBu = [ 'cfsId'];

      if( validateDate.includes(name) ) {
        let mustBeRequired = false;
        validateDate.every( (key) => {
          if( Array.isArray(this.inputs[key].value) ) {
            mustBeRequired = !!this.inputs[key].value.length;
          } else {
            mustBeRequired = !!this.inputs[key].value;
          }
          return !mustBeRequired;
        });
        if( mustBeRequired ) {
          this.validations.date = validateRequired;
        } else {
          this.validations.date = () => ('');
          this.inputs.date.error = '';
        }
      }

      if( validateBu.includes(name) ) {
        if( value ) {
          this.validations.buIds = validateRequired;
        } else {
          this.validations.buIds = () => ('');
          this.inputs.buIds.error = '';
        }
      }
    },
    /*
     * It checks if the inputs has at least one value
     * @return Boolean, true if it is not empty
     */
    checkAtLeatsOnaField() {
      let notEmpty = false;
      Object.values(this.inputs).every( ({ value }) => {
        notEmpty = !!( Array.isArray(value) ? value.length : (value || value === 0) )
        return !notEmpty;
      });
      return notEmpty;
    },
    /*
     * This method validate all fields , check is there is any a error
     * and if everything is right, then send the values to the search method
     */
    searchFilter() {
      const values = [];

      this.inputs = validateAllFields(this.validations, this.inputs);

      if( !this.checkAtLeatsOnaField() ) {
        this.emitter.emit(
          "informational",
          {
            type: 'caution',
            title: 'Introduce al menos un filtro',
            message: 'Debes introducir un filtro para realizar la busqueda.'
          }
        );
        return;
      }

      Object.keys(this.inputs).forEach( (field) => {
        if( (this.inputs[field].value || this.inputs[field].value === 0) && field !== 'date') {
          if( Array.isArray(this.inputs[field].value) ) {
            if( this.inputs[field].value.length ) {
              values.push({ name: field, value: this.inputs[field].value });
            }
          } else {
            values.push({ name: field, value: this.inputs[field].value });
          }
        }
      });
      values.push( {name: 'startDate', value: formatDateWhitDash(this.inputs.date.from)} );
      values.push( {name: 'endDate', value: formatDateWhitDash(this.inputs.date.to) } );
      if( isThereError(this.inputs) ) {
        this.search(values);
      }
      this.showMoreFilters = false;
    },
    /*
     *  This method clear all the values
     */
    clearFilter() {
      this.inputs = {
        date: { to: '', from: '', error: '' },
        buIds: { value: [], error: '' },
        cfsId: { value: '', error: '' },
        typeId: { value: '', error: '' },
        ticket: { value: '', error: '' },
        criticalityId: { value: '', error: '' },
        incidentByChange: { value: null, error: ''}
      };
      const options = document.querySelector('bbva-web-form-select-multiple').children;
      for( let i = 0; i < options.length; i++) {
        options[i].selected = false;
      }
      this.showMoreFilters = false;
      this.search([]);
    }
  },
  props: {
    /*
     * Function to send the filters when the submit the form
     * It send an array with the next format
     * [
     *  { name: 'buIds', value: 2 }
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
.radio-custom-grid {
  display: flex;
  padding-top: 6px;
}
.radio-input {
  display: inline-block;
  text-align: center;
}
.text-input input {
  position: absolute;
  top: 20%;
  left: 3%;
}
.select-multiple {
  height: 0px;
}

</style>
