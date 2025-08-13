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
              <v-col cols="12">
                <span class="text-h5 font-weight-black pt-0">
                  Deshacer ajuste
                </span>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" class="pt-0 pb-4 fs-22">
                Revisa los datos de origen con el ajuste final y reactivalos
              </v-col>
            </v-row>
            <v-row class="pl-4">
              <v-col cols="12" class="pt-0 pb-3 fs-15">
               País: {{ data.bu }} / Canal: {{ data.cfs }} / Operativa: {{ data.operatives || '-'}}
              </v-col>
            </v-row>
            <v-row class="pl-4">
              <v-col cols="6" class="pt-0 pb-8">
                <div class="fw-500 fs-14 border-bottom-title-modal pb-2" >DATOS ORIGINALES</div>
                <div class="d-flex pt-3 pb-2">
                  <img src="/icons/flag.svg" alt="Icono"/>
                  <span class="fs-15 pl-2">
                    Indisponibilidad origen: {{ data?.original?.availability || '-' }}
                  </span>
                </div>
                <div class="d-flex pb-2">
                  <img src="/icons/flag.svg" alt="Icono"/>
                  <span class="fs-15 pl-2">Errores: {{ data?.original?.errors || '-'}}</span>
                </div>
                <div class="d-flex pb-2">
                  <img src="/icons/flag.svg" alt="Icono"/>
                  <span class="fs-15 pl-2">Actividad: {{ data?.original?.activity || '-' }}</span>
                </div>
                <div class="fw-500 fs-12 pb-3">
                  Otros datos
                </div>
                <div class="fs-12 pb-1">
                  Fecha de inicio: {{ data?.original?.startDate || '-' }}
                </div>
                <div class="fs-12 pb-1">
                  Fecha de fin: {{ data?.original?.endDate  || '-' }}
                </div>
                <div class="fs-12 pb-1">
                  Hora de inicio: {{ data?.original?.startHour || '-' }}
                </div>
                <div class="fs-12 pb-1">
                  Hora de fin: {{ data?.original?.endHour || '-' }}
                </div>
              </v-col>
              <v-col cols="6" class="pt-0 pb-8">
                <div class="fw-500 fs-14 border-bottom-title-modal pb-2" >AJUSTE FINAL</div>
                <div class="d-flex pb-2 pt-3">
                  <img src="/icons/flag.svg" alt="Icono"/>
                  <span class="fs-15 pl-2">
                    Indisponibilidad origen: {{ data?.adjustment?.availability || '-' }}
                  </span>
                </div>
                <div class="d-flex pb-2">
                  <img src="/icons/flag.svg" alt="Icono"/>
                  <span class="fs-15 pl-2">Errores: {{ data?.adjustment?.errors || '-'}}</span>
                </div>
                <div class="d-flex pb-2">
                  <img src="/icons/flag.svg" alt="Icono"/>
                  <span class="fs-15 pl-2">Actividad: {{ data?.adjustment?.activity || '-' }}</span>
                </div>
                <div class="fw-500 fs-12 pb-3">
                  Otros datos
                </div>
                <div class="fs-12 pb-1">
                  Fecha de inicio: {{ data?.adjustment?.startDate || '-'}}
                </div>
                <div class="fs-12 pb-1">
                  Fecha de fin: {{ data?.adjustment?.endDate  || '-' }}
                </div>
                <div class="fs-12 pb-1">
                  Hora de inicio: {{ data?.adjustment?.startHour || '-' }}
                </div>
                <div class="fs-12 pb-1">
                  Hora de fin: {{ data?.adjustment?.endHour || '-' }}
                </div>
              </v-col>
            </v-row>
            <v-row justify="center">
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
    /* Flag, true if the model must be open */
    open: { type: Boolean, default: false },
    /* It closes the modal */
    close: { type: Function, default: () => {} },
    /* This function handle tha action if the user clicks on accept button*/
    onAccept: { type: Function, default: () => {} },
    /* It has the data about the impact adjustment */
    data: { type: Function, default: () => ({}) }
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
