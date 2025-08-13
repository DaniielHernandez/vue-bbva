<script>
import { Chart } from 'chart.js/auto'
import { COLORS } from '@/constants/availability'

let monthlyCumulativeAvailabilityChart = null

export default {
  name: 'MonthlyCumulativeAvailability',
  data() {
    return {
      colorLine: COLORS.YELLOW,
      colorBar: COLORS.BLUE,
      legendItems: [],
      availabilityComponent: true,
      labels: [],
      monthly: [],
      accumulated: [],
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
    availabilityTypeComponent() {
      return this.availabilityComponent ? 'Disponibilidad' : 'Indisponibilidad'
    }
  },
  methods: {
    /**
     * Generates a chart based on the provided data values.
     * It populates the labels, activities, and errors arrays from the data values, then creates a chartData object with labels and datasets.
     * Finally, it configures the chart and creates it in the specified canvas element.
     */
    generateChart() {
      this.localeOptions.minimumFractionDigits = this.decimals
      this.localeOptions.maximumFractionDigits = this.decimals
      if (this.data && this.data.months){
        this.data.months.forEach((row) => {
          this.labels.push(row.month)
          this.monthly.push(row.monthly)
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
            label: `${this.availabilityTypeComponent} mensual`,
            data: this.monthly,
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
                  return `Mes: ${ctx[0].label}`
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
                text: 'Mes del año',
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

      const ctx = document.getElementById('monthlyCumulativeAvailability')
      monthlyCumulativeAvailabilityChart = new Chart(ctx, config)
    },
    /**
     * Update the legend items based on the options of the chart.
     *
     * @return {void}
     */
    updateLegendItems() {
      this.legendItems = monthlyCumulativeAvailabilityChart.options.plugins.legend.labels.generateLabels(monthlyCumulativeAvailabilityChart)
    },
    /**
     * Update a legend item to be visible or not.
     *
     * @param {type} item - the legend item
     * @return {void}
     */
    updateLegendItem(item) {
      monthlyCumulativeAvailabilityChart.setDatasetVisibility(item.datasetIndex, !monthlyCumulativeAvailabilityChart.isDatasetVisible(item.datasetIndex))
      monthlyCumulativeAvailabilityChart.update()
      this.updateLegendItems()
    },
    /**
     * Update the chart with new data.
     *
     * @param {Object} newData - The new data to update the chart with
     * @param {Object[]} newData.months - Array of individual data objects
     * @param {String} newData.months[].month - The month
     * @param {Number} newData.months[].monthly - The monthly
     * @param {Number} newData.months[].accumulated - The errors
     * @return {void}
     */
    updateChart(newData, options) {
      if (!newData || !options) return
      this.localeOptions.minimumFractionDigits = options.decimals
      this.localeOptions.maximumFractionDigits = options.decimals
      this.availabilityComponent = options.availability

      const labels = []
      const monthly = []
      const accumulated = []

      const preLabels = this.labels
      const preMonthly = this.monthly
      const preAccumulated = this.accumulated

      newData.months.forEach((row) => {
        labels.push(row.month)
        monthly.push(row.monthly)
        accumulated.push(row.accumulated)
      })

      if (preLabels !== labels || preMonthly !== monthly || preAccumulated !== accumulated) {
        monthlyCumulativeAvailabilityChart.data.labels = labels
        monthlyCumulativeAvailabilityChart.data.datasets[0].data = accumulated
        monthlyCumulativeAvailabilityChart.data.datasets[0].label = `${this.availabilityTypeComponent} acumulada`
        monthlyCumulativeAvailabilityChart.data.datasets[1].data = monthly
        monthlyCumulativeAvailabilityChart.data.datasets[1].label = `${this.availabilityTypeComponent} mensual`
        monthlyCumulativeAvailabilityChart.options.scales.y.ticks.callback = (value) => {
          const text = parseFloat(value.toString()).toLocaleString(this.localeOptions)
          return `${text} %`
        }
        monthlyCumulativeAvailabilityChart.options.scales.y.title.text = `% ${this.availabilityTypeComponent}.`
        monthlyCumulativeAvailabilityChart.update()
        this.updateLegendItems()
      }
    }
  },
  /**
   * Lifecycle hook that is called after the component has been mounted.
   * Calls the generateChart method and the updateLegendItems method.
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
    <h3 class="mb-6">{{ availabilityTypeComponent }} ponderada por mes</h3>
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
    <canvas id="monthlyCumulativeAvailability"> </canvas>
  </div>
</template>

<style lang="scss" scoped>
.color-square {
  width: 16px;
  height: 16px;
  max-height: 520px;
}
</style>
