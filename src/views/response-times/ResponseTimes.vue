<template>
  <app-bar />
  <simple-section-header
    :title="title"
    backLabel=""
    icon="/icons/response-times.svg"
  />

    <response-times-table/>
</template>
<script>
import SimpleSectionHeader from '@/components/headers/SimpleSectionHeader.vue';
import ResponseTimesTable from "@/components/table/ResponseTimesTable.vue";
import AppBar from "@/components/AppBar/AppBar.vue";
import { checkPermissionAPI } from '@/requests/security.js';
import '@/components/bbva-web-components/bbva-web-tab-default.js'

/*
 * View to show response times view
 */
export default {
  data() {
    return {
      title: 'Resumen Ejecutivo - Tiempos de Respuesta',
    };
  },
  components: {
    SimpleSectionHeader,
    AppBar,
    ResponseTimesTable
  },
  beforeMount() {
    this.emitter.on("responseTimesTitle", (evt) => {
      this.title = evt.title;
    });

  },
}
</script>
