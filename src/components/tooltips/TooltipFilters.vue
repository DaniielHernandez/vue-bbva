<!-- eslint-disable vue/no-deprecated-slot-attribute -->
<template>
  <bbva-help-tooltip
    :opened="open"
    @help-tooltip-overlay-click="open = false"
    class="tooltip-help"
    horizontalPlacement="left"
    verticalPlacement="bottom"
  >
    <bbva-web-link
      :icon="icon"
      @click="open = !open"
      class="primary fw-500 padding-bottom"
      slot="invoker"
    >
      {{ titleLink }}
    </bbva-web-link>
    <div class="my-5">
      <div class="float-right">
        <v-btn @click="open = false" size="x-small" variant="text">
          <bbva-core-icon icon="bbva:close" size="m"></bbva-core-icon>
        </v-btn>
      </div>
      <template v-for="(filterOption, index) in filtersOptions" :key="index">
        <span class="fs-18 fc-white fw-500">{{ filterOption.label }}</span>
        <div
          role="radiogroup"
          class="radio-custom-grid"
          :class="{ 'mb-4': index < filtersOptions.length - 1 }"
        >
          <bbva-web-form-radio-button
            v-for="option in filterOption.options"
            :key="option.value"
            :value="option.value"
            :checked="option.value === filters[filterOption.name]"
            @change="() => setOption(filterOption.name, option.value)"
            ambient="dark"
            class="radio-item"
          >
            <span class="fs-15 fc-white">{{ option.label }}</span>
          </bbva-web-form-radio-button>
        </div>
      </template>
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
  name: 'TooltipFilters',
  data() {
    return {
      open: false
    }
  },
  methods: {
    /**
     * Sets the value of a key and emits a 'set-option' event if the value is different from the current value.
     *
     * @param {string} key - The key to set.
     * @param {any} value - The value to set for the key.
     * @return {void}
     */
    setOption(key, value) {
      if (value === this.filters[key]) return
      this.$emit('set-option', { key, value })
    }
  },
  props: {
    /**
     * The title of the tooltip.
     * @type {String}
     */
    titleLink: { type: String, default: 'Seleccione una opción' },
    /**
     * The icon of the tooltip.
     * @type {String}
     * @default 'bbva:show'
     */
    icon: { type: String, default: 'bbva:show' },
    /**
     *     The list of filters and their options.
     *     @type {Array}
     *     @required
     *     @example
     *     [{ name: 'filter1', label: 'Filter 1', options: [{ value: 1, label: 'Option 1' }] }]
     */
    filtersOptions: { type: Array, required: true, default: () => [] },
    /**
     * The values of the filters.
     * @type {Object}
     * @required
     * @example
     * { filter1: 1 }
     * */
    filters: { type: Object, required: true, default: () => {} }
  }
}
</script>

<style lang="scss" scoped>
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
