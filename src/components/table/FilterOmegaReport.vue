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
          @change="(ev) => setValue('geographyId', ev.target.value)"
          :invalid="!!inputs.geographyId.error"
          :error-message="inputs.geographyId.error"
          label="Geografía">
          <bbva-web-form-option
            v-for="option in options.geographyId"
            @change="(ev) => setValue('geographyId', ev.target.value)"
            :selected="inputs.geographyId?.value === option.id"
            :key="option.id"
            :value="option.id"><span class="pl-4">{{option.label}}</span></bbva-web-form-option>
        </bbva-web-form-select>
      </v-col>
      <v-col
        sm="12"
        md="6" lg="3" xl="3"
      >
        <div class="pb-sm-12">
          <bbva-web-form-select-multiple
            class="select-multiple"
            :invalid="!!inputs.buId.error"
            :disabled="!inputs.geographyId.value"
            :error-message="inputs.buId.error"
            @change="(ev) => setValue('buId', ev.target.selectedOptionsValues)"
            label="Business Unit">
            <bbva-web-form-option-multiple
              v-for="option in options.buId"
              :key="option.id"
              :selected="inputs.buId?.value?.includes(option.id) || false"
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
        <div class="pb-sm-12">
          <bbva-web-form-select-multiple
            class="select-multiple"
            :invalid="!!inputs.cfsId.error"
            :disabled="!inputs.buId.value"
            :error-message="inputs.cfsId.error"
            @change="(ev) => setValue('cfsId', ev.target.selectedOptionsValues)"
            label="CFS">
            <bbva-web-form-option-multiple
              v-for="option in options.cfsId"
              :key="option.id"
              :selected="inputs.cfsId?.value?.includes(option.id) || false"
              :value="`${option.id}`">
              <span class="pl-4">{{option.label}}</span>
            </bbva-web-form-option-multiple>
          </bbva-web-form-select-multiple>
        </div>
      </v-col>
      <v-col
        sm="12"
        md="6" lg="2" xl="2"
      >
        <date-picker
          @value-change="(ev) => setValue('date', ev.target.value)"
          :invalid="!!inputs.date.error"
          :errorMessage="inputs.date.error"
          label="Fecha"
          :value="inputs.date.value"
          />
      </v-col>

      <v-col sm="12" md="3" lg="2" xl="2">
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
import DatePicker from '@/components/forms/DatePicker.vue';
import { isThereError, validateAllFields, parseCatalog, validateRequired } from '@/utils/form';
// Requests
import { getCfsModelAPI } from '@/requests/cfs';
import { getBusinessUnitsAPI } from '@/requests/businessUnit';
import { getGeographyN1sAPI } from '@/requests/geographyN1';
// Constants
import { geographyIds } from '@/constants/geography.js';

export default {
  data() {
    return {
      /* It has the inputs with the fields, values and errors,  example
       * { buId: [ value: 3, error: '' ] }
       */
      inputs: {
        geographyId: { name: 'geaographyId', value: null, error: ''},
        buId: { name: 'buId', value: null, error: ''},
        cfsId: { name: 'cfsId', value: null, error: ''},
        date: { name: 'date', value: null, error: ''},
      },
      /* Option to be used by the selects*/
      options: {
        geographyId: [],
        buId: [],
        cfsId: [],
      },
      /* It has the fiels type select that are nested, example
       *  [ buId: [{ field: 'cfsId', request: getCfsesAPI } ]
       * Following this exmaple if buId change then the catalogs for the
       * cfs is going to be reloaded with the filter buId
       */
      nestedFields: {
        geographyId: [{ field: 'buId', request: getBusinessUnitsAPI }],
        buId: [{ field: 'cfsId', request: getCfsModelAPI } ]
      },
      /*
       * It has the validations when some filters have anyone
       * example
       * {
       *   buId: (value) => validateRequired(value),
       *   cfsId: (value) => validateRequired(value),
       *   date: (value) => validateRequired(value)
       * }
       */
      validations: {
        geographyId: validateRequired,
        buId: validateRequired,
        cfsId: validateRequired,
        date: validateRequired,
      },
    }
  },
  beforeMount() {
    this.loadCatalogs();
  },
  methods: {
    /*
     * It loads the initial catalogs used by the selects
     */
    loadCatalogs() {
      this.emitter.emit("load", { loading: true });
      getGeographyN1sAPI().then( (response) => {
        const items = response.data.filter( (x) => x.id !== geographyIds.GLOBAL ); 
        this.options.geographyId = parseCatalog( { items } );
        this.emitter.emit("load", { loading: false });
      }).catch( (error) => {
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
      this.applyNestedFields(name, value);
    },
    /*
     * This method check if the field has nested fields, only for selects fields
     * example
     * business unit depends of geography
     * @param {String} name   Field's name
     * @param {String} value  Field's value
     */
    applyNestedFields(name, value) {
      if( !this.nestedFields[name] ) {
        return;
      }
      if( this.nestedFields[name]?.length ) {
        const filter = [ { name, value} ];
        if(name === 'geographyId') {
          filter[0].name = 'geographyN1Id'; 
        } else if( name === 'buId') {
          filter[0].name = 'buIds'; 
          filter[0].value = value.map((id) => parseInt(id) );
        }
        
        this.emitter.emit("load", { loading: true });
        this.nestedFields[name].forEach(({field, request}) => {
          this.inputs[field] = { value: null,  error: null };
          request(
            1, 3000, filter
          ).then((response) => {
            this.options[field] = parseCatalog(response.data) ;
          }).catch((error) => {
            this.emitter.emit('error', { action: 'Cargar catalogos de filtros',  error });
          }).finally(() => {
            this.emitter.emit("load", { loading: false });
          });
        });
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
  components: {
    DatePicker
  },
  props: {
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
    }
  },
};
</script>

<style>
  .select-multiple {
    height: 0px;
    --_options-z-index: var(--bbva-web-form-select-multiple-options-z-index, 30);
  }
</style>
