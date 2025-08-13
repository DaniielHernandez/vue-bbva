<template>
  <v-overlay v-model="overlay" class="align-center justify-center" persistent>
    <div class="text-center">
      <bbva-foundations-spinner with-mask :size="size" />
    </div>
  </v-overlay>
</template>

<script>
import '@/components/bbva-web-components/bbva-foundations-spinner.js'

export default {
  data() {
    return {
      /* It has the overlay */
      overlay: false
    }
  },
  props: {
    /* Flag, true if it is open */
    open: { type: Boolean, default: false },
    /* Size of the icon loader */
    size: {
      type: Number,
      default: 180
    }
  },
  watch: {
    open(value) {
      this.overlay = value
    }
  }
}
</script>
