<template>
  <app-bar />
  <v-container fluid class="px-12 pt-6">
    <v-row dense align="center">
      <v-col cols="auto">
        <img :src="icon" alt="Operativas asociadas" width="40" height="40" />
      </v-col>
      <v-col cols="auto">
        <span class="fs-18 fw-500">{{ title }}</span>
      </v-col>
      <v-col cols="auto">
        <bbva-web-link class="primary fw-500 pl-3 pt-1" icon="bbva:download" @click="download">
          Descargar
        </bbva-web-link>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <filter-event-map-table @search="search" />
      </v-col>
    </v-row>
    <v-row v-if="firstLoad">
      <v-col cols="12">
        <event-map-table :events="events" @open-event="openEvent" @sort="search" />
      </v-col>
    </v-row>
    <v-row v-else class="pt-10">
      <v-col cols="12" class="pb-0">
        <img src="/icons/SearchEmpty.svg" alt="Icono de la sección" />
      </v-col>
      <v-col cols="12">
        <span class="text-h5">*Búsqueda de Mapas por eventos</span>
      </v-col>
      <v-col cols="12" class="py-0">
        Para poder visualizar los datos debes agregar los tres datos, BUs, Fecha y Tipo de folio.
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
// Components
import '@/components/bbva-web-components/bbva-web-link.js'
import AppBar from '@/components/AppBar/AppBar.vue'
import FilterEventMapTable from '@/components/table/FilterEventMapTable.vue'
import EventMapTable from '@/components/table/EventMapTable.vue'

// Requests
import { getEventMapAPI, getExcelEventMapAPI } from '@/requests/eventMap.js'

export default {
  components: {
    AppBar,
    FilterEventMapTable,
    EventMapTable
  },

  name: 'event-map-view',

  data() {
    return {
      // Constants
      icon: '/icons/SearchGraphic.svg',
      title: 'Mapa de eventos',

      // Variables
      firstLoad: false,
      events: [],
      // Filters
      filters: {
        buId: null,
        date: null,
        ticketTypeIds: null,
        criticalityIds: null,
        originIds: null,
        sort: null,
        sortBy: null,
        sortByCfsId: null
      }
    }
  },

  methods: {
    /**
     * Downloads an Excel file containing the event map data filtered by the current filters.
     *
     * @return {Promise<void>} A Promise that resolves when the download is complete.
     * @throws {Error} If there is an error while downloading the Excel file.
     */
    async download() {
      try {
        this.emitter.emit('load', { loading: true })

        const response = await getExcelEventMapAPI(this.filters)
        const responseData = response.data
        const filename = 'Mapa_de_eventos.xlsx'

        const blob = new Blob([responseData], { type: 'application/vnd.ms-excel' })
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.download = filename
        link.click()
        URL.revokeObjectURL(link.href)
      } catch (error) {
        this.emitter.emit('error', { action: 'Obtener el excel', error })
      } finally {
        this.emitter.emit('load', { loading: false })
      }
    },
    /**
     * Asynchronously searches for events based on the provided filters and updates the state accordingly.
     *
     * @param {Object} newFilters - An object containing the new filters to be applied to the search.
     * @return {Promise<void>} A Promise that resolves when the search is complete.
     */
    async search(newFilters) {
      try {
        this.filters = { ...this.filters, ...newFilters }
        this.emitter.emit('load', { loading: true })
        const { data: responseEventMap } = await getEventMapAPI(this.filters)
        this.events = responseEventMap?.events || []
        this.firstLoad = true
      } catch (error) {
        this.emitter.emit('error', { action: 'obtener los eventos', error })
      } finally {
        this.emitter.emit('load', { loading: false })
      }
    },
    /**
     * Toggles the 'open' property of the event at the specified index in the 'events' array.
     *
     * @param {number} eventIndex - The index of the event in the 'events' array.
     * @return {void}
     */
    openEvent(eventIndex) {
      this.events[eventIndex].open = !this.events[eventIndex].open
    }
  }
}
</script>
