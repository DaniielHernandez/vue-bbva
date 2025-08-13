<template>
  <app-bar />
  <section-header
    title="Configuración de usuarios y roles"
    backPath="/setup"
    icon="/icons/The-Best-And-Most-Engaged-Team.svg"
    textButton="Crear nuevo usuario"
    :onClickButton="newItem"
  />
  <data-table
    :headers="table.headers"
    :onEdit="edit"
    star
    :refresh="table.refresh"
    :onStar="star"
    :destroy="false"
    :requestData="table.request"
    :requestDataKeys="table.requestDataKeys"
    :filtersOptions="table.filters"
    :requestError="errorInRequestModal"
  />
  <user-form
    :close="closeForm"
    :data="form.data"
    :save="save"
    :open="form.open"
    :requestError="errorInRequestModal"
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
import {
  errorRequestModal, editSuccessModal, createSuccessModal, starSuccessModal, unstarSuccessModal
} from '@/utils/informationModal';
import DataTable from "@/components/table/DataTable.vue";
import AppBar from "@/components/AppBar/AppBar.vue";
import OverlayLoader from '@/components/loaders/OverlayLoader.vue';
import SectionHeader from '@/components/headers/SectionHeader.vue';
import {
  headersTable, filtersTable, validationsForm, fieldsForm, requestDataKeys, nestedFields
} from '@/constants/userAndRoles';
import UserForm from '@/components/forms/UserForm.vue';
import { updateStatusUsersAPI, getUsersAPI, createUserAPI, updateUserAPI } from '@/requests/users';
import InformationModal from '@/components/modals/InformationModal.vue';

export default {
  data() {
    return {
      /* Flag, true if it is loading */
      loading: false,
      /* Data used by the table component */
      table: {
        headers: headersTable, refresh: 0,
        request: getUsersAPI, filters: filtersTable, requestDataKeys
      },
      /* Data used by the form */
      form: {
        id: null,
        ids: [],
        data: {}, open: false,
        validations: validationsForm,
        fields: fieldsForm,
        nestedFields,
      },
      /* Data used by the modal */
      modal: {
        open: false,
        title: '',
        message: '',
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
    UserForm,
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
     * It stars an item
     * @param {Number}  id      Item's id
     * @param {Boolean} active  True if it must change to activated
     */
    star(id, active) {
      this.loading = true;
      updateStatusUsersAPI([id], active).then( () => {
        this.loading = false;
        this.modal = {
          open: true,
          ...( active ? starSuccessModal('usuario') : unstarSuccessModal('usuario') )
        }; 
        this.table.refresh++;
      }).catch((error) => {
        this.loading = false;
        this.errorInRequestModal('cambiar estatus', error);
      });
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
     * It handles the error request
     */
    errorInRequestModal(action, error) {
      this.modal = {
        open: true, ...errorRequestModal(action, error)
      };
    },
    /*
     * It saves an item edited or creates new item
     */
    save(values) {
      this.form.open = false;
      this.loading = true;
      if(this.form.id) {
        updateUserAPI(this.form.id, {...values, active: this.form.data.active }).then(() => {
          this.loading = false;
          this.modal = { open: true, ...editSuccessModal('usuario') };
          this.form = { ...this.form, id: null, data: {} };
          this.table.refresh++;
        }).catch( (error) => {
          this.loading = false;
          this.errorInRequestModal('actualizar', error)
        });
      } else {
        createUserAPI({...values, active: true}).then(() => {
          this.loading = false;
          this.modal = { open: true, ...createSuccessModal('usuario') };
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

