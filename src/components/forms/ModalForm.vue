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
            {{ Object.keys(data).length ? `Editar ${resource}` : `Crear ${resource}` }}
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
            <v-row v-for="(field, index) in fields" :key="`input-row-${index}`">
              <v-col cols="12" :key="`input-col-${index}`" >
                <bbva-web-form-select
                  :key="`input-${index}-select`"
                  v-if="field.type === 'select'"
                  @change="(ev) => setValue(field.name, ev.target.value)"
                  :value="inputs[field.name].value"
                  :invalid="!!inputs[field.name].error"
                  :disabled="checkItemDisabled(field.name)"
                  :error-message="inputs[field.name].error"
                  :label="field.label">
                  <bbva-web-form-option value="" v-if="!field.required">
                    <span class="pl-4">Ninguno</span>
                  </bbva-web-form-option>
                  <bbva-web-form-option
                    v-for="option in catalogs[field.name]"
                    :key="option.id"
                    :value="option.id">
                    <span class="pl-4">{{option.label}}</span>
                  </bbva-web-form-option>
                </bbva-web-form-select>
                <bbva-web-form-text
                  :key="`input-${index}-text`"
                  v-if="field.type === 'text'"
                  :maxlength="field.max || 200"
                  @input="(ev) => setValue(field.name, ev.target.value)"
                  :class="styles.textInput"
                  :value="inputs[field.name].value"
                  :invalid="Boolean(inputs[field.name].error)"
                  :error-message="inputs[field.name].error"
                  :label="field.label"></bbva-web-form-text>
                <bbva-form-field
                  :key="`input-${index}-number`"
                  v-if="field.type === 'number'"
                  allowed-pattern="[0-9.]"
                  :required="true"
                  :class="styles.textInput"
                  @input="({ target: { value } }) => setValue(field.name, value)"
                  :value="inputs[field.name].value"
                  :invalid="!!inputs[field.name].error"
                  :error-message="inputs[field.name].error"
                  :label="field.label"></bbva-form-field>
                <bbva-form-field
                  :key="`input-${index}-number`"
                  v-if="field.type === 'percentage'"
                  allowed-pattern="[0-9.%]"
                  :required="true"
                  :class="styles.textInput"
                  @input="({ target: { value } }) => setValue(field.name, value)"
                  :value="inputs[field.name].value"
                  :invalid="!!inputs[field.name].error"
                  :error-message="inputs[field.name].error"
                  :label="field.label"></bbva-form-field>

                <div class="select-multiple-form" v-if="field.type === 'select-multiple'">
                  <bbva-web-form-select-multiple
                    :invalid="!!inputs[field.name].error"
                    :error-message="inputs[field.name].error"
                    @change="(ev) => setValue(field.name, ev.target.selectedOptionsValues)"
                    :label="field.label">
                    <bbva-web-form-option-multiple
                      v-for="option in catalogs[field.name]"
                      :selected="inputs[field.name]?.value?.includes(`${option.id}`)"
                      :key="option.id"
                      :value="`${option.id}`">
                      <span class="pl-4">{{option.label}}</span>
                    </bbva-web-form-option-multiple>
                  </bbva-web-form-select-multiple>
                </div>
                <date-picker
                  :key="`input-${index}-date`"
                  v-if="field.type === 'date'"
                  @value-change="(ev) => setValue(field.name, ev.target.value)"
                  :label="field.label"
                  :invalid="!!inputs[field.name].error"
                  :errorMessage="inputs[field.name].error"
                  :value="inputs[field.name].value"
                  />
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions class="pl-10 pb-10">
          <bbva-button-default
            text="Continuar"
            :disabled="!valid"
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
  <overlay :open="dialog"></overlay>
</template>

<script>

import '@/components/bbva-web-components/bbva-web-form-text.js'
import '@/components/bbva-web-components/bbva-form-input.js'
import '@/components/bbva-web-components/bbva-web-form-select.js'
import '@/components/bbva-web-components/bbva-button-default.js'
import '@/components/bbva-web-components/bbva-foundations-icons.js'
import DatePicker from '@/components/forms/DatePicker.vue'
import { clearInputs, isThereError, validateAllFields, parseCatalog } from '@/utils/form';
import Overlay from "@/components/overlay/Overlay.vue"
import { ref } from 'vue';
import '@/components/bbva-web-components/bbva-web-form-select-multiple.js';

/*
 * This component is modal form for any resource to edit or create
 * that change the fields depending on the properties
 * 
 */
export default {
  data() {
    return {
      /* flag to open the dialog */
      dialog: false,
      /* Save the inputs with the values */
      inputs: {},
      /* Flag, true if the form is valid*/
      valid: true,
      /* It has all the catalogs used by the selects */
      catalogs: {},
      /* It has all the names of the fields */
      fieldKeys: [],
      styles: { textInput: ref('text-input') } 
    }
  },
  beforeMount() {
    this.loadCatalogs();
    this.fieldKeys = this.fields.map( ({name}) => name );
  },
  methods: {
    /*
     * This method loads all the catalogs used by the form
     */
    loadCatalogs() {
      const selects = this.fields.filter((field) => field.request );
      selects.forEach(({request, name, removeItemsById}) => {
        request(1,3000).then((response) => {
          this.catalogs[name] = parseCatalog(response.data) ;
          if( removeItemsById ) {
            this.catalogs[name] =  this.catalogs[name].filter( (item) => (
              !removeItemsById.includes(item.id)
            ));
          }
        }).catch((error) => {
          this.requestError('cargar catálogos', error);
        });
      });
    },
    /*
     * This method sets the values changed by the user
     * and execute the validations that the field has,
     * and if another field  of type select depends on this, then
     * reload the another field
     * 
     */
    setValue(name, value) {
      this.inputs[name] = {
        value,
        error: ''
      }

      const error = this.validations[name](value);

      if( error ) {
        setTimeout(() => {
          this.inputs[name].error = error;
        }, 100);
      }

      this.valid = !error;

      if( this.nestedFields[name] && this.nestedFields[name].length ) {
        const filter = [ { name, value} ];
        const options = this.fields.filter( (item) => {
          return this.nestedFields[name].find( (catalog) => catalog === item.name )
        });
        options.forEach(({request, name: field}) => {

          this.inputs[field] = { value: '',  error: null, touch: false};

          request(1, 1000, filter ).then((response) => {
            this.catalogs[field] = parseCatalog(response.data) ;
          }).catch((error) => {
            this.requestError('cargar catálogos', error);
          });
        });
      }
    },
    /*
     * This method checks if a field type select is disabled
     *
     * @param {String} field  Field's name
     *
     * @return True if it must be disabled
     */
    checkItemDisabled(field) {
      let disabled = false;
      Object.keys(this.nestedFields).forEach( (key) => {
        const catalog = this.nestedFields[key];
        disabled =  !!catalog.find( (subCatalog) =>  subCatalog === field) && !this.inputs[key].value;
      });
      return disabled;
    },
    /*
     * This method catch the submit form, check the validations for all the fields
     * and if everything is right then send the values submited to the parent component
     *
     */
    onSubmit() {
      const values = {};
      this.inputs = validateAllFields(this.validations, this.inputs);

      this.valid = isThereError( this.inputs );

      if(this.valid) {
        this.fields.forEach(({name, type}) => {
          if( type ===  'number') {
            values[name] = parseFloat(this.inputs[name].value);
          } else if(type === 'select-multiple'){
            values[name] = this.inputs[name].value.map((id) => parseInt(id) );
          }else { 
            values[name] = this.inputs[name].value;
          }
        });
        this.save(values);
      }
    },
  },
  components: {
    DatePicker,
    Overlay
  },
  props: {
    /* Flag to open the modal */
    open: { type: Boolean, default: false },
    /* Function where is going to send the submited values */
    save: { type: Function, default: () => {} },
    /* Function to close the modal */
    close: { type: Function, default: () => {} },
    /* It has the data when you are going to edit some resource, it must be empty if you
     *  are going to create
     */
    data: { type: Function, default: () => ({}) },
    /* It has a key name for every fields and the values are validations to execute,
     * example { email: (value) => validateRequired(value) || validateEmail(value) }
     */
     validations: { type: Function, default: () => ({})},
    /* It has the fields for the form, examples of different kind of fields
     * [
     *  { name: 'name', label: 'Name', type: 'text' },
     *  { name: 'age', label: 'Age', type: 'number' },
     *  {
     *    name: 'profileId', label: 'Perfil', type: 'select', options: [], request: getProfilesAPI
     *  }
     * ]
     */
    fields: { type: Function, default: () => []},

    /* The name of the resource to edit or create */
    resource: { type: Function, default: '' },
    /*
     * It is used when you have nested fields , example business unit depends on geography
     *
     *  { geographyN1Id: ['buId'] }
     */
    nestedFields: { type: Object, default: {} },
    /*
     * Function to handle error if any request fails
     */
    requestError: { type: Function, default: () => {} },
  },
  watch: {
    /*
     * This method follows when the flag open is changed  and clear
     * the previuos data if it exists
     */
    open(value) {
      this.dialog = value;
      if( Object.keys(this.data).length ) {
        this.fieldKeys.forEach( (key) => {
          const fieldIndex = this.fields.findIndex( (item) => item.name === key);
          if ( this.fields[fieldIndex].getIds ) {
            this.inputs[key] = {
              value: this.fields[fieldIndex].getIds(this.data[key]),
              error: ''
            }
          } else {
            this.inputs[key] = { value: this.data[key], error: '' };
          }
        });
      } else {
        this.inputs = clearInputs( this.fieldKeys );
      }
    },
  }
}
</script>

<style>
  .text-input input {
    position: absolute;
    top: 20%;
    left: 3%;
  }
  .title-form {
    font-weight: 700;
    font-size: 22px;
  }
  .select-multiple-form {
    height: 50px;
  }
</style>
