<template>
  <div class="pt-8 pb-8">
    <span class="fs-15 pr-8">MAPA DE CALOR</span>
    <span class="fs-15 pr-8">Canal: {{loadData.cfs}}</span>
    <span class="fs-15 pr-8">CBP: {{loadData.cbp}}</span>
    <span class="fs-15 pr-8">Operativa: {{loadData.operative}}</span>
    <span class="fs-15 pr-8">Mes: {{month}}</span>
  </div>
  <no-data-message 
     v-if="!loadData.hours.length"
     title="Información de la tabla"
     :message="filters.length ? 'No hay datos para los filtros seleccionados' :
              'No hay datos que mostrar en la tabla'"
  />
  <v-table v-else class="heat-map-table">
    <thead>
      <tr>
        <th class="ceil" style="text-align: center;">HORA</th>
        <th
          class="ceil"
          v-for="header in loadData.days"
          :style="`
            background: ${header.color || '#043263' };
            text-align: center;
          `"
          :key="`header-${header.day}`">
          <tooltip-heat-map-day :day="header" :filters="this.filters"
            :showLink="showLinkDay"
            />
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(hour, indexHour) in loadData.hours" :key="`hour-${indexHour}`">
        <td class="fs-15 ceil">{{ hour.hour }}</td>
        <td v-for="day in hour.days"
          class="fs-15 ceil td-border-bottom"
          :style="`
            background: ${day.color};
          `"
          >
          <tooltip-heat-map-ceil :day="day" :hour="hour.hour" :filters="this.filters"
            :showLink="showLinkCeil"
            :bu="bu"/>
        </td>

      </tr>
      <tr class="totals fs-15 fc-white">
        <td :colspan="loadData.days.length + 1">
          Total de ejecuciones del día: {{ formatNumber(loadData.totals.executions) }}
        </td>
      </tr>
      <tr>
        <td></td>
        <td v-for="day in loadData.days" :key="`footer-day-executions-${day.day}`">
          {{ formatNumber(day.totalExecutions)}}
        </td>
      </tr>

      <tr class="totals fs-15 fc-white">
        <td :colspan="loadData.days.length + 1">
          Total de errores del día: {{ formatNumber(loadData.totals.errors) }}
        </td>
      </tr>
      <tr>
        <td></td>
        <td v-for="day in loadData.days" :key="`footer-day-errors-${day.day}`">
          {{ formatNumber(day.totalErrors)}}
        </td>
      </tr>

      <tr class="totals fs-15 fc-white">
        <td :colspan="loadData.days.length + 1">
          Peso del día en el mes:  Porcentaje de ejecuciones del día frente a las ejecuciones del mes: 
            {{ formatNumber(loadData.totals.weight) }}
        </td>
      </tr>
      <tr>
        <td class="td-border-bottom"></td>
        <td
          class="td-border-bottom"
          v-for="day in loadData.days" :key="`footer-day-weight-${day.day}`">
          {{ day.totalWeight }}
        </td>
      </tr>
    </tbody>
  </v-table>
</template>

<script>
/* Requests */
import { getHeatMapDetailAPI } from '@/requests/heatMap.js';
import { getHeadersDays } from '@/utils/heatMap.js';
import { checkPermissionAPI } from '@/requests/security.js';
/* Utils */
import { getMonthFromString, formatNumber } from '@/utils/general';
/* Components */
import TooltipHeatMapDay from '@/components/tooltips/TooltipHeatMapDay.vue';
import TooltipHeatMapCeil from '@/components/tooltips/TooltipHeatMapCeil.vue';
import NoDataMessage from '@/components/utils/NoDataMessage.vue'

/* This component creates the table heat map with its functionality
 *
 */
export default {
  data() {
    return {
      /* Flag, true if the tooltip ceil must show the link*/
      showLinkCeil: false,
      /* Flag, true if the tooltip day must show the link*/
      showLinkDay: false,
      /* Method used to format any number*/
      formatNumber
    };
  },
  props: {
    bu: { type: String, default: '' },
    /* Data get from the request to get data for heat map*/
    data: { type: Object, default: () => ({}) },
    /* Input filters */
    filters: { type: Array, default: () => ([]) }
  },
  beforeMount() {
    const graphPath = '/service-levels/cfs-cbp-operative/detail/impact';
    const adjustmentPath = '/impact-adjustments/add-adjustment';

    Promise.all([
      checkPermissionAPI(graphPath),
      checkPermissionAPI(adjustmentPath)
    ]).then( (responses) => {
       this.showLinkDay = responses[0].data.success;
       this.showLinkCeil = responses[1].data.success;
    }).catch( (error) => {
      this.access = false;
      this.modal.open = true;

      this.validating = false;
    });

  },
  components: {
    NoDataMessage,
    TooltipHeatMapDay,
    TooltipHeatMapCeil
  },
  computed: {
    /* Get the name of the month from the filter date
     * @return String
     */
    month() {
      const months = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto',
        'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
      ];
      const date = this.filters.find( (item) => item.name === 'date' ).value
      const monthIndex = getMonthFromString(date);
      return months[monthIndex - 1];
    },
    /*
     * Get data to show into the table heat map
     * @return Object
     */
    loadData() {
      return {
        hours: this.data.hours || [],
        days: this.data.days || [],
        cfs: this.data.cfs || '',
        cbp: this.data.cbp || '',
        operative: this.data.operative || '',
        totals: {
          executions: this.data.totalExecutions,
          errors: this.data.totalErrors,
          weight: this.data.totalWeight,
        }
      }
    },
  }
}
</script>

<style>
.ceil {
  min-width: 56px;
}
.heat-map-table {
  text-align: center;
  th {
    --v-table-header-height: 32px !important;
  }
  td, .ceil {
    height: 40px !important;
  }
}
.totals {
  background-color: #043263;
}
.td-border-bottom {
  border-bottom: 1px #d9d9d9;
}
</style>
