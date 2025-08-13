<template>
  <app-bar />
  <v-container class="pl-12 pb-12 pt-2 pl-3" fluid>
    <v-row>
      <v-col cols="12" class="pt-8">
        <bbva-button-default
          variant="link"
          style="color: #1973B8; display: flex; gap: 8px;"
          icon="bbva:return"
          text=" Volver a Administración de Modelos" 
          @click="back">
        </bbva-button-default>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" class="d-flex">
        <span class="title-text-view pr-4">Resumen del modelo</span>
        <div class="pt-1">
          <bbva-button-default
            variant="link"
            style="color: #1973B8; display: flex; gap: 8px;"
            icon="bbva:download"
            text="Descargar" 
            @click="downloadCsv">
          </bbva-button-default>
        </div>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <span class="title-text-view-section">Datos CFS</span>
      </v-col>
    </v-row>

    <v-row  class="pl-3">
      <div class="pr-6 pb-6">
        <img src="/icons/flag.svg" alt="Icono de listado"/>
        <span class="pl-1 fs-15">Business Unit: {{data.bu}}</span>
      </div>
      <div class="pr-6 pb-6">
        <img src="/icons/flag.svg" alt="Icono de listado"/>
        <span class="pl-1 fs-15">CFS: {{data.cfs}}</span>
      </div>
      <div class="pr-6 pb-6">
        <img src="/icons/flag.svg" alt="Icono de listado"/>
        <span class="pl-1 fs-15">Service Owner / Nombre y apellidos: {{data.serviceOwner}}</span>
      </div>
      <div class="pr-6 pb-6">
        <img src="/icons/flag.svg" alt="Icono de listado"/>
        <span class="pl-1 fs-15">Clasificación de criticality: {{data.criticality}}</span>
      </div>
      <div class="pr-6 pb-6">
        <img src="/icons/flag.svg" alt="Icono de listado"/>
        <span class="pl-1 fs-15">Entorno: {{data.entorno}}</span>
      </div>
      <div class="pr-6 pb-6">
        <div class="pl-1 fs-15">
          <bbva-web-form-checkbox disabled name="rfoClp" :checked="data.rfoClp">RFO/CLP</bbva-web-form-checkbox>
        </div>
      </div>
    </v-row>

    <v-row>
      <v-col cols="12">
        <span class="title-text-view-section">Ventana</span>
      </v-col>
    </v-row>

    <v-row v-for="(ventana, index) in data.windowsGeneral" :key="`row-ventana-${index}`" class="pl-3">
      <div class="pr-6 pb-6">
        <img src="/icons/flag.svg" alt="Icono de listado"/>
        <span class="pl-1 fs-15">Día inicio: {{getDayLabel(ventana.startDay)}}</span>
      </div>
      <div class="pr-6 pb-6">
        <img src="/icons/flag.svg" alt="Icono de listado"/>
        <span class="pl-1 fs-15">Hora inicio: {{ventana.startHour}}</span>
      </div>
      <div class="pr-6 pb-6">
        <img src="/icons/flag.svg" alt="Icono de listado"/>
        <span class="pl-1 fs-15">Dia fin: {{getDayLabel(ventana.endDay)}}</span>
      </div>
      <div class="pr-6 pb-6">
        <img src="/icons/flag.svg" alt="Icono de listado"/>
        <span class="pl-1 fs-15">Hora fin: {{ventana.endHour}}</span>
      </div>
      <div style="display: block ruby" >
        <div class="pl-1 fs-15">
          <bbva-web-form-checkbox disabled name="rfoClp" :checked="ventana.holidays">
            Día inhábiles
          </bbva-web-form-checkbox>
        </div>
      </div>
    </v-row>

    <v-row>
      <v-col cols="12">
        <span class="title-text-view-section">Datos de medición</span>
      </v-col>
    </v-row>

    <v-row class="pl-3">
      <div class="pr-6 pb-6">
        <img src="/icons/flag.svg" alt="Icono de listado"/>
        <span class="pl-1 fs-15">Estatus de modelo: {{data.status}}</span>
      </div>
      <div class="pr-6 pb-6">
        <img src="/icons/flag.svg" alt="Icono de listado"/>
        <span class="pl-1 fs-15">Estatus de medición: {{data.statusMeasurement}}</span>
      </div>
      <div class="pr-6 pb-6">
        <img src="/icons/flag.svg" alt="Icono de listado"/>
        <span class="pl-1 fs-15">Modelo: {{data.typeModel}}</span>
      </div>
      <div class="pr-6 pb-6">
        <img src="/icons/flag.svg" alt="Icono de listado"/>
        <span class="pl-1 fs-15">Fuente: {{data.source}}</span>
      </div>
      <div class="pr-6 pb-6">
        <img src="/icons/flag.svg" alt="Icono de listado"/>
        <span class="pl-1 fs-15">Version: {{data.version}}</span>
      </div>
      <div class="pr-6 pb-6">
        <img src="/icons/flag.svg" alt="Icono de listado"/>
        <span class="pl-1 fs-15">Meta disponibilidad: {{data.metaAvailability}}%</span>
      </div>
      <div class="pr-6 pb-6">
        <img src="/icons/flag.svg" alt="Icono de listado"/>
        <span class="pl-1 fs-15">Meta tiempo de respuesta: {{data.metaTimeResponse}}%</span>
      </div>
      <div class="pr-6 pb-6">
        <div class="pl-1 fs-15">
          <bbva-web-form-checkbox disabled name="rfoClp" :checked="data.levelsService">
            Niveles de servicio
          </bbva-web-form-checkbox>
        </div>
      </div>
      <div class="pr-6 pb-6">
        <div class="pl-1 fs-15">
          <bbva-web-form-checkbox disabled name="rfoClp" :checked="data.timesAnswer">
            Tiempo de respuesta
          </bbva-web-form-checkbox>
        </div>
      </div>
    </v-row>

    <v-row>
      <v-col cols="12">
        <span class="title-text-view-section">Fechas</span>
      </v-col>
    </v-row>

    <v-row class="pl-3">
      <div class="pr-6 pb-6">
        <img src="/icons/flag.svg" alt="Icono de listado"/>
        <span class="pl-1 fs-15">Fecha alta: {{data.dischargeDate}}</span>
      </div>
      <div class="pr-6 pb-6">
        <img src="/icons/flag.svg" alt="Icono de listado"/>
        <span class="pl-1 fs-15">Fecha de activación: {{data.activationDate}}</span>
      </div>
      <div class="pr-6 pb-6">
        <img src="/icons/flag.svg" alt="Icono de listado"/>
        <span class="pl-1 fs-15">
          Fecha de inicio de Periodo de Garantía: {{data.datePeriodWarranty}}
        </span>
      </div>
      <div class="pr-6 pb-6">
        <img src="/icons/flag.svg" alt="Icono de listado"/>
        <span class="pl-1 fs-15">Fecha de inicio Oficial: {{data.dateStartOfficial}}</span>
      </div>
      <div class="pr-6 pb-6">
        <img src="/icons/flag.svg" alt="Icono de listado"/>
        <span class="pl-1 fs-15">Fecha de inactivación: {{data.dateInactivation}}</span>
      </div>
    </v-row>

    <v-row>
      <v-col cols="12">
        <span class="title-text-view-section">Partnership</span>
      </v-col>
    </v-row>

    <v-row class="pl-3">
      <div class="pr-6 pb-6">
        <img src="/icons/flag.svg" alt="Icono de listado"/>
        <span class="pl-1 fs-15">Partnership: {{data.partnership}}</span>
      </div>
      <div class="pr-6 pb-6">
        <img src="/icons/flag.svg" alt="Icono de listado"/>
        <span class="pl-1 fs-15">Estatus medición partnership: {{data.statusMeasurementPartnership}}</span>
      </div>
      <div class="pr-6 pb-6">
        <img src="/icons/flag.svg" alt="Icono de listado"/>
        <span class="pl-1 fs-15">
          Meta Partnership Expected SLA: {{data.metaPartnershipExpected}}
        </span>
      </div>
      <div class="pr-6 pb-6">
        <img src="/icons/flag.svg" alt="Icono de listado"/>
        <span class="pl-1 fs-15">Meta Partnership Minimum SLA: {{data.metaPartnershipMinimum}}</span>
      </div>
      <div class="pr-6 pb-6">
        <img src="/icons/flag.svg" alt="Icono de listado"/>
        <span class="pl-1 fs-15">Fecha de inicio partnership initial: {{data.dateStartPartnershipInitial}}</span>
      </div>
      <div class="pr-6 pb-6">
        <img src="/icons/flag.svg" alt="Icono de listado"/>
        <span class="pl-1 fs-15">Fecha de inicio partnership As Is: {{data.dateStartPartnershipAsIs}}</span>
      </div>
    </v-row>

    <div v-for="(cbp, index) in data.cbps" :key="`cbp-${index}`">
      <v-row class="pb-2 pt-2">
        <v-col cols="12" class="d-flex pl-6">
          <bbva-button-default
            variant="link"
            style="color: #1973B8; padding-top: 0px;"
            :icon="showCBP[cbp.name] ? 'bbva:collapse' : 'bbva:expand'"
            text=""
            @click="() => showCBP[cbp.name] = ! showCBP[cbp.name]">
          </bbva-button-default>
          <span class="title-text-view-section">{{cbp.name}}</span>
        </v-col>
      </v-row>
      <div
        v-show="showCBP[cbp.name]"
        class="pl-8"
        v-for="(operativa, indexOperativa) in cbp.operatives"
        :key="`operativa-${index}-${indexOperativa}`"
        >
        <v-row :class="indexOperativa === 0 ? 'pb-4' : 'pb-4 pt-4'">
          <v-col sm="3" md="3" lg="2" xl="2" class="pr-0">
          <div class="pb-6 pl-0">
            <img src="/icons/flag.svg" alt="Icono de listado"/>
            <span class="pl-2 fa">Operativa: {{operativa.name}}</span>
          </div>
          </v-col>
          <v-col class="pl-0">
          <v-container>
            <v-row v-for="(url,indexUrl) in operativa.urls"
              >
              <v-container
                :class="operativa.urls.length - 1 !== indexUrl ? 'border-bottom pt-2' : 'pt-2'"
                >
                <v-row>
                  <div class="pr-6 pb-6">
                    <img src="/icons/flag.svg" alt="Icono de listado"/>
                    <span class="pl-1 fs-15">Elemento variable de cada fuente: {{url.variableElement}}</span>
                  </div>
                  <div class="pr-6 pb-6">
                    <img src="/icons/flag.svg" alt="Icono de listado"/>
                    <span class="pl-1 fs-15">Umbral TR: {{url.thresholdTr}}</span>
                  </div>
                  <div class="pr-6 pb-6">
                    <img src="/icons/flag.svg" alt="Icono de listado"/>
                    <span class="pl-1 fs-15">Elemento variable madre: {{url.isMother ? 'Si' : 'No'}}</span>
                  </div>
                  <div class="pr-6 pb-6">
                    <div class="pl-1 fs-15">
                      <bbva-web-form-checkbox disabled name="isAccess" :checked="url.isAccess">
                        Es acceso
                      </bbva-web-form-checkbox>
                    </div>
                  </div>
                </v-row>
              </v-container>
            </v-row>
          </v-container>
          </v-col>
        </v-row>
        <v-divider v-if="indexOperativa !== cbp.operatives.length - 1"></v-divider>
      </div>
      <v-divider></v-divider>
    </div>

  </v-container>
  <information-modal
     :open="modal.open"
     :close="closeModal"
     :title="modal.title"
     :message="modal.message"
     :type="modal.type"
    />
</template>

<script>
import '@/components/bbva-web-components/bbva-button-default.js';
import '@/components/bbva-web-components/bbva-web-form-checkbox.js';
import { getModelAPI, getExcelFileModel } from '@/requests/models';
import AppBar from "@/components/AppBar/AppBar.vue";
import { getDayLabel } from '@/constants/model';
import InformationModal from '@/components/modals/InformationModal.vue';

import {errorRequestModal} from '@/utils/informationModal';

export default {
  data() {
    return {
      data: {},
      id: null,
      modal: {
        open: false,
        title: '',
        message: '',
        type: ''
      },
      showCBP: {
      },
    };
  },
  beforeMount() {
    this.id = this.$route.params.id;

    this.emitter.emit("load", { loading: true });
    getModelAPI(this.id).then( (response) => {
      this.data = response.data;
      this.data.cbps.forEach( (cbp) => {
        this.showCBP[cbp.name] = false;
      });

      this.emitter.emit("load", { loading: false });
    }).catch( (error) => {
      this.emitter.emit("load", { loading: false });
      this.errorInRequestModal('obtener modelo', error);
    });
  },
  components: {
    AppBar,
    InformationModal
  },
  methods: {
    /*
     * It gets the  day's label
     */
    getDayLabel,
    errorInRequestModal(action, error) {
      this.modal = {
        open: true, ...errorRequestModal(action, error)
      };
    },
    /*
     * It closes the modal
     */
    closeModal() {
      this.modal.open = false;
    },
    /*
     * It dowloads the file
     */
    downloadCsv() {
      this.emitter.emit("load", { loading: true });
      getExcelFileModel(this.id).then(
        (response) => {
        const blob = new Blob(
          [response.data], { type: 'application/vnd.ms-excel' }
        )
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.download = `model-${this.id}.xlsx`;
        link.click()
        URL.revokeObjectURL(link.href)
        this.emitter.emit("load", { loading: false });
      }).catch((error) => {
        this.emitter.emit("load", { loading: false });
        this.errorInRequestModal('descargar modelo', error);
      });
    },
    /*
     * It returns the the previous page
     */
    back() {
      this.$router.push('/setup/admin-models');
    }
  }
}
</script>

<style>
.title-text-view {
  font-family: Benton Sans BBVA;
  font-size: 18px;
  font-weight: 501;
}
.title-text-view-section {
  font-family: Benton Sans BBVA;
  font-size: 15px;
  font-weight: 501;
}
.fs {
  font-size: 14px;
}
.border-bottom {
  border-bottom: 1px solid #f4f4f4;
}
</style>
