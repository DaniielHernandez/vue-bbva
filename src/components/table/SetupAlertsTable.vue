<template> 
  <v-container fluid>
    <v-row>
      <v-col>
        <filter-setup-alerts :search="searchFilter" />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-table class="pl-10 pr-4 pt-6" >
          <thead>
            <tr>
              <th>
                <bbva-web-table-header-text
                  order=""
                  :sort-active="orderBy === 'bu'"
                  @sort-criteria="(evt) => sortTable('bu')"
                  id="bu">
                  BU/CFS
                </bbva-web-table-header-text>
              </th>
              <th>
                <bbva-web-table-header-text id="operative">OPERATIVA</bbva-web-table-header-text>
              </th>
              <th>
                <bbva-web-table-header-text
                  order=""
                  :sort-active="orderBy === 'elementToAlert'"
                  @sort-criteria="(evt) => sortTable('elementToAlert')"
                  id="elementToAlert">
                  ELEM. ALERTAR / NOMBRE
                </bbva-web-table-header-text>
              </th>
              <th>
                <bbva-web-table-header-text id="operator">OPERADOR</bbva-web-table-header-text>
              </th>
              <th>
                <bbva-web-table-header-text
                  order=""
                  :sort-active="orderBy === 'author'"
                  @sort-criteria="(evt) => sortTable('author')"
                  id="author">AUTOR</bbva-web-table-header-text>
              </th>
              <th>
                <bbva-web-table-header-text id="executionPeriod">PERIODI EJECT</bbva-web-table-header-text>
              </th>
              <th>
                <bbva-web-table-header-text id="timePeriod">PERIODO TIEMPO</bbva-web-table-header-text>
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, indexRow) in data"
              :key="`tr-body-${indexRow}`"
              >
              <td>
                <div
                  class="text-column">
                  {{ item.bu }}
                  <br/>
                  <span class="second-column">
                  {{ item.cfs }}
                  </span>
                </div>
              </td>  
              <td>{{ item.operative || '-' }}</td>
              <td>
                <div
                  class="text-column">
                  {{ item.elementToAlert }}
                  <br/>
                  <span class="second-column">
                  {{ item.name }}
                  </span>
                </div>
              </td>
              <td>{{ item.operator || '-' }}</td>
              <td>{{ item.user }}</td>
              <td>
                <div class="text-column">
                  {{ item.executionPeriod || '-' }}
                </div>
                <span class="second-column" v-if="item.daysOfWeek">
                  {{ item.daysOfWeek.toString() }}
                </span>
              </td>
              <td>{{ item.timePeriod || '-' }}</td>
              <td class="text-right">
                <div class="actions-table">
                  <bbva-web-table-body-action
                    :class=" item.active ? 'button-active' : 'icon-button-gray'"
                    @click="() => activateAlert( item, !item.active )"
                    icon="bbva:checkmark"
                    size="l"
                    :iconLink="true"
                    ></bbva-web-table-body-action>
                  <bbva-web-table-body-action
                    :class=" item.subscribed ? 'button-subscribed' : 'icon-button'"
                    icon="bbva:favorite"
                    size="l"
                    :iconLink="true"
                    @click="() => subscribe( item, !item.subscribed )"
                    ></bbva-web-table-body-action>
                  <tooltip-setup-alert
                    :id="item.id"
                    :onEdit="onEdit"
                    :onDelete="onDelete"
                    :onDuplicate="onDuplicate"
                    :onExecute="executeAlert"
                    />
                  </div>
              </td>
            </tr>
          </tbody>
          <tfoot align="center" class="footer-table">
            <tr>
              <td  colspan="8">
                <bbva-web-table-footer
                   v-if="more"
                   @click="loadMore"
                   class="load-more"
                  :loading="loadingTable" loading-text="Cargando">Ver más</bbva-web-table-footer>
                <span v-else class="second-column">no hay más registros por mostrar</span>
              </td>
            </tr>
          </tfoot>
        </v-table>
        </v-col>
    </v-row>
  </v-container>
  <subscribe-setup-alert
      :data="subscription.data"
      :onAccept="onSubscribe"
      :close="closeSubscription"
      :open="subscription.open"
      :subscribe="subscription.subscribed"
    />
  <active-setup-alert-modal
      :data="activate.data"
      :onAccept="onActive"
      :close="closeActive"
      :open="activate.open"
      :active="activate.active"
    />
  <execute-setup-alert-modal
      :onAccept="onExecute"
      :close="closeExecution"
      :open="execution.open"
      :data="execution.data"
    />
  <execute-setup-alert
    :open="execution.form"
    :save="onExecute"
    :close="closeExecution"
    :buId="execution?.data?.buId"
   />
</template> 

<script>
// constants
import { pagination } from '@/constants/pagination';
// components
import '@/components/bbva-web-components/bbva-foundations-icons.js'
import '@/components/bbva-web-components/bbva-web-table-body.js'
import '@/components/bbva-web-components/bbva-web-table-header.js'
import '@/components/bbva-web-components/bbva-web-table-footer.js'
import FilterSetupAlerts from '@/components/table/FilterSetupAlerts.vue';
import TooltipSetupAlert from '@/components/tooltips/TooltipSetupAlert.vue';
import SubscribeSetupAlert from '@/components/modals/SubscribeSetupAlertModal.vue';
import ActiveSetupAlertModal from '@/components/modals/ActiveSetupAlertModal.vue';
import ExecuteSetupAlertModal from '@/components/modals/ExecuteSetupAlertModal.vue';
import ExecuteSetupAlert from '@/components/forms/ExecuteSetupAlert.vue';
/* Request */
import {
  activateSetupAlertAPI,
  deleteSetupAlertAPI,
  executeSetupAlertAPI,
  subscribeSetupAlertAPI
} from '@/requests/alerts.js';
/* constants */
import { elementsToAlertIds } from '@/constants/elementsToAlert.js'

export default {
  data() {
    return {
      /* Sort the table, it can be ASC or DESC */
      order: 'DESC',
      /* It has the value to sort by BU or CFS*/
      orderBy: 'bu',
      /* Table's pagination */
      page: { ...pagination },
      /* Table's filters */
      filters: [],
      /* Values to handle subscription */
      subscription: {
        open: false,
        data: null,
        subscribed: false
      },
      /* Values to handle active/deactive alert */
      activate: {
        open: false,
        data: null,
        active: false
      },
      /* Values to handle execute alert */
      execution: {
        open: false,
        data: null,
        form: false
      }
    }
  },
  components: {
    FilterSetupAlerts,
    SubscribeSetupAlert,
    ActiveSetupAlertModal,
    ExecuteSetupAlertModal,
    ExecuteSetupAlert,
    TooltipSetupAlert
  },
  props: {
    /* function to search the data*/
    search: { type: Function, default: () => {} },
    /* Data for the table */
    data: { type: Function, default: () => ([]) },
    /* Flag, true if there is more items */
    more: { type: Boolean, default: false },
    /* Flag, true if it is loading */
    loadingTable: { type: Boolean, default: false }
  },
  methods: {
    /*
     * This methods edits an item
     * @param {number} id Setup alert's id
     */
    onEdit(id) {
      this.$router.push(`/setup/setup-alerts/${id}`);
    },
    /*
     * This show warning to delete alert modal
     * @param {number} id setup alert's id
     */
    onDelete(id) {
      this.emitter.emit(
        'informational',
        {
          title: '¿Seguro que quieres eliminar la alerta?',
          type: 'caution',
          confirmation: true,
          message: 'Con esta acción se eliminará esta alerta.',
          onAccept: () => this.removeAlert(id),
          forceOnAccept: true
        }
      )
    },
    /*
     * This methods deletes an item
     * @param {number} id setup alert's id
     */
    removeAlert(id) {
      this.emitter.emit("load", { loading: true });
      deleteSetupAlertAPI(id).then( () => {
        this.emitter.emit("load", { loading: false });
        this.emitter.emit(
          'informational',
          {
            title:  'Alerta eliminada',
            type: 'success',
            message: 'Se ha elminado la alerta correctamente'
          }
        )

        const index = this.data.findIndex((item) => item.id === id );
        if(index >= 0) {
          this.data.splice(index, 1)
        }
      }).catch( (error) => {
        this.emitter.emit("load", { loading: false });
        this.emitter.emit('error', { action: 'eliminar alerta',  error });
      })

    },
    /*
     * It opens the active's modal
     * @param {Object} data Setup Alert object
     * @param {boolean} active Flag, true if the alert must be active
     */
    activateAlert(data, active) {
      this.activate = {
        data, open: true, active
      }
    },
    /*
     * It opens the execute's modal
     * @param {Number} id Setup Alert object
     */
    executeAlert(id) {
      const data = this.data.find( (item) => item.id === id);
      if( data.elmentToAlertId === elementsToAlertIds.foliosAgata ) {
        this.execution = { data, open: false, form: true }
      } else {
        this.execution = { data, open: true, form: false }
      }
    },
    /*
     * This methods active/deactive a setup alert
     * @param {number} id Setup alert's id
     * @param {boolean} active  Flag, true if the alert must be active
     */
    onActive(){
      this.emitter.emit("load", { loading: true });
      activateSetupAlertAPI(this.activate.data.id, this.activate.active).then( (response) => {
        this.emitter.emit("load", { loading: false });
        this.activate.open = false;
        this.emitter.emit(
          'informational',
          {
            title:  this.activate.active ? 'Alerta activada' : 'Alerta desactivada',
            type: 'success',
            message: this.activate.active ? 'Has activado la alerta correctamente' : 'Has desactivado la alerta correctamente'
          }
        )

        const index = this.data.findIndex((item) => item.id === this.activate.data.id );
        if(index >= 0) {
          this.data[index].active = this.activate.active;
        }
        this.closeActive();
      }).catch( (error) => {
        this.closeActive();
        this.emitter.emit("load", { loading: false });
        this.emitter.emit('error', { action: 'activar/desactivar alerta',  error });
      })
    },
    /*
     * It opens the subscription's modal
     * @param {Object} data Setup Alert object
     * @param {boolean} subscribed Flag, true is te laert must be subscribed 
     */
    subscribe(data, subscribed) {
      this.subscription = {
        data, open: true, subscribed
      }
    },
    /*
     * It closes the active's modal
     */
    closeActive() {
      this.activate = {
        data: {}, open: false, active: false
      };
    },
    /*
     * It closes the subscription's modal
     */
    closeSubscription() {
      this.subscription = {
        data: {}, open: false, subscribed: false
      };
    },
    /*
     * It closes the subscription's modal
     */
    closeExecution() {
      this.execution = {
        data: {}, open: false, form: false
      };
    },
    closeSubscription() {
      this.subscription = {
        id: null, open: false, subscribe: false
      };
    },
    /*
     * This methods subscribes or remove suscription for the currect user
     * @param {number} id Setup alert's id
     * @param {boolean} subscribe Flag, true if the user has to be subscribed to the alert
     */
    onSubscribe() {
      this.emitter.emit("load", { loading: true });
      subscribeSetupAlertAPI(this.subscription.data.id, this.subscription.subscribed).then( (response) => {
        this.emitter.emit("load", { loading: false });

        this.subscription.open = false;
        this.emitter.emit(
          'informational',
          {
            title:  this.subscription.subscribed ? 'Suscripción realizada' : 'Haz rechazado la suscripción',
            type: 'success',
            message: this.subscription.subscribed ? 'Se ha suscrito correctamente' : 'Se ha rechazado la suscripción a la alerta correctamente'
          }
        )

        const index = this.data.findIndex((item) => item.id === this.subscription.data.id );
        if(index >= 0) {
          this.data[index].subscribed = this.subscription.subscribed;
        }
        this.closeSubscription();
      }).catch( (error) => {
        this.closeSubscription();
        this.emitter.emit("load", { loading: false });
        this.emitter.emit('error', { action: 'suscribir/remover suscripción',  error });
      })
    },
    /*
     * This methods duplicates a setup alert
     * @param {number} id setup alert's id
     */
    onDuplicate(id) {
      this.$router.push(`/setup/setup-alerts/${id}?duplicate=true`);
    },

    /*
     * This methods executes a setup alert
     * @param {Objet} params Params to execute the alert
     */
    onExecute(params = {}) {
      this.emitter.emit("load", { loading: true });
      executeSetupAlertAPI({id: this.execution.data.id, ...params}).then( (response) => {
        this.emitter.emit("load", { loading: false });

        if(response.status === 204) {
          this.emitter.emit(
            'informational',
            {
              title:  'Sin coincidencias',
              type: 'caution',
              message: 'No se han encontrado coincidencias en la ejecución'
            }
          )
        } else {
          this.emitter.emit(
            'informational',
            {
              title:  'Ejecución realizada con éxito',
              type: 'success',
              message: 'La alerta se ha ejecutado con éxito. Consultar el resultado en la notificación de alertas'
            }
          )
        }

        this.closeExecution();
      }).catch( (error) => {
        this.closeExecution();
        this.emitter.emit("load", { loading: false });
        this.emitter.emit('error', { action: 'ejecutar alerta',  error });
      })

    },
    /*
     * It sort the table by any header
     * @param {String} header Header's name
     */
    sortTable(header) {
      const tag = document.getElementById(header);
      if( this.order === 'ASC' ) {
        tag.removeAttribute('sort-ascending');
        tag.setAttribute('sort-descending', true);
      } else {
        tag.removeAttribute('sort-descending');
        tag.setAttribute('sort-ascending', true);
      }
      this.orderBy = header;
      this.order = this.order === 'ASC' ? 'DESC' : 'ASC';
      this.search(
        [
          { name: 'order', value: this.order },
          { name: 'orderBy', value: this.orderBy },
          ...this.filters
        ], 1, this.page.size
      );
    },
    /*
     * It loads more data to be showed into the table
     */
    loadMore() {
      this.page.number += 1;
      this.search(
        [
          { name: 'order', value: this.order },
          { name: 'orderBy', value: this.orderBy },
          ...this.filters
        ], this.page.number, this.page.size
      );
    },
    /*
     * This method saves the filters before to search table's data
     * @param {Object[]} filter Filter to get the data table
     * @param {string} filter.name  Filter's name
     * @param {string} filter.value Filter's value
     */
    searchFilter(filters) {
      this.filters = filters;
      this.page.number = 1;
      this.search(
        [
          { name: 'order', value: this.order },
          { name: 'orderBy', value: this.orderBy },
          ...filters
        ], this.page.number, this.page.size
      );
    }
  },
};
</script>

<style>
.second-column {
  color: #666666;
  font-size: 12px;
  font-weight: 350 !important;
}

.text-column {
  font-size: 14px !important;
}
.load-more {
  font-size: 15px;
  font-weight: 500;
}
.button-subscribed {
  width: 40px;
  color: #8E7022;
}
.button-active {
  width: 40px;
  color: #48AE64;
}
.actions-table {
  display: inline-flex;
}
.icon-button-gray {
  width: 40px;
  color: #BDBDBD;
}
.icon-button {
  width: 40px;
  color: #1464A5;
}
.icon-button:hover {
  color: #072146;
}
.v-table__wrapper {
  overflow-y: hidden;
  overflow-x: auto;
}

.footer-table {
  height: 125px;
  vertical-align: text-top;
}

</style>
