<template>
  <app-bar></app-bar>
  <section-header
    title="Administración de Business Unit"
    backPath="/setup/admin-catalogs"
    backLabel="&nbsp;Volver a Catálogos"
    textButton="Crear Business Unit"
    :onClickButton="newItem"
  />
  <data-table
    :headers="table.headers"
    star
    :onStar="star"
    :onEdit="edit"
    :destroy="false"
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
    resource="BUs"
    />
  <information-modal
     :open="modal.open"
     :close="closeModal"
     :title="modal.title"
     :onAccept="remove"
     :confirmation="modal.confirmation"
     :message="modal.message"
     :type="modal.type"
    />
    <overlay-loader :open="loading"/>
</template>

<script>
// Components
import OverlayLoader from '@/components/loaders/OverlayLoader.vue';
import SectionHeader from '@/components/headers/SectionHeader.vue';
import AppBar from "@/components/AppBar/AppBar.vue";
import DataTable from "@/components/table/DataTable.vue"
import InformationModal from '@/components/modals/InformationModal.vue';
// Requests
import {
  getBusinessUnitsAPI, createBusinessUnitAPI, updateBusinessUnitAPI, updateStatusBusinessUnitAPI
} from '@/requests/businessUnit';
// Constants
import {
  headersTable, filtersTable, validationsForm, fieldsForm, requestDataKeys
} from '@/constants/adminBusinessUnit';
import ModalForm from '@/components/forms/ModalForm.vue';
import {
  editSuccessModal, createSuccessModal, starSuccessModal, unstarSuccessModal, errorRequestModal
} from '@/utils/informationModal';

export default {
  data() {
    return {
      /* Flag, true if it is loading */
      loading: false,
      /* Data used by the table component */
      table: {
        headers: headersTable, request: getBusinessUnitsAPI, filters: filtersTable,
        requestDataKeys, refresh: 0
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
    AppBar,
    InformationModal,
    DataTable,
    SectionHeader,
    ModalForm
  },
  methods: {
    /*
     * It opens the form edit and set the item
     * @param {Object} item Item
     */
    edit(item) {
      this.form.open = true;
      this.form.data = {...item, name: item.bu };
      this.form.id = item.id;
    },
    /* 
     * It open the form to create a new item
     */
    newItem() {
      this.form.open = true;
    },
    /* 
     * It stars an item
     * @param {Number}  id      Item's id
     * @param {Boolean} active  True if the item must be ativated
     */
    star(id, active) {
      this.loading = true;
      this.modal.open = false;
      updateStatusBusinessUnitAPI(id, active).then(() => {
        this.loading = false;
        this.form = { ...this.form, id: null, data: {} };
        this.modal = {
          open: true,
          ...( active ? starSuccessModal('business unit') : unstarSuccessModal('business unit') )
        };
        this.table.refresh++;
      }).catch((error) => {
        this.loading = false;
        this.errorInRequestModal( active ? 'activar' : 'Desactivar', error);
      });
    },
    /*
     * It closes the form 
     */
    closeForm() {
      this.form.data = {};
      this.form.open = false;
    },
    /* It closes the modal */
    closeModal() {
      this.modal.open = false;
    },
    /* It handles the error request */
    errorInRequestModal(action, error) {
      this.modal = { open: true, ...errorRequestModal(action, error) };
    },
    /*
     * It saves an iten to be edited or an item to be created
     * @param {Object} values It has the field's value
     */
    save(values) {
      this.loading = true;
      this.form.open = false;
      if(this.form.id) {
        updateBusinessUnitAPI(this.form.id,{ ...values, active: this.form.data.active }).then(() => {
          this.loading = false;
          this.modal = { open: true, ...editSuccessModal('business unit') };
          this.form = { ...this.form, id: null, data: {} };
          this.table.refresh++;
        }).catch( (error) => {
          this.loading = false;
          this.errorInRequestModal('actualizar', error)
        });
      } else {
        createBusinessUnitAPI({...values, active: true }).then(() => {
          this.loading = false;
          this.modal = { open: true, ...createSuccessModal('business unit') };
          this.form = { ...this.form, id: null, data: {} };
          this.table.refresh++;
        }).catch( (error) => {
          this.loading = false;
          this.errorInRequestModal('crear', error);
        });
      }
    }
  }
};
</script>
