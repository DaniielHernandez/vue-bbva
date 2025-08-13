<template>
  <bbva-web-form-select
    :error-message="errorMessage"
    :form="formId"
    :invalid="invalid"
    :label="label"
    :required="required"
    :value="data"
    @change="(ev) => setValue(ev.target.value)"
  >
    <bbva-web-form-option
      v-for="option in options"
      :key="option.id"
      :selected="option.id === data"
      :value="option.id"
    >
      <span class="pl-4 d-inline-block">{{ option.label }}</span>
    </bbva-web-form-option>
  </bbva-web-form-select>
</template>

<script>
// Components
import '@/components/bbva-web-components/bbva-web-form-select.js'

export default {
  name: 'BaseSelect',
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
      type: [String, Number],
      default: ''
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
     * Flag, true if it's required.
     * @type {boolean}
     */
    required: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    /**
     * Sets the value of a key and emits a 'value-change' event.
     *
     * @param {string | number} value - the value to set for the key from name props
     * @return {void}
     */
    setValue(value) {
      if (value === this.data) return
      this.data = value
      this.$emit('value-change', { [this.name]: value })
    }
  },
  watch: {
    /**
     * Set a value for a field and validate it
     * @param {String | Number} value Field's value
     */
    value() {
      if (this.value) this.data = this.value
    }
  },
  /**
   * Called after the component has been mounted, where the `data` is assigned the value of the `value` props.
   *
   * @return {void}
   */
  mounted() {
    if (this.value) this.data = this.value
  }
}
</script>
