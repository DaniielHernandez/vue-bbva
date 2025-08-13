<template>
  <app-bar />
  <simple-section-header
    title="Valores D+1"
    icon="/icons/Book.svg"
    backPath="/setup"
  />
  <bbva-web-tab-default label="">
    <bbva-web-tab-default-item heading="Umbrales D+1">
      <threshold-d1 :userId="userId"/>
    </bbva-web-tab-default-item>
    <bbva-web-tab-default-item heading="Ponderación fin de semana">
      <weighing-weekend :userId="userId" />
    </bbva-web-tab-default-item>
  </bbva-web-tab-default>
</template>

<script>
import AppBar from "@/components/AppBar/AppBar.vue";
import SimpleSectionHeader from '@/components/headers/SimpleSectionHeader.vue';
import '@/components/bbva-web-components/bbva-web-tab-default.js'
import ThresholdD1 from "@/views/setup/values-d1/ThresholdD1.vue"
import WeighingWeekend from "@/views/setup/values-d1/WeighingWeekend.vue"
import { getUsersAPI } from '@/requests/users';

export default {
  data() {
    return {
      /* User's id */
      userId: null
    }
  },
  beforeMount() {
    this.getCurrentUserInfo();
  },
  methods: {
    /* It get the information for a specific user */
    getCurrentUserInfo() {
     const user = JSON.parse(sessionStorage.getItem('userSession'));
      getUsersAPI(1,1,[{ name: 'employeeId', value: user.employeeId }]).then(
        (response) => {
          this.userId = response.data.items[0].id;
        }
      );
    },
  },
  components: {
    SimpleSectionHeader,
    ThresholdD1,
    WeighingWeekend,
    AppBar
  }
}
</script>
