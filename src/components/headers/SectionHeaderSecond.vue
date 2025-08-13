<template>
  <v-container :class="styles.header" fluid>
    <v-row>
      <v-col cols="6" sm="6" md="6" lg="6" class="pt-3">
        <bbva-button-default
          variant="link"
          v-if="!!backLabel"
          style="color: #1973b8; padding-bottom: 10px; padding-top: 10px"
          icon="bbva:return"
          :text="backLabel"
          @click="back"
        >
        </bbva-button-default>
        <div :class="`d-flex ${backLabel ? '' : 'pt-8'}`">
          <img v-if="icon" :src="icon" alt="Icono de las sección" />
          <span class="pl-1 font-title">{{ title }}</span>
        </div>
      </v-col>
      <v-spacer class="d-none d-sm-flex"></v-spacer>
      <v-col cols="6" sm="6" md="4" lg="3" xl="2" :class="styles.gradientBackgroud">
        <div class="pt-6">
          <span class="font-title" style="color: #1973b8; font-weight: 700 !important">
            {{ subtitle }}
          </span>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { ref } from 'vue'
import '@/components/bbva-web-components/bbva-button-default.js'

export default {
  data() {
    return {
      /* CSS Styles */
      styles: {
        header: ref('section-header'),
        button: ref('button-header'),
        verticalCenter: ref('vertical-center'),
        gradientBackgroud: ref('gradient-background')
      }
    }
  },
  methods: {
    /* It return to the previous page */
    back() {
      this.$router.push(this.backPath)
    }
  },
  props: {
    /* It has the back label */
    backLabel: {
      type: String,
      default: '&nbsp;Volver al inicio'
    },
    /* It has the back path */
    backPath: {
      type: String,
      default: '/'
    },
    /* It has the title */
    title: {
      type: String,
      default: ''
    },
    /* It has the src icon */
    icon: {
      type: String,
      default: ''
    },
    /* It has the text subtitle */
    subtitle: {
      type: String,
      default: ''
    }
  }
}
</script>

<style>
.section-header {
  box-shadow: 0 4px 2px -2px #d3d3d3;
  margin-left: 0;
  margin-right: 0;
  padding-left: 48px;
  padding-top: 13px;
  height: 120px;
}

.button-header {
  width: 208px;
  height: 48px;
  background-color: #1464a5;
}

.gradient-background {
  background: linear-gradient(
    283deg,
    rgba(227, 227, 227, 1) 91%,
    rgba(255, 255, 255, 1) 91%,
    rgba(255, 255, 255, 1) 100%
  );
  height: 119px;
  box-shadow: 0 4px 2px -2px #d3d3d3;
  text-align: center;
}

.font-title {
  font-size: 18px !important;
  font-weight: 500 !important;
}

@media (max-width: 653px) {
  .font-title {
    font-size: 14px !important;
    font-weight: 450 !important;
  }
}
</style>
