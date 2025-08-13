<!-- eslint-disable vue/no-deprecated-slot-attribute -->
<template>
  <bbva-help-tooltip
    :opened="open"
    class="tooltip-help"
    verticalPlacement="top"
    horizontalPlacement="left"
    :id="`taxpayer-trend-tooltip-${id}`"
  >
    <bbva-web-link :icon="icon" @click="openTooltip" class="primary fw-500" slot="invoker">
    </bbva-web-link>

    <div class="px-3 py-2">
      <div class="d-flex flex-row justify-space-between">
        <span class="fs-18 fw-500">Selecciona una serie gráfica</span>
        <v-btn @click="closeTooltip" size="x-small" variant="text">
          <bbva-core-icon icon="bbva:close" size="m"></bbva-core-icon>
        </v-btn>
      </div>
      <div class="d-flex flex-row flex-wrap align-center pt-2">
        <div
          v-for="(subMenu, index) in menu.subMenus"
          :key="index"
          class="d-flex align-center ga-2 cursor-pointer w-50"
          @click="changeSubMenu(subMenu, index)"
        >
          <hr class="rectangle" :style="{ borderBottom: '4px dashed' + subMenu.color }" />
          <p class="fs-14 fw-350" :class="{ 'text-disabled': !subMenu.visible }">
            {{ subMenu.label }}
          </p>
        </div>
      </div>
    </div>
  </bbva-help-tooltip>
</template>
<script>
// Components
import '@/components/bbva-web-components/bbva-help-tooltip.js'
import '@/components/bbva-web-components/bbva-web-link.js'

export default {
  name: 'TaxpayerTrendTooltip',
  data() {
    return {
      open: false
    }
  },
  methods: {
    /**
     * Opens the tooltip if it is not already open, emitting an 'open' event with the id.
     * If the tooltip is already open, it calls the closeTooltip method.
     *
     * @return {void}
     */
    openTooltip() {
      if (!this.open) {
        this.$emit('open', this.id)
        this.open = true
      } else {
        this.closeTooltip()
      }
    },
    /**
     * Closes the tooltip by emitting a 'close' event with the current id and setting the 'open' property to false.
     *
     * @return {void}
     */
    closeTooltip() {
      this.$emit('close', this.id)
      this.open = false
    },
    /**
     * Emits an event to change the sub menu.
     *
     * @param {string} subMenu - The new sub menu to be set.
     * @param {number} index - The index of the sub menu.
     * @return {void}
     */
    changeSubMenu(subMenu, index) {
      this.$emit('changeSubMenu', { menuIndex: this.id, subMenu: subMenu, index: index })
    }
  },
  props: {
    /**
     * The id of the tooltip.
     * @type {number}
     * @default null
     * @required
     */
    id: { type: Number, default: null, required: true },
    /**
     * The menu of the tooltip.
     * @type {Object}
     * @default null
     * @required
     */
    menu: { type: Object, default: null, required: true },
    /**
     * The icon of the tooltip.
     * @type {String}
     * @default 'bbva:show'
     */
    icon: { type: String, default: 'bbva:show' }
  },
  /**
   * Mounts the component and adjusts the tooltip position after the component is rendered.
   * @return {void}
   */
  mounted() {
    this.$nextTick(() => {
      const taxpayerTrendTooltip = window.document.getElementById(
        `taxpayer-trend-tooltip-${this.id}`
      )
      const tooltip = taxpayerTrendTooltip.shadowRoot.querySelector('.tooltip')
      tooltip.style.bottom = 'calc(100% + 1rem - var(--_tooltip-spacing))'
      tooltip.style.width = `${this.menu.width}px`
    })
  }
}
</script>

<style lang="scss" scoped>
.tooltip-help {
  --_tooltip-width: var(--bbva-help-tooltip-width, 650px);
  --_help-tooltip-overlay-bg-color: unset;
  --_help-tooltip-bg-color: #ffffff;
  --_help-tooltip-after-bg-color: #ffffff;
  --_help-tooltip-bg-color-pressed: #ffffff;
  --_help-tooltip-color: #000000;
}
.rectangle {
  border: none;
  width: 18px;
  height: 4px;
}
</style>
