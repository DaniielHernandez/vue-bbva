<template>
  <app-bar></app-bar>
  <section-header
    title="Administración de CFS"
    backPath="/setup/admin-catalogs"
    backLabel="&nbsp;Volver a Catálogos"
    textButton="Crear CFS"
    :onClickButton="newItem"
  />
  <data-table
    :headers="table.headers"
    star
    :onStar="star"
    :destroy="false"
    :onEdit="edit"
    :refresh="table.refresh"
    :requestDataKeys="table.requestDataKeys"
    :requestData="table.request"
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
    resource="CFS"
    />
  <information-modal
     :open="modal.open"
     :close="closeModal"
     :title="modal.title"
     :message="modal.message"
     :type="modal.type"
    />
  <overlay-loader :open="loading"/>
</template>

<script>
import OverlayLoader from '@/components/loaders/OverlayLoader.vue';
import SectionHeader from '@/components/headers/SectionHeader.vue';
import AppBar from "@/components/AppBar/AppBar.vue";
import DataTable from "@/components/table/DataTable.vue";
import ModalForm from '@/components/forms/ModalForm.vue';
import {
  headersTable, filtersTable, validationsForm, fieldsForm, requestDataKeys
} from '@/constants/adminCfs';
import {
  editSuccessModal, createSuccessModal, starSuccessModal, unstarSuccessModal, errorRequestModal
} from '@/utils/informationModal';
import { getCfsesAPI, createCfsAPI, updateCfsAPI, updateStatusCfsAPI } from '@/requests/cfs';
import InformationModal from '@/components/modals/InformationModal.vue';

export default {
  data() {
    return {
      /* Flag, true if it is loading */
      loading: false,
      /* Data used by the table component */
      table: {
        headers: headersTable, request: getCfsesAPI,
        filters: filtersTable, requestDataKeys, refresh: 0
      },
      /* It has the modal information */
      modal: {
        open: false,
        title: '',
        message: '',
        type: ''
      },
      /* It has the form information */
      form: {
        data: {}, open: false,
        id: null,
        validations: validationsForm,
        fields: fieldsForm
      },
    }
  },
  components: {
    OverlayLoader,
    AppBar,
    DataTable,
    SectionHeader,
    InformationModal,
    ModalForm
  },
  methods: {
    star(id, active) {
      this.loading = true;
      updateStatusCfsAPI([id], active).then( () => {
        this.loading = false;
        this.modal = {
          open: true,
          ...( active ? starSuccessModal('CFS') : unstarSuccessModal('CFS') )
        }; 
        this.table.refresh++;
      }).catch((error) => {
        this.loading = false;
        this.errorInRequestModal('cambiar estatus', error);
      });
    },
    /*
     * It opens the form edit and set the item
     * @param {Object} item Item
     */
    edit(item) {
      this.form.open = true;
      this.form.data = item;
      this.form.id = item.id;
    },
    errorInRequestModal(action, error) {
      this.modal = {
        open: true, ...errorRequestModal(action, error)
      };
    },
    /* 
     * It open the form to create a new item
     */
    newItem() {
      this.form.data = {};
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
     * It saves an item edited or create a new one
     * @param {Object} values Fields's values
     */
    save(values) {
      this.loading = true;
      this.form.open = false;
      if(this.form.id) {
        updateCfsAPI(this.form.id, {...values, active: this.form.data.active}).then(() => {
          this.loading = false;
          this.modal = { open: true, ...editSuccessModal('CFS') };
          this.form = { ...this.form, id: null, data: {} };
          this.table.refresh++;
        }).catch( (error) => {
          this.loading = false;
          this.errorInRequestModal('actualizar', error)
        });
      } else {
        createCfsAPI({...values, active: true}).then(() => {
          this.loading = false;
          this.modal = { open: true, ...createSuccessModal('CFS') };
          this.form = { ...this.form, id: null, data: {} };
          this.table.refresh++;
        }).catch( (error) => {
          this.loading = false;
          this.errorInRequestModal('eliminar', error);
        });
      }

    }
  }
};
</script>
