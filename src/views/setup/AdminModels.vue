<template>
  <app-bar />
  <section-header
    title="Administrar Modelos"
    icon="/icons/Download-Certificate.svg"
    textButton="Crear Modelo"
    backPath="/setup"
    :onClickButton="newItem"
  />
  <data-table
    :headers="table.headers"
    :destroy="false"
    :watch="true"
    :formatColumns="table.formatColumns"
    :onWatch="watchItem"
    :onEdit="edit"
    :requestDataKeys="table.requestDataKeys"
    :requestData="table.request"
    :filtersOptions="table.filters"
    :requestError="errorInRequestModal"
  />
  <information-modal
     :open="modal.open"
     :close="closeModal"
     :title="modal.title"
     :message="modal.message"
     :type="modal.type"
    />
</template>

<script>
import SectionHeader from '@/components/headers/SectionHeader.vue';
import DataTable from "@/components/table/DataTable.vue"
import AppBar from "@/components/AppBar/AppBar.vue"
import { formatColumns, headersTable, filtersTable, requestDataKeys } from '@/constants/adminModels';
import { getModelsAPI } from '@/requests/models';
import { errorRequestModal } from '@/utils/informationModal';

export default {
  data() {
    return {
      /* Data used by the table component */
      table: {
        headers: headersTable, request: getModelsAPI, filters: filtersTable, requestDataKeys,
        formatColumns
      },
      /* Data used by the form */
      form: { data: {}, open: false },
      /* Modal information */
      modal: {
        open: false,
        title: '',
        message: '',
        type: ''
      },

    }
  },
  methods: {
    /* It redirects to edit the item */
    edit(item) {
      this.form.open = true;
      this.form.data = item;
      this.$router.push(`/setup/admin-models/form/${item.id}`);
    },
    /* It redirects to create the item */
    newItem() {
      this.form.data = {};
      this.form.open = true;
      this.$router.push('/setup/admin-models/form');
    },
    /* It closes the form modal */
    closeForm() {
      this.form.data = {};
      this.form.open = false;
    },
    /* It redirects to watch the item */
    watchItem(id) {
      this.$router.push(`/setup/admin-models/view/${id}`);
    },
    /* It handles the error */
    errorInRequestModal(action, error) {
      this.modal = {
        open: true, ...errorRequestModal(action, error)
      };
    },
  },
  components: {
    AppBar,
    SectionHeader,
    DataTable,
  }
};
</script>
