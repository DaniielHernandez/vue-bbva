<template>
  <v-row justify="center">
    <v-dialog
      v-model="dialog"
      persistent
      width="600"
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
                    :src="active ? '/icons/blue-status.svg' : '/icons/execute-alert.svg'"
                    :class="icon-title"
                    alt="Ejecución"/>
                </div>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" class="text-center">
                <span class="fs-22 font-weight-black pt-0">
                  Ejecutar Manualmente
                </span>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" class="pt-0 pb-4 fs-15 text-center">
                Vas ejecutar  manualmente la alerta {{ data.name }}
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
