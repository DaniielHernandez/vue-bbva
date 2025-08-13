<template>
  <bbva-web-form-textarea
    :error-message="errorMessage"
    :form="formId"
    :invalid="invalid"
    :label="label"
    :maxlength="max"
    :minlength="min"
    :show-max-counter="showMaxCounter"
    :required="required"
    :value="value"
    @blur="(ev) => setValue(ev.target.value)"
    @input-clear="setValue(null)"
    class="textarea"
  >
  </bbva-web-form-textarea>
</template>

<script>
// Components
import '@/components/bbva-web-components/bbva-web-form-textarea.js'

export default {
  name: 'BaseTextArea',
  data() {
    return {
      data: ''
    }
  },
  props: {
    name: {
      type: String,
      required: true
    },
    label: {
      type: String,
      required: true
    },
    formId: {
      type: String,
      required: true
    },
    value: {
      type: String,
      default: ''
    },
    errorMessage: {
      type: String,
      default: ''
    },
    invalid: {
      type: Boolean,
      default: false
    },
    required: {
      type: Boolean,
      default: false
    },
    min: {
      type: String,
      default: ''
    },
    max: {
      type: String,
      default: ''
    },
    showMaxCounter: {
      type: Boolean,
      default: false
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
    setValue(value) {
      if (this.value === value) return
      this.$emit('value-change', { [this.name]: value })
    }
  },
}
</script>

<style>
.textarea textarea {
  padding-top: 0.6rem;
  padding-inline: 1rem;
}
</style>
