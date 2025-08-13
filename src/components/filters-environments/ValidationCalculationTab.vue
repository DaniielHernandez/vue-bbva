<template>
  <v-container fluid>
    <v-row>
      <v-col class="d-flex">
        <filter-options-calculo
          class="mr-4"
          title="Otras opciones de vista"
          icon="bbva:show"
          :options="optionsVista"
          :disabled="!tableData?.length"
          @radio-options-change="onOptionsView"
        />
        <filter-options-calculo
          title="Descargar"
          icon="bbva:download"
          :options="optionsDescarga"
          :disabled="!tableData?.length"
          @radio-options-change="onOptionsDownload"
          :resetValues="true"
        />
      </v-col>
    </v-row>
  </v-container>

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
    <v-table density="compact">
      <thead>
        <tr>
          <th class="text-left"></th>
          <th class="text-center header-dia">Peso Operativa</th>
          <th class="text-center header-dia">Meta</th>
          <th class="text-center header-dia">Mes</th>
          <th v-for="(day, index) in days" :key="index" class="text-center header-dia">
            {{ day }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="text-center">
            {{ labels.units }} / {{ labels.cfs }} / {{ labels.environment }}
          </td>
          <td class="text-center">{{ cfsData.weight }}%</td>
          <td class="text-center">{{ cfsData.meta }}</td>
          <td
            class="text-center"
            :style="{
              backgroundColor: cfsData.monthlyColor || 'transparent',
              color: cfsData.monthlyColor === 'yellow' ? 'black' : 'white'
            }"
          >
            {{
              optionsVista.availability.value
                ? cfsData.monthlyResultAvailability
                : cfsData.monthlyResultUnavailability
            }}
          </td>
          <td
            v-for="(day, dayIndex) in days"
            :key="dayIndex"
            :style="{
              backgroundColor: cfsData.data[day]?.color || 'transparent',
              color: cfsData.data[day]?.color === 'yellow' ? 'black' : 'white'
            }"
            class="text-center"
          >
            {{
              optionsVista.availability.value
                ? cfsData.data[day]?.availability
                : cfsData.data[day]?.unavailability || '-'
            }}
          </td>
        </tr>
        <!--Operatives-->
        <tr
          v-for="(row, rowIndex) in tableData"
          :key="rowIndex"
          :class="{ 'row-zebra': rowIndex % 2 !== 0 }"
        >
          <td class="text-center">{{ row.operativa }}</td>
          <td class="text-center">
            {{ row.weight + '%' }}
          </td>

          <td class="text-center">{{ row.meta }}</td>
          <td
            class="text-center"
            :style="{
              backgroundColor: row.monthlyColor || 'transparent',
              color: row.monthlyColor === 'yellow' ? 'black' : 'white'
            }"
          >
            {{
              optionsVista.availability.value
                ? row.monthlyResult || '-'
                : row.monthlyResultUnavailability || '-'
            }}
          </td>

          <td
            v-for="(day, dayIndex) in days"
            :key="dayIndex"
            :style="{
              backgroundColor: row.data[day]?.color || 'transparent',
              color: row.data[day]?.color === 'yellow' ? 'black' : 'white'
            }"
            class="text-center"
          >
            {{
              optionsVista.availability.value
                ? row.data[day]?.availability || '-'
                : row.data[day]?.unavailability || '-'
            }}
          </td>
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
import NoDataMessage from '@/components/utils/NoDataMessage.vue'
import FiltersEnvironments from '@/components/filters-environments/FiltersEnvironments.vue'
import FilterOptionsCalculo from '@/components/filters-environments/FilterOptionsCalculo.vue'

// Request
import {
  downloadValidationDay,
  downloadValidationMonth,
  searchCalculation
} from '@/requests/businessUnit'

export default {
  components: {
    NoDataMessage,
    FiltersEnvironments,
    FilterOptionsCalculo
  },

  data() {
    return {
      // Holds the message displayed when no data is available in the table.
      message: 'No hay datos que mostrar en la tabla',
      // Array to store the days shown in the table.
      days: [],
      // Array containing the main table data fetched from the backend.
      tableData: [],
      // Object to store details related to CFS data.
      cfsData: {},
      // Contains filter options for units, CFS, and environment.
      options: {
        units: [],
        cfs: [],
        environment: []
      },
      // Stores the currently applied filter values (units, CFS, environment, date).
      filters: {
        units: '',
        cfs: '',
        environment: '',
        date: ''
      },
      // Stores labels associated with the filter values.
      labels: {
        units: '',
        cfs: '',
        environment: '',
        date: ''
      },
      // Manages the state for viewing availability or unavailability.
      optionsVista: {
        availability: {
          labels: ['Disponibilidad', 'Indisponibilidad'],
          value: true
        }
      },
      // Manages the options for monthly or daily downloads.
      optionsDescarga: {
        mensualmente: {
          labels: ['Mensualmente', 'Diariamente'],
          value: null
        }
      }
    }
  },

  methods: {
    /**
     * Updates the current filters with the provided filter values.
     * @param {Object} filters - The object containing the new filter values.
     */
    onFilterChange(filters) {
      this.filters = { ...this.filters, ...filters }
    },

    /**
     * Updates the current options with the provided options values.
     * @param {Object} options - The object containing the new options.
     */
    onOptionsChange(options) {
      this.options = { ...this.options, ...options }
    },

    /**
     * Updates the view options for availability or unavailability.
     * @param {Object} optionsVista - The object containing the new view options.
     */
    onOptionsView(optionsVista) {
      this.optionsVista = { ...this.optionsVista, ...optionsVista }
    },

    /**
     * Updates the download options and triggers the data download process.
     * @param {Object} optionsDescarga - The object containing the new download options.
     */
    onOptionsDownload(optionsDescarga) {
      this.optionsDescarga = { ...this.optionsDescarga, ...optionsDescarga }
      this.getFileData()
    },

    /**
     * Fetches the table data based on the current filter values.
     * Emits a load event to indicate the loading state during the process.
     * Updates the table data upon successful data retrieval or sets an error message on failure.
     */
    async getDataTable() {
      this.emitter.emit('load', { loading: true })
      try {
        const bu = this.options.units.find((unit) => unit.id === this.filters.units)?.label
        const cfs = this.options.cfs.find((cfs) => cfs.id === this.filters.cfs)?.label
        const environment = this.options.environment.find(
          (env) => env.id === this.filters.environment
        )?.label

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

        const { data } = await searchCalculation(payload)
        this.processOperativesData(data)
        this.emitter.emit('load', { loading: false })
      } catch (error) {
        this.emitter.emit('load', { loading: false })
        this.tableData = []
        this.message = 'No encontramos información para los filtros seleccionados'
        console.error('Error al cargar los datos de las operativas:', error)
      }
    },

    /**
     * Refactors the number to a fixed decimal value if it is 100.
     * @param {Number} number - The number to refactor.
     * @returns {Number} - The refactored number.
     */
    refactorNumber(number) {
      return number !== 100 ? (Math.floor(number * 100) / 100).toFixed(2) : number
    },
    /**
     * Processes the service data retrieved from the backend and formats it to update the table view.
     * Separates the data into days, groups by operability, and stores it into the table data.
     * Also processes details related to CFS data.
     * @param {Object} serviceData - The data object retrieved from the backend containing details by operability and CFS.
     */
    processOperativesData(serviceData) {
      const daysSet = new Set()
      const groupedData = {}

      const details = serviceData.detailsByOperability
      Object.keys(details).forEach((operability) => {
        const operabilityData = details[operability]
        groupedData[operability] = this.initializeGroupedData(operability, operabilityData)

        operabilityData.MonthlyResult.forEach((entry) => {
          const formattedDay = this.formatDay(entry.day)
          daysSet.add(formattedDay)
          groupedData[operability].data[formattedDay] = this.formatEntryData(entry)
        })
      })

      this.days = Array.from(daysSet).sort()
      this.tableData = Object.values(groupedData)
      if (this.tableData.length === 0) {
        this.message = 'No encontramos información para los filtros seleccionados'
      }

      this.processDetailsByCFS(serviceData.detailsByCFS)
      this.setLabels()
    },

    /**
     * Initializes the grouped data object for each operability.
     * @param {String} operability - The operability name.
     * @param {Object} operabilityData - The data object containing details for the operability.
     * @returns {Object} - The initialized grouped data object.
     */
    initializeGroupedData(operability, operabilityData) {
      return {
        operativa: operability,
        weight: operabilityData.MonthlyResult[0]?.weight,
        weightedAvailability: operabilityData.MonthlyResult[0]?.weightedAvailability || 0,
        weightedUnavailability: operabilityData.MonthlyResult[0]?.weightedUnavailability || 0,
        meta: operabilityData?.Meta || '-',
        monthlyResultUnavailability: this.refactorNumber(
          operabilityData['MonthlyResultIndiponibilidadOpe']
        ),
        monthlyResult: this.refactorNumber(operabilityData['Monthly Result']),
        monthlyColor: operabilityData.colorOperativaMensual.toLowerCase(),
        data: {}
      }
    },

    /**
     * Formats the day string to match the expected format.
     * @param {String} day - The day string to format.
     * @returns {String} - The formatted day string.
     */
    formatDay(day) {
      const [dayPart, monthPart, yearPart] = day.split('/')
      return `${monthPart}/${dayPart}/${yearPart}`
    },

    /**
     * Formats the entry data object to match the expected format.
     * @param {Object} entry - The entry data object to format.
     * @returns {Object} - The formatted entry data object.
     */
    formatEntryData(entry) {
      return {
        availability: this.refactorNumber(entry.availability),
        unavailability: this.refactorNumber(entry.unavailability),
        color: entry.color.toLowerCase()
      }
    },

    /**
     * Processes the details related to CFS data and formats it to update the CFS data view.
     * @param {Object} detailsByCFS - The data object containing details related to CFS.
     */
    processDetailsByCFS(detailsByCFS) {
      this.cfsData = {
        operativa: 'Detalles por CFS',
        weight: detailsByCFS.pesoOperativa,
        meta: detailsByCFS.MetaByCFS,
        monthlyResultAvailability: this.refactorNumber(detailsByCFS.ResultMensual),
        monthlyResultUnavailability: this.refactorNumber(detailsByCFS.ResultMensualIndiponibilidad),
        monthlyColor: detailsByCFS.colorCanalMensual.toLowerCase(),
        data: {}
      }

      detailsByCFS.DetailsDiasporCFS.forEach((entry) => {
        const formattedDay = this.formatDay(entry.day)
        this.cfsData.data[formattedDay] = {
          availability: this.refactorNumber(entry.ResutByCFSAvailability),
          unavailability: this.refactorNumber(entry.ResultByCFSUnavailability),
          color: entry.color.toLowerCase()
        }
      })
    },

    /**
     * Sets the labels for units, CFS, environment, and date based on the current filters.
     * Retrieves the label for each filter option and assigns it to the labels property.
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
     * Initiates the process for downloading file data based on the current download options.
     * Validates whether a monthly or daily download is required and then calls the respective function.
     * Triggers a loading event during the download process.
     */
    async getFileData() {
      if (this.optionsDescarga.mensualmente.value == null) {
        return
      }
      this.emitter.emit('load', { loading: true })

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

      if (this.optionsDescarga.mensualmente.value) {
        await this.handleDownload(payload, downloadValidationMonth)
      } else {
        await this.handleDownload(payload, downloadValidationDay)
      }
    },

    /**
     * Handles the download process for generating an Excel file based on the provided payload.
     * Executes the specified download function, creates a Blob object, and triggers an automatic download for the user.
     * @param {Object} payload - The data to be passed to the download function.
     * @param {Function} downloadFunction - The function to call for fetching the file data.
     */
    async handleDownload(payload, downloadFunction) {
      const { data } = await downloadFunction(payload)
      const blob = new Blob([data], { type: 'application/vnd.ms-excel' })

      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = `Validacion_calculo.xlsx`
      link.click()
      URL.revokeObjectURL(link.href)
      this.emitter.emit('load', { loading: false })
    }
  }
}
</script>

<style></style>
