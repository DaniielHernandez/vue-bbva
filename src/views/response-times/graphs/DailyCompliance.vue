<template>
  <div class="pa-6 w-100 h-auto bg-white">
    <h3 class="mb-6">Tiempo de respuesta desponderada</h3>
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

    <canvas id="dailyCompliance"> </canvas>
  </div>
</template>

<script>
import { Chart } from 'chart.js/auto'
import { COLORS } from '@/constants/colors'

let dailyComplianceChart = null

export default {
  name: 'DailyCompliance',
  data() {
    return {
      colorLine: COLORS.YELLOW,
      legendItems: [],
      complianceComponent: true,
      labels: [],
      values: [],
      localeOptions: {
        minimumFractionDigits: 2,
        maximumFractionDigits: 3
      }
    }
  },
  props: {
    /**
     * The data to be used in the chart.
     * @type {Object}
     */
    data: {
      type: Object,
      default: () => {}
    },
    /**
     * Compliance type
     * @type {Boolean}
     */
    compliance: {
      type: Boolean,
      default: true
    },
    /**
     * Decimals
     * @type {Number}
     * @default 2
     */
    decimals: {
      type: Number,
      default: 2
    }
  },
  computed: {
    /**
     * complianceTypeComponent - A description of the entire function.
     *
     * @return {string} 'Cumplimiento' if this.complianceComponent is truthy, 'Incumplimiento' otherwise
     */
    complianceTypeComponent() {
      return this.complianceComponent ? 'Cumplimiento' : 'Incumplimiento'
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
            label: `Tiempo de respuesta del día`,
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
            mode: 'point'
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
                text: `% ${this.complianceTypeComponent}.`,
                display: true
              },
              padding: {
                top: 20
              }
            }
          }
        }
      }

      const ctx = document.getElementById('dailyCompliance')
      dailyComplianceChart = new Chart(ctx, config)

      this.updateLegendItems()
    },
    /**
     * Update the legend items based on the options and chart data.
     *
     * @return {void}
     */
    updateLegendItems() {
      this.legendItems =
        dailyComplianceChart.options.plugins.legend.labels.generateLabels(dailyComplianceChart)
    },
    /**
     * Updates the legend item.
     *
     * @param {Object} item - item
     * @param {number} item.datasetIndex - item
     * @return {void}
     */
    updateLegendItem(item) {
      dailyComplianceChart.setDatasetVisibility(
        item.datasetIndex,
        !dailyComplianceChart.isDatasetVisible(item.datasetIndex)
      )
      dailyComplianceChart.update()
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
     * @param {boolean} options.compliance - the options for the chart
     * @param {number} options.decimals - the options for the chart
     * @returns {void}
     */
    updateChart(newData, options) {
      if (!newData || !options) return
      this.localeOptions.minimumFractionDigits = options.decimals
      this.localeOptions.maximumFractionDigits = options.decimals
      this.complianceComponent = options.compliance
      const labels = []
      const values = []

      const preLabels = this.labels
      const prevValues = this.values

      newData.days.forEach((row) => {
        labels.push(row.dayNumber)
        values.push(row.value)
      })
      if (preLabels !== labels || prevValues !== values) {
        dailyComplianceChart.data.labels = labels
        dailyComplianceChart.data.datasets[0].data = values
        dailyComplianceChart.options.scales.y.title.text = `% ${this.complianceTypeComponent}.`
        dailyComplianceChart.update()
        this.updateLegendItems()
      }
    }
  },
  /**
   * The mounted hook is called after the instance has been mounted,
   * where the complianceComponent is set to the compliance property,
   * the chart is generated, and the legend items are updated.
   *
   * @return {void}
   */
  mounted() {
    this.complianceComponent = this.compliance
    this.generateChart()
  }
}
</script>

<style lang="scss" scoped>
.color-square {
  width: 16px;
  height: 16px;
}
#dailyCompliance {
  width: 100%;
  height: auto;
  max-height: 520px;
}
</style>
