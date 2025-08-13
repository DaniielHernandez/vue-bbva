<template>
  <bbva-form-field
    class="field-input"
    action-variant="no-background"
    :id="`field-${id}`"
    :value="value"
    action-into-form=""
    :label="label"
    action-icon="bbva:calendar"
    :invalid="invalid || !!error"
    :error-message="errorMessage || error"
    @form-field-button-submit="openCalendar"
    @change="(ev) => validateDates(ev.target.value)"
    @form-field-input-clear="clearField"
    action-type="submit"
    :info-message=" (error || errorMessage ) ? '' : infoMessage"
    ></bbva-form-field>
  <div>
  <bbva-web-form-calendar-dialog
      :id="id"
      class="calendar"
      @dateSelected="(evt) => selectDate(evt.target.selectedDates)"
      type="multi">
  </bbva-web-form-calendar-dialog>
  </div>
</template>

<script>
import '@/components/bbva-web-components/bbva-web-form-calendar-dialog.js';
import '@/components/bbva-web-components/bbva-form-input.js';
import { isValid, format } from 'date-fns';

export default {
  data() {
    return {
      /* Message error */
      error: ''
    };
  },
  props: {
    /* Information message */
    infoMessage: { type: String, default: '' },
    /* Id of the tag */
    id: { type: String, default: 'MultiCalendar' },
    /* Label for input */
    label: { type: String, default: ''},
    /* Value of the input */
    value: { type: String, default: ''},
    /* Flag, true if the input is invalid */
    invalid: { type: Boolean, default: false},
    /* Message of error */
    errorMessage: { type: String, default: ''},
  },
  mounted(){
    const calendar = document.querySelector(`#${this.id}`);
    const date = this.value.replaceAll('-', '/');
    calendar.selectedDates = [ date ];
    calendar.focusedDate = date;
  },
  methods: {
    /*
     * Open the calendar
     */
    openCalendar() {
      const calendar = document.querySelector(`#${this.id}`);
      calendar.opened = true;
    },
    /*
     * Clear the input field
     */
    clearField() {
      const calendar = document.querySelector(`#${this.id}`);
      calendar.selectedDates = [];
    },
    /*
     * Validate if the input field is date
     * @param {String} value Field's input
     */
    validateDates(value) {
      const dates = [];
      const calendar = document.querySelector(`#${this.id}`);
      let valid = true;
      value.split(',').every( (date) => {
        valid = isValid( new Date(date) );
        dates.push(date.replaceAll('-', '/'));
        return valid;
      });

      this.error = valid ? '' : 'Formato inválido YYYY-MM-DD';

      this.$emit('value-change', { target: { value } })
      
      if( valid ) {
        calendar.selectedDates = dates;
      }
    },
    /*
     * Set the date selected from the calendar
     * @param {String} values Calendar's dates
     */
    selectDate(values) {
      if( !Array.isArray(values) ) {
        return;
      }
      let dates = '';
      values.forEach( (date, index) => {
        if( index ) {
          dates += ',' + format(date, 'yyyy-MM-dd');
        } else {
          dates += format(date, 'yyyy-MM-dd');
        }
      });
      this.$emit('value-change', { target: { value:  dates  } })
    },
  },
}
</script>

<style>
  .field-input input {
    position: absolute;
    top: 20%;
    left: 3%;
  }
  .calendar {
    top: -33px;
  }
</style>
