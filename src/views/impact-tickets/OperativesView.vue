<template>
  <app-bar />
  <simple-section-header
    :title="title"
    backPath="/"
    :breadcrumbs="breadcrumbs"
    :icon="icon"
  />
  <v-container fluid class="px-12 pt-6" v-if="firstLoad">
    <v-row>
      <v-col cols="12">
        <v-table density="compact">
          <thead>
            <tr>
              <th
                v-for="header in selectedHeaders"
                :id="`table-header-${header.value}`"
                :key="header.value"
                class="text-left fs-12 font-weight-light"
              >
                <bbva-web-table-header-text> {{ header.title }} </bbva-web-table-header-text>
              </th>
            </tr>
          </thead>
          <tbody v-if="operativesItems.length > 0">
            <template
              v-for="(operative, operativeIndex) in operativesItems"
              :key="operative.operativeId"
            >
              <tr>
                <td v-for="header in selectedHeaders" :key="header.value">
                  <!-- Header dateTimeStart -->
                  <bbva-web-table-body-text 
                    v-if="header.value === 'dateTimeStart'" 
                    grouped="true"
                  >
                    <span class="font-weight-light">
                      {{ operative.startDateString }} - {{ operative.startTimeString }}
                    </span>
                  </bbva-web-table-body-text>
                  <!-- Header dateTimeEnd -->
                  <bbva-web-table-body-text 
                    v-else-if="header.value === 'dateTimeEnd'" 
                    grouped="true"
                  >
                    <span class="font-weight-light">
                      {{ operative.endDateString }} - {{ operative.endTimeString }}
                    </span>
                  </bbva-web-table-body-text>
                  <!-- Header actions -->
                  <div v-else-if="header.value === 'actions'" class="d-flex ga-2">
                    <bbva-web-table-body-action
                      class="icon-button"
                      @click="() => openDeleteItem(operativeIndex)"
                      icon="bbva:trash"
                      size="m"
                    ></bbva-web-table-body-action>
                  </div>
                  <!-- Other Headers -->
                  <bbva-web-table-body-text 
                    v-else class="font-weight-light" 
                    grouped="true"
                  >
                    {{ operative[header.value] }}
                  </bbva-web-table-body-text>
                </td>
              </tr>
            </template>
          </tbody>
         <tfoot v-if="operativesItems.length > 0">
           <tr>
             <td :colspan="selectedHeaders.length" class="fs-12 font-weight-light text-center gray">
               <span> No hay más registros por mostrar </span>
             </td>
           </tr>
         </tfoot>

          <tbody v-else>
            <tr>
              <td class="text-center fs-15 font-weight-light" :colspan="selectedHeaders.length">
                No hay registros
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-col>
    </v-row>
  </v-container>
  <!-- Delete Modal -->
  <information-modal
    :open="dialogDelete.open"
    :close="closeDialogDelete"
    :title="dialogDelete.title"
    :message="dialogDelete.message"
    :subMessage="dialogDelete.subMessage"
    :type="dialogDelete.type"
    :confirmation="true"
    :onAccept="deleteCfsImpact"
  />
</template>

<script>
// Components
import '@/components/bbva-web-components/bbva-web-navigation-breadcrumbs.js'
import '@/components/bbva-web-components/bbva-web-table-header.js'
import '@/components/bbva-web-components/bbva-web-table-body.js'
import AppBar from '@/components/AppBar/AppBar.vue'
import SimpleSectionHeader from '@/components/headers/SimpleSectionHeader.vue'
import InformationModal from '@/components/modals/InformationModal.vue'

// Constants
import { operativesCfsImpactHeaders } from '@/constants/impactTickets'
const breadcrumbs = [
  {
    name: 'Consulta de folios',
    href: '/impact-tickets?back=true'
  },
  {
    name: 'BU impactadas',
    href: `/impact-tickets/cfs`
  },
  {
    name: 'Impactos asociados',
    href: `/impact-tickets/cfs/operatives`
  }
]

// Requests
import { getOperativesImpact, deleteOperativeImpact } from '@/requests/impactTickets'

export default {
  name: 'OperativesView',
  components: {
    AppBar,
    SimpleSectionHeader,
    InformationModal
  },
  data() {
    return {
      // Constants
      icon: '/icons/Mobile.svg',
      headers: operativesCfsImpactHeaders,
      breadcrumbs,

      // Variables
      title: '[CFS] - [BU] - N° de folio: [TICKET]',
      firstLoad: false,
      ticket: {
        id: null,
        name: '[Ticket]',
        type: null
      },
      bu: {
        id: null,
        name: '[BU]'
      },
      cfs: {
        id: null,
        name: '[CFS]'
      },
      operativesItems: [],

      // Selected
      selectedOperative: null,

      // Dialog
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
     * Returns an array of headers that should be shown based on the current ticket type.
     *
     * @return {Array} An array of headers.
     */
    selectedHeaders() {
      return this.headers.filter((header) => header.typesShow?.includes(this.ticket.type))
    }
  },
  methods: {
    /**
     * Opens the delete dialog for a specific operative item.
     *
     * @param {number} index - The index of the operative item in the operativesItems array.
     *
     * @return {void}
     */
    openDeleteItem(index) {
      this.selectedOperative = this.operativesItems[index]
      this.dialogDelete.title = 'Eliminar Folio'
      this.dialogDelete.message = '¿Seguro que quieres eliminar este Folio?'
      this.dialogDelete.subMessage = `N° de Folio: ${this.ticket.name}, Operativa: ${this.selectedOperative.operative}`
      this.dialogDelete.open = true
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
     * Deletes the CFSImpact.
     *
     * @return {Promise<void>} - A promise that resolves when the CFSImpact is deleted.
     */
    async deleteCfsImpact() {
      const obj = {}
      try {
        this.emitter.emit('load', { loading: true })
        const { data: responseOperativesImpact } = await deleteOperativeImpact({
          impactId: this.selectedOperative?.impactId,
          operativeId: this.selectedOperative?.idOperative
        })
        if (responseOperativesImpact?.statusCode === 409)
          throw new Error(responseOperativesImpact?.message || 'Error al eliminar el folio')
        await this.update()

        obj.type = 'success'
        obj.title = 'Folio eliminado'
        obj.message = 'Folio eliminado correctamente'
      } catch (error) {
        obj.type = 'error'
        obj.title = 'Error al obtener la información'
        obj.message = error
      } finally {
        this.dialogDelete.open = false
        this.emitter.emit('informational', obj)
        this.emitter.emit('load', { loading: false })
      }
    },
    /**
     * Asynchronously updates the operatives items by making a request to the server.
     *
     * @return {Promise<void>} A Promise that resolves when the update is complete.
     */
    async update() {
      const { data: responseOperativesImpact } = await getOperativesImpact({
        ticketId: this.ticket.id,
        buId: this.bu.id,
        cfsId: this.cfs.id
      })
      this.operativesItems = responseOperativesImpact || []
      this.ticket.name = responseOperativesImpact[0]?.ticket || '[Ticket]'
      this.ticket.type = responseOperativesImpact[0]?.typeTicketId || null
      this.bu.name = responseOperativesImpact[0]?.bu || '[BU]'
      this.cfs.name = responseOperativesImpact[0]?.cfs || '[CFS]'
      this.title = `${this.cfs.name} - ${this.bu.name} - N° de folio: ${this.ticket.name}`
    }
  },
  /**
   * Asynchronously mounts the component, emitting a load event, processing query parameters,
   * updating IDs, handling errors, setting breadcrumbs, updating data, and signaling the completion of loading.
   *
   * @return {void} No return value
   */
  async mounted() {
    try {
      this.emitter.emit('load', { loading: true })

      let { ticketId, buId, cfsId, typeId } = this.$route.query

      if (!ticketId || !buId || !cfsId || !typeId) {
        throw new Error('Verifique que los parametros de consulta sean correctos')
      }
      ticketId = parseInt(ticketId)
      buId = parseInt(buId)
      cfsId = parseInt(cfsId)
      typeId = parseInt(typeId)

      if (isNaN(ticketId) || isNaN(buId) || isNaN(cfsId) || isNaN(typeId)) {
        throw new Error('Verifique que los campos de consulta sean correctos')
      }

      this.ticket.id = ticketId
      this.ticket.type = typeId
      this.bu.id = buId
      this.cfs.id = cfsId
      
      this.breadcrumbs[1].href = `/impact-tickets/cfs?ticketId=${ticketId}&typeId=${typeId}`

      await this.update()


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

<style scoped>
.icon-button {
  width: 20px;
  color: #1464a5;
}
.icon-button:hover {
  color: #072146;
}
</style>
