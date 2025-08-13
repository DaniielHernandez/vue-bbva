<template>
  <v-container fluid class="pl-12 pr-12">
    <v-row>
      <v-col cols="12 d-flex">
        <span class="fw-500 fs-14"  >
          Umbral actual D+1:
        </span>
        <div class="pl-4 pr-4 d-flex fs-14">
          <div class="box-color orange" />
            <span class="pl-2 pr-1">{{form.data.greaterThan}}</span> &lt;
          <div class="pl-2 fw-500 fs-14 pr-2"> Rango High </div> &le;
          {{form.data.lesserThan}}
        </div>
        <div class="pr-4 d-flex">
          <div class="box-color red"/>
          <div class="pl-2 fs-14 fw-500 pr-1"> Rango Very High </div> &gt;
          <div class="fs-14">{{form.data.veryHighGreaterThan || ''}}</div>
        </div>
        <bbva-button-default
          variant="link"
          @click="edit"
          >
         <bbva-core-icon icon="bbva:update" size="14" style="color: #1973B8;"/>
         <span class="primary fw-500 fs-15"> Actualizar</span>
        </bbva-button-default>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" class="pb-0">
        <span class="font-weight-bold">
          Historial de umbrales D+1
        </span>
      </v-col>
    </v-row>
  </v-container>
  <data-table
    :headers="table.headers"
    :edit="false"
    :destroy="false"
    :star="false"
    :refresh="table.refresh"
    :requestData="table.request"
    :requestDataKeys="table.requestDataKeys"
    :filtersOptions="table.filters"
    :requestError="errorInRequestModal"
  />
  <modal-form
    :close="closeForm"
    :data="form.data"
    :save="save"
    :open="form.open"
    :validations="form.validations"
    :fields="form.fields"
    resource="umbrales D+1"
    />
  <information-modal
     :open="modal.open"
     :close="closeModal"
     :title="modal.title"
     :confirmation="modal.confirmation"
     :message="modal.message"
     :type="modal.type"
    />

  <overlay-loader :open="loading"/>
</template>

<script>
import DataTable from "@/components/table/DataTable.vue"
import {
  headersTable, filtersTable, validationsForm, fieldsForm, requestDataKeys
} from '@/constants/thresholdD1.js';
import { editSuccessModal, errorRequestModal } from '@/utils/informationModal';
import { createThresholdD1API, getThresholdsD1API } from '@/requests/thresholdD1';
import ModalForm from '@/components/forms/ModalForm.vue';
import InformationModal from '@/components/modals/InformationModal.vue';
import '@/components/bbva-web-components/bbva-button-default.js'
import OverlayLoader from '@/components/loaders/OverlayLoader.vue';

export default {
  data(){
    return {
      /* Flag, true if it is loading */
      loading: false,
      /* Data used by the table component */
      table: {
        headers: headersTable, refresh: 0,
        request: getThresholdsD1API, filters: filtersTable, requestDataKeys
      },
      /* It has the form information */
      form: {
        id: null,
        data: {}, open: false,
        validations: validationsForm,
        fields: fieldsForm
      },
      /* It has the modal information */
      modal: {
        open: false,
        title: '',
        message: '',
        confirmation: false,
        type: ''
      },
    }
  },
  props: {
    /* User's id */
    userId: { type: Number, default:null }
  },
  components: {
    OverlayLoader,
    DataTable,
    InformationModal,
    ModalForm,
  },
  beforeMount() {
    this.getLastThreshold();
  },
  methods: {
    /*
     * It gets the last threshold
     */
    getLastThreshold() {
      getThresholdsD1API(1,1, []).then((response) => {
        if( response.data?.items?.length ) {
          this.form.data = response.data.items[0];
          this.form.id = this.form.data.id; 
        }
      }).catch((error) => {
        this.errorInRequestModal('obtener', error);
      });
    },
    /*
     * It edits a threshold
     */
    edit() {
      this.emitter.emit("load", { loading: true });
      getThresholdsD1API(1,1, []).then((response) => {
        if( response.data?.items?.length ) {
          this.form.data = response.data.items[0];
          this.form.id = this.form.data.id; 
        }
        this.emitter.emit("load", { loading: false });
        this.form.open = true;
      }).catch((error) => {
        this.emitter.emit("load", { loading: false });
        this.errorInRequestModal('obtener', error);
      });
    },
    /*
     * It handles the error request
     */
    errorInRequestModal(action, error) {
      this.modal = {
        open: true, ...errorRequestModal(action, error)
      };
    },
    /*
     * It closes the form modal 
     */
    closeForm() {
      this.form.open = false;
    },
    /*
     * It closes the modal 
     */
    closeModal() {
      this.modal.open = false;
    },
    /*
     * It saves the item edited or creates a new one
     * @param {Object} values Fields's values
     */
    save(values) {
      this.form.open = false;
      this.loading = true;
      createThresholdD1API({...values, userId: this.userId }).then(() => {
        this.loading = false;
        this.modal = { open: true, ...editSuccessModal('umbral D+1') };
        this.form = { ...this.form, id: null, data: {} };
        this.table.refresh++;
        this.getLastThreshold();
      }).catch( (error) => {
        this.loading = false;
        this.errorInRequestModal('actualizar', error);
      });
    }
  }
}
</script>
