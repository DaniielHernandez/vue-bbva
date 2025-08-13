<template>
  <app-bar />
  <section-header
    title="Datos del modelo"
    backPath="/setup/admin-models-environments"
    icon="/icons/Download-Certificate.svg"
  />
  <v-container fluid class="pl-12">
    <v-row>
      <v-col>
        <div>
          <div>
            <v-row>
              <v-col>
                <h3>Resumen Modelo</h3>
                <bbva-web-link
                  class="primary fw-500"
                  icon="bbva:download"
                  @click="downloadModelData"
                >
                  Descargar
                </bbva-web-link>
              </v-col>
            </v-row>
            <h4 class="p-4">Datos CFS</h4>
            <v-row class="start mb-5">
              <v-col cols="2">
                <div :class="styles.colItem">
                  <img src="/icons/flag.svg" alt="Icono de listado" />
                  <span class="pl-1 font-catalog">Business Unit: {{ labels.bu?.name }}</span>
                </div>
              </v-col>

              <v-col cols="2">
                <div :class="styles.colItem">
                  <img src="/icons/flag.svg" alt="Icono de listado" />
                  <span class="pl-1 font-catalog">CFS: {{ labels.cfs?.name }}</span>
                </div>
              </v-col>
              <v-col cols="4">
                <div :class="styles.colItem">
                  <img src="/icons/flag.svg" alt="Icono de listado" />
                  <span class="pl-1 font-catalog"
                    >Service Owner / Nombre y apellidos: {{ labels.serviceOwner?.fullName }}</span
                  >
                </div>
              </v-col>
              <v-col cols="2">
                <div :class="styles.colItem">
                  <img src="/icons/flag.svg" alt="Icono de listado" />
                  <span class="pl-1 font-catalog">Entorno: {{ labels.environment?.title }}</span>
                </div>
              </v-col>
            </v-row>

            <h4 class="p-4">Ventana</h4>
            <div v-for="(ventana, index) in labels.windows" :key="index">
              <v-row class="start mb-5">
                <v-col cols="2">
                  <div class="styles.colItem">
                    <img src="/icons/flag.svg" alt="Icono de listado" />
                    <span class="pl-1 font-catalog">Día inicio: {{ ventana.startDay }}</span>
                  </div>
                </v-col>
                <v-col cols="2">
                  <div :class="styles.colItem">
                    <img src="/icons/flag.svg" alt="Icono de listado" />
                    <span class="pl-1 font-catalog">Hora inicio: {{ ventana.startTime }}</span>
                  </div>
                </v-col>
                <v-col cols="2">
                  <div :class="styles.colItem">
                    <img src="/icons/flag.svg" alt="Icono de listado" />
                    <span class="pl-1 font-catalog">Día fin: {{ ventana.endDay }}</span>
                  </div>
                </v-col>
                <v-col cols="2">
                  <div :class="styles.colItem">
                    <img src="/icons/flag.svg" alt="Icono de listado" />
                    <span class="pl-1 font-catalog">Hora fin: {{ ventana.endTime }}</span>
                  </div>
                </v-col>
                <v-col cols="2" align-self="center">
                  <bbva-web-form-checkbox
                    :disabled="true"
                    :checked="ventana.nonBusinessDays === 1"
                    name="excluirDiasInhabiles"
                  >
                    Excluir días inhábiles
                  </bbva-web-form-checkbox>
                </v-col>
              </v-row>
            </div>

            <h4 class="p-4">Datos de medición</h4>
            <v-row class="start mb-5">
              <v-col cols="2">
                <div :class="styles.colItem">
                  <img src="/icons/flag.svg" alt="Icono de listado" />
                  <span class="pl-1 font-catalog">Estatus de modelo: {{ labels.status }}</span>
                </div>
              </v-col>

              <v-col cols="2">
                <div :class="styles.colItem">
                  <img src="/icons/flag.svg" alt="Icono de listado" />
                  <span class="pl-1 font-catalog">Versión: {{ labels.version }}</span>
                </div>
              </v-col>
              <v-col cols="4">
                <div :class="styles.colItem">
                  <img src="/icons/flag.svg" alt="Icono de listado" />
                  <span class="pl-1 font-catalog"
                    >Meta disponibilidad: {{ labels.availabilityTarget }}</span
                  >
                </div>
              </v-col>
            </v-row>

            <h4 class="p-4">Fechas</h4>
            <v-row class="start mb-5">
              <v-col cols="3">
                <div :class="styles.colItem">
                  <img src="/icons/flag.svg" alt="Icono de listado" />
                  <span class="pl-1 font-catalog">Fecha alta: {{ labels.registrationDate }}</span>
                </div>
              </v-col>

              <v-col cols="3">
                <div :class="styles.colItem">
                  <img src="/icons/flag.svg" alt="Icono de listado" />
                  <span class="pl-1 font-catalog"
                    >Fecha de activación: {{ labels.startDate }}</span
                  >
                </div>
              </v-col>
            </v-row>

            <div v-for="(operative, index) in labels.operatives" :key="`cbp-${index}`">
              <v-row class="pb-2 pt-2">
                <v-col cols="12" class="d-flex pl-6">
                  <bbva-button-default
                    variant="link"
                    style="color: #1973b8; padding-top: 0"
                    :icon="showCBP[operative.operativeEEPP?.name] ? 'bbva:collapse' : 'bbva:expand'"
                    text=""
                    @click="
                      () =>
                        (showCBP[operative.operativeEEPP?.name] =
                          !showCBP[operative.operativeEEPP?.name])
                    "
                  >
                  </bbva-button-default>
                  <span class="title-text-view-section">{{ operative.operativeEEPP?.name }}</span>
                </v-col>
              </v-row>
              <div v-show="showCBP[operative.operativeEEPP?.name]" class="pl-8">
                <v-row :class="index === 0 ? 'pb-4' : 'pb-4 pt-4'">
                  <v-col sm="3" md="3" lg="2" xl="2" class="pr-0">
                    <div class="pb-6 pl-0">
                      <img src="/icons/flag.svg" alt="Icono de listado" />
                      <span class="pl-2 fa">Operativa: {{ operative.operativeEEPP?.name }}</span>
                    </div>
                  </v-col>
                  <v-col class="pl-0">
                    <v-container>
                      <v-row
                        v-for="(url, indexUrl) in operative.configurationElements"
                        :key="`url-${indexUrl}`"
                      >
                        <v-container
                          :class="
                            operative.configurationElements.length - 1 !== indexUrl
                              ? 'border-bottom pt-2'
                              : 'pt-2'
                          "
                        >
                          <v-row>
                            <div class="pr-6 pb-6">
                              <img src="/icons/flag.svg" alt="Icono de listado" />
                              <span class="pl-1 fs-15"
                                >Peso de Operativa: {{ operative.operativeWeight }}</span
                              >
                            </div>
                            <div class="pr-6 pb-6">
                              <img src="/icons/flag.svg" alt="Icono de listado" />
                              <span class="pl-1 fs-15"
                                >Elemento variable de cada fuente: {{ url.configurationName }}</span
                              >
                            </div>
                            <div class="pr-6 pb-6">
                              <img src="/icons/flag.svg" alt="Icono de listado" />
                              <span class="pl-1 fs-15">Capa: {{ url.element }}</span>
                            </div>
                          </v-row>
                        </v-container>
                      </v-row>
                    </v-container>
                  </v-col>
                </v-row>
                <v-divider v-if="index !== labels.operatives.length - 1"></v-divider>
              </div>
              <v-divider></v-divider>
            </div>
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>
  <information-modal
    :open="modal.open"
    :close="closeModal"
    :title="modal.title"
    :message="modal.message"
    :onAccept="modal.onAccept"
    :confirmation="modal.confirmation"
    :forceOnAccept="modal.forceOnAccept"
    :type="modal.type"
  />
</template>

<script>
// Components
import AppBar from '@/components/AppBar/AppBar.vue'
import SectionHeader from '@/components/headers/SectionHeader.vue'
import '@/components/bbva-web-components/bbva-web-form-checkbox.js'
import { ref } from 'vue'
import '@/components/bbva-web-components/bbva-web-link.js'
import InformationModal from '@/components/modals/InformationModal.vue'

// Request
import { getInfoModel, downloadSummaryModel } from '@/requests/businessUnit'
import { weekDays } from '@/constants/modelsEnvironments'

export default {
  data() {
    return {
      // Contains the styles for various columns
      styles: {
        colItem: ref('col-item'),
        colVertical: ref('col-vertical')
      },
      // Identifier of the current model
      modelId: 0,
      // Labels with information obtained from the backend
      labels: {},
      // Configuration for the modal popup displayed on the page
      modal: {
        open: false,
        title: 'Informacion guardada',
        message: 'El modelo se ha guardado correctamente',
        confirmation: false,
        forceOnAccept: true,
        onAccept: () => {}
      },
      showCBP: {},
      weekDays,
      status: [
        { id: 1, label: 'Activo' },
        { id: 0, label: 'Inactivo' }
      ]
    }
  },
  components: {
    InformationModal,
    AppBar,
    SectionHeader
  },

  /**
   * Fetches the data for the current model based on its ID.
   * Emits a loading event before and after fetching data.
   * If the model data is successfully fetched, it populates the `labels` property.
   * If an error occurs (e.g., the model ID is invalid or the request fails),
   * it triggers the error modal.
   *
   * @async
   * @function fetchModelData
   * @returns {Promise<void>} A promise that resolves when the data fetching process is complete.
   */
  created() {
    this.modelId = this.$route.params.id
    if (this.modelId) {
      this.fetchModelData()
    } else {
      this.showErrorModal()
    }
  },
  methods: {
    /**
     * Closes the modal popup.
     * Sets the modal's `open` property to false and redirects to the 'admin-models-environments' route.
     *
     * @function closeModal
     */
    closeModal() {
      this.modal.open = false
      this.$router.push({ name: 'admin-models-environments' })
    },

    /**
     * Fetches the model data from the backend.
     * Emits a loading event and retrieves model information based on `modelId`.
     * If successful, update the `labels` property with the fetched data.
     * If an error occurs, shows an error modal.
     *
     * @async
     * @function fetchModelData
     * @returns {Promise<void>} A promise resolving after data is fetched.
     */
    async fetchModelData() {
      this.emitter.emit('load', { loading: true })
      try {
        const { data } = await getInfoModel(this.modelId)

        if (data) {
          for (const window of data.windows) {
            window.startDay = this.weekDays.find((day) => day.id === +window.startDay)?.label
            window.endDay = this.weekDays.find((day) => day.id === +window.endDay)?.label
          }
          data.status = this.status.find((status) => status.id === +data.status)?.label

          this.labels = data
        } else {
          this.showErrorModal()
        }

        this.emitter.emit('load', { loading: false })
      } catch (err) {
        this.showErrorModal()
      }
    },

    /**
     * Downloads the model data as a summary document.
     * Emits a loading event, retrieves the summary, and downloads it if data is available.
     * If an error occurs, shows an error modal.
     *
     * @async
     * @function downloadModelData
     * @returns {Promise<void>} A promise resolving after the download is processed.
     */
    async downloadModelData() {
      this.emitter.emit('load', { loading: true })
      try {
        const { data } = await downloadSummaryModel(this.modelId)

        if (data) {
          this.handleDownload(data)
        } else {
          this.showErrorModal()
        }

        this.emitter.emit('load', { loading: false })
      } catch (err) {
        this.showErrorModal()
      }
    },

    /**
     * Displays an error modal.
     * Updates the modal's properties with error details and a callback function for handling user actions.
     *
     * @function showErrorModal
     */
    showErrorModal() {
      this.modal = {
        open: true,
        title: 'Error',
        type: 'error',
        message: 'No se pudo obtener información de este modelo.',
        onAccept: this.closeModal
      }
    },

    /**
     * Creates a downloadable file from the provided data.
     * A temporary link is generated for the user to download the file.
     * After the download is triggered, the link is revoked.
     *
     * @function handleDownload
     * @param {Blob} data - The data to download as a file.
     */
    handleDownload(data) {
      const url = window.URL.createObjectURL(data)
      const a = document.createElement('a')
      a.href = url
      a.download = 'Resumen_modelo.pdf'
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      this.emitter.emit('load', { loading: false })
    }
  }
}
</script>

<style scoped>
.mb-5 {
  margin-bottom: 5rem;
}

.p-4 {
  padding: 1rem;
}
</style>
