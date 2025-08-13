<template>
  <model-form-first-section
    v-if="step === 1"
    :previousData="data.first"
    :onCancel="cancel"
    :nextStep="nextStep"
    :onSubmit="onSubmit"
    :setData="setFirstSection"
    :requestError="errorInRequestModal"
    :catalogs="catalogs"
    />

  <model-form-second-section
    v-if="step === 2"
    :onCancel="cancel"
    :sumup="data.sumUpFirstSection"
    :setData="setSecondSection"
    :previousData="data.second"
    :previuosStep="previousStep"
    :onSubmit="onSubmit"
    />
  <information-modal
     :open="modal.open"
     :close="modal.finish ? back : closeModal"
     :onAccept="back"
     :title="modal.title"
     :confirmation="modal.confirmation"
     :message="modal.message"
     :type="modal.type"
    />

  <overlay-loader :open="loading"/>
</template>

<script>

import OverlayLoader from '@/components/loaders/OverlayLoader.vue';
import {
  dataFirstSection, dataSecondSection, days, modelStatus, dataCBPS

} from '@/constants/model';
import ModelFormFirstSection from '@/components/forms/ModelFormFirstSection.vue';
import ModelFormSecondSection from '@/components/forms/ModelFormSecondSection.vue';
import InformationModal from '@/components/modals/InformationModal.vue';
import { getBusinessUnitsAPI } from '@/requests/businessUnit';
import { getCfsesAPI } from '@/requests/cfs';
import { getListUserNamesAPI } from '@/requests/users';
import { getCriticalitiesAPI } from '@/requests/criticality';
import { parseCatalog } from '@/utils/form';
import { getEnvironmentsAPI } from '@/requests/environments';
import { getMeasurementStatusesAPI } from '@/requests/measurementStatus';
import { getSourceModelsAPI } from '@/requests/sourceModel';
import { getStatusModelAPI } from '@/requests/statusModel';
import { getTypesModelsAPI } from '@/requests/typeModel';
import { getPartnershipAPI } from "@/requests/partnership";
import { getPartnershipMeasurementAPI } from "@/requests/partnershipMeasurement";
import { nextTick } from 'vue'

import  {
  modelCreateFirstSectionAPI, modelCreateSecondSectionAPI, getModelAPI, modelUpdateFirstSectionAPI,
  removeWindowAPI, removeCbpAPI, removeOperativeAPI, modelUpdateSecondSectionAPI, removeUrlAPI
} from '@/requests/models.js'
import { errorRequestModal, editSuccessModal, createSuccessModal } from '@/utils/informationModal';

export default {
  data() {
    return {
      /* Flag, true if it is loading */
      loading: false,
      /* item's id */
      id: null,
      /* Flag, true if the first section is saved */
      saveFisrtSection: false,
      /* It has the catalogs used by the selec inputs*/
      catalogs: {},
      /* It has the data of the entire model */
      data: {
        first: {},
        second: {},
        sumUpFirstSection: {},
        removedWindows: [],
        removedCBPS: [],
        removedOperatives: [],
        removedUrls: []
      },
      /* Flag, it is true if the form is valid */
      valid: true,
      /* Modal's data */
      modal: {
        finish: false,
        open: false,
        title: '',
        message: '',
        type: ''
      },
      /* Number of the form step */
      step: 1,
      /* it contains the inputs errors */
      errors: {},
    };
  },
  components: {
    OverlayLoader,
    ModelFormFirstSection,
    ModelFormSecondSection,
    InformationModal
  },
  async beforeMount() {
    this.id = parseInt(this.$route.params.id);

    await nextTick();
    this.loading = true;


    if( this.id ) {
      getModelAPI(this.id).then( async (response) => {
        const fieldsFirstSection = {};
        Object.keys( dataFirstSection ).forEach( (key) => {
          fieldsFirstSection[key] = response.data[key];
        } );

        await this.loadCatalogs();

        this.data.first = {...fieldsFirstSection};
        this.data.second = {cbps: 
          response.data.cbps.length > 0 ? [...response.data.cbps] :  [ {...dataCBPS}]
        };
      } ).catch((error) => {
        this.loading = false;
        console.log(error);
        this.errorInRequestModal('obtener Modelo', error);
      });
    } else {
      this.loadCatalogs();
      this.data.first = { ...dataFirstSection };
      this.data.second = { ...dataSecondSection };
    }
  },
  methods: {
    /*
     * It loads the  catalogs used by the forms
     */
    loadCatalogs() {
      const items = [
        { request: getBusinessUnitsAPI, key: 'buId' },
        { request: getCfsesAPI, key: 'cfsId'  },
        { request: getListUserNamesAPI, key: 'serviceOwnerId' },
        { request: getCriticalitiesAPI, key: 'criticalityId' },
        { request: getEnvironmentsAPI, key: 'environmentId' },
        { request: getMeasurementStatusesAPI, key: 'measurementStatusId' },
        { request: getSourceModelsAPI, key: 'sourceId' },
        { request: getStatusModelAPI, key: 'statusId' },
        { request: getTypesModelsAPI, key: 'typeModelId' },
        { request: getPartnershipAPI, key: 'partnershipId' },
        { request: getPartnershipMeasurementAPI, key: 'measurementStatusPartnershipId' }
      ];
      const fields = items.map((catalog) => catalog.key);

      this.catalogs.days = days;
      return Promise.all(
        items.map( (catalog) => catalog.request(1,3000) )
      ).then((values) => {
        fields.forEach( (field, index) => {
          this.catalogs[field] = parseCatalog(values[index].data);
        });
        if( !this.id ) {
          this.catalogs.statusId = this.catalogs.statusId.filter(
            (item) => item.id !== modelStatus.inactive
          );
        }
        this.loading = false;
      }).catch((error) => {
        this.loading = false;
        this.errorInRequestModal('cargar catalogos', error);
      });
    },
    /*
     * It advances to the next step and saved the values of the first section
     * @param {Object}    values         Fields's values
     * @param {Number[]}  removedWindos  Array with the ids of the windows removed
     */
    nextStep(values, removedWindows) {
      this.data.first = {...values};
      this.data.sumUpFirstSection = {
        bu: this.catalogs.buId.find(
          (bu) => bu.id === values.buId
        ).label,
        cfs: this.catalogs.cfsId.find(
          (cfs) => cfs.id === values.cfsId
        ).label,
        measurementStatus:this.catalogs.measurementStatusId.find(
          (status) => status.id === values.measurementStatusId
        ).label ,
        source: this.catalogs.sourceId.find(
          (source) => source.id === values.sourceId
        ).label
      };
      console.log(this.data.sumUpFirstSection);
      this.data.removedWindows = removedWindows;
      this.step = 2;
    },
    /*
     * It sets the loading's value
     */
    setLoading(value) {
      this.loading = value;
    },
    /*
     * It returns to the first step
     */
    previousStep(values, removedCBPS, removedOperatives) {
      this.data.second = {...values};
      this.data.removedOperatives = removedOperatives;
      this.data.removedCBPS = removedCBPS;
      this.step = 1;
    },
    /*
     * It closes the modal
     */
    closeModal() {
      this.modal = {
        open: false, type: '', title: '', message: '', confirmation: false, finish: false
      };
    },
    /*
     * It handles the error request
     * @param {String} action  Action that has raised the error
     * @param {Object} error   Error with the information
     */
    errorInRequestModal(action, error) {
      this.modal = {
        open: true, ...errorRequestModal(action, error), finish: false
      };
    },
    /*
     * It return to the previous page
     */
    back() {
      this.closeModal();
      this.$router.push('/setup/admin-models');
    },
    /*
     * It closes the modal, when it's warning
     */
    cancel() {
      this.modal = {
        open: true,
        type: 'caution',
        title: '¿Seguro que quieres eliminar el proceso?',
        message: 'Vas a salir del proceso y todos los datos se perderan',
        confirmation: true,
        finish: false
      };
    },
    /*
     * It clears the first section of the form
     */
    cleanDataFirst() {
      const values = {};
      Object.keys(this.data.first).forEach( (key) => {
        if(
          ( typeof this.data.first[key] === "boolean" || this.data.first[key] ) &&
          key !== 'generalWindows'
        ) {
          values[key] = this.data.first[key];
        }
      });
      return { data: {...values}, generalWindows: this.data.first.generalWindows };
    },
    /*
     * Itr chekcs if the model has a second section
     * @return {Boolean}
     */
    isThereSecondSection() {
      return !!this.data.second.cbps[0].name;
    },
    /*
     * It updates the entire model
     */
    edit() {

      this.loading = true;

      Promise.all([
        ...this.data.removedWindows.map( (id) => removeWindowAPI(id) ),
        modelUpdateFirstSectionAPI(this.id, this.cleanDataFirst()),
        ...this.data.removedUrls.map( (id) => removeUrlAPI(id) ),
        ...this.data.removedOperatives.map( (id) => removeOperativeAPI(id) ),
        ...this.data.removedCBPS.map( (id) => removeCbpAPI(id) ),
        this.updateSecondSection()
      ]).then(() => {
        this.loading = false;
        this.modal = { open: true, ...editSuccessModal('modelo'), finish: true };
      }).catch( (error) => {
        this.loading = false;
        this.errorInRequestModal('crear', error);
      });
    },
    /*
     * It updates the second section of form
     */
    updateSecondSection() {
      if( !this.isThereSecondSection() ) {
        return new Promise((resolve, reject) => setTimeout(() => resolve(), 50));
      }
      const payload = {
        ...this.data.second,
        "modelId": this.id
      }
      if( this.data.second.cbps[0].id ) {
        return modelUpdateSecondSectionAPI(payload);
      } else {
        return this.createSecondSection();
      }
    },
    /*
     * It creates the second section of the model
     */
    createSecondSection() {
      if( ! this.isThereSecondSection() ) {
        this.modal = { open: true, ...createSuccessModal('modelo'), finish: true };
        return;
      }
      const payload = {
        ...this.data.second,
        "modelId": this.id
      }
      modelCreateSecondSectionAPI(payload).then(() => {
        this.loading = false;
        this.modal = { open: true, ...createSuccessModal('modelo'), finish: true };

      }).catch( (error) => {
        this.loading = false;
        this.errorInRequestModal('crear segunda sección', error);
      });
    },
    /*
     * It creates a new model
     */
    create() {
      this.loading = true;

      modelCreateFirstSectionAPI(this.cleanDataFirst()).then((response) => {
        this.id = response.data.id;
        this.createSecondSection();
      }).catch( (error) => {
        this.loading = false;
        this.errorInRequestModal('crear primer sección', error);
      });
    },
    /*
     * It saves the first section of the form
     * @param {Object}   values          Fields's values
     * @param {Number[]} removedWindows  Ids of the windows to be removed
     */
    setFirstSection(values, removedWindows) {
      this.data.first = {...values};
      this.data.removedWindows = removedWindows;
    },
    /*
     * It saves the values of the seconf section of the form
     * @param {Object}   values             Fields's values
     * @param {Number[]} removedCBPS        Ids of the cbps removed
     * @param {Number[]} removedOperatives  Ids of the operatives removed
     * @param {Number[]} removedUrls        Ids of the urls removed
     */
    setSecondSection(values, removedCBPS, removedOperatives, removedUrls) {
      this.data.second = {...values};
      this.data.removedOperatives = removedOperatives;
      this.data.removedCBPS = removedCBPS;
      this.data.removedUrls = removedUrls;
    },
    /*
     * It saves the item edited or create a new one
     */
    onSubmit() {
      if( this.id ) {
         this.edit();
      } else {
        this.create();
      }
    }
  }
}
</script>

<style>
  .text-input input {
    position: absolute;
    top: 20%;
    left: 5%;
  }
	.fs-14 {
		font-size: 14px;
	}
</style>
