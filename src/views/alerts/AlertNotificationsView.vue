<template>
  <div>
    <app-bar />
    <div class="pt-8">
      <simple-section-header
        :hideBackButton="true"
        :icon="icon"
        :subtitle="subtitle"
        :title="title"
      />
    </div>
    <v-container fluid class="px-12">
      <!-- Search Filter -->
      <v-row>
        <v-col cols="12" class="pb-0 pt-0">
          <filter-alert-notifications :search="searchFilter" />
        </v-col>
      </v-row>
      <!-- No results message -->
      <v-row v-if="!tableData.length">
        <v-col>
          <no-data-message
            title="Información de la tabla"
            :message="
              filters?.length
                ? 'No hay datos para los filtros seleccionados'
                : 'No hay datos que mostrar en la tabla'
            "
          />
        </v-col>
      </v-row>
      <!-- View's table -->
      <v-row v-else>
        <v-col>
          <v-table>
            <thead>
              <tr>
                <th class="text-left fs-12 font-weight-light">
                  <bbva-web-table-header-text
                    id="bu"
                    order=""
                    :sort-active="orderBy === 'bu'"
                    @sort-criteria="(evt) => sortTable('bu')"
                  >
                    BU / CFS
                  </bbva-web-table-header-text>
                </th>
                <th class="text-left fs-12 font-weight-light">
                  <bbva-web-table-header-text> OPERATIVA </bbva-web-table-header-text>
                </th>
                <th class="text-left fs-12 font-weight-light">
                  <bbva-web-table-header-text
                    id="notificationDate"
                    order=""
                    :sort-active="orderBy === 'notificationDate'"
                    @sort-criteria="(evt) => sortTable('notificationDate')"
                  >
                    Fecha de notificación
                  </bbva-web-table-header-text>
                </th>
                <th class="text-left fs-12 font-weight-light">
                  <bbva-web-table-header-text
                    id="alertElement"
                    order=""
                    :sort-active="orderBy === 'alertElement'"
                    @sort-criteria="(evt) => sortTable('alertElement')"
                  >
                    ELEMENTO A ALERTAR
                  </bbva-web-table-header-text>
                </th>
                <th class="text-left fs-12 font-weight-light">
                  <bbva-web-table-header-text> NOMBRE DE LA ALERTA </bbva-web-table-header-text>
                </th>
                <th class="text-left fs-12 font-weight-light">
                  <bbva-web-table-header-text
                    id="startTime"
                    order=""
                    :sort-active="orderBy === 'startTime'"
                    @sort-criteria="(evt) => sortTable('startTime')"
                  >
                    HORA INICIO
                  </bbva-web-table-header-text>
                </th>
                <th class="text-left fs-12 font-weight-light">
                  <bbva-web-table-header-text> HORA FIN </bbva-web-table-header-text>
                </th>
                <th style="min-width: 160px" class="text-left fs-12 font-weight-light"></th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(item, index) in tableData"
                :key="`row-alert-notifications-table-${index}`"
              >
                <td class="border-gray fs-14">
                  {{ item.bu }}
                  <span class="cfs-name-alert-notifications">
                    {{ item.cfs }}
                  </span>
                </td>
                <td class="border-gray fs-14">{{ item.operative || '-' }}</td>
                <td class="border-gray fs-14">{{ item.notificationDate || '-' }}</td>
                <td class="border-gray fs-14">{{ item.elementToAlert || '-' }}</td>
                <td class="border-gray fs-14">{{ item.name || '-' }}</td>
                <td class="border-gray fs-14">{{ item.startTime || '-' }}</td>
                <td class="border-gray fs-14">{{ item.endTime || '-' }}</td>
                <td class="border-gray fs-14">
                  <div class="d-flex">
                    <bbva-web-table-body-action
                      class="icon-button"
                      :disabled="isEyeButtonDisabled(item)"
                      @click="() => navigateToServiceLevelsAndSetAttended(item.id)"
                      icon="bbva:show"
                      size="s"
                    />
                    <bbva-web-table-body-action
                      class="icon-button"
                      @click="() => onSetAlertAsAttended(item.id, true)"
                      icon="bbva:law"
                      size="s"
                    />
                    <bbva-web-table-body-action
                      class="icon-button"
                      @click="() => seeAlert(item)"
                      icon="bbva:camera"
                      size="s"
                    />
                  </div>
                </td>
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
                  >
                    Ver más
                  </bbva-web-table-footer>
                  <span v-if="tableData.length && !showMore" :class="second - column">
                    No hay más registros por mostrar
                  </span>
                </td>
              </tr>
            </tfoot>
          </v-table>
        </v-col>
      </v-row>
      <information-modal
        :close="closeModal"
        :confirmation="modal.confirmation"
        :forceOnAccept="true"
        :message="modal.message"
        :onAccept="reloadTable"
        :open="modal.open"
        :title="modal.title"
        :type="modal.type"
      />
      <AlertDetailListModal
        :data="modalDetailsList.data"
        :isOpen="modalDetailsList.open"
        :message="modalDetailsList.message"
        :onClose="closemodalDetailsList"
        :onContinue="closemodalDetailsList"
        :title="modalDetailsList.title"
      />
    </v-container>
  </div>
</template>

<script>
// Components
import '@/components/bbva-web-components/bbva-web-table-header.js'
import '@/components/bbva-web-components/bbva-web-table-body.js'
import '@/components/bbva-web-components/bbva-web-table-footer.js'
import AppBar from '@/components/AppBar/AppBar.vue'
import AlertDetailListModal from '@/components/modals/AlertDetailListModal.vue'
import InformationModal from '@/components/modals/InformationModal.vue'
import FilterAlertNotifications from '@/components/table/FilterAlertNotifications.vue'
import NoDataMessage from '@/components/utils/NoDataMessage.vue'
import SimpleSectionHeader from '@/components/headers/SimpleSectionHeader.vue'
// Constants
import { pagination } from '@/constants/pagination'
// Requests
import {
  getAlertNotificationsListAPI,
  setAlertAsAttended,
  downloadNotificactionAPI
} from '@/requests/alerts'
// Utils
import { createQueryParams } from '@/utils/general'

export default {
  name: 'AlertNotificationsView',
  components: {
    AppBar,
    AlertDetailListModal,
    FilterAlertNotifications,
    InformationModal,
    SimpleSectionHeader,
    NoDataMessage
  },
  data() {
    return {
      // Constants
      title: 'Consulta de notificación de alertas',
      icon: '/icons/flag-dark-blue.svg',
      // Table's Filter
      filters: [],
      // Object with data used by the modal component
      modal: {
        data: null,
        open: false,
        title: 'Alerta atendida',
        message: 'Has atendido correctamente la alerta',
        type: 'success',
        confirmation: false
      },
      // Object with data used by the modal component with details on the alert being reviewed
      modalDetailsList: {
        data: null,
        list: [],
        message: '',
        open: false,
        title: ''
      },
      // Key to sort elements ascending or descending
      order: 'DESC',
      // Identifier of what colum the table is ordered by
      orderBy: 'bu',
      page: { ...pagination },
      // Show more results flag
      showMore: false,
      // Table's data
      tableData: [],
      // Total of table's items
      totalItems: 0
    }
  },
  methods: {
    seeAlert(item) {
      if (parseInt(item.elementToAlertId) !== 13) {
        this.openModalDetailsList(item)
      } else {
        this.downloadNotification(item.id)
      }
    },
    downloadNotification(id) {
      this.emitter.emit('load', { loading: true })
      downloadNotificactionAPI(id)
        .then((response) => {
          const blob = new Blob([response.data], { type: 'application/vnd.ms-excel' })
          const link = document.createElement('a')
          link.href = URL.createObjectURL(blob)
          link.download = 'Descarga Folios(Agata).xlsx'
          link.click()
          URL.revokeObjectURL(link.href)
          this.emitter.emit('load', { loading: false })
        })
        .catch((error) => {
          this.emitter.emit('load', { loading: false })
          this.emitter.emit('error', { action: 'descargar archivo', error })
        })
    },
    /*
     * Closes the informational modal
     */
    closeModal() {
      this.modal.open = false
    },
    /*
     * Closes the informational modal
     */
    closemodalDetailsList() {
      this.modalDetailsList.open = false
      // set timeout to avoid visible flickering in the modal content
      setTimeout(() => {
        this.modalDetailsList.list = []
      }, 150)
    },
    isEyeButtonDisabled(item) {
      return !(
        item.executionPeriodId === 1 &&
        (item.elementToAlertId === '1' ||
          item.elementToAlertId === '2' ||
          item.elementToAlertId === '4' ||
          item.elementToAlertId === '5')
      )
    },
    /*
     * Load more data for the table
     */
    loadMore() {
      this.search(this.page.number + 1, this.page.size, this.filters)
    },
    /*
     * Opens the informational modal
     */
    openModal() {
      this.modal.open = true
    },
    /*
     * Opens the informational modal
     */
    openModalDetailsList(item) {
      this.modalDetailsList = {
        data: { ...item },
        open: true,
        title: item.name
      }
    },
    onSetAlertAsAttended(alertId, openModal) {
      if (openModal) this.emitter.emit('load', { loading: true })
      setAlertAsAttended(alertId)
        .then(() => {
          if (openModal) this.openModal()
        })
        .catch((error) => {
          this.emitter.emit('error', { action: `marcar atendida alerta: ${alertId} `, error })
        })
        .finally(() => {
          this.emitter.emit('refreshNotifications')
          if (openModal) this.emitter.emit('load', { loading: false })
        })
    },
    /*
     * Sets an alert as attended and navigates to the corresponding view
     * @param {Number} id Alert id
     */
    navigateToServiceLevelsAndSetAttended(id) {
      const alert = this.tableData.find((item) => item.id === id)
      const query = [
        { name: 'buId', value: alert.buId },
        { name: 'cfsId', value: alert.modelId },
        { name: 'cbpId', value: alert.cbpId },
        { name: 'operativeId', value: alert.operativeId },
        { name: 'date', value: alert.notificationDate }
      ]
      const routerData = this.$router.resolve({ name: 'service-levels-cfs-detail-impact' })
      window.open(routerData.href + '?' + createQueryParams(query), '_blank')
      this.onSetAlertAsAttended(id, true)
    },
    reloadTable() {
      this.search(1, 20, this.filters)
    },
    /*
     * It gets the data to be showed by the table
     * @param {Number} pageNumber Page's number
     * @param {Number} pageSize Page's size
     */
    search(pageNumber, pageSize, values) {
      this.emitter.emit('load', { loading: true })
      getAlertNotificationsListAPI(pageNumber, pageSize, [
        { name: 'order', value: this.order },
        { name: 'orderBy', value: this.orderBy },
        ...this.filters
      ])
        .then((response) => {
          if (pageNumber === 1) {
            this.tableData = response.data.items
          } else {
            this.tableData = [...this.tableData, ...response.data.items]
          }
          this.page.number = pageNumber
          this.page.size = pageSize
          this.TotalItems = response.data.count
          this.showMore = response.data.count > this.tableData.length
          this.emitter.emit('load', { loading: false })
        })
        .catch((error) => {
          this.emitter.emit('load', { loading: false })
          this.emitter.emit('error', { action: 'cargar tabla', error })
        })
    },
    /*
     * It saves the filters, add the radio filters and executes the search
     */
    searchFilter(values) {
      this.filters = [...values]
      this.search(1, 20, [...values])
    },
    /*
     * Excecutes the api call to mark an alert as attended
     * @param {Number} id Alert ID
     * @param {Boolean} openModal Whether the promise should open a success
     * modal after resolving,
     */
    sortTable(header) {
      const tag = document.getElementById(header)
      if (this.order === 'ASC') {
        tag.removeAttribute('sort-ascending')
        tag.setAttribute('sort-descending', true)
      } else {
        tag.removeAttribute('sort-descending')
        tag.setAttribute('sort-ascending', true)
      }
      ;(this.orderBy = header), (this.order = this.order === 'ASC' ? 'DESC' : 'ASC')
      this.search(1, this.page.size)
    }
  },
  beforeMount() {
    this.search(1, 20, this.filters)
  }
}
</script>

<style scoped lang="scss">
.v-row + .v-row {
  margin-top: 0px !important;
}

.header-alert-notifications {
  border-bottom: thin solid rgba(var(--v-border-color), var(--v-border-opacity));
  background: white;
  color: #666;
}

.cfs-name-alert-notifications {
  font-size: 12px;
  color: #666;
  display: block;
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
