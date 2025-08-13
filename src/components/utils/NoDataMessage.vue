<template>
  <v-container class="ml-0 pl-12">
    <v-row>
      <v-col>
        <div :class="styles.icon">
          <micro-empty-state-day />
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <span class="text-h5">{{title}}</span>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <span>{{message}}</span>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import '@/components/bbva-web-components/bbva-foundations-microillustrations.js';
import { ref } from 'vue';

export default {
  data() {
    return {
      styles: {
        icon: ref('icon-message')
      }
    };
  },
  props: {
    title: { type: String, default: '' },
    message: { type: String, default: '' },
  }
}
</script>

<style>
.icon-message {
  width: 80px;
  height: 80px;
}
</style>
