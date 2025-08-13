<template>
  <v-card
    v-show="showMoreFilters"
    position="absolute"
    :key="`card-filters-${key}`"
    min-width="94%"
    style="overflow: initial; z-index: 50;"
    class="mt-2 ml-xl-12 ml-lg-12">
    <v-container
      fluid
     :class="withoutPadding ? 'ml-0 mr-0 pl-0 pr-0 pt-0 pb-0' : 'pl-xl-12 pl-lg-12 ml-0 mr-0'">
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
      </v-row>
      <v-row class="pr-8">
        <v-col
          sm="12"
          md="6"
          lg="4"
          xl="4"
          :key="`hidden-filter-index-${index}-${key}`"
          v-for="(filter, index) in filters">
          <bbva-web-form-text
            :key="`filter-table-text-${key}`"
            :id="`filter-table-text-${key}`"
            :class="filter.classes || styles.textInput"
            v-if="filter.type === 'text'"
            @change="(ev) => setValue(filter.name, ev.target.value)"
            :invalid="!!inputs[filter.name].error"
            :error-message="inputs[filter.name].error"
            :value="inputs[filter.name].value"
            :label="filter.label"></bbva-web-form-text>
          <bbva-web-form-select
            :key="`filter-table-select-${key}`"
            :id="`filter-table-select-${key}`"
            v-if="filter.type === 'select'"
            :class="filter.classes || ''"
            @change="(ev) => setValue(filter.name, ev.target.value)"
            :value="inputs[filter.name]?.value"
            :invalid="!!inputs[filter.name].error"
            :error-message="inputs[filter.name].error"
            :label="filter.label">
            <bbva-web-form-option value=""><span class="pl-4">Todos</span></bbva-web-form-option>
            <bbva-web-form-option
              v-for="option in filter.options"
              :key="`${option.id}-${key}`"
              :selected="inputs[filter.name]?.value === option.id"
              :value="option.id"><span class="pl-4">{{option.label}}</span></bbva-web-form-option>
          </bbva-web-form-select>

          <div class="pb-sm-12" v-if="filter.type === 'select-multiple'" >
            <bbva-web-form-select-multiple
              :key="`filter-table-multiple-${key}`"
              :id="`filter-table-multiple-${key}`"
              :class="`${filter.classes || ''} select-multiple`"
              @change="(ev) => setValue(filter.name, ev.target.selectedOptionsValues)"
              :invalid="!!inputs[filter.name].error"
              :error-message="inputs[filter.name].error"
              :label="filter.label">
              <bbva-web-form-option-multiple
                v-for="option in filter.options"
                :selected="inputs[filter.name]?.value?.includes(option.id) || false"
                :key="`${option.id}-multiple-${key}`"
                :value="`${option.id}`">
                <span class="pl-4">{{option.label}}</span>
              </bbva-web-form-option-multiple>
            </bbva-web-form-select-multiple>
          </div>

          <date-picker
            v-if="filter.type === 'date'"
            :key="`filter-table-date-${key}`"
            :classes="filter.classes || ''"
            @value-change="(ev) => setValue(filter.name, ev.target.value)"
            :max="filter.max || ''"
            :min="filter.min || ''"
            :invalid="!!inputs[filter.name].error"
            :errorMessage="inputs[filter.name].error"
            :label="filter.label"
            :value="inputs[filter.name].value"
            />
            
          <bbva-web-form-date-range
            v-if="filter.type === 'range-date'"
            class="date-range"
            label="Fecha Inicio - Fin"
            :from="inputs[filter.name].from"
            :to="inputs[filter.name].to"
            @date-range-change="(ev) => setRangeDate(filter.name, ev)"
            :invalid="!!inputs[filter.name].error"
            :error-message="inputs[filter.name].error"
            from="2021/04/15" to="2021/04/15">
          </bbva-web-form-date-range>
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
            v-if="clear"
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
    :class="withoutPadding ? 'ml-0 mr-0 pl-0 pr-0 pt-0 pb-0' : 'pl-xl-12 pl-lg-12 ml-0 mr-0'">
    <v-row justify="start">
      <v-col
        sm="12"
        md="6" lg="3" xl="3"
        :key="`showed-filter-index-${index}-${key}`"
        v-for="(filter, index) in showedFilters">
        <bbva-web-form-text
          :key="`filter-table-text-${key}`"
          v-if="filter.type === 'text'"
          :class="filter.classes || styles.textInput"
          @input="(ev) => setValue(filter.name, ev.target.value)"
          :value="inputs[filter.name].value"
          :invalid="!!inputs[filter.name].error"
          :error-message="inputs[filter.name].error"
          :label="filter.label"></bbva-web-form-text>
        <bbva-web-form-select
          :key="`filter-table-select-${key}`"
          v-if="filter.type === 'select'"
          :class="filter.classes || ''"
          @change="(ev) => setValue(filter.name, ev.target.value)"
          :invalid="!!inputs[filter.name].error"
          :error-message="inputs[filter.name].error"
          :label="filter.label">
          <bbva-web-form-option value="" v-if="!filter.required">
            <span class="pl-4">Todos</span>
          </bbva-web-form-option>
          <bbva-web-form-option
            v-for="option in filter.options"
            @change="(ev) => setValue(filter.name, ev.target.value)"
            :selected="inputs[filter.name]?.value === option.id"
            :key="option.id"
            :value="option.id"><span class="pl-4">{{option.label}}</span></bbva-web-form-option>
        </bbva-web-form-select>

        <div class="pb-sm-12" v-if="filter.type === 'select-multiple'" >
          <bbva-web-form-select-multiple
            :key="`filter-table-multiple-${key}`"
            :class="`${filter.classes || ''} select-multiple`"
            :invalid="!!inputs[filter.name].error"
            :error-message="inputs[filter.name].error"
            @change="(ev) => setValue(filter.name, ev.target.selectedOptionsValues)"
            :label="filter.label">
            <bbva-web-form-option-multiple
              v-for="option in filter.options"
              :key="option.id"
              :selected="inputs[filter.name]?.value?.includes(option.id) || false"
              :value="`${option.id}`">
              <span class="pl-4">{{option.label}}</span>
            </bbva-web-form-option-multiple>
          </bbva-web-form-select-multiple>
        </div>

        <date-picker
          v-if="filter.type === 'date'"
          :key="`filter-table-date-${key}`"
          :max="filter.max || ''"
          :min="filter.min || ''"
          @value-change="(ev) => setValue(filter.name, ev.target.value)"
          :classes="filter.classes || ''"
          :invalid="!!inputs[filter.name].error"
          :errorMessage="inputs[filter.name].error"
          :label="filter.label"
          :value="inputs[filter.name].value"
          />

          <bbva-web-form-date-range
            class="date-range"
            v-if="filter.type === 'range-date'"
            :from="inputs[filter.name].from"
            :to="inputs[filter.name].to"
            @date-range-change="(ev) => setRangeDate(filter.name, ev)"
            :invalid="!!inputs[filter.name].error"
            :error-message="inputs[filter.name].error"
            from="2021/04/15" to="2021/04/15">
          </bbva-web-form-date-range>
      </v-col>
      <v-col sm="12" md="2" lg="1" v-if="filters.length > 3" class="pl-lg-0">
        <div class="pt-3 pl-xl-4">
          <bbva-button-default
            text="Ver más filtros"
            variant="link"
            class="h-75"
            @click="showMoreFilters = true"></bbva-button-default>
        </div>
      </v-col>
      <v-col sm="12" md="2" lg="1" xl="1"  v-else-if="clear">
        <div class="pt-3 pl-4 pl-md-0">
        <bbva-button-default
          text="Borrar filtros"
          variant="link"
          class="h-75"
          @click="clearFilter" ></bbva-button-default>
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

import '@/components/bbva-web-components/bbva-web-form-text.js';
import '@/components/bbva-web-components/bbva-web-form-select.js';
import '@/components/bbva-web-components/bbva-web-form-select-multiple.js';
import '@/components/bbva-web-components/bbva-button-default.js';
import '@/components/bbva-web-components/bbva-web-form-date-range.js';
import DatePicker from '@/components/forms/DatePicker.vue';
import { isThereError, validateAllFields, parseCatalog } from '@/utils/form';
import { ref } from 'vue';

export default {
  data() {
    return {
      /* Flag, true to show more filters when those are more than 3 */
      showMoreFilters: false,
      /* It has the filters showed */
      showedFilters: [],
      /* It has the inputs with the fields, values and errors,  example
       * { buId: [ value: 3, error: '' ] }
       */
      inputs: {},
      /* */
      styles: { textInput: ref('text-input') } 
    }
  },
  beforeMount() {
    this.filters.forEach((filter, index) => {
      this.inputs[filter.name] = {}
      if( index <= 2 ) {
        this.showedFilters.push(filter);
      }
    })
    this.setValues(this.values);
  },
  methods: {
    /*
     * Thus method saves the values into the fields
     * @param {Object} values               Values to set into the fields
     * @param {String} values.name          Field's name
     * @param {String|Number} values.value  Field's value
     */
    setValues(values) {
      if( values.length ) {
        values.forEach( (item) => {
          this.inputs[item.name] = {...item};
        });
      }
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
      if( this.nestedFields[name].length ) {
        const filter = value ? [ { name, value} ] : [];
        
        this.emitter.emit("load", { loading: true });
        this.nestedFields[name].forEach(({field, request, extraFilters }) => {
          this.inputs[field] = { value: '',  error: null, touch: false};
          request(
            1, 3000, [ ...filter, ...(extraFilters || [] ) ]
          ).then((response) => {
            this.filters.every( (filter, index) => {
              if(filter.name !== field) {
                return true;
              }
              this.filters[index].options = parseCatalog(response.data) ;
              return false;
            });
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
          const filter = this.filters.find( (item) => ( item.name === input.name ) );
          if( filter.type === 'range-date' ) {
            values.push({ name: filter.from , value: input.from });
            values.push({ name: filter.to , value: input.to });
          } else if( Array.isArray(input.value) ) {
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
      this.showMoreFilters = false;
    },
    /*
     * This method clear all the values
     */
    clearFilter() {
      this.filters.forEach(({name}) => { this.inputs[name] = {} });
      this.search([]);
    }
  },
  components: {
    DatePicker
  },
  props: {
    key: { type: Number, default: 0 },
    /* Flag to define if show the button clear filters */
    clear: { type: Boolean, default: true },
    /* Flag, remove the padding */
    withoutPadding: { type: Boolean, default: false },
    /* Those area the initial values for the filters */
    values: { type: Array, default: [] },
    /* It has the fiels type select that are nested, example
     *  [ buId: [{ field: 'cfsId', request: getCfsesAPI } ]
     * Following this exmaple if buId change then the catalogs for the
     * cfs is going to be reloaded with the filter buId
     */
    nestedFields: { type: Object, default: {} },
    /*
     * It has the validations when some filters have anyone
     * example
     * {
     *   buId: (value) => validateRequired(value),
     *   cfsId: (value) => validateRequired(value),
     *   date: (value) => validateRequired(value)
     * }
     */
    validations: { type: Function, default: () => ({}) },
    /* It has the filters to show, there are diferente options, example:
     *
     * [
     *   { name: 'fullName', label: 'Nombre y apellidos', type: 'text' },
     *   { name: 'rolId', label: 'Rol', type: 'select', options: [], request: getRolesAPI },
     * ];
     */
    filters: {
      type: Function,
      default: () => []
    },
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
  watch: {
    /* Follow the values */
    values(newValues) {
      this.setValues(newValues);
    }
  }
};
</script>

<style>
  .text-input input {
    position: absolute;
    top: 20%;
    left: 3%;
  }
  .select-multiple {
    height: 0px;
    --_options-z-index: var(--bbva-web-form-select-multiple-options-z-index, 30);
  }
</style>
