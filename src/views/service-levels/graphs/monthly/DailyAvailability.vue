<script>
import { Chart } from 'chart.js/auto'
import { COLORS } from '@/constants/availability'

let dailyAvailabilityChart = null

export default {
  name: 'DailyAvailability',
  data() {
    return {
      colorLine: COLORS.YELLOW,
      legendItems: [],
      availabilityComponent: true,
      labels: [],
      values: [],
      localeOptions: {
        minimumFractionDigits: 2,
        maximumFractionDigits: 3
      }
    }
  },
  props: {
    data: {
      type: Object,
      default: () => {}
    },
    availability: {
      type: Boolean,
      default: true
    },
    decimals: {
      type: Number,
      default: 2
    }
  },
  computed: {
    /**
     * availabilityTypeComponent - A description of the entire function.
     *
     * @return {string} 'Disponibilidad' if this.availabilityComponent is truthy, 'Indisponibilidad' otherwise
     */
    availabilityTypeComponent() {
      return this.availabilityComponent ? 'Disponibilidad' : 'Indisponibilidad'
    }
  },
  methods: {
    /**
     * Generates a chart based on the data retrieved. 
     */
    generateChart() {
      this.localeOptions.minimumFractionDigits = this.decimals
      this.localeOptions.maximumFractionDigits = this.decimals
      if (this.data && this.data.days) {
        this.data.days.forEach((row) => {
          this.labels.push(row.dayNumber)
          this.values.push(row.value)
        })
      }

      const chartData = {
        labels: this.labels,
        datasets: [
          {
            label: `${this.availabilityTypeComponent} desponderada del día`,
            data: this.values,
            backgroundColor: this.colorLine,
            borderColor: this.colorLine,
            pointStyle: true,
            pointHoverRadius: 8
          }
        ]
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
                  return `Día: ${ctx[0].label}`
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
                text: 'N° día del mes',
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
                  const text = value.toLocaleString(this.localeOptions)
                  return `${text} %`
                }
              },
              title: {
                text: `% ${this.availabilityTypeComponent}.`,
                display: true
              },
              padding: {
                top: 20
              },
              min: 0,
              suggestedMax: 100
            }
          }
        }
      }

      const ctx = document.getElementById('dailyAvailability')
      dailyAvailabilityChart = new Chart(ctx, config)
    },
    /**
     * Update the legend items based on the options and chart data.
     *
     * @return {void}
     */
    updateLegendItems() {
      this.legendItems = dailyAvailabilityChart.options.plugins.legend.labels.generateLabels(dailyAvailabilityChart)
    },
    /**
     * Updates the legend item.
     *
     * @param {type} item - description of parameter
     * @return {type} description of return value
     */
    updateLegendItem(item) {
      dailyAvailabilityChart.setDatasetVisibility(item.datasetIndex, !dailyAvailabilityChart.isDatasetVisible(item.datasetIndex))
      dailyAvailabilityChart.update()
      this.updateLegendItems()
    },
    /**
     * Updates the chart with new data and options.
     *
     * @param {Object} newData - the new data for the chart
     * @param {Object} newData.days - the new data for the chart
     * @param {Object} newData.days.dayNumber - the new data for the chart
     * @param {Object} newData.days.value - the new data for the chart
     * @param {Object} options - the options for the chart
     * @param {boolean} options.availability - the options for the chart
     * @param {number} options.decimals - the options for the chart
     * @returns {void}
     */
    updateChart(newData, options) {
      if (!newData || !options) return
      this.localeOptions.minimumFractionDigits = options.decimals
      this.localeOptions.maximumFractionDigits = options.decimals
      this.availabilityComponent = options.availability
      const labels = []
      const values = []

      const preLabels = this.labels
      const prevValues = this.values

      newData.days.forEach((row) => {
        labels.push(row.dayNumber)
        values.push(row.value)
      })
      if (preLabels !== labels || prevValues !== values) {
        dailyAvailabilityChart.data.labels = labels
        dailyAvailabilityChart.data.datasets[0].data = values
        dailyAvailabilityChart.data.datasets[0].label = `${this.availabilityTypeComponent} desponderada del día`
        dailyAvailabilityChart.options.scales.y.ticks.callback = (value) => {
          const text = parseFloat(value.toString()).toLocaleString(this.localeOptions)
          return `${text} %`
        }
        dailyAvailabilityChart.options.scales.y.title.text = `% ${this.availabilityTypeComponent}.`
        this.updateLegendItems()
        dailyAvailabilityChart.update()
      }
    }
  },
  /**
   * The mounted hook is called after the instance has been mounted,
   * where the availabilityComponent is set to the availability property,
   * the chart is generated, and the legend items are updated.
   *
   * @return {void} 
   */
  mounted() {
    this.availabilityComponent = this.availability
    this.generateChart()
    this.updateLegendItems()
  }
}
</script>

<template>
  <div class="pa-6 w-100 h-auto bg-white">
    <h3 class="mb-6">{{ availabilityTypeComponent }} del día desponderado</h3>
    <div class="d-flex justify-space-between mb-6 text-body-2">
      <div class="d-flex ga-4">
        <div
          class="d-flex align-center ga-2"
          style="cursor: pointer"
          v-for="item in legendItems"
          :key="item.text"
          @click="updateLegendItem(item)"
        >
          <span class="color-square" :style="{ backgroundColor: item.fillStyle }"></span>
          <p :class="{ 'text-disabled': item.hidden }">
            {{ item.text }}
          </p>
        </div>
      </div>
    </div>

    <canvas id="dailyAvailability"> </canvas>
  </div>
</template>

<style lang="scss" scoped>
.color-square {
  width: 16px;
  height: 16px;
}
#dailyAvailability {
  width: 100%;
  height: auto;
  max-height: 520px;
}
</style>
