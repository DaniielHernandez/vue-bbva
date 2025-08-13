<!-- eslint-disable vue/no-deprecated-slot-attribute -->
<template> 
  <app-bar />
  <simple-section-header
    title="Ajustes de impacto"
    backLabel=""
    icon="/icons/balance.svg"
  />
   <v-container fluid class="pl-xl-12 pl-lg-12">
    <v-row>
      <v-col class="d-flex pl-0 pt-0 pb-0">
        <bbva-form-toggle
          class="toggle-adjustments"
          :checked="myAdjustments"
          @formToggleSwitchChange="switchMyAdjustments"
            ><span class="pl-2">Tus ajustes</span></bbva-form-toggle>
        <div class="pt-2">
        <bbva-web-link
          :disabled="!Object.keys(data).length"
          class="primary fw-500"
          icon="bbva:download"
          @click="download"
        >
          Descargar
        </bbva-web-link>
        </div>
      </v-col>
    </v-row>
   </v-container>
  <filter-table
    :filters="filters.options"
    :nestedFields="filters.nestedFilterFields"
    :search="searchFilters"
    :clear="false"
    v-if="filters.options.length"/>
  <no-data-message 
     v-if="!Object.keys(data).length"
     title="Información de la tabla"
     :message="filters.values.length ? 'No hay datos para los filtros seleccionados' :
              'No hay datos que mostrar en la tabla'"
  />
  <v-container v-else fluid class="pl-12">
    <v-row>
      <v-col>
        <v-table>
          <thead>
            <tr>
              <th
                v-for="(header, index) in headers"
                :id="`table-header${index}`"
                :key="`table-header${index}`"
                >
                <bbva-web-table-header-text>{{header.title}}</bbva-web-table-header-text>
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(id, indexRow) in Object.keys(data).sort((a,b) => parseInt(a) - parseInt(b) )"
              :key="`tr-body-${indexRow}`"
              >
              <td>{{ data[id].bu }}</td>
              <td>{{ data[id].cfs }}</td>
              <td>{{ data[id].stage }}</td>
              <td>{{ `${data[id].startDate} - ${data[id].endDate}` }}</td>
              <td>{{ `${data[id].startHour} - ${data[id].endHour}` }}</td>
              <td v-if="data[id].ticket">{{ data[id].ticket }}</td>
              <td v-else>
                <div style="width: 80px;">
                  <bbva-help-tooltip
                    class="tooltip-impact-adjustment"
                    :opened="openedTooltip === id"
                    horizontalPlacement="left"
                    @help-tooltip-overlay-click="closeTooltip"
                  >
                    <bbva-web-link
                      slot="invoker"
                      @click="() => openTooltip(id)"
                      class="icon-url fs-14 fw-500"
                      icon="bbva:info" size="s"
                      >Sin folio</bbva-web-link>
                    <div>
                      <bbva-web-link
                        class="light-blue fw-500"
                        icon="bbva:document"
                        @click="() => openAssociateModal(id, false)">
                        Asociar 
                      </bbva-web-link>
                      <bbva-web-link
                        class="light-blue fw-500"
                        icon="bbva:addnotes"
                        @click="() => openAssociateModal(id, true)">
                        Crear folio y asociar
                      </bbva-web-link>
                    </div>
                  </bbva-help-tooltip>
                </div>
              </td>
              <td>{{ data[id].user }}</td>
              <td class="text-right">
                <bbva-web-table-body-action
                  @click="() => openRevertModal(id)"
                  class="icon-button"
                  icon="bbva:frequency" size="m"
                  ></bbva-web-table-body-action>
              </td>
            </tr>
          </tbody>
          <tfoot align="center">
            <tr>
              <td  colspan="8">
                <bbva-web-table-footer
                   v-if="more"
                   @click="loadMore"
                   class="load-more"
                  :loading="loading" loading-text="Cargando">Ver más</bbva-web-table-footer>
                <span v-else :class="second-column">no hay más registros por mostrar</span>
              </td>
            </tr>
          </tfoot>
        </v-table>
      </v-col>
    </v-row >
  </v-container>
  <revert-impact-adjustment-modal
    :open="revertModal.open" :close="closeRevertModal" :onAccept="revert"
    :data="revertModal.data"
    />
    <associate-ticket 
      :create="associateModal.create"
      :open="associateModal.open"
      :close="closeAssociateModal"
      :data="associateModal.data"
      :save="saveAssociate"
      />
</template>

<script>
//  Components
import AssociateTicket from '@/components/forms/AssociateTicket.vue';
import RevertImpactAdjustmentModal from '@/components/modals/RevertImpactAdjustmentModal.vue';
import SimpleSectionHeader from '@/components/headers/SimpleSectionHeader.vue'
import FilterTable from "@/components/table/FilterTable.vue"
import NoDataMessage from '@/components/utils/NoDataMessage.vue'
import '@/components/bbva-web-components/bbva-help-tooltip.js'
import '@/components/bbva-web-components/bbva-web-table-header.js'
import '@/components/bbva-web-components/bbva-web-table-footer.js'
import '@/components/bbva-web-components/bbva-web-link.js'
import '@/components/bbva-web-components/bbva-web-table-body.js'
import '@/components/bbva-web-components/bbva-form-toggle.js';
import AppBar from "@/components/AppBar/AppBar.vue";
/* Constants */
import { headers, filtersTable, nestedFilterFields } from '@/constants/impactAdjustments.js';
import { pagination } from '@/constants/pagination';
/* Requests */
import {
  getImpactAdjustmentAPI,
  getImpactAdjustmentsAPI,
  revertImpactAdjustmentAPI,
  createTicketAPI,
  getExcelImpactAdjustmentsAPI,
  associateTicketAPI
} from '@/requests/impactAdjustments.js';
/* Utils */
import { parseDataTable } from '@/utils/impactAdjustments';
import { parseCatalog } from '@/utils/form';
import { filtersCamelCase } from '@/utils/general';

/*
 *  https://impact-adjustments-dot-dev-bbva-service-level-plat.ew.r.appspot.com/impact-adjustments
 */
export default {
  data() {
    return {
      /* Filter my adjustments */
      myAdjustments: false, 
      /* Headers for the table */
      headers,
      /* Filters Inputs */
      filters: { values: [], options: filtersTable, nestedFilterFields },
      /* It has the data to show into the table */
      data: {},
      /* It has the pagination related to the table */
      pagination: { ...pagination },
      /* Total of item related to impact adjustments */
      total: 0,
      /* Flag to open the tooltip */
      openedTooltip: 0,
      /* Data to open the modal to associate and create ticket */
      associateModal: {
        data: {},
        id: null,
        open: false
      },
      /* Data to open the modal to revert adjustment */
      revertModal: {
        open: false,
        id: null,
      }
    }
  },
  components: {
    AppBar,
    AssociateTicket,
    RevertImpactAdjustmentModal,
    SimpleSectionHeader,
    FilterTable,
    NoDataMessage
  },
  beforeMount(){
    this.loadData();
  },
  methods: {
    /*
     * It switches the value for myAdjustment filter and search the data with the filter updated
     */
    switchMyAdjustments() {
      this.myAdjustments = !this.myAdjustments;
      this.search();
    },
    /*
     * It downloads the excel file
     */
    download() {
      this.emitter.emit("load", { loading: true });
      getExcelImpactAdjustmentsAPI( this.allFilters() ).then(
        (response) => {
        const blob = new Blob(
          [response.data], { type: 'application/vnd.ms-excel' }
        )
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.download = `ajustes_de_impacto.xlsx`;
        link.click()
        URL.revokeObjectURL(link.href)
        this.emitter.emit("load", { loading: false });
      }).catch((error) => {
        this.emitter.emit("load", { loading: false });
        this.emitter.emit('error', { action: 'descargar ajustes de impacto',  error });
      });
    },
    /*
     * It associates and/or creates the ticket to and adjustment
     * @param {Object} values              Values to create the ticket
     * @param {String} values.id        Ticket's id
     * @param {String} values.ticket        Ticket
     * @param {string} values.description  Ticket's description
     */
    saveAssociate(values) {
      if( this.associateModal.create ) {
        this.createTicket(values);
      } else {
        this.addTicket(values);
      }
    },
    /*
     * It closes the form modal to associate a ticket
     */
    closeAssociateModal() {
      this.associateModal = {
        data: {},
        open: false,
       id: null,
       create: false
      };
    },
    /*
     * It opens the form modal to associate/create a ticket
     * @param {Number}  id      Adjustsment's ID
     * @param {Boolean} create  Flag, true if the modal must create a ticket
     */
    openAssociateModal(id, create) {
      this.associateModal = {
        data: this.data[id],
        open: true,
        id,
        create
      };
    },
    /*
     * It opens the modal to revert and adjustment
     * @param {Number}  id      Adjustsment's ID
     */
    openRevertModal(id) {
      this.emitter.emit('load', { loading: true });
      getImpactAdjustmentAPI(id).then( (response) => {
        this.emitter.emit('load', { loading: false });
        this.revertModal = { open: true, id, data: response.data }
      }).catch((error) => {
        this.emitter.emit('load', { loading: false });
        this.emitter.emit('error', { action: 'obtener tabla',  error });
      });
    },
    /*
     * It closes the revert modal
     */
    closeRevertModal() {
      this.revertModal = { open: false, id: null };
    },
    /*
     * it opens the tooltip for a specific column
     * @param {Number}  id      Adjustsment's ID
     */
    openTooltip(id) {
      this.openedTooltip = id;
    },
    /*
     * It returns all the filter
     */
    allFilters() {
      return filtersCamelCase([
       ...this.filters.values.filter( (item) => !!item.value ),
       { name: 'myAdjustments', value: this.myAdjustments}
      ]);
    },
    /*
     * It loads the initial data
     */
    loadData() {
      const requests = this.filters.options.filter( (item) => item.request );

      this.emitter.emit('load', { loading: true });
      Promise.all(
        requests.map( (item) => item.request(1, 5000) )
      ).then( (responses) => {
        for( let i = 0; i < responses.length; i++) {
          this.filters.options[i].options = parseCatalog(responses[i].data);
        }
        this.search();
      }).catch((error) => {
      this.emitter.emit('load', { loading: false });
        this.emitter.emit('error', { action: 'obtener catalogos',  error });
      });
    },
    /*
     * It catch the filters and executes the medthod search to get data
     */
    searchFilters(filters) {
      this.filters.values = [...filters];
      this.search();
    },
    /*
     * It searches the data to show into the table
     * @param {Number} pageNumber  Page's number
     * @param {Number} pageSize    Page's size
     */
    search(pageNumber = pagination.number, pageSize = pagination.size) {
      this.emitter.emit('load', { loading: true });
      getImpactAdjustmentsAPI( pageNumber, pageSize, this.allFilters() ).then( (response) => {

        if( this.pagination.number === pageNumber ) {
          this.data = {...parseDataTable( response.data.items ) };
        } else {
          this.data = {...this.data, ...parseDataTable( response.data.items ) };
        }
        this.more = response.data.count > Object.keys(this.data).length;
        this.emitter.emit('load', { loading: false });
        this.pagination.size = pageSize;
        this.pagination.number = pageNumber;
      }).catch( (error) => {
        this.emitter.emit('load', { loading: false });
        this.emitter.emit('error', { action: 'obtener tabla',  error });
      });
    },
    /*
     * it load more elements for the table
     */
    loadMore() {
      this.search( this.pagination.number + 1, this.pagination.size );
    },
    /*
     * It reverts an adjustment
     */
    revert() {
      this.emitter.emit('load', { loading: true });
      revertImpactAdjustmentAPI( this.revertModal.id ).then( () => {
        this.emitter.emit('load', { loading: false });
        this.search();
        this.closeRevertModal();
        this.emitter.emit(
          'informational',
          {
            type: 'success',
            title: 'Estado original del ajuste',
            message: 'El ajuste ha vuelto al estado original que se realizo por normalización de impacto'
          }
        );

      }).catch( (error) => {
        this.emitter.emit('load', { loading: false });
        this.emitter.emit('error', { action: 'revertir ajuste',  error });
      });;
    },
    /*
     * Associate a ticket to an adjustment
     *
     * @param {Object} values            Values to create the ticket
     * @param {String} values.fid        Ticket's ID
     */
    addTicket(values) {
      const adjustmentId = this.associateModal.id;
      this.closeAssociateModal();
      this.emitter.emit('load', { loading: true });
      associateTicketAPI({adjustmentId, ...values}).then( () => {
        this.openedTooltip = 0;
        this.emitter.emit('load', { loading: false });
        this.emitter.emit(
          'informational',
          {
            type: 'success',
            title: 'Asociación de folio',
            message: `Has asociado correctamente el folio no. ${values.ticketId}`
          }
        );
        this.search();
      }).catch((error) => {
        this.emitter.emit('load', { loading: false });
        this.emitter.emit('error', { action: 'Asociar folio',  error });
      });
    },
    /*
     * It creates a ticket and after associates the ticket to and adjustment
     * @param {Object} values              Values to create the ticket
     * @param {String} values.ticket        Ticket
     * @param {string} values.description  Ticket's description
     */
    createTicket(values) {
      const adjustmentId = this.associateModal.id;
      const buId = this.associateModal.data.buId;
      this.closeAssociateModal();
      this.emitter.emit('load', { loading: true });
      createTicketAPI({ adjustmentId, ...values, buId}).then( () => {
        this.openedTooltip = 0;
        this.emitter.emit('load', { loading: false });
        this.emitter.emit(
          'informational',
          {
            type: 'success',
            title: 'Creación y asociación de folio',
            message: `Has creado y asociado correctamente el folio no. ${values.ticketId}`
          }
        );
        this.search();
      }).catch( (error) => {
        this.emitter.emit('load', { loading: false });
        this.emitter.emit('error', { action: 'Crear folio',  error });
      })
    },
    /*
     * It closes th tooltip opened over some column
     */
    closeTooltip() {
      this.openedTooltip = 0;
    }
  }
}
</script>

<style>
.icon-url {
  color: #1464A5;
  padding-bottom: 1rem;
  padding-top: 1rem;
}
.icon-url:hover {
  color: #024581;
}

.icon-button {
  width: 40px;
  color: #1464A5;
}
.icon-button:hover {
  color: #024581;
}
.second-column {
  color: #666666;
  font-size: 12px;
  font-weight: 350 !important;
}
.button-active {
  width: 40px;
  color: #8E7022;
}
.text-column {
  font-size: 14px !important;
}
.load-more {
  font-size: 15px;
  font-weight: 500;
}
.tooltip-impact-adjustment {
  --_help-tooltip-overlay-bg-color: var(--bbva-help-tooltip-dark-mode-overlay-color, unset);
  --_help-tooltip-bg-color: var(--bbva-help-tooltip-dark-mode-background-color, #004486);
  --_help-tooltip-after-bg-color: #004486;
}
.toggle-adjustments {
  width: 170px;
}

.v-table__wrapper {
  overflow: unset;
}
</style>

