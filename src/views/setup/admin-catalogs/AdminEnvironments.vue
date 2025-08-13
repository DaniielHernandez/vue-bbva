<template>
  <app-bar></app-bar>
  <section-header
    title="Administración de Entornos"
    backPath="/setup/admin-catalogs"
    backLabel="&nbsp;Volver a Catálogos"
    textButton="Crear Entorno"
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
    :customBuildData="customBuildData"
  />
  <modal-form
    :close="closeForm"
    :data="form.data"
    :save="save"
    :open="form.open"
    :validations="form.validations"
    :fields="form.fields"
    resource="Entornos"
  />
  <information-modal
    :open="modal.open"
    :close="closeModal"
    :title="modal.title"
    :message="modal.message"
    :type="modal.type"
  />
  <overlay-loader :open="loading" />
</template>

<script>
// Components
import OverlayLoader from '@/components/loaders/OverlayLoader.vue'
import SectionHeader from '@/components/headers/SectionHeader.vue'
import AppBar from '@/components/AppBar/AppBar.vue'
import DataTable from '@/components/table/DataTable.vue'
import ModalForm from '@/components/forms/ModalForm.vue'
import InformationModal from '@/components/modals/InformationModal.vue'

// Constants
import { separator } from '@/constants/general'
import {
  headersTable,
  filtersTable,
  validationsForm,
  fieldsForm,
  requestDataKeys
} from '@/constants/adminEnvironments'

// Utils
import {
  editSuccessModal,
  createSuccessModal,
  starSuccessModal,
  unstarSuccessModal,
  errorRequestModal
} from '@/utils/informationModal'

// Request
import {
  getEnvironmentsApi,
  createEnvironmentApi,
  updateStatusEnvironmentApi
} from '@/requests/environments'
import { getSplitValue } from '@/utils/table'

export default {
  data() {
    return {
      /* Flag, true if it is loading */
      loading: false,
      /* Data used by the table component */
      table: {
        headers: headersTable,
        request: getEnvironmentsApi,
        filters: filtersTable,
        requestDataKeys,
        refresh: 0
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
        data: {},
        open: false,
        id: null,
        validations: validationsForm,
        fields: fieldsForm
      }
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
    /**
     * Transforms raw data into a structured format for easier handling in the application.
     *
     * @param {Array<Object>} data - An array of items to be processed, each represented as an object.
     * @param {Array<string>} keys - An array of keys that should be extracted and processed from each item.
     * @returns {Object} - A new object where the keys are item IDs, and the values are arrays of key-value objects.
     *
     */
    customBuildData(data, keys) {
      const build = {}
      data.forEach((item) => {
        build[item.id] = keys.map((key) => {
          let value = item[key]
          if (key.includes(separator)) {
            const key1 = key.split(separator)[0]
            const key2 = key.split(separator)[1]
            value = getSplitValue(item[key1], item[key2])
          }
          return { value, name: key }
        })
      })
      return build
    },
    /**
     * Star or unstar an item and update its status.
     *
     * @param {number} id - The ID of the item to star/unstar.
     * @param {boolean} active - Indicates whether the item should be starred (true) or unstarred (false).
     * @param {Object} item - The item being modified, holding its current state.
     */
    star(id, active, item) {
      this.loading = true
      const i = { ...item }
      i.status = active ? 1 : 0
      delete i.active
      updateStatusEnvironmentApi([id], i)
        .then(() => {
          this.loading = false
          this.modal = {
            open: true,
            ...(active ? starSuccessModal('Entorno') : unstarSuccessModal('Entorno'))
          }
          this.table.refresh++
        })
        .catch((error) => {
          this.loading = false
          this.errorInRequestModal('cambiar estatus', error)
        })
    },
    /*
     * It opens the form edit and set the item
     * @param {Object} item Item
     */
    edit(item) {
      const i = { ...item }
      delete i.active
      this.form.open = true
      this.form.data = i
      this.form.id = i.id
    },
    errorInRequestModal(action, error) {
      this.modal = {
        open: true,
        ...errorRequestModal(action, error)
      }
    },
    /*
     * It open the form to create a new item
     */
    newItem() {
      this.form.data = {}
      this.form.open = true
    },
    /*
     * It closes the form modal
     */
    closeForm() {
      this.form.data = {}
      this.form.open = false
    },
    /*
     * It closes the modal
     */
    closeModal() {
      this.modal.open = false
    },
    /*
     * It saves an item edited or create a new one
     * @param {Object} values Fields's values
     */
    save(values) {
      this.loading = true
      this.form.open = false
      if (this.form.id) {
        updateStatusEnvironmentApi(this.form.id, {
          ...values,
          status: this.form.data.status,
          id: this.form.id
        })
          .then(() => {
            this.loading = false
            this.modal = { open: true, ...editSuccessModal('Entorno') }
            this.form = { ...this.form, id: null, data: {} }
            this.table.refresh++
          })
          .catch((error) => {
            this.loading = false
            this.errorInRequestModal('actualizar', error)
          })
      } else {
        // 1 = Activo y 0 = inactivo
        createEnvironmentApi({ ...values, status: 1 })
          .then(() => {
            this.loading = false
            this.modal = { open: true, ...createSuccessModal('Entorno') }
            this.form = { ...this.form, id: null, data: {} }
            this.table.refresh++
          })
          .catch((error) => {
            this.loading = false
            this.errorInRequestModal('guardar', error)
          })
      }
    }
  }
}
</script>
