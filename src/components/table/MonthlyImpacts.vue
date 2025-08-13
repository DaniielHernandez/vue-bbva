<template>
  <v-row>
    <v-col cols="12">
      <form :id="nameForm" class="w-100" @submit.prevent="searchForm">
        <v-container fluid>
          <v-row>
            <v-col cols="12" xs="12" sm="6" md="4" lg="4" xl="4">
              <bbva-form-input
                :form="nameForm"
                :value="filters.ticketNumber"
                @form-field-input-blur="
                  ({ target: { value } }) => setFilters({ ticketNumber: value ? value : null })
                "
                @formFieldInputClear="() => setFilters({ ticketNumber: null })"
                label="N° de Folio"
                type="text"
              >
              </bbva-form-input>
            </v-col>
            <v-col cols="12" xs="12" sm="6" md="4" lg="4" xl="4">
              <bbva-form-input
                :form="nameForm"
                :value="filters.ticketProblem"
                @form-field-input-blur="
                  ({ target: { value } }) => setFilters({ ticketProblem: value ? value : null })
                "
                @formFieldInputClear="() => setFilters({ ticketProblem: null })"
                label="Folio problema"
                type="text"
              >
              </bbva-form-input>
            </v-col>
            <v-col cols="auto">
              <bbva-button-default text="Buscar" type="submit"> </bbva-button-default>
            </v-col>
          </v-row>
        </v-container>
      </form>
    </v-col>
  </v-row>
  <v-row>
    <v-col cols="12">
      <v-table density="compact">
        <thead>
          <tr>
            <th
              v-for="header in headers"
              :id="`table-header${header.value}`"
              :key="header.value"
              class="text-left fs-12 font-weight-light"
            >
              <bbva-web-table-header-text
                :order="header.order"
                :sort-active="header.value === filters.filter"
                :class="header.value !== filters.filter ? 'font-weight-light' : ''"
                @sort-criteria="(ev) => sort(header.value, ev.detail.sortAscending)"
              >
                {{ header.title }}
              </bbva-web-table-header-text>
            </th>
          </tr>
        </thead>
        <tbody v-if="items.length > 0">
          <tr v-for="item in items" :key="item.id">
            <td
              v-for="header in headers"
              :key="header.value"
              class="text-left fs-15 font-weight-light"
            >
              <span :class="header.value === 'startDate' ? 'no-wrap-text' : ''">
                {{ item[header.value] }}
              </span>
            </td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr>
            <td class="text-center fs-15 font-weight-light" :colspan="headers.length">
              No hay registros
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-col>
  </v-row>
  <v-row justify="center" v-if="items.length > 0">
    <v-col cols="12" class="text-center">
      <bbva-web-table-footer
        v-if="total > items.length"
        @click="loadMore"
        class="fs-15 fw-500"
        :loading="loading"
        loading-text="Cargando"
      >
        Ver más
      </bbva-web-table-footer>
      <span v-else class="fs-12 font-weight-light">No hay más registros por mostrar</span>
    </v-col>
  </v-row>
</template>

<script>
// Components
import '@/components/bbva-web-components/bbva-form-input.js'
import '@/components/bbva-web-components/bbva-web-table-header.js'
import '@/components/bbva-web-components/bbva-web-table-footer.js'

// Constants
const headers = [
  { title: 'N° DE FOLIO', value: 'ticketNumber', order: false },
  { title: 'FOLIO PROBLEMA', value: 'ticketProblem', order: false },
  { title: 'FECHA INICIO', value: 'startDate', order: true },
  { title: 'TIPO', value: 'type', order: true },
  { title: 'SINTOMA', value: 'symptom', order: false },
  { title: 'CAUSA', value: 'cause', order: false },
  { title: 'CAUSA RAIZ', value: 'rootCause', order: false },
  { title: 'CONTRIBUCIÓN', value: 'contribution', order: true }
]

export default {
  name: 'MonthlyImpacts',
  components: {},
  props: {
    data: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      // Constants
      nameForm: 'monthly-impacts-form',
      option: null,
      headers,

      // Variables
      items: [],
      total: 0,
      loading: false,
      filters: {
        pageNumber: 1,
        pageSize: 5,
        ticketNumber: null,
        ticketProblem: null,
        order: null,
        filter: null
      }
    }
  },
  methods: {
    /**
     * Updates the filters object with the provided filters.
     *
     * @param {Object} filters - The filters to be added to the existing filters.
     * @return {void} This function does not return anything.
     */
    setFilters(filters) {
      this.filters = { ...this.filters, ...filters }
    },
    /**
     * Executes a search based on the current filters and emits a 'search' event with the updated filters.
     *
     * @return {void} - This function does not return a value.
     */
    searchForm() {
      this.loading = true
      this.filters.pageNumber = 1
      this.$emit('search', this.filters)
      this.loading = false
    },
    /**
     * Loads more data by incrementing the page number and emitting a 'load-more' event.
     *
     * @return {void}
     */
    loadMore() {
      this.loading = true
      this.filters.pageNumber += 1
      this.$emit('load-more', this.filters)
      this.loading = false
    },
    sort(header, sortAscending) {
      this.filters.filter = header
      this.filters.order = sortAscending ? 'asc' : 'desc'
      this.searchForm()
    },
    /**
     * Update data in the items and total properties.
     *
     * @param {Object} newData - The new data to update with
     * @param {Number} newData.total - The total number of items
     * @param {Array} newData.impacts - The array of impacts
     * @return {void}
     */
    updateData(newData) {
      this.filters.pageNumber = 1
      this.items = newData.impacts
      this.total = newData.total
    },
    /**
     * Update items with new data and set total.
     *
     * @param {Object} newData - The new data to be added
     * @param {Number} newData.total - The total number of items
     * @param {Array} newData.impacts - The array of impacts
     * @return {void}
     */
    getMoreData(newData) {
      this.items = [...this.items, ...newData.impacts]
      this.total = newData.total
    }
  },
  /**
   * Lifecycle hook that is called after the component is mounted.
   */
  mounted() {
    this.items = this.data.impacts || []
    this.total = this.data.total || 0
  }
}
</script>

<style scoped>
.no-wrap-text {
  white-space: nowrap;
}
</style>
