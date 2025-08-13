<template>
  <bbva-web-form-select-multiple
    :error-message="errorMessage"
    :form="formId"
    :invalid="invalid"
    :label="label"
    :required="required"
    @change="(ev) => setValue(ev.target.selectedOptionsValues)"
    auto-validate
  >
    <bbva-web-form-option-multiple
      v-for="option in options"
      :key="option.id"
      :value="option.id"
      :selected="data.includes(option.id)"
    >
      <span class="pl-4 d-inline-block">{{ option.label }}</span>
    </bbva-web-form-option-multiple>
  </bbva-web-form-select-multiple>
</template>

<script>
// Components
import '@/components/bbva-web-components/bbva-web-form-select-multiple.js'

export default {
  name: 'BaseSelectMultiple',
  data() {
    return {
      data: []
    }
  },
  props: {
    /**
     * The name of the key.
     * @type {String}
     */
    name: {
      type: String,
      required: true
    },
    /**
     * The label of the key.
     * @type {String}
     */
    label: {
      type: String,
      required: true
    },
    /**
     * The id of the form.
     * @type {String}
     */
    formId: {
      type: String,
      required: true
    },
    /**
     * The value of the key.
     * @type {Array}
     */
    value: {
      type: Array,
      default: () => []
    },
    /**
     * The list of options.
     * @type {Array}
     * @example
     * [{ id: 1, label: 'Option 1' }]
     */
    options: {
      type: Array,
      required: true
    },
    /**
     * The error message of the key.
     * @type {String}
     */
    errorMessage: {
      type: String,
      default: ''
    },
    /**
     * If true, the key is required.
     * @type {Boolean}
     */
    required: {
      type: Boolean,
      default: false
    },
    /**
     * If true, the key is invalid.
     * @type {Boolean}
     */
    invalid: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    /**
     * Sets the value of a key and emits a 'value-change' event.
     *
     * @param {Array} value - the value to set for the key from name props
     * @return {void}
     */
    setValue(value) {
      if (value === this.data) return
      this.data = value
      this.$emit('value-change', { [this.name]: value })
    }
  },
  /**
   * Called after the component has been mounted, where the `data` is assigned the value of the `value` props.
   *
   * @return {void}
   */
  watch: {
    /**
     * Sets the value of the component's data property to the provided new value.
     *
     * @param {Array} newValue - The new value to set for the component's data property.
     * @return {void}
     */
    value(newValue) {
      this.data = newValue
    }
  },
  /**
   * Called after the component has been mounted, where the `data` property is assigned the value of the `value` property.
   *
   * @return {void}
   */
  mounted() {
    if (this.value) this.data = this.value
  },
}
</script>
