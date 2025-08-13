<template>
  <app-bar />
  <section-header
    title="Consulta y Adminstración de Alertas"
    backPath="/setup"
    icon="/icons/alert.svg"
    textButton="Configuración de alertas"
    :onClickButton="newItem"
  />
  <setup-alerts-table
    :search="search"
    :data="data"
    :more="more"
    :loadingTable="loadingTable"
    />
</template>

<script>
import AppBar from "@/components/AppBar/AppBar.vue";
import SectionHeader from '@/components/headers/SectionHeader.vue';
import { getSetupAlertsAPI } from '@/requests/alerts.js';
import SetupAlertsTable from '@/components/table/SetupAlertsTable.vue';

export default {
  data() {
    return {
      /* Flag id there is more items to load for the table */
      more: false, 
      /* Flag, if the table is loading items */
      loadingTable: false,
      /* Table's data */
      data: [],
    }
  },
  components: {
    AppBar,
    SetupAlertsTable,
    SectionHeader
  },
  beforeMount(){
    this.search([], 1, 10);
  },
  methods: {
    /*
     * This method searches the table's data
     * @param {Object[]} filter Filter to get the data table
     * @param {string} filter.name  Filter's name
     * @param {string} filter.value Filter's value
     * @param {number} pageNumber Page's number
     * @param {number} pageSize Page's size
     */
    search(filters, pageNumber, pageSize) {
      this.loadingTable = true;
      this.emitter.emit("load", { loading: true });
      getSetupAlertsAPI(pageNumber, pageSize, filters).then( (response) => {
        this.emitter.emit("load", { loading: false });
        this.loadingTable = false;
        if( pageNumber === 1 ) {
          this.data = response.data.items;
        } else {
          this.data = [...this.data, ...response.data.items];
        }
        this.more = response.data.count > this.data.length;
      }).catch( (error) => {
        this.emitter.emit("load", { loading: false });
        this.loadingTable = false;
        this.emitter.emit('error', { action: 'cargar tabla',  error });
      });
    },
    /* 
     * It open the form to create a new setup alert
     */
    newItem() {
      this.$router.push('/setup/setup-alerts/create');
    }
  }
};
</script>

