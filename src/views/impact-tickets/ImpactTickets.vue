<template>
  <app-bar></app-bar>
  <v-container fluid class="pl-12">
    <v-row justify="space-between">
      <v-col>
        <div class="d-flex pt-8">
          <img src="/icons/listFolios.svg" alt="Icono de la sección" />
          <span class="pl-1 fs-18 fw-500 pt-2">Consulta de folios con impacto</span>
          <bbva-web-link class="primary fw-500 pl-3 pt-1" icon="bbva:download" @click="download">
            Descargar
          </bbva-web-link>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <FilterImpactTicket :search="searchFilter" :values="filters" />
      </v-col>
    </v-row>
    <v-row v-if="!items.length" class="pt-16">
      <v-col cols="12" class="pb-0">
        <img src="/icons/info.svg" alt="Icono de la sección" />
      </v-col>
      <v-col cols="12" class="pt-0">
        <span class="text-h5">Inicio de consulta de folio</span>
      </v-col>
      <v-col cols="12">
        <span>
          {{
            filters.length === 0
              ? 'Para comenzar la consulta elige una o varias business unit y la fecha de inicio - fecha fin de la incidencia'
              : 'No hay datos con los filtros seleccionados'
          }}
        </span>
      </v-col>
    </v-row>
    <v-row v-else>
      <v-col>
        <v-table>
          <thead>
            <tr>
              <th
                v-for="header in headers"
                :id="`table-header${header.value}`"
                :key="header.value"
                class="text-left fs-12 font-weight-light"
              >
                <bbva-web-table-header-text
                  v-if="columnsSort.includes(header.value)"
                  :id="header.value"
                  order=""
                  :sort-active="sort.orderBy === header"
                  @sort-criteria="(evt) => sortTable(header.value)"
                >
                  {{ header.title }}
                </bbva-web-table-header-text>
                <bbva-web-table-header-text v-else>
                  {{ header.title }}
                </bbva-web-table-header-text>
              </th>
              <th style="min-width: 160px"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in items" :key="`ticket-item-${item.id}`">
              <td v-if="openedRows.includes(item.id) && item.hidden" :colspan="9">
                <v-container fluid class="open-row-table">
                  <v-row>
                    <v-col>
                      <span class="fs-15 fw-500 pb-6">Otros datos de interes</span>
                    </v-col>
                  </v-row>
                  <v-row>
                    <div
                      class="pr-6 pb-6"
                      v-for="(row, index) in expandedRows(item.typeId)"
                      :key="index"
                    >
                      <img src="/icons/flag.svg" alt="Icono de listado" />
                      <span class="pl-1 fs-15"> {{ row.label }}: {{ item[row.key] }} </span>
                    </div>
                    <div class="pr-6 pb-6" v-if="item.typeId === ticketTypesIds.SET1_REQUIREMENT">
                      <bbva-web-link
                        class="primary fw-500"
                        icon="bbva:watch"
                        @click="() => documentUrl(item.url)"
                      >
                        Url del informe
                      </bbva-web-link>
                    </div>
                  </v-row>
                </v-container>
              </td>

              <template v-if="!item.hidden">
                <td
                  :style="openedRows.includes(item.id) ? 'border-bottom: unset;' : ''"
                  v-for="(header, index) in headers"
                  :key="`table-row-${index}`"
                  class="text-left fs-15 font-weight-light"
                >
                  <div v-if="header.value === 'ticket'">
                    <bbva-web-link
                      v-if="expandedRows(item.typeId).length"
                      class="primary fw-500"
                      @click="() => openRow(item.id)"
                    >
                      {{ item.ticket }}
                    </bbva-web-link>
                    <span v-else class="fs-15 fw-500">
                      {{ item.ticket }}
                    </span>
                  </div>
                  <span
                    v-else
                    :style="
                      header.value === 'classificationD1'
                        ? `color: ${item.clasificationDColor}`
                        : ''
                    "
                  >
                    {{ getRowValue(header.value, item[header.value]) }}
                  </span>
                </td>
                <td
                  v-if="!item.hidden"
                  :style="openedRows.includes(item.id) ? 'border-bottom: unset;' : ''"
                >
                  <div :class="small ? 'd-flex' : ''">
                    <bbva-web-table-body-action
                      class="icon-button"
                      @click="() => onWatch(item.id, item.typeId)"
                      icon="bbva:show"
                      size="s"
                    ></bbva-web-table-body-action>
                    <tooltip-impact-ticket
                      v-if="small"
                      :id="item.id"
                      :onEdit="onEdit"
                      :onDelete="onDelete"
                      :typeId="item.typeId"
                    />
                    <bbva-web-table-body-action
                      v-if="!small"
                      class="icon-button"
                      :disabled="noEdit.includes(item.typeId)"
                      @click="() => onEdit(item.id)"
                      icon="bbva:edit"
                      size="s"
                    ></bbva-web-table-body-action>
                    <bbva-web-table-body-action
                      v-if="!small"
                      :disabled="noDelete.includes(item.typeId)"
                      class="icon-button"
                      @click="() => onDelete(item.id)"
                      icon="bbva:trash"
                      size="s"
                    ></bbva-web-table-body-action>
                  </div>
                </td>
              </template>
            </tr>
          </tbody>
          <tfoot align="center">
            <tr>
              <td colspan="9">
                <bbva-web-table-footer
                  v-if="showMore"
                  @click="loadMore"
                  class="load-more"
                  :loading="loading"
                  loading-text="Cargando"
                  >Ver más</bbva-web-table-footer
                >
                <span v-if="items.length && !showMore" :class="second - column"
                  >no hay más registros por mostrar</span
                >
              </td>
            </tr>
          </tfoot>
        </v-table>
      </v-col>
    </v-row>
  </v-container>
  <impact-ticket-form :open="form.open" :close="closeForm" :data="form.data" :save="editTicket" />
  <information-modal
    :open="modal.open"
    :close="closeModal"
    :title="modal.title"
    :message="modal.message"
    :subMessage="modal.subMessage"
    :type="modal.type"
    :onAccept="deleteImpactTicket"
    :confirmation="modal.confirmation"
  />
</template>

<script>
// Components
import AppBar from '@/components/AppBar/AppBar.vue'
import '@/components/bbva-web-components/bbva-web-link.js'
import '@/components/bbva-web-components/bbva-web-table-header.js'
import '@/components/bbva-web-components/bbva-web-table-body.js'
import FilterImpactTicket from '@/components/table/FilterImpactTicket.vue'
import TooltipImpactTicket from '@/components/tooltips/TooltipImpactTicket.vue'
import '@/components/bbva-web-components/bbva-web-table-footer.js'
import InformationModal from '@/components/modals/InformationModal.vue'
import ImpactTicketForm from '@/components/forms/ImpactTicketForm.vue'
// Requests
import {
  getImpactTicketsAPI,
  getExcelImpactTicketsAPI,
  removeImpactTicketAPI,
  editImpactTicketAPI
} from '@/requests/impactTickets.js'
// utils
import { parseDataTable } from '@/utils/impactTickets.js'
// constants
import { ticketTypesRowsExpanded, ticketTypesIds } from '@/constants/impactTickets.js'

export default {
  data() {
    return {
      // It has the items of type of ticket to not be edit
      noEdit: [ticketTypesIds.BASELINE, ticketTypesIds.SET1_REQUIREMENT],
      // It has the items of type of ticket to not be edit
      noDelete: [ticketTypesIds.BASELINE],
      /* Flag, true if the windonw's size is too small */
      small: false,
      /* Attributes to be sorted the table */
      sort: {
        orderBy: 'starTimeString',
        order: 'ASC'
      },
      /*  Available columns to be sorted the table */
      columnsSort: ['starTimeString', 'type', 'classificationD1', 'incidentByChange'],
      /* Object with data used by the modal component */
      modal: {
        data: null,
        open: false,
        title: '',
        message: '',
        subMessage: '',
        type: '',
        confirmation: false
      },
      /* Data of the item to be edited */
      form: {
        data: {},
        open: false
      },
      /* Ticket's types */
      ticketTypesIds,
      /* Rows that are opened */
      openedRows: [],
      /* Table's pagination */
      page: { number: 1, size: 20 },
      /* Table's headers */
      headers: [
        { title: 'N° de folio', value: 'ticket' },
        { title: 'Fecha de incio', value: 'starTimeString' },
        { title: 'Tipo', value: 'typeDesc' },
        { title: 'Business Unit', value: 'bu' },
        { title: 'Descripción', value: 'description' },
        { title: 'Criticidad', value: 'criticality' },
        { title: 'Clasific. D+1', value: 'classificationD1' },
        { title: 'Inc. por cambio', value: 'incidentByChange' }
      ],
      /* Table's items */
      items: [],
      /* If it can show more items */
      showMore: false,
      /* Table's filters */
      filters: []
    }
  },
  components: {
    AppBar,
    ImpactTicketForm,
    InformationModal,
    FilterImpactTicket,
    TooltipImpactTicket
  },
  beforeMount() {
    this.setFilters()
    if (this.filters.length) {
      this.search(1, this.page.size, this.filters)
    }

    this.onResize()
  },
  mounted() {
    window.addEventListener('resize', this.onResize)
  },
  methods: {
    /*
     * This method sets the initial filters
     */
    setFilters() {
      if (!this.$route.query.back) {
        localStorage.clear()
        return
      }
      const storage = localStorage.getItem('impact-tickets')
      const storageFilters = storage ? JSON.parse(storage) : {}
      if (Object.keys(storageFilters).length === 0) {
        return
      }

      this.filters = storageFilters.values
    },
    /*
     * Set into local storage the parameters for the filters
     */
    setStorageFilters(filters) {
      localStorage.setItem(
        'impact-tickets',
        JSON.stringify({
          values: filters
        })
      )
    },
    /*
     * This method returns the value to be printed into the column
     * @param {String} field  Field's name
     * @param {Object} item   Item with the value
     */
    getRowValue(field, itemValue) {
      if ([undefined, null].includes(itemValue)) {
        return 'N/A';
      }

      if (field === 'incidentByChange') {
        switch (itemValue) {
          case null:
            return 'N/A';
          case 0:
            return 'No';
          case 1:
            return 'Si';
          default:
            return itemValue;
        }
      }
      return itemValue;
    },
    /*
     * It sets the flag when the window's width is too small
     */
    onResize() {
      const width = window.innerWidth
      this.small = width <= 1400
    },
    /*
     * It sort the table by any header
     * @param {String} header Header's name
     */
    sortTable(header) {
      const tag = document.querySelector(`#${header}`)
      if (this.sort.order === 'ASC') {
        tag.removeAttribute('sort-ascending')
        tag.setAttribute('sort-descending', true)
      } else {
        tag.removeAttribute('sort-descending')
        tag.setAttribute('sort-ascending', true)
      }
      this.sort = {
        orderBy: header,
        order: this.sort.order === 'ASC' ? 'DESC' : 'ASC'
      }
      this.search(1, this.page.size, this.filters)
    },
    /*
     * It updates the item
     * @param {Object}   values             Item's values
     * @param {Number}   typeId             Ticket's type id
     * @param {String}   ticket              Ticket's number
     * @param {Boolean}  incidentByChange   Flag
     */
    editTicket(values) {
      this.emitter.emit('load', { loading: true })
      editImpactTicketAPI(values)
        .then(() => {
          this.form = {
            data: {},
            open: false
          }
          this.modal = {
            open: true,
            type: 'success',
            title: ' Folio con impacto editado',
            confirmation: false,
            message: 'Has editado el folio con impacto correctamente'
          }
          this.search(1, this.page.size, this.filters)
        })
        .catch((error) => {
          this.form = {
            data: {},
            open: false
          }
          this.emitter.emit('error', { action: 'editar folio', error })
        })
        .finally(() => {
          this.emitter.emit('load', { loading: false })
        })
    },
    /*
     * It closes the form modal
     */
    closeForm() {
      this.form = {
        data: {},
        open: false
      }
    },
    /*
     * It closes the informational modal
     */
    closeModal() {
      this.modal = {
        data: null,
        open: false,
        title: '',
        message: '',
        type: '',
        confirmation: false
      }
    },
    /*
     * It opens the modal to edit an item
     * @param {Number} id Item's id
     */
    onEdit(id) {
      const data = this.items.find((item) => item.id === id)
      this.form = {
        data,
        open: true
      }
    },
    /*
     * It opens the modal to delete an item
     * @param {Number} id Item's id
     */
    onDelete(id) {
      const data = this.items.find((item) => item.id === id)
      this.modal = {
        open: true,
        title: 'Eliminar folio',
        data: data || {},
        type: 'caution',
        confirmation: true,
        message: '¿Seguro que quieres eliminar este folio?',
        subMessage: `N° de folio: ${data.ticket}, Business Unit: ${data.bu}`
      }
    },
    /*
     * It deletes an item
     */
    deleteImpactTicket() {
      this.emitter.emit('load', { loading: true })
      removeImpactTicketAPI(this.modal.data.id)
        .then(() => {
          this.closeModal()
          this.modal = {
            open: true,
            type: 'success',
            title: ' Folio con impacto eliminado',
            confirmation: false,
            message: 'Has eliminado el folio con impacto correctamente'
          }
          this.search(1, this.page.size, this.filters)
        })
        .catch((error) => {
          this.closeModal()
          this.emitter.emit('error', { action: 'eliminar folio', error })
        })
        .finally(() => {
          this.emitter.emit('load', { loading: false })
        })
    },
    /*
     *
     */
    documentUrl(url) {
      window.open(url, '_blank')
    },
    /*
     * It deletes the expanded rows
     * @param {Number} typeId Ticket'd type
     */
    expandedRows(typeId) {
      if (!typeId) {
        return []
      }
      const key = Object.keys(ticketTypesIds).find((item) => ticketTypesIds[item] === typeId)
      return ticketTypesRowsExpanded[key]
    },
    /*
     * This method open the row by item's id
     * @param {Number} id Item's id
     */
    openRow(id) {
      if (this.openedRows.includes(id)) {
        this.openedRows = this.openedRows.filter((item) => item !== id)
      } else {
        this.openedRows.push(id)
      }
    },
    /*
     * Load more data for the table
     */
    loadMore() {
      this.search(this.page.number + 1, this.page.size, this.filters)
    },
    /*
     * It pre filter the filter's value before to execute the function search
     */
    searchFilter(values) {
      if (values.length === 0) {
        this.items = []
        this.filters = []
        this.showMore = false
        this.openedRows = []
        this.page = { number: 1, size: 20 }
        return
      }
      this.search(1, this.page.size, values)
    },
    /*
     * It searches the data to show into the table
     * @param {Number} pageNumber  Page's number
     * @param {Number} pageSize    Page's size
     * @param {Object[]}  filters           Filter to send into the request
     * @param {String}    filters[].name    Name of the filter
     * @param {String}    filters[].value   Value of the filter, the type can be different
     */
    search(pageNumber = 1, pageSize = 20, filters = []) {
      this.setStorageFilters(filters)
      this.emitter.emit('load', { loading: true })

      getImpactTicketsAPI(pageNumber, pageSize, [
        ...filters,
        { name: 'order', value: this.sort.order },
        { name: 'orderBy', value: this.sort.orderBy }
      ])
        .then((response) => {
          if (pageNumber === 1) {
            this.items = [...parseDataTable(response.data.items)]
          } else {
            this.items = [...this.items, ...parseDataTable(response.data.items)]
          }
          this.showMore = response.data.count > this.items.filter((item) => !item.hidden).length
          this.page.number = pageNumber
          this.page.size = pageSize
        })
        .catch((error) => {
          this.emitter.emit('error', { action: 'cargar tabla', error })
        })
        .finally(() => {
          this.filters = filters
          this.emitter.emit('load', { loading: false })
        })
    },
    /*
     * It downloads the excel file
     */
    download() {
      this.emitter.emit('load', { loading: true })
      getExcelImpactTicketsAPI(this.filters)
        .then((response) => {
          const blob = new Blob([response.data], { type: 'application/vnd.ms-excel' })
          const link = document.createElement('a')
          link.href = URL.createObjectURL(blob)
          link.download = 'folio_de_impacto.xlsx'
          link.click()
          URL.revokeObjectURL(link.href)
          this.emitter.emit('load', { loading: false })
        })
        .catch((error) => {
          this.emitter.emit('load', { loading: false })
          this.emitter.emit('error', { action: 'descargar folios de impacto', error })
        })
    },
    /*
     * It redirects to second level of impact tickets
     */
    onWatch(id, typeId) {
      this.$router.push(`/impact-tickets/cfs?ticketId=${id}&typeId=${typeId}`)
    }
  }
}
</script>
<style>
.load-more {
  font-size: 15px;
  font-weight: 500;
}
.second-column {
  color: #666666;
  font-size: 12px;
  font-weight: 350 !important;
}
.icon-button {
  width: 40px;
  color: #1464a5;
}
</style>
