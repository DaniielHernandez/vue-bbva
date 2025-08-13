<template>
  <bbva-foundations-spinner with-mask :size="size" />
</template>

<script>
import '@/components/bbva-web-components/bbva-foundations-spinner.js'

export default {
  props: {
    size: {
      type: Number,
      default: 180
    }
  }
}
</script>
