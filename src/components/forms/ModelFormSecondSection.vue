<template>
  <header-form-model stepValue="50" :onClose="onCancel" :onSubmit="save" />
  <v-container class="pl-8 pb-12" fluid>
    <v-row>
      <v-col cols="12" align="center">
        <bbva-button-default variant="secondary" class="btn-preview" icon="bbva:up" text="Anterior" @click="backStep">
        </bbva-button-default>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <span class="text-step-form">2 de 2</span>
      </v-col>
    </v-row>
    <v-row class="mt-0">
      <v-col cols="12">
        <span class="title-form-model">Elementos de medición</span>
      </v-col>
    </v-row>

    <v-row class="mt-0">
      <v-col cols="12">
        <bbva-web-notification-message style="padding-top: 5px; padding-left: 10px;height: 35px;">
          <p>Todos los campos son obligatorios para poder avanzar</p>
        </bbva-web-notification-message>
      </v-col>
    </v-row>

    <v-row class="mt-0">
      <v-col cols="12">
        <span class="title-section-form-model">Resumen Modelo paso 1</span>
      </v-col>
    </v-row>

    <v-row class="mt-0">
      <v-col cols="12 pt-2">
        <span class="text fs-14 pr-4">Business Unit: {{sumup.bu}}</span>
        <span class="text fs-14 pr-4">CFS: {{sumup.cfs}}</span>
        <span class="text fs-14 pr-4">Estatus de medición: {{sumup.measurementStatus}}</span>
        <span class="text fs-14 pr-4">Fuente: {{sumup.source}}</span>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" style="display: flex;gap: 10px;align-items: center;" class="pb-0">
        <span class="title-bu-cbp">Business Unit y CBPS</span>
        <bbva-button-default text="Añadir CBP" style="color: #1973B8; display: flex; gap: 8px;" icon="bbva:add"
          variant="link" @click="addRowCPBS">
        </bbva-button-default>
      </v-col>
      <v-col cols="12" class="pt-2">
        <span class="text fs-14">Crea CBPS y añade las operativas con sus datos necesarias</span>
      </v-col>
    </v-row>

    <v-container v-for="(d, indexCbps) in data.cbps" class="mx-5 pb-0" style="max-width: 100%;">
      <v-row>
        <v-col cols="12" class="d-flex">
          <bbva-button-default
            variant="link"
            class="primary"
            :icon="openedCbps.includes(indexCbps) ? 'bbva:collapse' : 'bbva:expand'"
            text=""
            @click="() => switchOpened(indexCbps)">
          </bbva-button-default>
          <span class="title-cbp pr-6"> CBP {{ indexCbps + 1 }}</span>
          <bbva-button-default text="Eliminar CBP" style="color: #1973B8; display: flex; gap: 8px;" icon="bbva:trash"
            variant="link" :disabled="indexCbps === 0" @click="deleteRowCPBS(indexCbps)">
          </bbva-button-default>
        </v-col>
      </v-row>
      <v-row v-if="openedCbps.includes(indexCbps)">
        <v-col sm="6" md="4" lg="3">
          <bbva-web-form-text key="input-name-text" class="input-text" :ref="`cbp-${indexCbps}`"
            @input="(ev) => setValueCBPS(indexCbps, 'name', ev.target.value)" :value="d.name"
            :invalid="!!errors.cbps[indexCbps].name" :error-message="errors.cbps[indexCbps].name" label="Nombre de CBP"></bbva-web-form-text>
        </v-col>
      </v-row>
      <v-row v-if="openedCbps.includes(indexCbps)" >
        <v-col cols="12" class="d-flex">
          <span class="title-cbp pr-6">OPERATIVAS</span>
          <bbva-button-default text="Añadir operativa" style="color: #1973B8; display: flex; gap: 8px;" icon="bbva:add"
            variant="link" @click="addRowOperational(indexCbps)">
          </bbva-button-default>
        </v-col>

      </v-row>
      <v-row v-for="(operativa, indexOperational) in d.operatives" v-if="openedCbps.includes(indexCbps)" >
        <v-col cols="12">
          <span class="text fs-14">Operativa {{ indexOperational + 1 }}</span>
        </v-col>
        <v-col sm="6" md="4" lg="3">
          <bbva-web-form-text key="input-operational-text" class="input-text" :ref="`op-${indexCbps}-${indexOperational}`"
            @input="(ev) => setValueOperational(indexCbps, indexOperational, 'name', ev.target.value)"
            :value="operativa.name" :invalid="!!errors?.cbps[indexCbps]?.operatives[indexOperational].name"
            :error-message="errors?.cbps[indexCbps]?.operatives[indexOperational].name" label="Nombre operativa"></bbva-web-form-text>
        </v-col>
        <v-col sm="6" md="4" lg="3" align-self="center">
          <bbva-button-default
            text="Eliminar operativa"
            style="color: #1973B8"
            icon="bbva:trash"
            variant="link"
            :disabled="indexOperational === 0" @click="deleteRow(indexCbps, indexOperational)">
          </bbva-button-default>
        </v-col>
        <v-container class="ml-0">
          <v-row>
            <v-col cols="12" class="d-flex">
              <span class="title-cbp pr-6">URLS</span>
              <bbva-button-default text="Añadir URL" style="color: #1973B8; display: flex; gap: 8px;" icon="bbva:add"
                variant="link" @click="addRowUrl(indexCbps, indexOperational, indexUrl)">
              </bbva-button-default>
            </v-col>
          </v-row>
          <v-row v-for="(url, indexUrl) in operativa.urls">
            <v-col cols="12" class="d-flex">
              <span class="text fs-14 pr-6">URL {{ indexUrl + 1 }}</span>
            </v-col>
            <v-col sm="6" md="6" lg="3" xl="2">
              <bbva-web-form-text key="input-element-text" class="input-text overflow-hidden" :ref="`url-${indexCbps}-${indexOperational}-${indexUrl}`"
                @input="(ev) => setValueUrl(indexCbps, indexOperational, indexUrl,'variableElement', ev.target.value)"
                :value="url.variableElement"
                :invalid="!!errors?.cbps[indexCbps]?.operatives[indexOperational].urls[indexUrl].variableElement"
                :error-message="errors?.cbps[indexCbps]?.operatives[indexOperational].urls[indexUrl].variableElement"
                label="Elemento variante de cada fuente"></bbva-web-form-text>
            </v-col>
            <v-col sm="6" md="6" lg="2" xl="2">
              <bbva-form-field
                key="input-umbral-text"
                class="input-text"
                allowed-pattern="[0-9.]"
                :required="true"
                @input="({target: { value }}) => setValueUrl(indexCbps, indexOperational, indexUrl, 'thresholdTr', value === '' ? value : parseFloat(value) )"
                :value="url.thresholdTr"
                :invalid="!!errors?.cbps[indexCbps]?.operatives[indexOperational].urls[indexUrl].thresholdTr"
                :error-message="errors?.cbps[indexCbps]?.operatives[indexOperational].urls[indexUrl].thresholdTr"
                label="Umbral TR"></bbva-form-field>
            </v-col>
            <v-col sm="6" md="12" lg="4" xl="3" class="pb-6 pr-0 d-flex" style="text-align: initial;">
              <div class="pr-6">
                <span class="fs-15 fw-500">Elemento variable madre</span>
                <div role="radiogroup" class="radio-custom-grid">
                  <bbva-web-form-radio-button key="input-is-mother-radio-1" :name="'options_' + indexCbps + '_' + indexOperational + '_' + indexUrl"
                    @change="() => setValueUrl(indexCbps, indexOperational, indexUrl,'isMother', true)"
                    :checked="url.isMother">
                    Si
                  </bbva-web-form-radio-button>
                  <bbva-web-form-radio-button  key="input-is-mother-radio-2" :name="'options_' + indexCbps + '_' + indexOperational + '_' + indexUrl"
                    @change="() => setValueUrl(indexCbps, indexOperational, indexUrl, 'isMother', false)"
                    class="pl-6"
                    :checked="!url.isMother">
                    No
                  </bbva-web-form-radio-button>
                </div>
              </div>
              <bbva-web-form-checkbox
                class="pt-3"
                @change="(ev) => setValueUrl(indexCbps, indexOperational, indexUrl, 'isAccess', ev.target.checked)"
                name="isAccess" :checked="url.isAccess">
                Es acceso
              </bbva-web-form-checkbox>
              <bbva-button-default text="" style="color: #1973B8" icon="bbva:trash" variant="link" class="pt-2 pl-6"
                :disabled="operativa.urls.length === 1" @click="deleteRowUrl(indexCbps, indexOperational, indexUrl)">
              </bbva-button-default>
            </v-col>
          </v-row>
        </v-container>
      </v-row>
      <v-row>
        <v-col cols="12" class="pt-0 pb-0">
          <v-divider class="my-5"></v-divider>
        </v-col>
      </v-row>
    </v-container>

    <v-row align-content="center">
      <v-col sm="6" md="2" lg="1" xl="1" class="d-flex pt-6">
        <bbva-button-default text="Continuar" @click="save">
        </bbva-button-default>
        <bbva-button-default text="Cancelar" style="color: #1973B8" class="btn-cancel font-weight-black ml-8" variant="link"
          @click="onCancel">
        </bbva-button-default>
      </v-col>
    </v-row>

  </v-container>
</template>

<script>
import { validateUrl, validateCbps, validateOperative } from '@/constants/model';
import '@/components/bbva-web-components/bbva-web-form-checkbox.js';
import '@/components/bbva-web-components/bbva-web-form-text.js'
import '@/components/bbva-web-components/bbva-form-input.js'
import '@/components/bbva-web-components/bbva-web-form-date.js'
import '@/components/bbva-web-components/bbva-web-form-radio-button.js'
import '@/components/bbva-web-components/bbva-foundations-microillustrations.js'
import '@/components/bbva-web-components/bbva-button-default.js'
import '@/components/bbva-web-components/bbva-progress-multistep-bar.js'
import '@/components/bbva-web-components/bbva-web-notification-message.js'
import HeaderFormModel from '@/components/headers/HeaderFormModel.vue'

/*
 * It's the form used by the second part of the model form
 *
 */

export default {
  data() {
    return {
      /* Indexes of opened cbps */
      openedCbps: [],
      id: null,
      /* Data used in the second part of the form */
      data: { cbps: []},
      /* CBPs removed */
      removedCBPS: [],
      /* Operatives removed */
      removedOperatives: [],
      /* urls removed*/
      removedUrls: [],
      /* Save the errors raise by the field's validations */
      errors: {
        cbps: []
      },
      /* Flag, true if the form is valid */
      valid: true,
      /* It has all the field's validations */
      validations: {
        cbps: {...validateCbps},
        operatives: { ...validateOperative },
        urls: {...validateUrl}
      },
    };
  },
  props: {
    /* Function to handle when user cancel the form */
    onCancel: { type: Function, default: () => { } },
    /* Function to send the values when submit the first part of the model */
    onSubmit: { type: Function, default: () => { } },
    /* Function set the form data */
    setData: { type: Function, default: () => { } },
    /* */
    sumup: { type: Object, default: {} }, 
    /* Previous form data */
    previousData: { type: Object, default: {} }, 
    /* It reqirects to revious step */
    previuosStep: { type: Function, default: () => { } },
  },
  beforeMount() {
    this.id = this.$route.params.id;
    if( !this.id ) {
      this.openedCbps.push(0);
    }
    this.data = {...this.previousData};
    this.initializeErrors();
  },
  components: {
    HeaderFormModel
  },
  methods: {
    /*
     * This method switch if the cbp row must be opened or closed
     * @param {Number} indexCbps Cbp's index
     */
    switchOpened(indexCbps) {
      if( this.openedCbps.includes(indexCbps) ) {
        const index = this.openedCbps.findIndex( (item) => item === indexCbps );
        delete this.openedCbps[index];
      } else {
        this.openedCbps.push(indexCbps);
      }
    },
    /*
     * It initializes the error values
     */
    initializeErrors() {
      this.data.cbps.forEach( (cbp) => {
        const addCbp = { operatives: []};
        cbp.operatives.forEach( (op, indexOp) => {
          const addOp = { urls: [] };
          addCbp.operatives.push(addOp);
          op.urls.forEach((url) => {
            addCbp.operatives[indexOp].urls.push({});
          })
        });
        this.errors.cbps.push(addCbp);
      });
    },
    /*
     * It sets cbp's value
     * @param {Number} index  CBP's index
     * @param {String} key    Field name
     * @param {String} value  Field's value
     */
    setValueCBPS(index, key, value) {
      this.data.cbps[index][key] = value;
      this.errors.cbps[index][key] = this.validations.cbps[key](value);

    },
    /*
     * It sets the operational value
     * @param {Number} iCbps   Cbp's index
     * @param {Number} iOp     Operative's index
     * @param {String} key     Field name
     * @param {String} value   New value
     */
    setValueOperational(iCbps, iOperational, key, value) {
      this.data.cbps[iCbps].operatives[iOperational][key] = value;
      this.errors.cbps[iCbps].operatives[iOperational][key] = this.validations.operatives[key](value);
    },
    /*
     * It sets the url value in a field
     * @param {Number} iCbps   Cbp's index
     * @param {Number} iOp     Operative's index
     * @param {Number} iUrl    Url's index
     * @param {String} key     Field name
     * @param {String} value   New value
     */
    setValueUrl(iCbps, iOp, iurl, key, value) {
      this.data.cbps[iCbps].operatives[iOp].urls[iurl][key] = value;
      this.errors.cbps[iCbps].operatives[iOp].urls[iurl][key] = this.validations.urls[key](value);
    },
    /*
     * It adds a cbp row
     */
    addRowCPBS() {
      const operativa = {
        name: "",
        urls: [{
        variableElement: "",
        thresholdTr: "",
        isMother: ""
        }]
      }  
      const cbp =  {
        name: "",
        number: this.data.cbps.length + 1,
        operatives: []
      }

      if(this.id) {
        operativa.id = null;
        cbp.id = null;
      }

      cbp.operatives.push({...operativa});

      this.data.cbps.push(cbp);
      this.errors.cbps.push({
        operatives: [{ urls: [{}] }]
      })
      this.openedCbps.push(this.data.cbps.length - 1);
      this.$nextTick(() => {
        if ( this.$refs[`cbp-${this.data.cbps.length - 1}`] ) {
          setTimeout(() => {
            this.$refs[`cbp-${this.data.cbps.length - 1}`][0].focus();
          }, 300)
        }
      });
    },
    /*
     * It a operative row by index
     * @param {Number} index CBP's index
     */
    addRowOperational(index) {
      const operativa = {
        name: "",
        urls: [{
          variableElement: "",
          thresholdTr: null,
          isMother: false,
          isAccess: false
        }]
      }

      if(this.id) {
        operativa.id = null;
      }
      this.data.cbps[index].operatives.push(operativa)
      this.errors.cbps[index].operatives.push({ urls: [{}]})
      this.$nextTick(() => {
        if ( this.$refs[`op-${index}-${this.data.cbps[index].operatives.length - 1}`] ) {
          setTimeout(() => {
            this.$refs[`op-${index}-${this.data.cbps[index].operatives.length - 1}`][0].focus();
          }, 300)
        }
      });
    },
    /*
     * It add a url row by cbp index and operative index
     */
    addRowUrl(indexCBP, indexOP) {
      const url = {
        variableElement: "",
        thresholdTr: null,
        isMother: false,
        isAccess: false
      }

      if(this.id) {
        url.id = null;
      }
      this.data.cbps[indexCBP].operatives[indexOP].urls.push(url);
      this.errors.cbps[indexCBP].operatives[indexOP].urls.push({})
      this.$nextTick(() => {
        if ( this.$refs[`url-${indexCBP}-${indexOP}-${this.data.cbps[indexCBP].operatives[indexOP].urls.length - 1}`] ) {
          setTimeout(() => {
            this.$refs[`url-${indexCBP}-${indexOP}-${this.data.cbps[indexCBP].operatives[indexOP].urls.length - 1}`][0].focus();
          }, 300)
        }
      });

    },
    /*
     * It removes a row cbp by index
     * @param {Number} index  Row's index 
     */
    deleteRowCPBS(index) {
      const row = this.data.cbps.splice(index, 1)[0];
      this.errors.cbps.splice(index, 1);

      if( this.id && row.id) {
        this.removedCBPS.push(row.id);
      }
    },
    /*
     * It backs to the previous step
     */
    backStep() {
      this.previuosStep(this.data, this.removedCBPS, this.removedOperatives, this.removedUrls);
    },
    /*
     *
     */
    deleteRowUrl(icbps, iop, iurl) {
      const row = this.data.cbps[icbps].operatives[iop].urls.splice(iurl, 1)[0]
      this.errors.cbps[icbps].operatives[iop].urls.splice(iurl, 1)

      if( this.id && row.id) {
        this.removedUrls.push(row.id);
      }
    },
    /*
     * It deletes a row
     */
    deleteRow(icbps, iop) {
      const row = this.data.cbps[icbps].operatives.splice(iop, 1)[0]
      this.errors.cbps[icbps].operatives.splice(iop, 1)

      if( this.id && row.id) {
        this.removedOperatives.push(row.id);
      }
    },
    /*
     * Check if there is any error between the fields
     */
    isThereError() {
      this.errors.cbps.every( ( cbp, indexCBP ) => {

        if( cbp.name ) {
          this.valid = false;
          return false;
        }
        cbp.operatives.every( ( op, indexOP ) => {
          if( op.name ) {
            this.valid = false;
            return false;
          }
          op.urls.every( (url, indexUrl) => {
            Object.keys(url).every( (key) => {
              this.valid = ! url[key];
              return this.valid;
            });
            return this.valid;
          });
          return this.valid;
        });
        return this.valid;
      });
    },
    /*
     * It validates all the fields
     */
    validateAll() {
      this.data.cbps.forEach( (cbp, indexCBP) => {
        this.errors.cbps[indexCBP].name = this.validations.cbps.name(cbp.name)
        cbp.operatives.forEach( (op, indexOP) => {
          Object.keys(op).forEach( (key) => {
            if( ! this.validations.operatives[key] ) {
              return;
            }

            this.errors.cbps[indexCBP].operatives[indexOP][key] = this.validations.operatives[key](
              op[key]
            );
            op.urls.forEach( (url, indexUrl) => {
              Object.keys(url).forEach( (keyUrl) => {
                if( ! this.validations.urls[keyUrl] ) {
                  return;
                }

                this.errors.cbps[indexCBP].operatives[indexOP].urls[indexUrl][keyUrl] = this.validations.urls[keyUrl](
                  url[keyUrl]
                );
              });
            });
          });
        });
      });
      this.isThereError();
    },
    /*
     * It validates all the fields and save the data
     */
    save() {
      this.validateAll();
      if( this.valid ) {
        this.setData(this.data, this.removedCBPS, this.removedOperatives, this.removedUrls);
        this.onSubmit();
      }
    },
  },
  watch: {
    previousData(values) {
      this.data = {...values};
      this.initializeErrors();
    }
  }
}
</script>

<style>
.fs-14 {
  font-size: 14px;
}

.btn-cancel {
  margin: 15px 45px;
}

.input-text input {
  margin-left: 17px;
  margin-top: 12px;
}

.radio-custom-grid {
  display: flex;
  justify-content: initial;
  padding-top: 6px;
  max-width: 150px;
}

.btn-preview {
  border-radius: 30px;
  color: #004481;
  height: 40px;
}
.title-form-model {
  font-size: 26px;
  font-weight: 700 !important;
}
.title-section-form-model {
  font-size: 15px;
  font-weight: 501 !important;
}

.text-step-form {
  font-size: 15px !important;
  font-style: italic !important;
  color: #666666 !important;
}
.title-bu-cbp {
  font-size: 18px;
  font-weight: 501;
}
.title-cbp {
  font-size: 15px;
  font-weight: 501;
}

</style>
  
