<template>
  <bbva-help-tooltip
    class="tooltip-help"
    :opened="open"
    horizontalPlacement="left"
    @help-tooltip-overlay-click="close"
  >
    <bbva-web-link
      class="primary padding-invoker"
      slot="invoker"
      :icon="icon"
      @click="show"
      :disabled="disabled"
    >
      {{ title }}
    </bbva-web-link>

    <v-container>
      <span class="fs-18 fc-white fw-500">Selecciona una opción</span>
      <div class="float-right">
        <v-btn variant="text" size="x-small" @click="close">
          <bbva-core-icon icon="bbva:close" size="m"></bbva-core-icon>
        </v-btn>
      </div>
      <div role="radiogroup" class="radio-custom-grid">
        <div v-for="(option, key) in options" :key="key">
          <bbva-web-form-radio-button
            :key="`input-radio-true-${key}`"
            ambient="dark"
            :checked="option?.value === true"
            @change="() => updateRadioFilter(key, true)"
          >
            <span class="fs-15 fc-white">{{ option?.labels?.[0] }}</span>
          </bbva-web-form-radio-button>
          <bbva-web-form-radio-button
            :key="`input-radio-false-${key}`"
            ambient="dark"
            :checked="option?.value === false"
            @change="() => updateRadioFilter(key, false)"
          >
            <span class="fs-15 fc-white">{{ option?.labels?.[1] }}</span>
          </bbva-web-form-radio-button>
        </div>
      </div>
    </v-container>
  </bbva-help-tooltip>
</template>

<script>
// Components
import '@/components/bbva-web-components/bbva-help-tooltip.js'
import '@/components/bbva-web-components/bbva-web-form-radio-button.js'
import '@/components/bbva-web-components/bbva-web-link.js'
import '@/components/bbva-web-components/bbva-core-icon.js'

export default {
  props: {
    /**
     * @prop {Boolean} disabled - A flag to disable the component. Defaults to `false`.
     **/
    disabled: {
      type: Boolean,
      required: false,
      default: false
    },
    /**
     * @prop {Boolean} resetValues - A flag to reset the values of the options when the tooltip is closed.
     * Defaults to `false`.
     **/
    resetValues: {
      type: Boolean,
      required: false,
      default: false
    },
    /**
     * @prop {Object} options -
     * A required object containing the radio button options with their respective values and labels.
     * Defaults to an empty object `{}`.
     **/
    options: {
      type: Object,
      required: true,
      default: () => ({})
    },
    /**
     * @prop {String} title - A required string to define the title displayed in the tooltip's invoker link.
     * Defaults to an empty string `''`.
     **/
    title: {
      type: String,
      required: true,
      default: ''
    },
    /**
     *   @prop {String} icon - The icon name to display in the tooltip's invoker link. Defaults to 'bbva:show'.
     **/
    icon: {
      type: String,
      required: false,
      default: 'bbva:show'
    }
  },

  data() {
    return {
      // Flag tooltip
      open: false
    }
  },

  methods: {
    /**
     * Opens the tooltip by setting the `open` data property to `true`.
     */
    show() {
      this.open = true
    },

    /**
     * Closes the tooltip by setting the `open` data property to `false`.
     * If the `resetValues` prop is `true`, all option values will be reset to `null`.
     * Emits the `radio-options-change` event with the updated `options` object.
     */
    close() {
      const keys = Object.keys(this.options)

      if (this.resetValues) {
        keys.forEach((key) => {
          this.options[key].value = null
        })
      }
      this.$emit('radio-options-change', { ...this.options })
      this.open = false
    },

    /**
     * Updates a single radio button option's value.
     * Updates the `options` object by setting the value of the provided `key` to `value`.
     * Emits the `radio-options-change` event with the updated `options` object.
     *
     * @param {String} key - The key of the option to update.
     * @param {Boolean} value - The new value for the radio button (true/false).
     */
    updateRadioFilter(key, value) {
      this.options[key].value = value
      this.$emit('radio-options-change', { ...this.options })
    }
  }
}
</script>

<style scoped>
.tooltip-help {
  --_tooltip-width: var(--bbva-help-tooltip-width, 349px);
  --_help-tooltip-overlay-bg-color: var(--bbva-help-tooltip-dark-mode-overlay-color, unset);
  --_help-tooltip-bg-color: var(--bbva-help-tooltip-dark-mode-background-color, #004486);
  --_z-index: var(--bbva-help-tooltip-z-index, 100);
  --_help-tooltip-after-bg-color: #004486;
}

.radio-custom-grid {
  padding-top: 20px;
  padding-bottom: 10px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  border-bottom: 1px solid white;
}

.padding-invoker {
  padding-bottom: 1rem;
}
</style>
