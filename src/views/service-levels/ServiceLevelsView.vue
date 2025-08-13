<template>
  <app-bar />
  <section-header
    :title="titles[currentTab]"
    backLabel=""
    icon="/icons/service-levels.svg"
    :textButton="paths?.dashboard?.access ? 'Configuración Dashboard' : '' "
    :onClickButton="dashboard"
  />
  <bbva-web-tab-default label="" @selected-change="changeTab">

    <bbva-web-tab-default-item heading="Vista Libre">
      <service-levels-table :index="0"/>
    </bbva-web-tab-default-item>

    <bbva-web-tab-default-item
      v-for="(dashboard, index) in dashboards" :heading="dashboard.name"
      >
      <service-levels-table :dashboard="dashboard" :index="index + 1"/>
    </bbva-web-tab-default-item>

  </bbva-web-tab-default>

</template>
<script>
/* Components */
import SectionHeader from '@/components/headers/SectionHeader.vue';
import ServiceLevelsTable from "@/components/table/ServiceLevelsTable.vue";
import AppBar from "@/components/AppBar/AppBar.vue";
import '@/components/bbva-web-components/bbva-web-tab-default.js'
/* requests */
import { checkPermissionAPI } from '@/requests/security.js';
import { getDashboardByUserAPI } from '@/requests/dashboard.js';

/*
 * Vieew to show the service level view
 */
export default {
  data() {
    return {
      /* Dashboards */
      dashboards: [],
      currentTab: 0,
      /* Titles of the view by filter BU */
      titles: [
        'Resumen Ejecutivo - Disponibilidad'
      ],
      /* It saves the paths to check if the user has permission */
      paths:{
        dashboard: { path: '/service-levels/setup-dashboard', access: true }
      }
    };
  },
  components: {
    SectionHeader,
    AppBar,
    ServiceLevelsTable
  },
  beforeMount() {
    this.validatePaths()
    this.emitter.on("serviceTitle", (evt) => {
      this.titles[evt.index] = evt.title;
    });
    getDashboardByUserAPI().then( (response) => {
      this.dashboards = response.data.items
      this.dashboards.forEach(() => {
        this.titles.push('Resumen Ejecutivo - Disponibilidad');
      });
    });
  },
  methods: {
    changeTab(evt) {
      this.currentTab = evt.target.selected;
    },
    /*
     * It validate if the user has permission to the paths 
     */
    validatePaths() {
      Object.keys( this.paths ).map( (key) => {
        checkPermissionAPI( this.paths[key].path ).then( (response) => {
          this.paths[key].access = response.data.success;
        });
      });
    },
    dashboard() {
      this.$router.push('/service-levels/setup-dashboard')
    }
  }
}
</script>
