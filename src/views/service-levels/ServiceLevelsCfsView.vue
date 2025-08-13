<template>
  <app-bar />
  <simple-section-header
    :title="title"
    :subtitle="subtitle"
    backPath="/"
    :breadcrumbs="breadcrumbs"
    icon="/icons/service-levels.svg"
    :onClickButton="newItem"
  />
  <service-levels-cfs-table/>

</template>
<script>
import SimpleSectionHeader from '@/components/headers/SimpleSectionHeader.vue';
import ServiceLevelsCfsTable from "@/components/table/ServiceLevelsCfsTable.vue";
import AppBar from "@/components/AppBar/AppBar.vue";

export default {
  data() {
    return {
      title: 'Disponibilidad',
      subtitle: '',
      breadcrumbs: [
        {
          name: 'Resumen Ejecutivo - Disponibilidad',
          href: '/service-levels?back=true'
        },
        {
          name: 'CFS / CBP / OPERATIVA',
          href: '/service-levels/cfs-cbp-operative'
        }
      ]
    }
  },
  beforeMount() {
    this.emitter.on("serviceCfsTitle", (evt) => {
      this.title = evt.title;
      this.subtitle = evt.subtitle;
    });
  },
  components: {
    AppBar,
    SimpleSectionHeader,
    ServiceLevelsCfsTable
  }
}
</script>
