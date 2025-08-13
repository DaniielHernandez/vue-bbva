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
            {{ Object.keys(data).length ? 'Editar usuario' : 'Crear usuario' }}
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
            <v-row >
              <v-col cols="12">
                <bbva-web-form-text
                  @input="(ev) => setValue('fullName', ev)"
                  :class="styles.textInput"
                  :value="inputs.fullName.value"
                  :invalid="Boolean(inputs.fullName.error)"
                  :error-message="inputs.fullName.error"
                  label="Nombre y apellidos"></bbva-web-form-text>
              </v-col>
              <v-col cols="12">
                <bbva-web-form-text
                  @input="(ev) => setValue('email', ev)"
                  :value="inputs.email.value"
                  :class="styles.textInput"
                  :invalid="Boolean(inputs.email.error)"
                  :error-message="inputs.email.error"
                  label="Email"></bbva-web-form-text>
              </v-col>
              <v-col cols="12">
                <bbva-web-form-text
                  @input="(ev) => setValue('employeeId', ev)"
                  :value="inputs.employeeId.value"
                  :class="styles.textInput"
                  :invalid="Boolean(inputs.employeeId.error)"
                  :error-message="inputs.employeeId.error"
                  label="ID usuario"></bbva-web-form-text>
              </v-col>
              <v-col cols="12">
                <bbva-web-form-select
                  @change="(ev) => setValue('geographyN1Id', ev)"
                  :value="inputs.geographyN1Id.value"
                  :invalid="!!inputs.geographyN1Id.error"
                  :error-message="inputs.geographyN1Id.error"
                  label="Geografía">
                  <bbva-web-form-option
                    v-for="option in catalogs.geographyN1Id"
                    :key="option.id"
                    :value="option.id"><span class="pl-4">{{option.label}}</span></bbva-web-form-option>
                   
                </bbva-web-form-select>
                 
              </v-col>
              <v-col cols="12">
                <bbva-web-form-select
                  v-if="addBu"
                  @change="(ev) => setValue('buId', ev)"
                  :value="inputs.buId.value"
                  :invalid="!!inputs.buId.error"
                  :error-message="inputs.buId.error"
                  label="Business unit">
                  <bbva-web-form-option value="all"><span class="pl-4">Todas</span></bbva-web-form-option>
                  <bbva-web-form-option
                    v-for="option in catalogs.buId"
                    :key="option.id"
                    :value="option.id"><span class="pl-4">{{option.label}}</span></bbva-web-form-option>
                </bbva-web-form-select>
              </v-col>
              <v-col cols="12">
                <bbva-web-form-select
                  @change="(ev) => setValue('roleId', ev)"
                  :value="inputs.roleId.value"
                  :invalid="!!inputs.roleId.error"
                  :error-message="inputs.roleId.error"
                  label="Rol">
                  <bbva-web-form-option
                    v-for="option in catalogs.roleId"
                    :key="option.id"
                    :value="option.id"><span class="pl-4">{{option.label}}</span></bbva-web-form-option>
                </bbva-web-form-select>
              </v-col>
              <v-col cols="12">
                <bbva-web-form-select
                  @change="(ev) => setValue('profileId', ev)"
                  :value="inputs.profileId.value"
                  :invalid="!!inputs.profileId.error"
                  :error-message="inputs.profileId.error"
                  label="Perfil">
                  <bbva-web-form-option
                    v-for="option in catalogs.profileId"
                    :key="option.id"
                    :value="option.id"><span class="pl-4">{{option.label}}</span></bbva-web-form-option>
                </bbva-web-form-select>
              </v-col>
              <v-col cols="12">
                <bbva-web-form-select
                  @change="(ev) => setValue('areaId', ev)"
                  :value="inputs.areaId.value"
                  :invalid="!!inputs.areaId.error"
                  :error-message="inputs.areaId.error"
                  label="Cargo/Área">
                  <bbva-web-form-option
                    v-for="option in catalogs.areaId"
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
import { getProfilesAPI } from '@/requests/profiles';
import { getAreasAPI } from '@/requests/areas';
import { getBusinessUnitsAPI } from '@/requests/businessUnit';
import { getGeographyN1sAPI } from '@/requests/geographyN1';
import { getRolesAPI } from '@/requests/roles';
import { validationsForm } from '@/constants/userAndRoles'
import { ref } from 'vue';
import {
  clearInputs, isThereError, validateAllFields, parseCatalog
} from '@/utils/form';
const fields = [
  'fullName', 'email',  'employeeId',
  'buId', 'roleId', 'profileId', 'areaId', 'geographyN1Id'
]

export default {
  data() {
    return {
      /* Flag, true if the dialog is open*/
      dialog: false,
      /* Form's inputs */
      inputs: {},
      /* Flag, true is the form is valid */
      valid: true,
      /* Select's catalog  */
      catalogs: {},
      /* Form's validations */
      validations: { ...validationsForm},
      /* Styles */
      styles: { textInput: ref('text-input') },
      /* Flag, true if the bu id is added*/
      addBu: true,
      /* Field's keys */
      fieldKeys: [...fields],
    }
  },
  beforeMount() {
    this.loadCatalogs();
  },
  methods: {
    /*
     * It gets the catalogs used by the catalogs
     */
    loadCatalogs() {
      [
        { request: getProfilesAPI, key: 'profileId'},
        { request: getAreasAPI, key: 'areaId' },
        { request: getBusinessUnitsAPI, key: 'buId'},
        { request: getGeographyN1sAPI, key: 'geographyN1Id'},
        { request:  getRolesAPI, key: 'roleId'},
      ].forEach( ({request, key}) => {
        request().then((response) => {
          this.catalogs[key] = parseCatalog(response.data) ;
        }).catch((error) => {
           this.requestError('cargar catálogos', error);
        });
      })
    },
    /*
     * It sets the values
     */
    setValue(name, ev) {
      const value = ev.target.value
      this.inputs[name].value = value;
      this.inputs[name].error = '';
      const error = this.validations[name](value);

      if( error ) {
        setTimeout(() => {
          this.inputs[name].error = error;
        }, 100);
      }

      if( name === 'geographyN1Id') {
        if( value === 3) {
          this.removeInputBu();
        } else {
          const filter = [ { name, value} ];

          this.inputs.buId = { value: '',  error: null, touch: false};
          getBusinessUnitsAPI(1, 1000, filter ).then((response) => {
            this.catalogs.buId = parseCatalog(response.data) ;
            this.addInputBu();
           }).catch((error) => {
            this.requestError('cargar catálogos', error);
          });
        };
      }

      this.valid = isThereError( this.inputs );
    },
    /*
     * It adds the bu input
     */
    addInputBu() {
      const bu = this.fieldKeys.find( (item) => item === 'buId' );
      if( !bu ) {
        this.fieldKeys.push('buId');
      }

      this.inputs.buId = { value: '',  error: null, touch: false};
      this.validations.buId = validationsForm.buId;
      this.addBu = true;
    },
    /*
     * It removes the bu input
     */
    removeInputBu() {
      this.fieldKeys = this.fieldKeys.filter((item) => {
        return item !== 'buId';
      });

      if( this.validations.buId ) {
        delete this.validations.buId;
      }
      if( this.inputs.buId ) {
        delete this.inputs.buId;
      }
      this.addBu = false;
    },
    /*
     * It handles the form's submit
     */
    onSubmit() {
      this.inputs = validateAllFields(this.validations, this.inputs);
      const values = {};

      this.valid = isThereError( this.inputs );

      if(this.inputs.buId && this.inputs.buId.value === 'all') {
        this.removeInputBu();
      }
      if(this.valid) {
        this.fieldKeys.forEach( (key) => values[key] = this.inputs[key].value );
        this.save(values);
      }
    },
  },
  props: {
    /* Flag, true if the modal is open*/
    open: { type: Boolean, default: false },
    /* Function to save the data */
    save: { type: Function, default: () => {} },
    /* It closes the modal */
    close: { type: Function, default: () => {} },
    /* It handles the request error */
    requestError: { type: Function, default: () => {} },
    /* It has the form's data */
    data: { type: Function, default: () => ({}) }
  },
  watch: {
    open(value) {
      this.dialog = value;
      this.fieldKeys = [ ...fields];
      this.addInputBu();
      if( Object.keys(this.data).length ) {
        this.fieldKeys.forEach( (key) => {
          this.inputs[key] = { value: this.data[key], error: '', touch: false };
        });
        if( this.data.geographyN1Id === 3 ) {
          this.removeInputBu();
        }
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
</style>
