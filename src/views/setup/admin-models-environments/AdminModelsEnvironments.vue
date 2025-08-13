<template>
  <app-bar />
  <section-header
    title="Administración de Modelos de Entornos Previos"
    backPath="/setup"
    icon="/icons/Download-Certificate.svg"
    textButton="Crear Modelo"
    :onClickButton="onCreateModel"
  />

  <v-container fluid>
    <filters-modelo
      @filter-change="onFilterChange"
      @options-change="onOptionsChange"
      @search-click="getDataTable(false)"
      :showSelectMultiple="true"
    />
  </v-container>

  <v-container v-if="dataTable.length > 0" fluid>
    <v-table density="compact">
      <thead>
        <tr>
          <th class="text-left fs-12 font-weight-light">Business Unit</th>
          <th class="text-left fs-12 font-weight-light">CFS</th>
          <th class="text-left fs-12 font-weight-light">Entorno</th>
          <th class="text-left fs-12 font-weight-light">Estatus Modelo</th>
          <th class="text-left fs-12 font-weight-light">Versión</th>
          <th class="text-left fs-12 font-weight-light">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in dataTable" :key="item.modelId">
          <td>{{ item.buName }}</td>
          <td>{{ item.cfsName }}</td>
          <td>{{ item.environmentName }}</td>
          <td>{{ item.status === 1 ? 'Activo' : 'Inactivo' }}</td>
          <td>{{ item.modelVersion }}</td>
          <td>
            <bbva-web-table-body-action
              class="icon-button"
              icon="bbva:edit"
              size="m"
              @click="editRow(item)"
            ></bbva-web-table-body-action>
            <bbva-web-table-body-action
              class="icon-button"
              icon="bbva:show"
              size="m"
              @click="viewRow(item)"
            ></bbva-web-table-body-action>
            <bbva-web-table-body-action
              class="icon-button"
              icon="bbva:copy"
              size="m"
              @click="cloneRow(item)"
            ></bbva-web-table-body-action>
          </td>
        </tr>
      </tbody>
    </v-table>
  </v-container>

  <v-container v-else>
    <no-data-message title="Información de la tabla" :message="message" />
  </v-container>
</template>

<script>
// Components
import '@/components/bbva-web-components/bbva-web-table-header.js'
import '@/components/bbva-web-components/bbva-web-table-body.js'
import '@/components/bbva-web-components/bbva-web-table-footer.js'
import AppBar from '@/components/AppBar/AppBar.vue'
import NoDataMessage from '@/components/utils/NoDataMessage.vue'
import SectionHeader from '@/components/headers/SectionHeader.vue'
import FiltersModelo from '@/components/filters-modelo/FiltersModelo.vue'

// Request
import { searchEnvironment, getInfoModel } from '@/requests/businessUnit'

export default {
  components: {
    AppBar,
    SectionHeader,
    NoDataMessage,
    FiltersModelo
  },
  data() {
    return {
      // Holds the array of data displayed in the table
      dataTable: [],
      // Stores the no-data message displayed when the table is empty
      message: 'No hay datos que mostrar en la tabla',
      // Contains the selected filter values for the table data
      filters: {
        units: '',
        cfs: '',
        environment: '',
        date: '', // no se utiliza
        models: '',
        status: 1
      },
      // Stores the available options for each dropdown filter
      options: {
        units: [],
        cfs: [],
        environment: [],
        models: []
      }
    }
  },
  beforeCreate() {
    localStorage.clear()
  },
  created() {
    this.getDataTable(true)
  },
  methods: {
    /**
     * Updates the filters object whenever a filter change event is triggered.
     * @param {Object} filters - Object containing the updated filter values.
     */
    onFilterChange(filters) {
      this.filters = filters
    },

    /**
     * Updates the options object whenever options change event is emitted.
     * @param {Object} options - Object containing the updated options for filters.
     */
    onOptionsChange(options) {
      this.options = options
    },

    /**
     * Redirects the user to the 'Create Model' route.
     */
    onCreateModel() {
      localStorage.setItem('status', 1)
      this.$router.push({ name: 'admin-models-environments-create-model' })
    },

    /**
     * Fetches the data for a specific model and redirects to the 'Create Model' page.
     * @param {Object} item - The selected row data from the table.
     */
    async editRow(item) {
      this.emitter.emit('load', { loading: true })

      const { data } = await getInfoModel(item.modelId)

      if (data) {
        localStorage.setItem('initialModel', JSON.stringify(data))
        localStorage.setItem('status', 2)
        this.$router.push({ name: 'admin-models-environments-create-model' })
      }

      this.emitter.emit('load', { loading: false })
    },

    /**
     * Redirects the user to the 'Summary' page for the selected model.
     * @param {Object} item - The selected row data from the table.
     */
    viewRow(item) {
      this.$router.push({ name: 'admin-models-environments-summary', params: { id: item.modelId } })
    },

    /**
     * Fetches the data for a specific model, prepares it for cloning, and redirects to the 'Create Model' page with the cloned data.
     * @param {Object} item - The selected row data from the table.
     */
    async cloneRow(item) {
      this.emitter.emit('load', { loading: true })

      const { data } = await getInfoModel(item.modelId)

      if (data) {
        const rest = { ...data, startDate: '', endDate: '', status: null }
        localStorage.setItem('initialModel', JSON.stringify(rest))
        localStorage.setItem('clonedModel', true)
        localStorage.setItem('status', 3)
        this.$router.push({ name: 'admin-models-environments-create-model' })
      }

      this.emitter.emit('load', { loading: false })
    },

    /**
     * Fetches the table data from the backend based on the current filters.
     * Updates the table or sets a 'no data' message if no results are found.
     */
    async getDataTable(init) {
      this.emitter.emit('load', { loading: true })

      try {
        let payload = {}
        if (!init) {
          payload = {
            pageNumber: 1,
            pageSize: 10,
            buId: this.filters.units,
            cfsIds: this.filters.cfs,
            environmentsIds: this.filters.environment,
            isActive: this.filters.status === 1 ? 1 : 0
          }
        }

        const { data } = await searchEnvironment(payload)

        this.dataTable = data ?? []
        if (this.dataTable) {
          this.message = 'No encontramos información para los filtros seleccionados'
        }

        this.emitter.emit('load', { loading: false })
      } catch (error) {
        this.emitter.emit('load', { loading: false })
      }
    }
  }
}
</script>

<style scoped>
.icon-button {
  width: 40px;
  padding: 0 10px;
  color: #1464a5;
}

.icon-button:hover {
  color: #024581;
}
</style>
