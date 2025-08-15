<script>
// import AppBar from "@/components/AppBar/AppBar.vue";

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

import '@/components/bbva-web-components/bbva-web-table-header.js'
import '@/components/bbva-web-components/bbva-web-table-body.js'
import '@/components/bbva-web-components/bbva-button-default.js'
import { onMounted } from 'vue';


export default {
  data() {
    return {
      /* Flag, true if it is loading */
      loading: false,
      /* Data used by the table component */
      // table: {
      //   headers: headersTable, refresh: 0,
      //   request: getUsersAPI, filters: filtersTable, requestDataKeys
      // },
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
      headersTableUsers: [
        { title: 'Nombre y Apellidos', key: 'nombreApellidos' },
        { title: 'Email', key: 'email' },
        { title: 'ID Usuario', key: 'userId' },
        { title: 'Geografía', key: 'geografia' },
        { title: 'Business Unit', key: 'businessUnit' },
        { title: 'Rol', key: 'rol' },
        { title: 'Perfil', key: 'profile' },
        { title: 'Cargo/Área', key: 'area' },
        { title: 'Acciones', key: 'actions', sortable: false } // <-- Nueva columna
      ],

      users: []
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
      updateStatusUsersAPI([id], active).then(() => {
        this.loading = false;
        this.modal = {
          open: true,
          ...(active ? starSuccessModal('usuario') : unstarSuccessModal('usuario'))
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
      if (this.form.id) {
        updateUserAPI(this.form.id, { ...values, active: this.form.data.active }).then(() => {
          this.loading = false;
          this.modal = { open: true, ...editSuccessModal('usuario') };
          this.form = { ...this.form, id: null, data: {} };
          this.table.refresh++;
        }).catch((error) => {
          this.loading = false;
          this.errorInRequestModal('actualizar', error)
        });
      } else {
        createUserAPI({ ...values, active: true }).then(() => {
          this.loading = false;
          this.modal = { open: true, ...createSuccessModal('usuario') };
          this.form = { ...this.form, id: null, data: {} };
          this.table.refresh++;
        }).catch((error) => {
          this.loading = false;
          this.errorInRequestModal('crear', error);
        });
      }
    }
  },
  mounted() {
    const rawUsers = JSON.parse(localStorage.getItem('users') || '[]');
    this.users = rawUsers.map(u => ({
      nombreApellidos: `${u.firstName} ${u.lastName}`,
      email: u.email,
      userId: u.userId,
      geografia: u.country || '',
      businessUnit: u.companyName || '',
      rol: u.tipoBuzon || '',
      profile: u.tipoLicencia || '',
      area: u.department || ''
    }));

  }
};





</script>

<template>
  <app-bar />
  <section-header title="Configuración de usuarios y roles" backPath="/setup"
    icon="/icons/The-Best-And-Most-Engaged-Team.svg" textButton="Crear nuevo usuario" :onClickButton="newItem" />
  <!-- <data-table :headers="table.headers" :onEdit="edit" star :refresh="table.refresh" :onStar="star" :destroy="false"
    :requestData="table.request" :requestDataKeys="table.requestDataKeys" :filtersOptions="table.filters"
    :requestError="errorInRequestModal" /> -->




  <v-container>
    <h2 class="mb-2">Lista de Usuarios</h2>
    <v-data-table :headers="headersTableUsers" :items="users" class="elevation-1">
      <template #item.actions="{ item }">
        <!-- Botón Editar -->
        <bbva-button-default text="" variant="link" class="pt-3" style="color: #1976d2; padding-bottom: 10px"
          @click="edit(item)" icon="bbva:edit">
        </bbva-button-default>

        <!-- Botón Eliminar -->
        <bbva-button-default text="" variant="link" class="pt-3" style="color: #d32f2f; padding-bottom: 10px"
          @click="deleteUser(item)" icon="bbva:trash">
        </bbva-button-default>
      </template>
    </v-data-table>
  </v-container>




  <user-form :close="closeForm" :data="form.data" :save="save" :open="form.open" :requestError="errorInRequestModal" />
  <information-modal :open="modal.open" :close="closeModal" :title="modal.title" :message="modal.message"
    :type="modal.type" />
  <overlay-loader :open="loading" />

</template>

<style scoped>
body {
  font-family: Arial, sans-serif;
  padding: 20px;
  background: #f5f5f5;
}

table {
  border-collapse: collapse;
  width: 100%;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

th,
td {
  border: 1px solid #ddd;
  padding: 12px;
  text-align: left;
}

th {
  background-color: #1976d2;
  color: white;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

tr:nth-child(even) {
  background-color: #f2f2f2;
}

tr:hover {
  background-color: #e3f2fd;
}

.container-table {
  margin-left: 10%;
  margin-right: 10%;
}
</style>
