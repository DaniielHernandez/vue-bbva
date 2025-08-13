<template>
  <app-bar />
  <simple-section-header
    title="Administración de Catalogos"
    icon="/icons/Book.svg"
    backPath="/setup"
  />
  <v-container fluid class="pl-12 pr-12">
    <v-row>
      <v-col
        v-for="(col, index) in list"
        :key="`col-admin-catalogs-${index}`"
        sm="12"
        md="6"
        lg="4"
        xl="4"
        :class="styles.colVertical"
        >
        <div  :class="styles.colItem">
          <img src="/icons/flag.svg" alt="Icono de listado">
          <span class="pl-1 font-catalog">{{ col.title }}</span>
          <div class="float-right">
            <bbva-button-default
              variant="link"
              style="color: #1973B8; font-size: 15px !important"
              text="Administrar"
              @click="() => $router.push(col.path)">
            </bbva-button-default>
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { dataList } from '@/constants/adminCatalogs';
import AppBar from "@/components/AppBar/AppBar.vue";
import '@/components/bbva-web-components/bbva-button-default.js'
import { ref } from 'vue';

import SimpleSectionHeader from '@/components/headers/SimpleSectionHeader.vue';
export default {
  data() {
    return {
      /* List of items to be used in the view */
      list: dataList,
      /* styles */
      styles: {
        colItem: ref('col-item'),
        colVertical: ref('col-vertical')
      }
    }
  },
  components: {
    SimpleSectionHeader,
    AppBar
  }
}
</script>

<style>
.col-vertical {
  padding-top: 20px;
}
.col-item {
  border-bottom: 1px solid #D3D3D3;
  margin-left: 10px;
  margin-right: 10px;
  padding-bottom: 20px;
}
.font-catalog {
  font-size: 15px !important;
  font-weight: 350;
}
</style>
