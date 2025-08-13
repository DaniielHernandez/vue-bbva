<template>
  <v-container color="primary" fluid style="background-color: #072146;height: 80px;" class="pt-10">
    <v-row >
      <v-col xl="10">
        <span class="text-white fs-15 pl-4 fw-500">
          {{ title }}
        </span>
      </v-col>
      <v-col md="3" sm="4" xl="2" lg="2" class="flex">
        <bbva-button-default
          variant="positive"
          class="close-btn font-weight-black"
          icon="bbva:close"
          @click="onClose">
        </bbva-button-default>
      </v-col>
    </v-row>
  </v-container>
  <bbva-progress-multistep-bar
    :class="step-bar"
    :accessibility-text="stepValue"
    :value="stepValue"
  ></bbva-progress-multistep-bar>
</template>

<script>
import '@/components/bbva-web-components/bbva-progress-multistep-bar.js'

export default {
  data() {
    return {
      /* Item's ID */
      id: null,
      /* Header title */
      title: 'Configuración de alertas',
    }
  },
  beforeMount() {
    this.id = this.$route.params.id;
    this.title = 'Configuración de alertas';
    if(this.id) {
      this.title = 'Edición de alertas';
      const duplicate = !!this.$route.query.duplicate;
      if( duplicate ) {
        this.title = 'Duplicar alerta';
      }
    }
  },
  props: {
    /* It has the step value */
    stepValue: { type: String, default: '0' },
    /* Function the hanlde the close */
    onClose: { type: Function, default: () => {} }
  }
}
</script>

<style>
  .step-bar span {
    background-color: #E9E9E9 !important;
  }
  .close-btn {
    background-color: #02A5A5;
    color: #E9E9E9;
    min-width: 56px;
    min-height: 60px;
    position: absolute;
    top: -4px;
    right: -4px;
  }
  .close-btn:hover {
    opacity: 0.8;
  }
  .close-btn:active {
    opacity: 0.9;
  }
</style>
