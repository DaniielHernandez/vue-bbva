<!-- eslint-disable vue/no-deprecated-slot-attribute -->
<template>
  <bbva-help-tooltip
    :opened="open"
    @help-tooltip-overlay-click="open = false"
    class="tooltip-help"
    horizontalPlacement="left"
    verticalPlacement="bottom"
  >
    <bbva-web-link :icon="icon" @click="open = !open" class="primary fw-500 padding-bottom" slot="invoker">
      {{ title }}
    </bbva-web-link>
    <div class="tooltip-filter">
      <span class="fs-18 fc-white fw-500">{{ optionsTitle }}</span>
      <div class="float-right">
        <v-btn @click="open = false" size="x-small" variant="text">
          <bbva-core-icon icon="bbva:close" size="m"></bbva-core-icon>
        </v-btn>
      </div>
      <div role="radiogroup" class="radio-custom-grid">
        <bbva-web-form-radio-button
          v-for="option in options"
          :checked="option.id === data"
          :key="option.id"
          :name="filterName"
          :value="option.id"
          @change="() => setOption(option.id)"
          ambient="dark"
          class="radio-item"
        >
          <span class="fs-15 fc-white">{{ option.label }}</span>
        </bbva-web-form-radio-button>
      </div>
    </div>
  </bbva-help-tooltip>
</template>
<script>
// Components
import '@/components/bbva-web-components/bbva-help-tooltip.js'
import '@/components/bbva-web-components/bbva-web-form-radio-button.js'
import '@/components/bbva-web-components/bbva-web-link.js'
import '@/components/bbva-web-components/bbva-core-icon.js'

export default {
  name: 'TooltipFilter',
  data() {
    return {
      open: false,
      data: ''
    }
  },
  methods: {
    /**
     * Set the option for the given item.
     *
     * @param {string|number|boolean} item - the item to set as the option
     * @return {void}
     */
    setOption(item) {
      if (item === this.data) return
      this.data = item
      this.$emit('value-change', { [this.filterName]: item })
    }
  },
  props: {
    title: { type: String, default: '', required: true },
    optionsTitle: { type: String, default: '', required: true },
    filterName: { type: String, default: '', required: true },
    value: { type: String, default: '' },
    icon: { type: String, default: 'bbva:show' },
    /**
     * The list of options.
     * @type {Array}
     * @example
     * [{ id: 1, label: 'Option 1' }]
     */
    options: { type: Array, required: true, default: () => [] }
  },
  /**
   * Called after the component has been mounted, where the `data` property is assigned the value of the `value` property.
   * If the `value` property is not set, the first option will be selected.
   * @return {void}
   */
  mounted() {
    if (this.value) this.data = this.value
    else if (this.options.length) this.data = this.options[0].id
  }
}
</script>

<style lang="scss" scoped>
.tooltip-filter {
  padding-block: 20px;
}

.tooltip-help {
  --_tooltip-width: var(--bbva-help-tooltip-width, 348px);
  --_help-tooltip-overlay-bg-color: var(--bbva-help-tooltip-dark-mode-overlay-color, unset);
  --_help-tooltip-bg-color: var(--bbva-help-tooltip-dark-mode-background-color, #004486);
  --_help-tooltip-after-bg-color: #004486;
}

.radio-custom-grid {
  padding-block: 10px;
  display: flex;
  border-bottom: 1px solid white;
}

.radio-item {
  width: 100%;
}

.padding-bottom {
  padding-bottom: 1rem;
}
</style>
