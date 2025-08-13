<template>
  <v-container fluid class="pl-12 pr-12">
    <v-row>
      <v-col cols="12">
        <span class="font-weight-bold">
          Añade ponderaciones de fin de semana desde cero:
        </span>
        <bbva-button-default
          class="pl-1"
          variant="link"
          @click="newItem"
          >
          <bbva-core-icon icon="bbva:add" size="14" style="color: #1973B8;"/>
          <span class="primary fw-500 fs-15 pl-1"> Crear ponderación</span>
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
    :onEdit="edit"
      :formatColumns="table.formatColumns"
    :noDestroyMany="true"
    :onDestroy="warningDestroy"
    :requestDataKeys="table.requestDataKeys"
    :requestData="table.request"
    :refresh="table.refresh"
    :filtersOptions="table.filters"
  />
  <modal-form
    :close="closeForm"
    :data="form.data"
    :save="save"
    :open="form.open"
    :validations="form.validations"
    :fields="form.fields"
    resource="ponderación de fin de semana"
    />
  <information-modal
     :open="modal.open"
     :close="closeModal"
     :onAccept="remove"
     :title="modal.title"
     :confirmation="modal.confirmation"
     :message="modal.message"
     :type="modal.type"
    />

  <overlay-loader :open="loading"/>
</template>

<script>
import OverlayLoader from '@/components/loaders/OverlayLoader.vue';
import DataTable from "@/components/table/DataTable.vue"
import {
  headersTable, filtersTable, validationsForm, fieldsForm, requestDataKeys
} from '@/constants/weighingWeekend.js';
import {
  editSuccessModal, createSuccessModal, errorRequestModal
} from '@/utils/informationModal';
import {
  getWeighingWeekendsAPI, removeWeighingWeekendAPI, updateWeighingWeekendAPI,
  createWeighingWeekendAPI
} from '@/requests/weighingWeekend';
import ModalForm from '@/components/forms/ModalForm.vue';
import InformationModal from '@/components/modals/InformationModal.vue';
import '@/components/bbva-web-components/bbva-button-default.js'
import '@/components/bbva-web-components/bbva-core-icon.js'
import { formatColumns } from '@/constants/weighingWeekend';
export default {
  data(){
    return {
      /* Flag, true if it is loading */
      loading: false,
      /* Data used by the table component */
      table: {
        headers: headersTable, refresh: 0,  formatColumns,
        request: getWeighingWeekendsAPI, filters: filtersTable, requestDataKeys
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
  components: {
    OverlayLoader,
    DataTable,
    InformationModal,
    ModalForm,
  },
  props: {
    /* User's id */
    userId: { type: Number, default:null }
  },
  methods: {
    /*
     * It opens the form edit and set the item
     * @param {Object} item Item
     */
    edit(item) {
      this.form.open = true;
      this.form.data = item;
      this.form.id = item.id;
    },
    /*
     * It removes one o or many items
     */
    remove() {
      this.loading = true;
      this.modal.open = false;
      removeWeighingWeekendAPI(this.form.id).then(() => {
        this.loading = false;
        this.form = { ...this.form, id: null, data: {}, ids: [] };
        this.modal = {
          open: true,
          type: 'success',
          title: `Ponderación de fin de semana eliminada`,
          message: `Has eliminado la ponderación de fin de semana correctamente`
        };
        this.table.refresh++;
      }).catch((error) => {
        this.loading = false;
        this.errorInRequestModal('eliminar', 'ponderación fin de semana', error)
      });
    },
    /*
     * It shows a warning before detroy the item
     * @param {Object} item Item
     */
    warningDestroy(item) {
      this.form.id = item.id;
      this.modal = {
        open: true,
        type: 'caution',
        title: 'Eliminar Ponderación de fin de semana',
        message: `
          ¿Seguro que quieres eliminar la siguiente ponderación de fin de semana?
          BU: ${item.bu}, CFS: ${item.cfs},
          Ponderación sábado: ${item.sundayWeighting}, Ponderación domingos ${item.sundayWeighting}
        `,
        confirmation: true
      };
    },
    /* 
     * It open the form to create a new item
     */
    newItem() {
      this.form.open = true;
    },
    /*
     * It closes the form modal 
     */
    closeForm() {
      this.form.data = {};
      this.form.open = false;
    },
    /*
     * It closes the modal
     */
    closeModal() {
      this.modal.open = false;
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
     * It formats an object given the parameters
     * @param {Number}  buId              Business Unit's id
     * @param {Number}  channelId           Channel's id
     * @param {String}  experationDate  Experation date
     * @param {Number}  saturdayWeighting          Weighing saturday
     * @param {Number}  sundayWeighting         Weighing Sunday
     */
    getValues({buId, channelId, effectiveDate, saturdayWeighting, sundayWeighting}) {
      return {
        buId, channelId, effectiveDate,
        saturdayWeighting,
        sundayWeighting,
        userId: this.userId
      }
    },
    /* 
     * It saves an item edited or creates a new one
     * @param {Object} values   Fields's values
     */
    save(values) {
      this.loading = true;
      this.form.open = false;
      if(this.form.id) {
        updateWeighingWeekendAPI(
          this.form.id, this.getValues(values)
        ).then(() => {
          this.loading = false;
          this.modal = { open: true, ...editSuccessModal('ponderación de fin de semana') };
          this.form = { ...this.form, id: null, data: {} };
          this.table.refresh++;
        }).catch( (error) => {
          this.loading = false;
          this.errorInRequestModal('actualizar', error)
        });
      } else {
        createWeighingWeekendAPI( this.getValues(values) ).then(() => {
          this.loading = false;
          this.modal = { open: true, ...createSuccessModal('ponderación de fin de semana') };
          this.form = { ...this.form, id: null, data: {} };
          this.table.refresh++;
        }).catch( (error) => {
          this.loading = false;
          this.errorInRequestModal('crear', error);
        });
      }

    }
  }
}
</script>
