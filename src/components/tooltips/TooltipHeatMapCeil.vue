<template>
  <bbva-help-tooltip
    class="tooltip-heat-map-ceil"
    :style="`--bbva-help-tooltip-invoker-background-color: ${day.color};`"
    :opened="open"
    horizontalPlacement="center"
    verticalPlacement="bottom"
    @help-tooltip-overlay-click="close"
  >
    <bbva-web-link
      slot="invoker"
      class="fs-15 pl-4 pr-4 pt-2 pb-2"
      @click="show"
      :style="`background: ${day.color};`"
      >
    {{ formatNumber(day.value) }}
    </bbva-web-link>
    <div class="tooltip-ceil-align pb-3">
      <span class="fs-18 fc-white fw-500 pt-2">Detalle de ejecuciones y errores</span>
      <div class="float-right">
        <v-btn
          variant="text"
          size="x-small"
          @click="close"
          >
          <bbva-core-icon icon="bbva:close" size="m" class="blue-light"></bbva-core-icon>
        </v-btn>
      </div>
      <div class="fs-15 fc-white">
        Total de ejecuciones: {{formatNumber(data.totalExecutions)}}
      </div>
      <div class="fs-15 fc-white pb-4">
        Total de errores: {{formatNumber(data.totalErrors)}}
      </div>
      <v-table class="table-heat-map-ceil">
        <thead>
          <th class="fs-15 fw-500 fc-white">HORA</th>
          <th class="fs-15 fw-500 fc-white">EJECUCIONES</th>
          <th class="fs-15 fw-500 fc-white">ERRORES</th>
        </thead>
        <tbody>
          <tr v-for="hour in data.hours">
            <td class="fs-12 fc-white pl-0" style="height: 24px !important;">{{hour.hour}}</td>
            <td class="fs-12 fc-white pl-0" style="height: 24px !important;">{{formatNumber(hour.executions)}}</td>
            <td class="fs-12 fc-white pl-0" style="height: 24px !important;">{{formatNumber(hour.errors)}}</td>
          </tr>
        </tbody>
      </v-table>
      <bbva-web-link
        v-if="showLink"
        class="blue-light fw-500 pt-3"
        @click="redirect">
        Asociación impactos
      </bbva-web-link>
    </div>
  </bbva-help-tooltip>
</template>
<script>
/* Components */
import '@/components/bbva-web-components/bbva-help-tooltip.js'
import '@/components/bbva-web-components/bbva-web-link.js'
import '@/components/bbva-web-components/bbva-core-icon.js'
/* Requests */
import { getHeatMapDetailAPI } from '@/requests/heatMap';
/* Utils */
import { setDayStringDate, formatNumber, createQueryParams } from '@/utils/general';
import { translateFilters } from '@/utils/serviceLevels.js';
/*
 * This component shows the tooltip to choose between availability and decimals
 */
export default {
  data() {
    return {
      /* Flag, true it the tooltip is open */
      open: false,
      formatNumber,
      data: {}
    };
  },
  methods: {
    /*
     * This method format the hour from '9:55' to '09:55'
     * @param {String} hour hour to be formated
     * @return String 
     */
    formatHour(hour) {
      const numberHour = parseInt( hour.split(':')[0] );
      const minutes = hour.split(':')[1];
      if( numberHour < 10 ) {
        return `0${numberHour}:${minutes}`;
      }
      return hour;
    },
    /*
     * Redirect to the  associate settings view
     */
    redirect() {
      const filters = translateFilters( this.getFilters() );
      const hourIndex = filters.findIndex( (item) => item.name === 'hour');

      filters[ hourIndex ] = {
        name: 'startHour', value: this.formatHour( this.data.hours[0].hour )
      };
      filters.push( {
        name: 'endHour', value:  this.formatHour( this.data.hours[ this.data.hours.length - 1].hour )
      });
      const query = createQueryParams( filters )

      const routeData = this.$router.resolve({name: 'add-adjustment'});
      window.open(routeData.href + '?' + query + `bu=${this.bu}`, '_blank');
    },
    /*
     * Close the tooltip
     */
    close() {
      this.open = false;
    },
    /*
     * It opens the tooltip and search the data to be
     * showed by the tooltip
     */
    show() {
      this.open = true;
      this.searchCeilDetail();
    },
    /*
     * It makes the filters to use by the request to get
     * the data for this ceil
     */
    getFilters() {
     const date = this.filters.find( (item) => item.name === 'date' ).value;
     const dayDate = setDayStringDate(this.day.day, date);

     return [
        ...this.filters.filter((item) => item.name !== 'date'),
        { name: 'hour', value: parseInt(this.hour.split(':')[0]) },
        { name: 'date', value: dayDate }
      ];
    },
    /*
     * It gets the data to be showed by the tooltip
     */
    searchCeilDetail() {
      this.emitter.emit('load', { loading: true });
      getHeatMapDetailAPI( this.getFilters() ).then((response) => {
        this.data = response.data;
      }).catch( (error) => {
        this.open = false;
        this.emitter.emit('error', { action: 'obtener datos de la celda', error });
      }).finally(() => {
        this.emitter.emit('load', { loading: false });
      });
    }
  },
  props: {
    /* Flag, true if th link must be showed */
    showLink: { type: Boolean, default: false },
    /* BU's name*/
    bu: { type: String, default: ''},
    /* Label to show the day */
    day: {  type: Object, default: () => ({}) },
    /* It has the hour related to the ceil */
    hour: {  type: String, default: '' },
    /* Input filters */
    filters: {  type: Array, default: () => ([]) },
  },
};
</script>

<style>
.tooltip-heat-map-ceil {
  --_tooltip-width: var(--bbva-help-tooltip-width, 361px);
  --_tooltip-height: var(--bbva-help-tooltip-height, 485px);
  --_help-tooltip-overlay-bg-color: var(--bbva-help-tooltip-dark-mode-overlay-color, unset);
  --_help-tooltip-bg-color: var(--bbva-help-tooltip-dark-mode-background-color, #004486);
  --_help-tooltip-after-bg-color: #004486;
}
.tooltip-ceil-align {
  text-align: left;
}
.table-heat-map-ceil {
  background: #004486;
  td {
    border-bottom: 0px !important;
  }
}
</style>
