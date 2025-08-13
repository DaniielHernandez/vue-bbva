<template>
  <v-row fluid class="mt-4 ml-4 mb-4">
    <bbva-web-link
      :disabled="!tableData.length"
      class="primary"
      icon="bbva:download"
      @click="download"
    >
      Descargar
    </bbva-web-link>
  </v-row>
  <v-container fluid>
    <filters-environments
      @filter-change="onFilterChange"
      @options-change="onOptionsChange"
      @search-click="getDataTable"
    />
  </v-container>
  <v-container fluid class="mt-4" v-if="tableData.length > 0">
    <v-row justify="center">
      <v-col col="3">BU: {{ labels.units }}</v-col>
      <v-col col="3">CFS: {{ labels.cfs }}</v-col>
      <v-col col="3">Entorno: {{ labels.environment }}</v-col>
      <v-col col="3">Fecha: {{ filters.date }}</v-col>
    </v-row>
  </v-container>

  <v-container fluid v-if="tableData.length > 0">
    <v-table density="compact" class="mt-4">
      <thead>
        <tr>
          <!-- Operatives columns -->
          <th></th>
          <!-- Dynamically generate columns for each day-->
          <th
            v-for="(day, index) in days"
            :key="'day-header-' + index"
            colspan="2"
            class="text-center header-dia"
          >
            {{ day }}
          </th>
        </tr>
        <tr>
          <!-- Empty space for the Operations column -->
          <th></th>
          <!-- Columns for each day -->
          <template v-for="index in days" :key="'subcol-header-' + index">
            <th class="text-center header-categoria day-cell">Peticiones</th>
            <th class="text-center header-categoria day-cell">Errores</th>
          </template>
        </tr>
      </thead>
      <tbody>
        <!-- Operatives rows -->
        <tr
          v-for="(row, rowIndex) in tableData"
          :key="'row-' + rowIndex"
          :class="{ 'row-zebra': rowIndex % 2 !== 0 }"
        >
          <!-- Operative name -->
          <td>{{ row.operativa }}</td>
          <!-- Dynamically generate data columns for each day -->
          <template v-for="(day, dayIndex) in days" :key="'data-' + rowIndex + '-' + dayIndex">
            <td class="day-cell">{{ row.data[day]?.peticiones || 0 }}</td>
            <td class="day-cell">{{ row.data[day]?.errores || 0 }}</td>
          </template>
        </tr>
      </tbody>
    </v-table>
  </v-container>

  <v-container v-if="tableData.length === 0">
    <no-data-message title="Información de la tabla" :message="message" />
  </v-container>
</template>
<script>
// Components
import '@/components/bbva-web-components/bbva-web-table-header.js'
import '@/components/bbva-web-components/bbva-web-table-body.js'
import '@/components/bbva-web-components/bbva-web-table-footer.js'
import '@/components/bbva-web-components/bbva-web-link.js'
import '@/components/bbva-web-components/bbva-core-icon.js'
import NoDataMessage from '@/components/utils/NoDataMessage.vue'
import FiltersEnvironments from '@/components/filters-environments/FiltersEnvironments.vue'

// Request
import { downloadFile, searchOperatives } from '@/requests/businessUnit'

export default {
  components: {
    FiltersEnvironments,
    NoDataMessage
  },

  data() {
    return {
      /* Form name */
      nameForm: 'environmentForm',
      /* Message for empty table */
      message: 'No hay datos que mostrar en la tabla',
      /* Array for days into table */
      days: [],
      /* Data for show */
      tableData: [],
      /* Object containing the lists that correspond to each of the filters */
      options: {
        units: [],
        cfs: [],
        environment: []
      },
      /* Filters values */
      filters: {
        units: '',
        cfs: '',
        environment: '',
        date: ''
      },
      /* Values of the selected filters */
      labels: {
        units: '',
        cfs: '',
        environment: '',
        date: ''
      }
    }
  },
  methods: {
    /**
     * This method updates the filters with the provided new filter values.
     * @param {Object} filters - The new filter values to be applied.
     * @property {string} filters.units - The selected unit's ID.
     * @property {string} filters.cfs - The selected CF's ID.
     * @property {string} filters.environment - The selected environment's ID.
     * @property {string} filters.date - The selected date in 'YYYY-MM-DD' format.
     */
    onFilterChange(filters) {
      this.filters = { ...this.filters, ...filters }
    },

    /**
     * This method updates the options with the provided new option values.
     * @param {Object} options - The new options to be updated.
     * @property {Array} options.units - List of available units.
     * @property {Array} options.cfs - List of available CFs.
     * @property {Array} options.environment - List of available environments.
     */
    onOptionsChange(options) {
      this.options = { ...this.options, ...options }
    },

    /**
     * Retrieves the data to populate the table, based on the current filters.
     * This emits a loading event, constructs the payload, and fetches the data.
     * If an error occurs during the fetch, it resets the table data and shows an error message.
     * @async
     * @throws Will reset `tableData` and set a message if data fetch fails.
     */
    async getDataTable() {
      this.emitter.emit('load', { loading: true })
      try {
        const bu = this.options.units.find((unit) => unit.id === this.filters.units).label
        const cfs = this.options.cfs.find((cfs) => cfs.id === this.filters.cfs).label
        const environment = this.options.environment.find(
          (env) => env.id === this.filters.environment
        ).label

        const date = this.filters.date.split('-')
        const dateTo = `${date[1]}/${date[2]}/${date[0]}`

        const payload = {
          bu,
          buId: this.filters.units,
          cfs,
          cfsId: this.filters.cfs,
          environment,
          environmentId: this.filters.environment,
          dateTo
        }

        const { data } = await searchOperatives(payload)
        this.processOperativesData(data)

        this.emitter.emit('load', { loading: false })
      } catch (error) {
        this.emitter.emit('load', { loading: false })
        this.tableData = []
        this.message = 'No encontramos información para los filtros seleccionados'
      }
    },

    /**
     * Processes the raw data received from the server to populate the table.
     * Extracts unique days and organizes data grouped by operatives.
     * Updates the table days and data properties.
     * @param {Array} rawData - Raw data received from the server.
     * @property {Object} rawData[].operative - Operatives data grouped by operative name.
     */
    processOperativesData(rawData) {
      const uniqueDays = new Set()
      const operativeData = rawData[0]?.operative || {}

      // Process grouped data by operative
      const groupedData = Object.entries(operativeData).map(([operativeName, records]) => {
        const data = {}
        records.forEach((record) => {
          record.day = `${record.day.split('/')[1]}/${record.day.split('/')[0]}/${
            record.day.split('/')[2]
          }`
          uniqueDays.add(record.day) // Add unique days
          data[record.day] = {
            peticiones: record.executedRequests,
            errores: record.erroneousRequests
          }
        })
        return {
          operativa: operativeName,
          data
        }
      })

      this.days = Array.from(uniqueDays).sort()
      this.tableData = groupedData

      if (this.tableData.length === 0) {
        this.message = 'No encontramos información para los filtros seleccionados'
      }

      this.setLabels()
    },

    /**
     * Updates the labels for each selected filter value.
     * Extracts and assigns the label for each filter (unit, CF, environment, and date).
     */
    setLabels() {
      const unit = this.options.units.find((unit) => unit.id === this.filters.units)
      const cfs = this.options.cfs.find((cfs) => cfs.id === this.filters.cfs)
      const environment = this.options.environment.find(
        (env) => env.id === this.filters.environment
      )
      this.labels = {
        units: unit ? unit.label : '',
        cfs: cfs ? cfs.label : '',
        environment: environment ? environment.label : '',
        date: this.filters.date
      }
    },

    /**
     * Triggers the download process for the current table data.
     * Constructs the payload for the download request and logs the processing date.
     * Emits a loading event during the process.
     * @async
     * @throws Logs an error if the download process fails.
     */
    async download() {
      this.emitter.emit('load', { loading: true })

      const date = this.filters.date.split('-')
      const dateTo = `${date[1]}/${date[2]}/${date[0]}`

      const bu = this.options.units.find((unit) => unit.id === this.filters.units).label
      const cfs = this.options.cfs.find((cfs) => cfs.id === this.filters.cfs).label
      const environment = this.options.environment.find(
        (env) => env.id === this.filters.environment
      ).label

      const payload = {
        bu,
        buId: this.filters.units,
        cfs,
        cfsId: this.filters.cfs,
        environment,
        environmentId: this.filters.environment,
        dateTo
      }

      const { data } = await downloadFile(payload)

      const blob = new Blob([data], { type: 'application/vnd.ms-excel' })

      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = `Validacion_datos.xlsx`
      link.click()
      URL.revokeObjectURL(link.href)
      this.emitter.emit('load', { loading: false })
    }
  }
}
</script>

<style>
.text-center {
  text-align: center;
}

/* Estilos para los encabezados */
.header-dia {
  background-color: #003366;
  color: white;
  font-weight: bold;
  border-right: solid 1px #f2f2f2;
  border-bottom: solid 1px #f2f2f2;
}

.header-categoria {
  background-color: #0055a5;
  color: white;
}

/* Estilo de cebra para las filas */
.row-zebra {
  background-color: #f2f2f2;
}

/* Padding para las celdas */
th,
td {
  padding: 8px 12px;
}

/* Agregar borde vertical entre las celdas de los días */
.day-cell {
  border-right: 1px solid #f2f2f2;
  /* Borde entre las celdas */
}

tr th:last-child {
  border-right: none;
}

/* Remover el borde en la última celda de cada fila */
tr td:last-child {
  border-right: none;
}
</style>
