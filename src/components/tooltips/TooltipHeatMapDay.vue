<template>
  <bbva-help-tooltip
    class="tooltip-heat-map-day"
    :style="`--bbva-help-tooltip-invoker-background-color: ${day.color  || '#043263' };`"
    :opened="open"
    horizontalPlacement="left"
    verticalPlacement="bottom"
    @help-tooltip-overlay-click="close"
  >
    <bbva-web-link
      slot="invoker"
      class="fs-15 fc-white pl-4 pr-4 pt-2 pb-2"
      @click="show"
      :style="`background: ${day.color || '#043263'};`"
      >
    {{ day.day }}
    </bbva-web-link>
    <div class="tooltip-align">
      <span class="fs-18 fc-white fw-500">Ajustes</span>
      <div class="float-right">
        <v-btn
          variant="text"
          size="x-small"
          @click="close"
          >
          <bbva-core-icon icon="bbva:close" size="m" class="blue-light"></bbva-core-icon>
        </v-btn>
      </div>
      <div >
        <bbva-web-link
            v-if="showLink"
          class="blue-light fw-500 pt-4 pl-2"
          @click="redirect">
          Ver gráfica y ajustar impacto
        </bbva-web-link>
      </div>
    </div>
  </bbva-help-tooltip>
</template>
<script>
/* Components */
import '@/components/bbva-web-components/bbva-help-tooltip.js'
import '@/components/bbva-web-components/bbva-web-link.js'
import '@/components/bbva-web-components/bbva-core-icon.js'
/* Utils */
import { setDayStringDate, formatNumber, createQueryParams } from '@/utils/general';
import { translateFilters } from '@/utils/serviceLevels.js';

/*
 * This components shows the tooltip to redirect to the graph view
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
     * It redirects to the graph view
     */
    redirect() {
      const filters = translateFilters( this.filters );
      const date = filters.find( (item) => item.name === 'date' ).value;
      const dayDate = setDayStringDate(this.day.day, date);
      const query = createQueryParams([
        ...filters.filter( (item) => !['date', 'decimals', 'availability'].includes(item.name) ),
        { name: 'date', value: dayDate }
      ]);
      const routeData = this.$router.resolve({name: 'service-levels-cfs-detail-impact'});
      window.open(routeData.href + '?' + query, '_blank');
    },
    /*
     * Close the tooltip
     */
    close() {
      this.open = false;
    },
    /*
     * It opens the tooltip
     */
    show() {
      this.open = true;
    },
  },
  props: {
    /* Flag, true if th link must be showed */
    showLink: { type: Boolean, default: false },
    /* Label to show the day */
    day: {  type: Object, default: () => ({}) },
    /* Input filters */
    filters: { type: Array, default: () => ([]) }
  }
};
</script>

<style>
.tooltip-heat-map-day {
  --_tooltip-width: var(--bbva-help-tooltip-width, 266px);
  --_help-tooltip-overlay-bg-color: var(--bbva-help-tooltip-dark-mode-overlay-color, unset);
  --_help-tooltip-bg-color: var(--bbva-help-tooltip-dark-mode-background-color, #004486);
  --_help-tooltip-after-bg-color: #004486;
}
.tooltip-align {
  text-align: left;
}
</style>
