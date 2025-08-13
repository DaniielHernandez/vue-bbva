<template>
  <v-overlay v-model="openOverlay" color="primary"></v-overlay>
</template>

<script>
export default {
  data() {
    return {
      /* Flag, true if the overlay is open */
      openOverlay: false
    };
  },
  props: {
    /* Flag, true if it is open */
    open: { type: Boolean, default: false }
  },
  watch: {
    open(value) {
      this.openOverlay = value;
    }
  }
}
</script>

<style>
.v-overlay--active {
    background: rgb(04, 32, 63 , 0.45);
}
</style>

