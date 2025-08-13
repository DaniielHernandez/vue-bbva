<template>
  <SectionHeaderSecond :icon="icon" :subtitle="subtitle" :title="title" />
  <v-container class="pl-8 pb-12" fluid>
    <bbva-web-tab-default label="" @selected-change="changeTab">
      <bbva-web-tab-default-item heading="Validación Datos">
        <validation-data-tab />
      </bbva-web-tab-default-item>

      <bbva-web-tab-default-item heading="Validación Cálculo">
        <validation-calculation-tab />
      </bbva-web-tab-default-item>
    </bbva-web-tab-default>
  </v-container>
</template>

<script>
// Components
import '@/components/bbva-web-components/bbva-web-tab-default.js'
import ValidationDataTab from '@/components/filters-environments/ValidationDataTab.vue'
import ValidationCalculationTab from '@/components/filters-environments/ValidationCalculationTab.vue'
import SectionHeaderSecond from '@/components/headers/SectionHeaderSecond.vue'

export default {
  components: {
    SectionHeaderSecond,
    ValidationDataTab: ValidationDataTab,
    ValidationCalculationTab: ValidationCalculationTab
  },
  data() {
    return {
      currentTab: 0,
      icon: '/icons/Download-Certificate.svg',
      title: 'Validación Entornos Previos',
      subtitle: 'NDS Entornos Previos'
    }
  },
  methods: {
    changeTab(evt) {
      this.currentTab = evt.target.selected
    }
  }
}
</script>

<style></style>
