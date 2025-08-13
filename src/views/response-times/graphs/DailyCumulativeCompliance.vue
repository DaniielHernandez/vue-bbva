<script>
import { Chart } from 'chart.js/auto'
import { COLORS } from '@/constants/colors'

let dailyCumulativeComplianceChart = null

export default {
  name: 'DailyCumulativeCompliance',
  data() {
    return {
      colorLine: COLORS.YELLOW,
      colorBar: COLORS.BLUE,
      legendItems: [],
      complianceComponent: true,
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
            label: `Tiempos de respuesta acumulada`,
            data: this.accumulated,
            backgroundColor: this.colorLine,
            borderColor: this.colorLine,
            pointStyle: true,
            pointHoverRadius: 8
          },
          {
            label: `Contribución del día`,
            data: this.contributions,
            backgroundColor: this.colorBar,
            borderColor: this.colorBar,
            pointStyle: true,
            type: 'bar'
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
              title: {
                text: 'N° día del mes',
                display: true
              },
              grid: {
                lineWidth: 0
              },
              padding: {
                top: 20
              }
            },
            y: {
              title: {
                text: `% ${this.complianceTypeComponent}.`,
                display: true
              },
              // if datasets type includes 'bar', use beginAtZero to false for dynamic ticks
              beginAtZero: false,
              // If need to show from 0 when are bar datasets
              suggestedMin: 0,
              ticks: {
                callback: (value) => {
                  const text = value.toLocaleString(this.localeOptions)
                  return `${text} %`
                }
              },
              grid: {
                lineWidth: 0
              },
              padding: {
                top: 20
              }
            }
          }
        }
      }

      const ctx = document.getElementById('dailyCumulativeCompliance')
      dailyCumulativeComplianceChart = new Chart(ctx, config)

      this.updateLegendItems()
    },
    /**
     * Update the legend items based on the options and chart data.
     *
     * @return {void}
     */
    updateLegendItems() {
      this.legendItems =
        dailyCumulativeComplianceChart.options.plugins.legend.labels.generateLabels(
          dailyCumulativeComplianceChart
        )
    },
    /**
     * Updates the legend item.
     *
     * @param {Object} item - description of parameter
     * @param {number} item.datasetIndex - description of parameter
     * @return {void}
     */
    updateLegendItem(item) {
      dailyCumulativeComplianceChart.setDatasetVisibility(
        item.datasetIndex,
        !dailyCumulativeComplianceChart.isDatasetVisible(item.datasetIndex)
      )
      dailyCumulativeComplianceChart.update()
      this.updateLegendItems()
      // Only for dynamic bar charts
      this.updateSuggestedMin()
    },
    /**
     * Update the suggested minimum value for the y-axis.
     *
     * @return {void}
     */
    updateSuggestedMin() {
      dailyCumulativeComplianceChart.options.scales.y.suggestedMin = this.legendItems[1].hidden
        ? null
        : 0
      dailyCumulativeComplianceChart.update()
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
     * @param {boolean} options.compliance - the options for the chart
     * @param {number} options.decimals - the options for the chart
     * @returns {void}
     */
    updateChart(newData, options) {
      if (!newData || !options) return
      this.localeOptions.minimumFractionDigits = options.decimals
      this.localeOptions.maximumFractionDigits = options.decimals
      this.complianceComponent = options.compliance

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
        dailyCumulativeComplianceChart.data.labels = labels
        dailyCumulativeComplianceChart.data.datasets[0].data = accumulated
        dailyCumulativeComplianceChart.data.datasets[1].data = contributions
        dailyCumulativeComplianceChart.options.scales.y.title.text = `% ${this.complianceTypeComponent}.`
        dailyCumulativeComplianceChart.update()
        this.updateLegendItems()
      }
    }
  },
  /**
   * Mounts the component and initializes the compliance component.
   *
   * @return {void} 
   */
  mounted() {
    this.complianceComponent = this.compliance
    this.generateChart()
  }
}
</script>

<template>
  <div class="pa-6 w-100 h-auto bg-white">
    <h3 class="mb-6">Tiempos de respuesta mensual</h3>
    <div class="d-flex flex-wrap justify-space-between mb-6 text-body-2">
      <div class="d-flex flex-wrap ga-4">
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
      <div class="d-flex flex-wrap align-center ga-2">
        <span>Tiempos de respuesta acumulado mensual (Σ): </span>
        <span class="font-weight-bold">{{ summation }} %</span>
        <img v-if="exceedsTheGoal" src="/icons/Checked.svg" alt="checked" />
        <img v-else src="/icons/Warning.svg" alt="warning" />
      </div>
    </div>

    <canvas id="dailyCumulativeCompliance"> </canvas>
  </div>
</template>

<style lang="scss" scoped>
.color-square {
  width: 16px;
  height: 16px;
}
#dailyCumulativeCompliance {
  width: 100%;
  height: auto;
  max-height: 520px;
}
</style>
