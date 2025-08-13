<template>
  <v-row justify="center">
    <v-dialog
      v-model="dialog"
      persistent
      width="900"
    >
      <v-card>
        <v-card-title class="pl-10 pb-0 pt-4">
          <div class="float-right">
            <v-btn
              variant="text"
              size="x-small"
              @click="close"
              >
              <bbva-core-icon icon="bbva:close" size="m"></bbva-core-icon>
            </v-btn>
          </div>
        </v-card-title>
        <v-card-text class="pt-0">
          <v-container class="pt-0">
            <v-row>
              <v-col cols="12" class="pt-0 text-center">
                <div :class="icon-title">
                  <img
                    :src="subscribe ? '/icons/big-star-gold.svg' : '/icons/big-star-blue.svg'"
                    :class="icon-title"
                    alt="Suscripción"/>
                </div>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" class="text-center">
                <span class="fs-22 font-weight-black pt-0">
                  {{ subscribe ? 'Te vas a suscribir a la siguiente alerta' : 
                     'Vas a recharzar la suscribción de la siguiente alerta'
                  }}
                </span>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" class="pt-0 pb-4 fs-15 text-center">
                {{ ` BU: ${data.bu}, CFS: ${data.cfs}, Operativa: ${data.operative},
                     Elemento a alertar: ${data.elementToAlert}, Nombre: ${data.name}, 
                     Operador: ${data.operator}, Valor: ${data.value1},
                     Periodo de ejecución:
                     ${data.executionPeriod} ${data.daysOfWeek ? `/${data.daysOfWeek.toString()}` : ''},
                     Periodo de tiempo: ${data.timePeriod}
                `}}
              </v-col>
            </v-row>
            <v-row justify="center" class="text-center">
              <v-col cols="12">
                <bbva-button-default
                  text="Aceptar"
                  @click="onAccept" ></bbva-button-default>
                <bbva-button-default
                  text="Cancelar"
                  variant="link"
                  class="h-75 pl-8"
                  @click="close"></bbva-button-default>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-row>
  <overlay :open="dialog"></overlay>
</template>

<script>

import '@/components/bbva-web-components/bbva-button-default.js'
import '@/components/bbva-web-components/bbva-foundations-icons.js'
import '@/components/bbva-web-components/bbva-foundations-microillustrations.js'
import Overlay from "@/components/overlay/Overlay.vue"
import { ref } from 'vue';
// requests
import { getSetupAlertAPI } from '@/requests/alerts.js';

export default {
  data() {
    return {
      /* Flag to open the modal */
      dialog: false,
    }
  },
  components: {
    Overlay
  },
  props: {
      /* Setup Alert's data*/
    data: { type: Function, default: () => ({}) },
    /* Flag, true if the model must be open */
    open: { type: Boolean, default: false },
    /* It closes the modal */
    close: { type: Function, default: () => {} },
    /* This function handle tha action if the user clicks on accept button*/
    onAccept: { type: Function, default: () => {} },
    /* Flag, true if it is suscribes to the setup alert*/
    subscribe: { type: Boolean, default: true }
  },
  watch: {
    open(value) {
      this.dialog = value;
    },
  }
}
</script>

<style>
.icon-title {
  width: 80px;
  height: 80px;
  display: inline-block;
}
.border-bottom-title-modal {
  border-bottom: 1px solid #E0E0E0;
}
</style>
