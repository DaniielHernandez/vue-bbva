<template>
  <app-bar></app-bar>
  <section-header
    title="Días inhábiles"
    icon="/icons/Calendar.svg"
    backPath="/setup"
    textButton="Crear nuevo día inhábil"
    :onClickButton="newItem"
  />
  <data-table
    :headers="table.headers"
    :onEdit="edit"
    :refresh="table.refresh"
    :onDestroy="warningDestroy"
    :requestDestroyMany="warningDestroyMany"
    :requestData="table.request"
    :requestDataKeys="table.requestDataKeys"
     :formatColumns="table.formatColumns"
    :filtersOptions="table.filters"
    :requestError="errorInRequestModal"
  />
  <non-working-day-form
    :close="closeForm"
    :save="save"
    :data="form.data"
    :open="form.open"
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
    <overlay-loader :open="loading"/>
</template>

<script>
import SectionHeader from '@/components/headers/SectionHeader.vue';
import AppBar from "@/components/AppBar/AppBar.vue";
import DataTable from "@/components/table/DataTable.vue"
import NonWorkingDayForm from "@/components/forms/NonWorkingDayForm.vue"
import OverlayLoader from '@/components/loaders/OverlayLoader.vue';
import { headersTable, filtersTable, requestDataKeys, formatColumns } from '@/constants/nonWorkingDays';
import InformationModal from '@/components/modals/InformationModal.vue';
import {
  editSuccessModal, createSuccessModal, removeManyCautionModal, errorRequestModal
} from '@/utils/informationModal';
import {
  removeNonWorkingDayAPI, updateNonWorkingDayAPI, createNonWorkingDayAPI, getNonWorkingDaysAPI
} from '@/requests/nonWorkingDay';
export default {
  data(){
    return {
      /* Flag, true if it is loading */
      loading: false,
      /* Data used by the table component */
      table: {
        headers: headersTable, request: getNonWorkingDaysAPI,
        filters: filtersTable, requestDataKeys, refresh: 0, formatColumns
      },
      /* It has the modal information */
      modal: {
        open: false,
        title: '',
        message: '',
        confirmation: false,
        type: ''
      },
      /* It has the form information */
      form: { data: {}, open: false, id: null, ids: [] },
    }
  },
  components: {
    OverlayLoader,
    AppBar,
    DataTable,
    SectionHeader,
    InformationModal,
    NonWorkingDayForm
  },
  methods: {
    /*
     * It opens the form edit and set the item
     * @param {Object} item Item
     */
    edit(item) {
      this.form.data = item;
      this.form.id = item.id;
      this.form.open = true;
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
     * It open the form to create a new item
     */
    newItem() {
      this.form.data = {};
      this.form.open = true;
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
        title: `¿Seguro que quieres eliminar el día inhábil?`,
        message: `El día inhábil ${item.date}, Business Unit
          ${item.bu} se borrará de manera permanente`,
        confirmation: true
      };
    },
    /*
     * It destroys many items
     * @param {Number} ids Items's ids
     */
    warningDestroyMany(ids) {
      this.form.ids = ids;
      this.modal = {
        open: true, ...removeManyCautionModal('a los días inhábiles'), confirmation: true
      };
    },
    /*
     * It removes one o or many items
     */
    remove() {
      this.modal.open = false;
      this.loading = true;
      const ids = this.form.ids.length ? this.form.ids : [this.form.id];
      Promise.all( ids.map( (id) => (
        removeNonWorkingDayAPI(id)
      ))).then(() => {
        this.loading = false;
        this.form = { ...this.form, id: null, data: {}, ids: [] };
        const many = ids.length > 1;
        this.modal = {
          open: true,
          type: 'success',
          title: many ? 'Días inhábiles eliminados' : 'Día inhábil eliminado',
          message: many ? 'Has eliminado los dias inhábiles correctamente' :
          'Día inhábil eliminado correctamente'
        };
        this.table.refresh++;
      }).catch((error) => {
        this.loading = false;
        this.errorInRequestModal('eliminar','día inhábil', error)
      });
    },
    /*
     * It closes the form modal 
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
     * It saves an item o creates a new one
     * @param {Number} buId   Business unit's id
     * @param {Number} day     Day of the month
     * @param {Number} month   Month of the year
     * @param {Number} year    Year
     */
    save({buId, day, month, year}) {
      this.loading = true;
      this.form.open = false;
      const parsedValues = {
        buId,
        date: `${year}-${month < 10 ? '0' : ''}${month}-${day < 10 ? '0' : ''}${day}`
      };
      if(this.form.id) {
        updateNonWorkingDayAPI(this.form.id, parsedValues).then(() => {
          this.loading = false;
          this.modal = { open: true, ...editSuccessModal('día inhábil') };
          this.form = { ...this.form, id: null, data: {} };
          this.table.refresh++;
        }).catch( (error) => {
          this.errorInRequestModal('actualizar', error)
        });
      } else {
        createNonWorkingDayAPI(parsedValues).then(() => {
          this.loading = false;
          this.modal = { open: true, ...createSuccessModal('día inhábil') };
          this.form = { ...this.form, id: null, data: {} };
          this.table.refresh++;
        }).catch( (error) => {
          this.errorInRequestModal('eliminar', error);
        });
      }
    }
  }
};
</script>
