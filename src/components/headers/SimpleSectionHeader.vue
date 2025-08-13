<template>
  <v-container fluid class="pl-12">
    <v-row v-if="breadcrumbs.length > 0">
      <v-col class="pt-0 pb-0">
        <bbva-web-navigation-breadcrumbs />
      </v-col>
    </v-row>
    <v-row justify="space-between">
      <v-col>
        <bbva-button-default
          v-if="!breadcrumbs.length && backLabel"
          v-show="!hideBackButton"
          variant="link"
          style="color: #1973b8; padding-bottom: 10px"
          icon="bbva:return"
          :text="backLabel"
          @click="back"
        >
        </bbva-button-default>
        <div :class="`d-flex ${backLabel ? '' : 'pt-8 ga-2'}`">
          <img v-if="icon" :src="icon" alt="Icono de la sección" />
          <div style="display: inline-grid">
            <span class="pl-1 fs-18 fw-500">{{ title }}</span>
            <span v-if="subtitle" class="fs-14 pl-1 subtitle-header">
              {{ subtitle }}
            </span>
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import '@/components/bbva-web-components/bbva-button-default.js'
import '@/components/bbva-web-components/bbva-web-navigation-breadcrumbs.js'

export default {
  name: 'SimpleSectionHeader',
  data() {
    return {}
  },
  mounted() {
    if (!this.breadcrumbs.length) return
    const breadcrumb = document.querySelector('bbva-web-navigation-breadcrumbs')
    breadcrumb.data = this.breadcrumbs
  },
  methods: {
    /* It returns to the previous page */
    back() {
      this.$router.push(this.backPath)
    }
  },
  props: {
    /* It has the breadcrumbs */
    breadcrumbs: { type: Function, default: () => [] },
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
    /* It has the subtitle */
    subtitle: {
      type: String,
      default: ''
    },
    /* It has the title */
    title: {
      type: String,
      default: ''
    },
    /* It has the icon source */
    icon: {
      type: String,
      default: ''
    },
    hideBackButton: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style>
.subtitle-header {
  margin-top: -3px;
}
</style>
