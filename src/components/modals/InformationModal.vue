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
                <div :class="styles.iconTitle">
                  <micro-success v-if="type === 'success'"/>
                  <micro-error v-if="type === 'error'"/>
                  <micro-caution v-if="type === 'caution'"/>
                  <img v-if="type === 'information'" src="/icons/info.svg"
                    :class="styles.iconTitle"
                    alt="Información"/>
                </div>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" class="text-center">
                <span class="fs-22 font-weight-black pt-0">
                  {{ title }}
                </span>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" class="text-center pt-0">
                {{message}}
              </v-col>
              <v-col cols="12" class="text-center pt-0 fs-15" v-if="subMessage">
                {{subMessage}}
              </v-col>
            </v-row>
            <v-row justify="center" class="pt-8">
              <v-col cols="6" class="text-center">
                <bbva-button-default
                  text="Continuar"
                  @click="next" ></bbva-button-default>
                <bbva-button-default
                  v-if="confirmation"
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
      /* Flag, true is dailog is open */
      dialog: false,
      /* CSS Styles */
      styles: {
        iconTitle: ref('icon-title')
      }
    }
  },
  components: {
    Overlay
  },
  methods: {
    /*
     * It handles the next button click 
     */
    next(){
      if( this.confirmation ) {
         this.onAccept();
      } else if( this.forceOnAccept ) {
         this.onAccept();
         this.close();
      } else {
        this.close();
      }
    }
  },
  props: {
    /* Flag, true if it is open */
    open: { type: Boolean, default: false },
    /* It handles the action to close the modal */
    close: { type: Function, default: () => {} },
    /* It handles the accept button */
    onAccept: { type: Function, default: () => {} },
    /* It is the type of informational model */
    type: { type: String, default: 'success' },
    /* Flag if the modal is confirmation  */
    confirmation: { type: Boolean, default: false },
    /* It has the title modal */
    title: { type: String, default: '' },
    /* It has the modal message */
    message: { type: String, default: '' },
    /* It has the modal submessage */
    subMessage: { type: String, default: '' },
    /* Flag, true if it must execute onAccept function*/
    forceOnAccept: { type: Boolean, default: false }
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
</style>
