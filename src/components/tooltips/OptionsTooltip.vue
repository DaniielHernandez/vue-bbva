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
      icon="bbva:show"
      @click="show">
      Otras opciones de vista
    </bbva-web-link>
    <div>
      <span class="fs-18 fc-white fw-500">Selecciona una opción</span>
      <div class="float-right">
        <v-btn
          variant="text"
          size="x-small"
          @click="close"
          >
          <bbva-core-icon icon="bbva:close" size="m"></bbva-core-icon>
        </v-btn>
      </div>
      <div role="radiogroup" class="radio-custom-grid">
        <bbva-web-form-radio-button
           ref="availabilityTrue"
          :key="`input-is-availability-radio-1-${index}`"
          ambient="dark"
          :checked="radioFilters.availability"
          @change="() => updateRadioFilter('availability', true)">
          <span class="fs-15 fc-white">Disponibilidad</span>
        </bbva-web-form-radio-button>
        <bbva-web-form-radio-button 
          :checked="!radioFilters.availability"
          :key="`input-is-unavailability-radio-2-${index}`"
          ambient="dark"
          @change="() => updateRadioFilter('availability', false)"
          >
          <span class="fs-15 fc-white">Indisponibilidad</span>
        </bbva-web-form-radio-button>
      </div>
      <div class="second-section-radio">
        <span class="fs-15 fc-white fw-500">Selecciona una opción</span>
        <div role="radiogroup" class="radio-custom-grid">
          <bbva-web-form-radio-button
            :key="`input-decimals-radio-1-${index}`"
            :checked="radioFilters.decimals === 2"
            ambient="dark"
            @change="() => updateRadioFilter('decimals', 2)"
            >
            <span class="fs-15 fc-white">2 decimales</span>
          </bbva-web-form-radio-button>
          <bbva-web-form-radio-button 
            :checked="radioFilters.decimals === 3"
            :key="`input-decimals-radio-2-${index}`"
            @change="() => updateRadioFilter('decimals', 3)"
            >
            <span class="fs-15 fc-white">3 decimales</span>
          </bbva-web-form-radio-button>
        </div>
      </div>
    </div>
  </bbva-help-tooltip>
</template>
<script>
import '@/components/bbva-web-components/bbva-help-tooltip.js'
import '@/components/bbva-web-components/bbva-web-form-radio-button.js'
import '@/components/bbva-web-components/bbva-web-link.js'
import '@/components/bbva-web-components/bbva-core-icon.js'

/*
 * This methos shows the tooltip to choose between availability and decimals
 */
export default {
  data() {
    return {
      /* Flag, true it the tooltip is open */
      open: false
    };
  },
  methods: {
    /*
     * Open the tooltip
     */
    show() {
      this.open = true;
    },
    /*
     * Close the tooltip
     */
    close() {
      this.open = false;
    },
    /*
     * Update the tooltip filter
     * @param {String} key    Filed's name
     * @param {String} value  Field's value
     */
    updateRadioFilter(key, value) {
      if( this.radioFilters[key] !== value) {
        this.setRadioFilter(key, value)
      }
    }
  },
  props: {
    /* Function to set the radio filter */
    setRadioFilter: {  type: Function, default: () => {} },
    /* Radio filter */
    radioFilters: {  type: Function, default: () => ({ decimals: 2, availability: true }) },
    /* index */
    index: { type: Number, default: 0 },
  }
};
</script>

<style>
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
	justify-content: space-around;
  border-bottom: 1px solid white;
}
.second-section-radio {
  padding-top: 20px;
  padding-bottom: 20px;
}
.padding-invoker {
 padding-bottom: 1rem;
}
</style>
