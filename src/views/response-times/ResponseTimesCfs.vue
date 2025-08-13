<template>
  <app-bar />
  <simple-section-header
    :title="title"
    :subtitle="subtitle"
    backPath="/"
    :breadcrumbs="breadcrumbs"
    icon="/icons/response-times.svg"
  />
  <response-times-cfs-table/>

</template>
<script>
import SimpleSectionHeader from '@/components/headers/SimpleSectionHeader.vue';
import ResponseTimesCfsTable from "@/components/table/ResponseTimesCfsTable.vue";
import AppBar from "@/components/AppBar/AppBar.vue";

export default {
  data() {
    return {
      title: 'Tiempos de respuesta',
      subtitle: '',
      /* Breaddrumbs */
      breadcrumbs: [
        {
          name: 'Resumen Ejecutivo - Tiempos de respuesta',
          href: '/response-times?back=true'
        },
        {
          name: 'CFS / CBP / OPERATIVA',
          href: '/response-times/cfs-cbp-operative'
        }

      ],
    }
  },
  beforeMount() {
    this.emitter.on("responseTimesCfsTitle", (evt) => {
      this.title = evt.title;
      this.subtitle = evt.subtitle;
    });
  },
  components: {
    AppBar,
    SimpleSectionHeader,
    ResponseTimesCfsTable
  }
}
</script>
