<template>
  <app-bar />
  <simple-section-header
    :title="title"
    :subtitle="subtitle"
    backPath="/"
    :breadcrumbs="breadcrumbs"
    :icon="icon"
  />
  <v-container fluid class="px-12 pt-6" v-if="firstLoad">
    <v-row>
      <v-col cols="auto">
        <div class="d-flex ga-4">
          <bbva-button-group-item
            v-for="(group, indexGroup) in groupItems"
            :key="group.value + indexGroup"
            :checked="group.checked"
            :disabled="group.checked && chackedGroup === 1"
            :text="group.text"
            :value="group.value"
            @change="(ev) => changeGroupItem(indexGroup, ev)"
            showCheck
          >
          </bbva-button-group-item>
        </div>
      </v-col>
    </v-row>
    <v-row v-for="(bu, buIndex) in buItems" :key="bu.buId">
      <template v-if="!bu.hidden">
        <v-col cols="12">
          <span class="fs-15 fw-500">{{ bu.name }}</span>
        </v-col>
        <v-col cols="12">
          <cfs-impact-table
            :bu="bu"
            :buIndex="buIndex"
            :ticket="ticket"
            @open-cfs="openCfs"
            @open-contribution="(selection) => openDialog(selection, 'contribution')"
            @open-delete-cfs="openDeleteDialog"
            @open-edit-cfs="(selection) => openDialog(selection, 'edit')"
            @show-cfs="showCfs"
          />
        </v-col>
      </template>
    </v-row>
  </v-container>
  <!-- dialog -->
  <v-dialog v-model="dialog.open" width="auto" max-width="75%" height="auto" max-height="75%">
    <EditCfsImpactForm
      v-if="dialog.open && dialog.type === 'edit'"
      :bu="selectedBu"
      :cfs="selectedCfs"
      :ticket="ticket"
      :originOptions="originOptions"
      @close="closeDialog"
      @updateCfs="updateCfsImpact"
    ></EditCfsImpactForm>
    <contribution-cfs-impact-table
      v-else-if="dialog.open && dialog.type === 'contribution'"
      :bu="selectedBu"
      :cfs="selectedCfs"
      :ticket="ticket"
      @close="closeDialog"
    ></contribution-cfs-impact-table>
  </v-dialog>
  <!-- Delete Modal -->
  <information-modal
    :close="closeDialogDelete"
    :confirmation="true"
    :message="dialogDelete.message"
    :onAccept="deleteCfsImpact"
    :open="dialogDelete.open"
    :subMessage="dialogDelete.subMessage"
    :title="dialogDelete.title"
    :type="dialogDelete.type"
  />
</template>

<script>
// Components
import '@/components/bbva-web-components/bbva-web-navigation-breadcrumbs.js'
import '@/components/bbva-experience-components/bbva-button-group.js'
import AppBar from '@/components/AppBar/AppBar.vue'
import SimpleSectionHeader from '@/components/headers/SimpleSectionHeader.vue'
import CfsImpactTable from '@/components/table/CfsImpactTable.vue'
import EditCfsImpactForm from '@/components/forms/EditCfsImpactForm.vue'
import ContributionCfsImpactTable from '@/components/table/ContributionCfsImpactTable.vue'
import InformationModal from '@/components/modals/InformationModal.vue'

// Constants
const breadcrumbs = [
  {
    name: 'Consulta de folios',
    href: '/impact-tickets?back=true'
  },
  {
    name: 'CFSs con impacto',
    href: `/impact-tickets/cfs`
  }
]

// Requests
import {
  getOriginAPI,
  getCfsImpacts,
  deleteCfsImpact,
  updateCfsImpact
} from '@/requests/impactTickets'

export default {
  name: 'CfsView',
  components: {
    AppBar,
    SimpleSectionHeader,
    CfsImpactTable,
    EditCfsImpactForm,
    ContributionCfsImpactTable,
    InformationModal
  },
  data() {
    return {
      // Constants
      icon: '/icons/Analysis.svg',

      // Variables
      breadcrumbs,
      title: 'N° de Folio: [TICKET]',
      subtitle: 'Detalle de impactos por BU/CFSs',
      firstLoad: false,
      selectedGroup: 0,
      groupItems: [],
      buItems: [],
      ticket: {
        id: null,
        name: null,
        type: null
      },

      // Selected
      selectedBu: null,
      selectedCfs: null,

      // Options
      originOptions: [],

      // Dialog
      dialog: {
        open: false,
        type: null
      },

      // Delete Dialog
      dialogDelete: {
        open: false,
        title: '',
        message: '',
        subMessage: '',
        type: 'caution'
      }
    }
  },
  computed: {
    /**
     * Computes the number of checked items in the groupItems array.
     *
     * @return {number} The count of checked items.
     */
    chackedGroup() {
      return this.groupItems?.filter((item) => item.checked).length
    }
  },
  methods: {
    /**
     * Toggles the checked status of the item at the specified index in the groupItems array,
     * and updates the hidden status of the corresponding item in the buItems array.
     *
     * @param {number} index - The index of the item to toggle.
     * @return {void}
     */
    changeGroupItem(index) {
      this.groupItems[index].checked = !this.groupItems[index].checked
      this.buItems[index].hidden = !this.groupItems[index].checked
    },
    /**
     * Toggles the open status of a specific cfsItem in a buItem.
     *
     * @param {Object} options - An object containing the indices of the buItem and cfsItem.
     * @param {number} options.buIndex - The index of the buItem in the buItems array.
     * @param {number} options.cfsIndex - The index of the cfsItem in the cfsItems array of the corresponding buItem.
     * @return {void}
     */
    openCfs({ buIndex, cfsIndex }) {
      this.buItems[buIndex].cfsItems[cfsIndex].open = !this.buItems[buIndex].cfsItems[cfsIndex].open
    },
    /**
     * Updates the selectedBu and selectedCfs properties based on the provided buIndex and cfsIndex,
     * then navigates to the 'impact-tickets-cfs-operatives' route with the appropriate query parameters.
     *
     * @param {number} buIndex - The index of the business unit in the buItems array.
     * @param {number} cfsIndex - The index of the CFS item in the cfsItems array of the corresponding business unit.
     * @return {void}
     */
    showCfs({ buIndex, cfsIndex }) {
      this.selectedBu = this.buItems[buIndex]
      this.selectedCfs = this.buItems[buIndex].cfsItems[cfsIndex]
      this.$router.push({
        name: 'impact-tickets-cfs-operatives',
        query: {
          ticketId: this.ticket.id,
          buId: this.selectedBu.buId,
          cfsId: this.selectedCfs.cfsId,
          typeId: this.ticket.type
        }
      })
    },
    /**
     * Opens a dialog with the selected business unit and change set folder.
     *
     * @param {Object} options - The options object containing the buIndex and cfsIndex.
     * @param {number} options.buIndex - The index of the selected business unit.
     * @param {number} options.cfsIndex - The index of the selected change set folder.
     * @param {string} type - The type of dialog to open.
     * @return {void}
     */
    openDialog({ buIndex, cfsIndex }, type) {
      this.selectedBu = this.buItems[buIndex]
      this.selectedCfs = this.buItems[buIndex].cfsItems[cfsIndex]
      this.dialog.type = type
      this.dialog.open = true
    },
    /**
     * Opens a dialog to delete a specific item.
     *
     * @param {number} buIndex - The index of the business unit.
     * @param {number} cfsIndex - The index of the change set folder.
     * @return {void}
     */
    openDeleteDialog({ buIndex, cfsIndex }) {
      this.selectedBu = this.buItems[buIndex]
      this.selectedCfs = this.buItems[buIndex].cfsItems[cfsIndex]
      this.dialogDelete.title = 'Eliminar Folio'
      this.dialogDelete.message = '¿Seguro que quieres eliminar este Folio?'
      this.dialogDelete.subMessage = `N° de Folio: ${this.ticket.name}, CFS: ${this.selectedCfs.name}`
      this.dialogDelete.open = true
    },
    /**
     * Asynchronously updates the data based on the CFS impacts response.
     *
     * @return {Promise<void>} - A promise that resolves when the data is updated.
     */
    async update() {
      const cfsImpactsResponse = await getCfsImpacts({ ticketId: this.ticket.id, typeId: this.ticket.type })
      this.buItems = cfsImpactsResponse?.data.buItems || []
      this.groupItems =
        cfsImpactsResponse?.data.buItems?.map((buItem) => {
          return {
            text: buItem.name,
            value: buItem.buId,
            checked: true
          }
        }) || []
    },
    /**
     * Asynchronously updates the CFS impact based on the provided filters.
     *
     * @param {Object} filters - The filters to update the CFS impact.
     * @param {string} filters.symptom - The symptom to filter by.
     * @param {string} filters.originId - The origin id to filter by.
     * @param {string} filters.totalImpact - The total impact to filter by.
     * @param {string} filters.accessImpact - The access impact to filter by.
     *
     * @return {Promise<void>} - A promise that resolves when the CFS impact is updated.
     */
    async updateCfsImpact(filters) {
      const obj = {}
      try {
        this.emitter.emit('load', { loading: true })
        const { data: responseOperativesImpact } = await updateCfsImpact({
          ...filters,
          ticketId: this.ticket.id,
          typeTicketId: this.ticket.type
        })
        if (responseOperativesImpact?.statusCode === 409)
          throw new Error(responseOperativesImpact?.message || 'Error al actualizar el folio')

        await this.update()

        obj.type = 'success'
        obj.title = 'Folio actualizado'
        obj.message = 'Folio actualizado correctamente'
      } catch (error) {
        obj.type = 'error'
        obj.title = 'Error al actualizar el folio'
        obj.message = error.response.data.message || error
      } finally {
        this.dialog.open = false
        this.emitter.emit('informational', obj)
        this.emitter.emit('load', { loading: false })
      }
    },
    /**
     * Closes the dialog.
     *
     * @return {void}
     */
    closeDialog() {
      this.dialog.open = false
    },
    /**
     * Closes the delete dialog.
     *
     * @return {void}
     */
    closeDialogDelete() {
      this.dialogDelete.open = false
    },
    /**
     * Deletes the CFS impact selected.
     *
     * @return {Promise<void>} - A promise that resolves when the CFS impact is deleted.
     */
    async deleteCfsImpact() {
      const obj = {}
      try {
        this.emitter.emit('load', { loading: true })
        const { data: responseOperativesImpact } = await deleteCfsImpact({
          impactId: this.selectedCfs?.impactId
        })
        if (responseOperativesImpact?.statusCode === 409)
          throw new Error(responseOperativesImpact?.message || 'Error al eliminar el folio')

        await this.update()

        obj.type = 'success'
        obj.title = 'Folio eliminado'
        obj.message = 'Folio eliminado correctamente'
      } catch (error) {
        obj.type = 'error'
        obj.title = 'Error al eliminar el folio'
        obj.message = error.response.data.message || error
      } finally {
        this.dialogDelete.open = false
        this.emitter.emit('informational', obj)
        this.emitter.emit('load', { loading: false })
      }
    }
  },
  /**
   * Mounts the component and initializes data based on fetched API responses.
   *
   * @return {void}
   */
  async mounted() {
    try {
      this.emitter.emit('load', { loading: true })

      let { ticketId, typeId } = this.$route.query

      if (!ticketId || !typeId) {
        throw new Error('Verifique que los parámetros de consulta sean correctos')
      }
      ticketId = parseInt(ticketId)
      typeId = parseInt(typeId)

      if (isNaN(ticketId)) {
        throw new Error('Verifique que los campos de consulta sean correctos')
      }

      const [originResponse, cfsImpactsResponse] = await Promise.all([
        getOriginAPI(),
        getCfsImpacts({ ticketId, typeId })
      ])
      this.originOptions = originResponse?.data || []
      this.buItems = cfsImpactsResponse?.data.buItems || []
      this.groupItems =
        cfsImpactsResponse?.data.buItems?.map((buItem) => {
          return {
            text: buItem.name,
            value: buItem.buId,
            checked: true
          }
        }) || []
      this.ticket = {
        id: ticketId || null,
        name: cfsImpactsResponse?.data?.ticket || null,
        type: typeId || null
      }

      this.title = `N° de Folio: ${cfsImpactsResponse?.data?.ticket || ''}`
      this.firstLoad = true
    } catch (error) {
      const obj = {
        type: 'error',
        title: 'Error al obtener la información',
        message: error
      }
      this.emitter.emit('informational', obj)
    } finally {
      this.emitter.emit('load', { loading: false })
    }
  }
}
</script>
