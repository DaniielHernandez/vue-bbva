<template>
  <div class="custom-font-graph d-flex flex-row flex-wrap ga-8 mb-8 align-end">
    <template v-for="(day, index) in days" :key="day.day">
      <div class="d-flex flex-column ga-2">
        <div v-if="index === 0" class="fs-15 font-weight-light">Día de impacto</div>
        <div v-else-if="index === 1" class="fs-15 font-weight-light">Días comparados</div>
        <div
          :style="{
            backgroundColor: day.backgroundColor ? day.backgroundColor : '',
            border: '1px solid ' + day.color,
            color: day.backgroundColor ? 'white' : 'black',
            opacity: day.visivible ? 1 : 0.5
          }"
          class="d-flex flex-column ga-4 pa-4"
        >
          <div class="d-flex justify-space-between ga-4">
            <h4 class="fs-14 font-weight-bold">{{ translateDate(day.day) }}</h4>
            <!-- actions -->
            <div class="d-flex align-center ga-2">
              <bbva-core-icon
                v-if="!day.backgroundColor"
                :icon="day.visivible ? 'bbva:show' : 'bbva:hide'"
                @click="updateLegendItem(day, index)"
                size="s"
                style="color: #1464a5; cursor: pointer"
              ></bbva-core-icon>
              <bbva-core-icon
                v-if="!day.backgroundColor"
                @click="day.visivible && openDialog(index)"
                icon="bbva:calendar"
                size="s"
                style="color: #1464a5; cursor: pointer"
              >
              </bbva-core-icon>
            </div>
          </div>
          <div class="d-flex align-center ga-4">
            <div class="d-flex align-center ga-2">
              <span class="color-rectangle" :style="{ backgroundColor: day.color }"></span>
              <p class="fs-12 font-weight-light">Actividad</p>
            </div>
            <div class="d-flex align-center ga-2">
              <hr class="dash" :style="{ borderBottom: '4px dashed' + day.color }" />
              <p class="fs-12 font-weight-light">Errores</p>
            </div>
          </div>
        </div>
      </div>
    </template>
    <!-- dialog -->
    <v-dialog v-model="dialog" width="608px" height="auto">
      <v-card title="Cambiar día comparado" class="pa-4 impact-card">
        <form
          @submit.prevent="updateDay(selectedDayIndex)"
          class="d-flex flex-column w-100"
          id="form-impact-graph"
        >
          <v-card-text>
            <date-picker
              :required="true"
              :value="days[selectedDayIndex].day"
              @value-change="(ev) => changeDay(ev.target.value)"
              label="Día"
            />
          </v-card-text>
          <v-card-actions class="d-flex ga-4">
            <bbva-button-default text="Continuar" type="submit"> </bbva-button-default>
            <bbva-button-default text="Cancelar" @click="dialog = false" variant="secondary">
            </bbva-button-default>
          </v-card-actions>
        </form>
      </v-card>
    </v-dialog>
  </div>
  <div class="custom-font-graph w-100 h-auto bg-white">
    <h3 class="mb-6">Representación gráfica de impacto</h3>

    <canvas id="impactGraph"> </canvas>
  </div>
</template>

<script>
// Componentes
import DatePicker from '@/components/forms/DatePicker.vue'

// Libs
import { Chart } from 'chart.js/auto'

// Constants
import { COLORS } from '@/constants/availability'

// Utils
import { formatDateWhitSlash } from '@/utils/general'

let impactGraphChart = null

export default {
  name: 'ImpactGraph',
  components: {
    DatePicker
  },
  data() {
    return {
      days: [
        {
          day: null,
          color: COLORS.RED,
          activity: [],
          errors: [],
          datasetsIndex: {
            activity: 0,
            errors: 1
          },
          backgroundColor: COLORS.BBVA,
          visivible: true
        },
        {
          day: null,
          color: COLORS.YELLOW,
          activity: [],
          errors: [],
          datasetsIndex: {
            activity: 2,
            errors: 3
          },
          backgroundColor: null,
          visivible: true
        },
        {
          day: null,
          color: COLORS.BLUE_LIGHT,
          activity: [],
          errors: [],
          datasetsIndex: {
            activity: 4,
            errors: 5
          },
          backgroundColor: null,
          visivible: true
        },
        {
          day: null,
          color: COLORS.AQUA,
          activity: [],
          errors: [],
          datasetsIndex: {
            activity: 6,
            errors: 7
          },
          backgroundColor: null,
          visivible: true
        }
      ],
      labels: [],
      elements: 'All',
      dialog: false,
      selectedDayIndex: null,
      datePatternWithDash: /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/
    }
  },
  props: {
    data: {
      type: Object,
      default: () => {}
    }
  },
  methods: {
    /**
     * Translate a date if it matches a specific pattern.
     *
     * @param {String} date - the date to be translated
     * @return {String} the translated date if it matches the pattern, otherwise the original date
     */
    translateDate(date) {
      if (!this.datePatternWithDash.test(date)) return date
      return formatDateWhitSlash(date)
    },
    /**
     * Generate the chart based on the data provided, including labels, activities, and errors.
     *
     */
    generateChart() {
      if (this.data && this.data.days) {
        this.data.days.forEach((row, index) => {
          // set labels on first iteration
          if (index === 0) {
            this.labels = row.values.map((item) => item.time)
          }
          this.days[index].day = row.day
          this.days[index].activity = row.values.map((item) => item.activity)
          this.days[index].errors = row.values.map((item) => item.errors)
        })
      }

      const datasets = []
      this.days.forEach((row) => {
        datasets.push({
          label: `Actividades`,
          data: row.activity,
          backgroundColor: row.color,
          borderColor: row.color,
          pointStyle: true,
          pointHoverRadius: 8,
          yAxisID: 'y',
          datasetIndex: row.datasetsIndex.activity
        })
        datasets.push({
          label: `Errores`,
          data: row.errors,
          backgroundColor: row.color,
          borderColor: row.color,
          pointStyle: true,
          pointHoverRadius: 8,
          borderDash: [10, 10],
          yAxisID: 'y1',
          datasetIndex: row.datasetsIndex.errors
        })
      })

      const chartData = {
        labels: this.labels,
        datasets: datasets
      }

      const config = {
        type: 'line',
        data: chartData,
        responsive: true,
        options: {
          interaction: {
            intersect: true,
            mode: 'point',
          },
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              enabled: true,
              callbacks: {
                title: (ctx) => {
                  return `Minutos: ${ctx[0].label}`
                }
              }
            }
          },
          scales: {
            x: {
              grid: {
                lineWidth: 0
              },
              title: {
                text: 'Minutos',
                display: true
              },
              padding: {
                top: 20
              }
            },
            y: {
              grid: {
                lineWidth: 0
              },
              ticks: {
                callback: (value) => {
                  const text = value.toLocaleString()
                  return `${text}`
                }
              },
              title: {
                text: `Actividad`,
                display: true
              },
              padding: {
                top: 20
              },
              position: 'left',
              beginAtZero: true
            },
            y1: {
              grid: {
                lineWidth: 0
              },
              ticks: {
                callback: (value) => {
                  const text = value.toLocaleString()
                  return `${text}`
                }
              },
              title: {
                text: `Errores`,
                display: true
              },
              padding: {
                top: 20
              },
              position: 'right',
              beginAtZero: true
            }
          }
        }
      }

      const ctx = document.getElementById('impactGraph')
      impactGraphChart = new Chart(ctx, config)
    },
    /**
     * Update the legend item for the given day and index.
     * If there are less than two datasets visible, the legend item will be hidden.
     *
     * @param {Object} day - the day object to update
     * @param {Number} index - the index of the day to update
     * @return {void}
     */
    updateLegendItem(day, index) {
      if (this.days[index].visivible && this.days.filter((d) => d.visivible).length <= 2) return
      const visible = day.visivible

      if (this.elements === 'Activity') {
        impactGraphChart.data.datasets[day.datasetsIndex.activity].hidden = visible
        impactGraphChart.data.datasets[day.datasetsIndex.errors].hidden = true
      } else if (this.elements === 'Errors') {
        impactGraphChart.data.datasets[day.datasetsIndex.activity].hidden = true
        impactGraphChart.data.datasets[day.datasetsIndex.errors].hidden = visible
      } else {
        impactGraphChart.data.datasets[day.datasetsIndex.activity].hidden = visible
        impactGraphChart.data.datasets[day.datasetsIndex.errors].hidden = visible
      }

      this.days[index].visivible = !this.days[index].visivible
      this.$emit('updateVisibility', { index, visible: this.days[index].visivible })
      impactGraphChart.update()
    },
    /**
     * Update the chart with new data and apply filters.
     *
     * @param {Object} newData - the new data to update the chart with
     * @param {Object} filters - the filters to apply to the chart
     */
    updateChart(newData, filters) {
      if (!newData) return
      if (newData && newData.days) {
        newData.days.forEach((row, index) => {
          // set labels on first iteration
          if (index === 0) {
            this.labels = row.values.map((item) => item.time)
          }
          this.days[index].day = row.day
          this.days[index].activity = row.values.map((item) => item.activity)
          this.days[index].errors = row.values.map((item) => item.errors)
        })
      }

      impactGraphChart.data.labels = this.labels
      impactGraphChart.data.datasets[0].data = this.days[0].activity
      impactGraphChart.data.datasets[1].data = this.days[0].errors
      impactGraphChart.data.datasets[2].data = this.days[1].activity
      impactGraphChart.data.datasets[3].data = this.days[1].errors
      impactGraphChart.data.datasets[4].data = this.days[2].activity
      impactGraphChart.data.datasets[5].data = this.days[2].errors
      impactGraphChart.data.datasets[6].data = this.days[3].activity
      impactGraphChart.data.datasets[7].data = this.days[3].errors
      // Show data depends on filters.elements if 'all' show activity and errors
      // If 'Activity' hide errors
      // If 'Errors' hide activity
      this.elements = filters.elements

      // update visibility
      impactGraphChart.data.datasets[0].hidden = !this.days[0].visivible
      impactGraphChart.data.datasets[1].hidden = !this.days[0].visivible
      impactGraphChart.data.datasets[2].hidden = !this.days[1].visivible
      impactGraphChart.data.datasets[3].hidden = !this.days[1].visivible
      impactGraphChart.data.datasets[4].hidden = !this.days[2].visivible
      impactGraphChart.data.datasets[5].hidden = !this.days[2].visivible
      impactGraphChart.data.datasets[6].hidden = !this.days[3].visivible
      impactGraphChart.data.datasets[7].hidden = !this.days[3].visivible
      if (this.elements === 'Activity') {
        impactGraphChart.data.datasets[1].hidden = true
        impactGraphChart.data.datasets[3].hidden = true
        impactGraphChart.data.datasets[5].hidden = true
        impactGraphChart.data.datasets[7].hidden = true
      } else if (this.elements === 'Errors') {
        impactGraphChart.data.datasets[0].hidden = true
        impactGraphChart.data.datasets[2].hidden = true
        impactGraphChart.data.datasets[4].hidden = true
        impactGraphChart.data.datasets[6].hidden = true
      }

      // set fill area only for dataset[0]
      impactGraphChart.data.datasets[0].backgroundColor = COLORS.RED_AREA
      impactGraphChart.data.datasets[0].fill = true
      impactGraphChart.options.scales.y.ticks.callback = (value) => {
        const text = value.toLocaleString()
        return `${text}`
      }
      impactGraphChart.options.scales.y1.ticks.callback = (value) => {
        const text = value.toLocaleString()
        return `${text}`
      }
      impactGraphChart.update()
    },
    /**
     * Open a dialog with the specified index.
     *
     * @param {number} index - The index of the dialog to open.
     * @return {void}
     */
    openDialog(index) {
      this.selectedDayIndex = index
      this.dialog = true
    },
    /**
     * Change the day to the specified day.
     *
     * @param {string} day - the new day to be set
     * @return {void}
     */
    changeDay(day) {
      this.days[this.selectedDayIndex].change = day
    },
    /**
     * Updates the day at the specified index if it has been changed.
     *
     * @param {number} index - The index of the day to update
     * @return {void}
     */
    updateDay(index) {
      if (!this.days[index].change) return
      this.days[index].day = this.days[index].change
      this.days[index].change = null
      this.dialog = false
      this.$emit('update-day', { index, day: this.days[index].day })
    }
  },
  /**
   * Lifecycle hook that is called after the component has been mounted.
   *
   * @return {void}
   */
  mounted() {
    this.generateChart()
  }
}
</script>

<style lang="scss" scoped>
.custom-font-graph {
  font-family: --font-family-benton-sans, sans-serif;
}
.color-rectangle {
  width: 16px;
  height: 4px;
}
.dash {
  border: none;
  width: 18px;
  height: 4px;
}
#impactGraph {
  width: 100%;
  height: auto;
  max-height: 520px;
}
.datepicker {
  position: fixed !important;
  top: 50% !important;
}
.impact-card {
  height: auto !important;
  overflow: visible !important;
}
</style>

<style>
.date-input input {
  top: unset !important;
  left: unset !important;
  padding-left: 1rem !important;
  padding-top: 1rem !important;
}
</style>