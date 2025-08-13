<template>
  <v-container color="primary" fluid style="background-color: #072146; height: 80px">
    <v-row>
      <v-col class="custom-span" cols="4" sm="4" md="6" lg="6">
        <span>
          {{ titleElse === '' ? (id ? 'Editar modelo' : 'Nuevo Modelo') : titleElse }}
        </span>
      </v-col>
      <v-col cols="6" sm="6" md="6" lg="6" class="flex">
        <bbva-button-default
          variant="link"
          style="color: #1973b8"
          class="save container"
          icon="bbva:saveforlater"
          text="Guardar cambios"
          @click="onSubmit"
        >
        </bbva-button-default>
        <bbva-button-default
          variant="positive"
          class="close-btn font-weight-black"
          icon="bbva:close"
          @click="onClose"
        >
        </bbva-button-default>
      </v-col>
    </v-row>
  </v-container>
  <bbva-progress-multistep-bar
    :class="styles.stepBar"
    :accessibility-text="stepValue"
    :value="stepValue"
  ></bbva-progress-multistep-bar>
</template>

<script>
import '@/components/bbva-web-components/bbva-progress-multistep-bar.js'
import { ref } from 'vue'

export default {
  data() {
    return {
      /* Styles */
      styles: { stepBar: ref('step-bar') },
      /* Item's ID */
      id: null
    }
  },
  beforeMount() {
    this.id = this.$route.params.id
  },
  props: {
    /* It has the step value */
    stepValue: { type: String, default: '0' },
    /* It has the submit  function */
    onSubmit: {
      type: Function,
      default: () => {}
    },
    /* Function the hanlde the close */
    onClose: {
      type: Function,
      default: () => {}
    },
    titleElse: { type: String, default: '' }
  }
}
</script>

<style>
.step-bar span {
  background-color: #e9e9e9 !important;
}

.close-btn {
  background-color: #02a5a5;
  color: #e9e9e9;
  min-width: 56px;
  min-height: 56px;
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

.custom-span {
  color: white;
  font-size: 15px;
  padding-left: 4px;
  font-weight: 500;
  padding-top: 40px !important;
}

@media (max-width: 389px) {
  .custom-span {
    color: white;
    padding-top: 25px !important;

    font-size: 14px !important;
    font-weight: 450 !important;
  }
}

.save {
  font-weight: 500;
  font-size: 15px;
  padding-top: 25px !important;
}

@media (max-width: 653px) {
  .save {
    font-size: 12px !important;
    font-weight: 400 !important;
    padding-top: 25px !important;
  }
}

.container {
  position: absolute;
  right: 60px;
}

</style>
