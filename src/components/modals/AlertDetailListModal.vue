<template>
  <div>
    <v-row justify="center">
      <v-dialog
        v-model="dialog"
        persistent
        class="modal-dialog"
        width="948"
        :fullscreen="smallWindow"
      >
        <v-card>
          <v-card-title class="pl-10 pb-0 pt-4">
            <!-- Icon -->
            <v-row>
              <v-col cols="12" class="px-0 text-left">
                <div :class="styles.iconTitle">
                  <micro-success v-if="type === 'success'" />
                  <micro-error v-if="type === 'error'" />
                  <micro-caution v-if="type === 'caution'" />
                  <img
                    v-if="type === 'information'"
                    src="/icons/info.svg"
                    :class="styles.iconTitle"
                    alt="Información"
                  />
                </div>
                <div class="float-right">
                  <v-btn variant="text" size="x-small" @click="handleClose">
                    <bbva-core-icon icon="bbva:close" size="m"></bbva-core-icon>
                  </v-btn>
                </div>
              </v-col>
            </v-row>
          </v-card-title>
          <v-card-text class="px-0 pt-0 pb-5">
            <div class="modal-text-inner">
              <!-- Title -->
              <p v-if="title" class="text-h5 font-weight-black pt-0 pb-3">
                {{ title }}
              </p>
              <!-- Message -->
              <p v-if="message" class="pb-5">
                {{ message }}
              </p>
              <!-- Modal data -->
              <ul class="modal-list pl-5 pb-3">
                <li v-if="data.bu" class="pb-3">BU: {{ data.bu }}</li>
                <li v-if="data.cfs" class="pb-3">CFS: {{ data.cfs }}</li>
                <li v-if="data.operative" class="pb-3">Operativa: {{ data.operative }}</li>
                <li v-if="data.elementToAlert" class="pb-3">
                  Elemento a alertar: {{ data.elementToAlert }}
                </li>
                <li v-if="data.operator" class="pb-3">Operador: {{ data.operator }}</li>
                <li v-if="data.notificationDate" class="pb-3">
                  Fecha de notificación: {{ data.notificationDate }}
                </li>
                <li v-if="data.measurementStatus" class="pb-3">
                  Estatus de medición: {{ data.measurementStatus }}
                </li>
                <li v-if="!data.timeSlots.length && data.total" class="pb-3">
                  <!-- Use intl. format to comply for all regions -->
                  Total: {{ Number(data.total).toLocaleString('en-US') }}
                </li>
                <li v-for="(ts, index) in data.timeSlots" :key="ts" class="pb-3">
                  {{ calculateTimeSlotString(index, ts.interval, ts.value, data.elementToAlert) }}
                </li>
              </ul>

              <!-- Acction Button -->
              <bbva-button-default text="Continuar" @click="handleContinue">
                Continuar
              </bbva-button-default>
              <bbva-button-default
                v-if="confirmation"
                text="Cancelar"
                variant="link"
                class="h-75 pl-8"
                @click="close"
              >
                Cerrar
              </bbva-button-default>
            </div>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-row>
    <overlay :open="dialog"></overlay>
  </div>
</template>

<script>
import '@/components/bbva-web-components/bbva-button-default.js'
import '@/components/bbva-web-components/bbva-foundations-icons.js'
import '@/components/bbva-web-components/bbva-foundations-microillustrations.js'
import Overlay from '@/components/overlay/Overlay.vue'
import { ref } from 'vue'

export default {
  data() {
    return {
      // Flag, true is dailog is open
      dialog: false,
      // checks if the window is smaller than the given width
      smallWindow: false,
      // CSS Styles
      styles: {
        iconTitle: ref('icon-title')
      }
    }
  },
  beforeMount() {
    this.onResize()
  },
  components: {
    Overlay
  },
  methods: {
    calculateTimeSlotString(index, interval, value, elementToAlert) {
      return elementToAlert
        ? `Franja horaria ${index + 1}: ${interval} / ${value} ${elementToAlert.toLowerCase()}`
        : `Franja horaria ${index + 1}: ${interval} / ${value}`
    },
    /*
     * Excecutes the close fn provided as a prop.
     */
    handleClose() {
      this.onClose()
    },
    /*
     * Excecutes the "continue" fn provided as a prop.
     */
    handleContinue() {
      this.onClose()
    },
    /*
     * Sets a flag when the window is smaller than the given width
     */
    onResize() {
      this.smallWindow = window.innerWidth <= 1000
    }
  },
  mounted() {
    window.addEventListener('resize', this.onResize)
  },
  props: {
    /* Contains the modal's data to display */
    data: { type: Object, default: {} },
    /* It has the modal submessage */
    message: { type: String, default: '' },
    /* Flag, true if it is open */
    isOpen: { type: Boolean, default: false },
    /* It handles the action to close the modal */
    onClose: { type: Function, default: () => {} },
    /* It handles the accept button */
    onContinue: { type: Function, default: () => {} },
    /* It has the title modal */
    title: { type: String, default: '' },
    /* It is the type of informational model */
    type: { type: String, default: 'information' }
  },
  watch: {
    isOpen(value) {
      this.dialog = value
    }
  }
}
</script>

<style scoped lang="scss">
.icon-title {
  width: 120px;
  height: 120px;
  display: inline-block;
}

modal-dialog {
  width: 600px;
  @media (max-widt: 600px) {
    width: 100%;
  }
}

.modal-list {
  list-style-type: none;
  list-style-image: url('/icons/flag.svg');

  li {
    font-size: 15px;
  }
}

.modal-text-inner {
  padding: 0px 35px;
}
</style>
