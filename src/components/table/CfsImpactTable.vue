<template>
  <v-table density="compact">
    <thead>
      <tr>
        <th
          v-for="header in seletedHeaders"
          :key="header.value"
          :id="`table-header-${header.value}`"
          class="text-left fs-12 font-weight-light"
          :class="{ 'min-width-460': (header.value === 'symptom') || (header.value === 'comments') }"
        >
          <bbva-web-table-header-text> {{ header.title }} </bbva-web-table-header-text>
        </th>
      </tr>
    </thead>
    <tbody v-if="bu.cfsItems.length > 0">
      <template v-for="(cfs, cfsIndex) in bu.cfsItems" :key="cfs.cfsId">
        <tr>
          <td 
            v-for="header in seletedHeaders" 
            :key="header.value" 
            :class="{ 'border-b-unset': cfs.open }">
            <!-- Header Name -->
            <bbva-web-table-body-text
              v-if="header.value === 'name' && selectedMoreData.length > 0"
              @click="openCfs(cfsIndex)"
              text-action
              grouped="true"
            >
              {{ cfs[header.value] }}
            </bbva-web-table-body-text>
            <!-- Header Contribution -->
            <bbva-web-table-body-text
              v-else-if="header.value === 'contributionD' && selectedModalShow.length > 0"
              @click="opneModal(cfsIndex)"
              text-action
              grouped="true"
            >
              {{ cfs[header.value] }}
            </bbva-web-table-body-text>
            <!-- Header dateTime -->
            <bbva-web-table-body-text 
              v-else-if="header.value === 'dateTime'"
              grouped="true"
            >
              <div class="d-flex flex-column ga-2">
                <span class="font-weight-light">
                  Inicio: {{ cfs.startDateString }} - {{ cfs.startTimeString }}
                </span>
                <span class="font-weight-light">
                  Fin: {{ cfs.endDateString }} - {{ cfs.endTimeString }}
                </span>
              </div>
            </bbva-web-table-body-text>
            <!-- Header clasificationD -->
            <bbva-web-table-body-text
              v-else-if="header.value === 'clasificationD'"
              :style="{ color: cfs.clasificationDColor }"
              grouped="true"
            >
              {{ cfs[header.value] }}
            </bbva-web-table-body-text>
            <!-- Header actions -->
            <div v-else-if="header.value === 'actions'" class="d-flex ga-2">
              <bbva-web-table-body-action
                :disabled="header?.disabledShow.includes(this.ticket.type)"
                @click="() => showItem(cfsIndex)"
                class="icon-button"
                icon="bbva:show"
                size="m"
              ></bbva-web-table-body-action>
              <bbva-web-table-body-action
                @click="() => openEditItem(cfsIndex)"
                class="icon-button"
                icon="bbva:edit"
                size="m"
              ></bbva-web-table-body-action>
              <bbva-web-table-body-action
                :disabled="header?.disabledDelete.includes(this.ticket.type)"
                @click="() => openDeleteItem(cfsIndex)"
                class="icon-button"
                icon="bbva:trash"
                size="m"
              ></bbva-web-table-body-action>
            </div>
            <!-- Other Headers -->
            <bbva-web-table-body-text
              v-else
              class="font-weight-light"
              :class="{ 'white-space-wrap': (header.value === 'symptom') || (header.value === 'comments') }"
              grouped="true"
            >
              {{ cfs[header.value] }}
            </bbva-web-table-body-text>
          </td>
        </tr>
        <tr v-if="cfs.open">
          <td :colspan="seletedHeaders.length">
            <div class="d-flex flex-column pa-4 ga-4">
              <span class="fs-15 fw-500"> Otros datos de interes </span>
              <div class="d-flex ga-6">
                <div v-for="moreData in selectedMoreData" :key="moreData.value" class="d-flex ga-2">
                  <img src="/icons/flag.svg" alt="Icono de listado" />
                  <span class="font-weight-light">
                    {{ moreData.title }}: {{ cfs[moreData.value] }}
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
        <td class="text-center fs-15 font-weight-light" :colspan="seletedHeaders.length">
          No hay registros
        </td>
      </tr>
    </tbody>
    <tfoot v-if="bu.cfsItems.length > 0">
      <tr>
        <td :colspan="seletedHeaders.length" class="fs-12 font-weight-light text-center gray">
          <span> No hay más registros por mostrar </span>
        </td>
      </tr>
    </tfoot>
  </v-table>
</template>

<script>
// Components
import '@/components/bbva-web-components/bbva-web-table-header.js'
import '@/components/bbva-web-components/bbva-web-table-body.js'

// Constants
import { cfsImpactHeaders, cfsImpactMoreDataHeaders } from '@/constants/impactTickets'

export default {
  name: 'CfsImpactTable',
  props: {
    /**
     * @typedef {Object} BuObject
     * @property {number} id - The ticket id.
     */
    /**
     * The bu object
     * @type {BuObject}
     * @required
     */
    bu: {
      type: Object,
      required: true
    },
    /**
     * The bu index
     * @type {number}
     * @required
     */
    buIndex: {
      type: Number,
      required: true
    },
    /**
     * @typedef {Object} TicketObject
     * @property {number} id - The ticket id.
     * @property {string} type - The ticket type.
     */
    /**
     * The ticket object
     * @type {TicketObject}
     * @required
     */
    ticket: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      headers: cfsImpactHeaders,
      moreDataHeaders: cfsImpactMoreDataHeaders
    }
  },
  computed: {
    /**
     * Returns an array of headers that should be shown based on the current ticket type.
     *
     * @return {Array} An array of headers.
     */
    seletedHeaders() {
      return this.headers.filter((header) => header.typesShow?.includes(this.ticket.type))
    },
    /**
     * Returns an array of extra data that should be shown based on the current ticket type.
     *
     * @return {Array} An array of extra data.
     */
    selectedMoreData() {
      return this.moreDataHeaders.filter((header) => header.typesShow?.includes(this.ticket.type))
    },
    /**
     * Returns an array of data that should be shown in a modal based on the current ticket type.
     *
     * @return {Array} An array of data.
     */
    selectedModalShow() {
      return this.headers.filter((header) => header.typesModalShow?.includes(this.ticket.type))
    }
  },
  methods: {
    /**
     * Emits the openCfs event.
     *
     * @return {void}
     */
    openCfs(cfsIndex) {
      this.$emit('open-cfs', { buIndex: this.buIndex, cfsIndex })
    },
    /**
     * Emits the openContribution event.
     *
     * @return {void}
     */
    opneModal(cfsIndex) {
      this.$emit('open-contribution', { buIndex: this.buIndex, cfsIndex })
    },
    /**
     * Emits the showCfs event.
     *
     * @return {void}
     */
    showCfs(cfsIndex) {
      this.$emit('show-cfs', { buIndex: this.buIndex, cfsIndex })
    },
    /**
     * Emits the showCfs event.
     *
     * @return {void}
     */
    showItem(cfsIndex) {
      this.$emit('show-cfs', { buIndex: this.buIndex, cfsIndex })
    },
    /**
     * Emits the openEditCfs event.
     *
     * @return {void}
     */
    openEditItem(cfsIndex) {
      this.$emit('open-edit-cfs', { buIndex: this.buIndex, cfsIndex })
    },
    /**
     * Emits the openDeleteCfs event.
     *
     * @return {void}
     */
    openDeleteItem(cfsIndex) {
      this.$emit('open-delete-cfs', { buIndex: this.buIndex, cfsIndex })
    }
  }
}
</script>

<style scoped>
.icon-button {
  width: 20px;
  color: #1464a5;
}
.icon-button:hover {
  color: #072146;
}
.min-width-460 {
  min-width: 400px !important;
}
.white-space-wrap {
  white-space: wrap !important;
}
.border-b-unset {
  border-bottom: unset !important;
}
</style>
