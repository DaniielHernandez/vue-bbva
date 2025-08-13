<template>
  <v-table density="compact">
    <thead>
      <tr>
        <th
          v-for="header in headers"
          :key="header.value"
          :id="`table-header-${header.value}`"
          class="text-left fs-12"
        >
          <bbva-web-table-header-text
            :order="header.order"
            :sort-active="header.value === filters.sortBy"
            :class="{
              'font-weight-light': header.value !== filters.sortBy,
              'min-width-200': header.value === 'cause' || header.value === 'rootCause'
            }"
            @sort-criteria="(ev) => sort(header.value, ev.detail.sortAscending, 'sortBy')"
          >
            {{ header.title }}
          </bbva-web-table-header-text>
        </th>
        <th
          v-for="header in tableCfsHeaders"
          :key="header.value"
          :id="`table-header-${header.value}`"
          class="text-left fs-12"
        >
          <bbva-web-table-header-text
            :order="header.order"
            :sort-active="header.value === filters.sortByCfsId"
            :class="{
              'font-weight-light': header.value !== filters.sortByCfsId
            }"
            @sort-criteria="(ev) => sort(header.value, ev.detail.sortAscending, 'sortByCfsId')"
          >
            {{ header.title }}
          </bbva-web-table-header-text>
        </th>
      </tr>
    </thead>
    <tbody v-if="events.length > 0">
      <template v-for="(event, eventIndex) in events" :key="eventIndex">
        <tr>
          <template v-for="header in headers" :key="header.value">
            <td
              :style="{
                'background-color': header.value === 'total' ? event.totalBackgroundColor : 'none'
              }"
              :class="{ 'border-b-unset': event.open }"
            >
              <!-- Header Ticket -->
              <bbva-web-table-body-text
                v-if="header.value === 'ticket'"
                @click="openEvent(eventIndex)"
                text-action
                grouped="true"
              >
                {{ event[header.value] }}
              </bbva-web-table-body-text>
              <!-- Header Criticidad -->
              <bbva-web-table-body-text
                v-else-if="header.value === 'criticality'"
                :style="{ color: event.criticalityColor }"
                grouped="true"
              >
                {{ event[header.value] }}
              </bbva-web-table-body-text>
              <!-- Header Total -->
              <bbva-web-table-body-text 
                v-else-if="header.value === 'total'" 
                class="fs-15 fw-500"
                grouped="true"
              >
                {{ event[header.value] }}
              </bbva-web-table-body-text>
              <!-- Other Headers -->
              <bbva-web-table-body-text
                v-else
                class="font-weight-light"
                :class="{
                  'white-space-wrap': header.value === 'cause' || header.value === 'rootCause'
                }"
                grouped="true"
              >
                {{ event[header.value] }}
              </bbva-web-table-body-text>
            </td>
          </template>

          <td
            v-for="header in tableCfsHeaders"
            :key="header.value"
            :style="{ 'background-color': selectedCfs(event, header.value)?.totalBackgroundColor }"
            :class="{ 'border-b-unset': event.open }"
          >
            <bbva-web-table-body-text
              class="font-weight-light"
              grouped="true"
            >
              {{ selectedCfs(event, header.value)?.total }}
            </bbva-web-table-body-text>
          </td>
        </tr>
        <tr v-if="event.open">
          <td :colspan="colspan">
            <div class="d-flex flex-column pa-4 ga-4">
              <span class="fs-15 fw-500"> Otros datos de interes </span>
              <div class="d-flex flex-wrap ga-6">
                <div v-for="moreData in moreDataHeaders" :key="moreData.value" class="d-flex ga-2">
                  <img src="/icons/flag.svg" alt="Icono de listado" width="16" />
                  <span class="font-weight-light">
                    {{ moreData.title }}: {{ event[moreData.value] }}
                  </span>
                </div>
              </div>
            </div>
          </td>
        </tr>
      </template>
    </tbody>
    <tbody v-else>
      <tr>
        <td class="text-center fs-15 font-weight-light" :colspan="colspan">No hay registros</td>
      </tr>
    </tbody>
  </v-table>
</template>

<script>
// Components
import '@/components/bbva-web-components/bbva-form-input.js'
import '@/components/bbva-web-components/bbva-web-table-body.js'
import '@/components/bbva-web-components/bbva-web-table-header.js'
import '@/components/bbva-web-components/bbva-web-table-footer.js'

// Constants
const headers = [
  { title: 'FOLIO', value: 'ticket', order: true },
  { title: 'FECHA', value: 'date', order: true },
  { title: 'TIPO DE FOLIO', value: 'ticketType', order: true },
  { title: 'CAUSA', value: 'cause', order: true },
  { title: 'CAUSA RAIZ', value: 'rootCause', order: false },
  { title: 'CRITICIDAD', value: 'criticality', order: true },
  { title: 'TOTAL', value: 'total', order: true }
]

const moreDataHeaders = [
  { title: 'Incidente por cambio', value: 'changeIncident', order: true },
  { title: 'Origen', value: 'origin', order: true },
  { title: 'Taxonomía', value: 'taxonomy', order: true },
  { title: 'Descripción', value: 'description', order: true },
  { title: 'Tipología', value: 'typology', order: true }
]

export default {
  name: 'EventMapTable',
  props: {
    events: {
      type: Array,
      default: () => []
    }
  },

  data() {
    return {
      // Constants
      headers,
      moreDataHeaders,

      // Variables
      filters: {
        sort: null,
        sortBy: null,
        sortByCfsId: null
      }
    }
  },
  computed: {
    /**
     * Returns an array of headers for the CFS items in the events prop.
     *
     * @return {Array} An array of objects containing the title, value, and order of each CFS item.
     * If the events prop is empty or the first event does not have any CFS items, an empty array is returned.
     */
    tableCfsHeaders() {
      const cfsHeaders = this.events[0]?.cfsItems

      if (cfsHeaders) {
        return cfsHeaders
          .filter((cfs) => cfs.id)
          .map((cfs) => ({ title: cfs.name, value: cfs.id, order: true }))
      }
      return []
    },
    /**
     * Calculates the total number of columns in the table by adding the length of the headers array
     * and the length of the tableCfsHeaders array.
     *
     * @return {number} The total number of columns in the table.
     */
    colspan() {
      return headers.length + this.tableCfsHeaders.length
    }
  },
  methods: {
    /**
     * Emits an 'open-event' event with the given eventIndex.
     *
     * @param {number} eventIndex - The index of the event to be opened.
     * @return {void}
     */
    openEvent(eventIndex) {
      this.$emit('open-event', eventIndex)
    },
    /**
     * Returns the selected CFS item from the event's CFS items array based on the provided CFS header.
     *
     * @param {Object} event - The event object containing the CFS items array.
     * @param {string} cfsHeader - The CFS header to search for in the CFS items array.
     * @return {Object|null} The selected CFS item if found, otherwise null.
     */
    selectedCfs(event, cfsHeader) {
      if (event) {
        return event.cfsItems.find((cfs) => cfs.id === cfsHeader)
      }
      return null
    },
    /**
     * Sorts the data based on the given header and sort order.
     *
     * @param {string} header - The header to sort by.
     * @param {boolean} sortAscending - Whether to sort in ascending order.
     * @param {string} type - The type of sorting to perform ('sortByCfsId' or 'sortBy').
     * @return {void} This function does not return anything.
     */
    sort(header, sortAscending, type) {
      if (type === 'sortByCfsId') {
        this.filters.sortByCfsId = header
        this.filters.sortBy = null
      } else if (type === 'sortBy') {
        this.filters.sortBy = header
        this.filters.sortByCfsId = null
      }
      this.filters.sort = sortAscending ? 'asc' : 'desc'
      this.$emit('sort', this.filters)
    }
  }
}
</script>

<style scoped>
.min-width-200 {
  min-width: 200px !important;
}
.white-space-wrap {
  white-space: wrap !important;
}
.border-b-unset {
  border-bottom: unset !important;
}
</style>
