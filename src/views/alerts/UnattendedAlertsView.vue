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
          <filter-alert-notifications :search="searchFilter" variant="unattendedAlerts" />
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
                <th class="text-left fs-12 font-weight-light">
                  <bbva-web-table-header-text
                    id="author"
                    order=""
                    :sort-active="orderBy === 'author'"
                    @sort-criteria="(evt) => sortTable('author')"
                  >
                    AUTOR
                  </bbva-web-table-header-text>
                </th>
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
                <td class="border-gray fs-14">{{ item.author || '-' }}</td>
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
    </v-container>
  </div>
</template>

<script>
// Components
import '@/components/bbva-web-components/bbva-web-table-header.js'
import '@/components/bbva-web-components/bbva-web-table-body.js'
import '@/components/bbva-web-components/bbva-web-table-footer.js'
import AppBar from '@/components/AppBar/AppBar.vue'
import FilterAlertNotifications from '@/components/table/FilterAlertNotifications.vue'
import NoDataMessage from '@/components/utils/NoDataMessage.vue'
import SimpleSectionHeader from '@/components/headers/SimpleSectionHeader.vue'
// Constants
import { pagination } from '@/constants/pagination'
// Requests
import { getUnattendedAlertNotificationsListAPI } from '@/requests/alerts'
// Utils
import { createQueryParams } from '@/utils/general'

export default {
  name: 'TaxpayerTrend',
  components: {
    AppBar,
    FilterAlertNotifications,
    NoDataMessage,
    SimpleSectionHeader
  },
  data() {
    return {
      // Constants
      title: 'Consulta de Alertas no atendidas',
      icon: '/icons/response-times.svg',
      // Table's Filter
      filters: [],
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
    /*
     * Load more data for the table
     */
    loadMore() {
      this.search(this.page.number + 1, this.page.size, this.filters)
    },
    /**
     * Reloads the table to what the filters mark
     */
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
      // This API is not intented to be here.
      getUnattendedAlertNotificationsListAPI(pageNumber, pageSize, [
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
