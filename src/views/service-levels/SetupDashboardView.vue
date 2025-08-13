<template>
  <app-bar></app-bar>
  <section-header
    title="Configurador de Dashboard"
    icon="/icons/desktop.svg"
    backPath="/service-levels"
    backLabel="Volver a Niveles de Servicio"
    textButton="Crear nuevo dashboard"
    :onClickButton="newItem"
  />
  <data-table
    :hiddenDataKeys="table.hiddenDataKeys"
    :hiddenHeaders="table.hiddenHeaders"
    titleHiddenRow="Detalles Dashboard"
    :headers="table.headers"
    :onEdit="edit"
    :customBuildData="table.buildData"
    :refresh="table.refresh"
    :onDestroy="warningDestroy"
    :noDestroyMany="true"
    :requestData="table.request"
    :requestDataKeys="table.requestDataKeys"
    :filtersOptions="table.filters"
    :requestError="errorInRequestModal"
  />
  <information-modal
     :open="modal.open"
     :close="closeModal"
     :title="modal.title"
     :onAccept="remove"
     :message="modal.message"
     :confirmation="modal.confirmation"
     :type="modal.type"
    />
  <modal-form
    :close="closeForm"
    :nestedFields="form.nestedFields"
    :data="form.data"
    :fields="form.fields"
    :validations="form.validations"
    :save="save"
    :open="form.open"
    resource="Dashboard"
    />
</template>

<script>
import SectionHeader from '@/components/headers/SectionHeader.vue';
import ModalForm from '@/components/forms/ModalForm.vue';
import AppBar from "@/components/AppBar/AppBar.vue";
import DataTable from "@/components/table/DataTable.vue"
import OverlayLoader from '@/components/loaders/OverlayLoader.vue';
import {
  headersTable, filtersTable, requestDataKeys, hiddenDataKeys,
  hiddenHeaders, fieldsForm, validationsForm, nestedFields
} from '@/constants/setupDashboard';
import InformationModal from '@/components/modals/InformationModal.vue';
import {
  editSuccessModal, createSuccessModal, errorRequestModal
} from '@/utils/informationModal';
import {
  removeDashboardAPI, updateDashboardAPI, createDashboardAPI, getDashboardsAPI
} from '@/requests/dashboard';
import { buildData } from '@/utils/setupDashboard';


/*
 * View to show the dashboard admin
 */
export default {
  data(){
    return {
      /* It saves the data used to show the tale */
      table: {
        headers: headersTable, request: getDashboardsAPI, hiddenDataKeys, hiddenHeaders,
        filters: filtersTable, requestDataKeys, refresh: 0, buildData
      },
      /* It saves the data to show the form */
      form: {
        id: null,
        data: {}, open: false,
        fields: fieldsForm,
        validations: validationsForm,
        nestedFields,
      },
      /* It saves the data to show the modal */
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
    DataTable,
    SectionHeader,
    ModalForm, 
    InformationModal,
  },
  methods: {
    /*
     * It set the data to edit form and open the modal form
     * @param {Object} item   It contains the data and the ida to edit the item
     */
    edit(item) {
      this.form.data = item;
      this.form.id = item.id;
      this.form.open = true;
    },
    /*
     * It sets the error and open the modal
     * @param {String}  action   String with teh action that raised the error
     * @param {Object}  error    Error
     */
    errorInRequestModal(action, error) {
      this.modal = {
        open: true, ...errorRequestModal(action, error)
      };
    },
    /*
     * It prepares the values to open the open to add a new item/dashboard
     */
    newItem() {
      this.form.data = {};
      this.form.open = true;
    },
    /*
     * It shows a warning before to accept destoy the item/dashboard
     * @param {Object} item  Item/dashboard to be destroyed
     */
    warningDestroy(item) {
      this.form.id = item.id;
      this.modal = {
        open: true,
        type: 'caution',
        title: `¿Seguro que quieres eliminar ${item.dashboardName}?`,
        message: 'Con esta accción va a eliminar este dashboard',
        confirmation: true
      };
    },
    /*
     * It deletes a dashboard
     */
    remove() {
      this.emitter.emit("load", { loading: true });
      this.modal.open = false;
      removeDashboardAPI(this.form.id).then(() => {
        this.emitter.emit("load", { loading: false });
        this.form = { ...this.form, id: null, data: {}, ids: [] };
        this.modal = {
          open: true,
          type: 'success',
          title: `Dashboard eliminado`,
          message: `Has eliminado el dashboard de semana correctamente`
        };
        this.table.refresh++;
      }).catch((error) => {
        this.emitter.emit("load", { loading: false });
        this.errorInRequestModal('eliminar', 'dashboard', error)
      });
    },
    /*
     * It closes the modal form
     */
    closeForm() {
      this.form.data = {};
      this.form.id = null;
      this.form.open = false;
    },
    /*
     * It closes the modal
     */
    closeModal() {
      this.modal.open = false;
    },
    /*
     * It saves the values from the form, when the user is creating or editing a dashboard
     * @param {Object} values  Form's values
     */
    save(values) {
      this.emitter.emit("load", { loading: true });
      this.form.open = false;

      if(this.form.id) {
        updateDashboardAPI(this.form.id, values).then(() => {
          this.emitter.emit("load", { loading: false });
          this.modal = { open: true, ...editSuccessModal('dashboard') };
          this.form = { ...this.form, id: null, data: {} };
          this.table.refresh++;
        }).catch( (error) => {
          this.emitter.emit("load", { loading: false });
          this.errorInRequestModal('actualizar', error)
        });
      } else {
        createDashboardAPI(values).then(() => {
          this.emitter.emit("load", { loading: false });
          this.modal = { open: true, ...createSuccessModal('dashboard') };
          this.form = { ...this.form, id: null, data: {} };
          this.table.refresh++;
        }).catch( (error) => {
          this.emitter.emit("load", { loading: false });
          this.errorInRequestModal('crear', error);
        });
      }
    }
  }
};
</script>
