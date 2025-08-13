<template>
  <v-card :title="title" class="pa-4 overflow-auto">
    <v-card-text>
      <div class="d-flex flex-row flex-wrap gc-6 gr-3 mb-4">
        <div class="d-flex ga-2">
          <img src="/icons/flag.svg" alt="Icono de listado" width="16" />
          <bb class="font-weight-light">Business Unit: {{ bu?.name }}</bb>
        </div>
        <div class="d-flex ga-2">
          <img src="/icons/flag.svg" alt="Icono de listado" width="16" />
          <span class="font-weight-light"> Folio: {{ ticket?.name }}</span>
        </div>
        <div v-for="data in dataHeaders" :key="data.value" class="d-flex ga-2">
          <img src="/icons/flag.svg" alt="Icono de listado" width="16" />
          <span v-if="data.value === 'dateTimeStart'" class="font-weight-light">
            {{ data.title }}: {{ cfs.startDateString }} - {{ cfs.startTimeString }}
          </span>
          <span v-else-if="data.value === 'dateTimeEnd'" class="font-weight-light">
            {{ data.title }}: {{ cfs.endDateString }} - {{ cfs.endTimeString }}
          </span>
          <span v-else class="font-weight-light"> {{ data.title }}: {{ cfs[data.value] }} </span>
        </div>
      </div>
      <v-table density="compact">
        <thead>
          <tr>
            <th
              v-for="header in headers"
              :key="header.value"
              :id="`table-header-${header.value}`"
              class="text-left fs-12 font-weight-light"
            >
              <bbva-web-table-header-text> {{ header.title }} </bbva-web-table-header-text>
            </th>
          </tr>
        </thead>
        <tbody v-if="contributionItems.length > 0">
          <tr v-for="(operative, index) in contributionItems" :key="`operative-${index}`">
            <td v-for="header in headers" :key="header.value" class="no-border-bottom">
              <bbva-web-table-body-text class="font-weight-light" grouped="true">
                {{ operative[header.value] }}
              </bbva-web-table-body-text>
            </td>
          </tr>
        </tbody>
        <tbody v-else-if="contributionItems.length === 0">
          <tr>
            <td class="text-center fs-15 font-weight-light" :colspan="headers.length">
              <span v-if="firstLoad">No hay registros</span>
              <span v-else>Cargando...</span>
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card-text>
    <v-card-actions class="d-flex ga-4">
      <bbva-button-default text="Cerrar" @click="closeDialog"> </bbva-button-default>
    </v-card-actions>
  </v-card>
</template>

<script>
// Components
import '@/components/bbva-web-components/bbva-web-table-header.js'
import '@/components/bbva-web-components/bbva-web-table-body.js'

// Constants
import { contributionDataHeaders, contributionHeaders } from '@/constants/impactTickets'

// Requests
import { getContributionCfsImpact } from '@/requests/impactTickets'

export default {
  name: 'ContributionCfsImpactTable',
  props: {
    /**
     * @typedef {Object} TicketObject
     * @property {number} id - The ticket id.
     */
    /**
     * The ticket object
     * @type {TicketObject}
     * @required
     */
    ticket: {
      type: Object,
      required: true
    },
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
     * @typedef {Object} CfsObject
     * @property {number} cfsId - The cfs id.
     */
    /**
     * The cfs object
     * @type {CfsObject}
     * @required
     */
    cfs: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      // Constants
      title: 'Validación contribución D+1 ',
      dataHeaders: contributionDataHeaders,
      headers: contributionHeaders,

      // Variables
      firstLoad: false,
      contributionItems: []
    }
  },
  methods: {
    /**
     * Emits the close event.
     *
     * @return {void}
     */
    closeDialog() {
      this.$emit('close')
    }
  },
  /**
   * Mounts the component and initializes the contributionItems.
   *
   * @return {void}
   */
  async mounted() {
    try {
      const { data: responseContribution } = await getContributionCfsImpact({
        ticketId: this.ticket.id,
        cfsId: this.cfs.cfsId
      })
      this.contributionItems = responseContribution || []
    } finally {
      this.firstLoad = true
    }
  }
}
</script>

<style lang="scss" scoped>
.overflow-auto {
  overflow: auto;
}
.no-border-bottom {
  border-bottom: none !important;
}
</style>
