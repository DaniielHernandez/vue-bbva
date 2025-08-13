<template>
  <div
    data-grid="region">
    <div data-grid="zone">
      <bbva-web-form-date custom
        :label="label"
        :form="formId"
        :value="date"
        :min="min"
        :class="`date-input ${classes}`"
        :invalid="invalid"
        :disabled="disabled"
        :error-message="errorMessage"
        :max="max"
        :required="required"
        @input="(ev) => onChange(ev)"
      />
    </div>
  </div>
</template>

<script>
import '@/components/bbva-web-components/bbva-web-form-date.js'

/*
 * This component was made to wrap the bbva date picker component with
 * specific styles
 * 
 */
export default {
  data() {
    return {
      /* date */
      date: '',
    };
  },
  beforeMount() {
    this.date = this.value;
  },
  props: {
    /* Label to show */
    label: { type: String, default: '' },
    /* Flag, true if the field is invalid */
    invalid:{  type: Boolean, default: false },
    /* Error message */
    errorMessage: { type: String, default: '' },
    /* Date */
    value: { type: String, default: '' },
    /* Min date */
    min: { type: String, default: '' },
    /* Max date */
    max: { type: String, default: '' },
    /* Flag, true if it's disabled */
    disabled: { type: Boolean, default: false },
    /* Class css to add to date picker */
    classes: { type: String, default: '' },
    /* Flag, true if it's required */
    required: { type: Boolean, default: false },
    /* Form id */
    formId: { type: String, default: '' },
  },
  methods: {
    /*
     * This method handle the event on Change for the date picker
     * and emit another event value-change
     * 
     * @param {Object} ev Event result of change the date
     */
    onChange (ev) {
      const ts = ev.target.value
      if (ts === this.date) return
      this.$emit('value-change', { target: { value: { ts } } })
    },
  },
  watch: {
    /*
     * Follow the changes over value and update the internal date
     */
    value(newValue) {
      this.date = newValue;
    }
  }
}
</script>

<style>
  .date-input input {
    position: absolute;
    top: 20%;
    left: 5%;
  }
</style>
