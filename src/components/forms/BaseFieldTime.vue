<template>
  <bbva-form-time
    :error-message="errorMessage"
    :form="formId"
    :invalid="invalid"
    :label="label"
    :max="max"
    :min="min"
    :pattern="pattern"
    :required="required"
    :step="step"
    :value="data"
    @change="(ev) => setValue(name, ev.target.value)"
    auto-validate
    class="text-input"
    type="time"
  >
  </bbva-form-time>
</template>

<script>
// Components
import '@/components/bbva-web-components/bbva-form-input.js'

export default {
  name: 'BaseFieldTime',
  data() {
    return {
      data: ''
    }
  },
  props: {
    /**
     * The name of the key in the data object.
     * @type {string}
     */
    name: {
      type: String,
      required: true
    },
    /**
     * The label of the field.
     * @type {string}
     */
    label: {
      type: String,
      required: true
    },
    /**
     * The id of the form.
     * @type {string}
     */
    formId: {
      type: String,
      required: true
    },
    /**
     * The value of the field.
     * @type {string}
     */
    value: {
      type: String,
      default: ''
    },
    /**
     * Flag, true if the field is invalid.
     * @type {boolean}
     */
    invalid: {
      type: Boolean,
      default: false
    },
    /**
     * Error message.
     * @type {string}
     */
    errorMessage: {
      type: String,
      default: ''
    },
    /**
     * Flag, true if the field is required.
     * @type {boolean}
     */
    required: {
      type: Boolean,
      default: false
    },
    /**
     * The pattern of the field.
     * @type {string}
     */
    pattern: {
      type: String,
      default: ''
    },
    /**
     * The step of the field.
     * @type {number}
     */
    step: {
      type: Number,
      default: 5
    },
    /**
     * The min value of the field.
     * @type {string}
     */
    min: {
      type: String,
      default: ''
    },
    /**
     * The max value of the field.
     * @type {string}
     */
    max: {
      type: String,
      default: ''
    }
  },
  methods: {
    /**
     * Sets the value of a key and emits a 'value-change' event.
     *
     * @param {string} key - the key to set
     * @param {string} value - the value to set for the key
     * @return {void} 
     */
    setValue(key, value) {
      if (value === this.data) return
      this.data = value
      this.$emit('value-change', { [key]: value })
    }
  },
  watch: {
    /**
     * Called when the `value` property changes.
     *
     * @param {string} value - the new value of the `value` property
     * @return {void}
     */
    value() {
      this.data = this.value
    }
  },
  /**
   * Called after the component has been mounted, where the `data` property is assigned the value of the `value` property.
   *
   * @return {void} 
   */
  mounted() {
    this.data = this.value
  }
}
</script>

<style>
.text-input input {
  top: 0.6rem;
  left: 1rem;
}
</style>
