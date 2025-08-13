<script>
import { Chart } from 'chart.js/auto'
import { COLORS } from '@/constants/availability'

let dailyCumulativeAvailabilityChart = null

export default {
  name: 'DailyCumulativeAvailability',
  data() {
    return {
      colorLine: COLORS.YELLOW,
      colorBar: COLORS.BLUE,
      legendItems: [],
      availabilityComponent: true,
      labels: [],
      contributions: [],
      accumulated: [],
      exceedsTheGoal: true,
      summation: 0,
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
      this.exceedsTheGoal = this.data.exceedsTheGoal || false
      this.summation = this.data.summation.toLocaleString(this.localeOptions) || 0
      if (this.data && this.data.days) {
        this.data.days.forEach((row) => {
          this.labels.push(row.dayNumber)
          this.contributions.push(row.contribution)
          this.accumulated.push(row.accumulated)
        })
      }

      const chartData = {
        labels: this.labels,
        datasets: [
          {
            label: `${this.availabilityTypeComponent} acumulada`,
            data: this.accumulated,
            backgroundColor: this.colorLine,
            borderColor: this.colorLine,
            pointStyle: true,
            pointHoverRadius: 8,
            type: 'line'
          },
          {
            label: `Contribución del día en el mes`,
            data: this.contributions,
            backgroundColor: this.colorBar,
            borderColor: this.colorBar,
            pointStyle: true,
          },
        ]
      }
      const config = {
        type: 'bar',
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

      const ctx = document.getElementById('dailyCumulativeAvailability')
      dailyCumulativeAvailabilityChart = new Chart(ctx, config)
    },
    /**
     * Update the legend items based on the options and chart data.
     *
     * @return {void}
     */
    updateLegendItems() {
      this.legendItems = dailyCumulativeAvailabilityChart.options.plugins.legend.labels.generateLabels(dailyCumulativeAvailabilityChart)
    },
     /**
     * Updates the legend item.
     *
     * @param {type} item - description of parameter
     * @return {type} description of return value
     */
    updateLegendItem(item) {
      dailyCumulativeAvailabilityChart.setDatasetVisibility(item.datasetIndex, !dailyCumulativeAvailabilityChart.isDatasetVisible(item.datasetIndex))
      dailyCumulativeAvailabilityChart.update()
      this.updateLegendItems()
    },
        /**
     * Updates the chart with new data and options.
     *
     * @param {Object} newData - the new data for the chart
     * @param {Object} newData.days - the new data for the chart
     * @param {Object} newData.days.dayNumber - the new data for the chart
     * @param {Object} newData.days.accumulated - the new data for the chart
     * @param {Object} newData.days.contribution - the new data for the chart
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

      this.exceedsTheGoal = newData.exceedsTheGoal || false
      this.summation = newData.summation.toLocaleString(this.localeOptions) || 0

      const labels = []
      const contributions = []
      const accumulated = []

      const preLabels = this.labels
      const preContributions = this.contributions
      const preAccumulated = this.accumulated

      newData.days.forEach((row) => {
        labels.push(row.dayNumber)
        contributions.push(row.contribution)
        accumulated.push(row.accumulated)
      })

      if (
        preLabels !== labels ||
        preContributions !== contributions ||
        preAccumulated !== accumulated
      ) {
        dailyCumulativeAvailabilityChart.data.labels = labels
        dailyCumulativeAvailabilityChart.data.datasets[0].data = accumulated
        dailyCumulativeAvailabilityChart.data.datasets[0].label = `${this.availabilityTypeComponent} acumulada`
        dailyCumulativeAvailabilityChart.data.datasets[1].data = contributions
        dailyCumulativeAvailabilityChart.data.datasets[1].label = `Contribución del día en el mes`
        dailyCumulativeAvailabilityChart.options.scales.y.ticks.callback = (value) => {
          const text = value.toLocaleString(this.localeOptions)
          return `${text} %`
        }
        dailyCumulativeAvailabilityChart.options.scales.y.title.text = `% ${this.availabilityTypeComponent}.`
        dailyCumulativeAvailabilityChart.update()
        this.updateLegendItems()
      }
    }
  },
  mounted() {
    this.availabilityComponent = this.availability
    this.generateChart()
    this.updateLegendItems()
  }
}
</script>

<template>
  <div class="pa-6 w-100 h-auto bg-white">
    <h3 class="mb-6">{{ availabilityTypeComponent }} mensual</h3>
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
      <div class="d-flex ga-4">
        <div class="d-flex align-center ga-2">
          <span>{{ availabilityTypeComponent }} acumulada mensual (Σ): </span>
          <span class="font-weight-bold">{{ summation }} %</span>
          <img v-if="exceedsTheGoal" src="/icons/Checked.svg" alt="checked" />
          <img v-else src="/icons/Warning.svg" alt="warning" />
        </div>
      </div>
    </div>

    <canvas id="dailyCumulativeAvailability"> </canvas>
  </div>
</template>

<style lang="scss" scoped>
.color-square {
  width: 16px;
  height: 16px;
}
#dailyCumulativeAvailability {
  width: 100%;
  height: auto;
  max-height: 520px;
}
</style>
