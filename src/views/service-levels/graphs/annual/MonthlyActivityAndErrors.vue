<script>
import { Chart } from 'chart.js/auto'
import { COLORS } from '@/constants/availability'

let monthlyActivityAndErrorsChart = null

export default {
  name: 'MonthlyActivityAndErrors',
  data() {
    return {
      colorActivities: COLORS.YELLOW,
      colorErrors: COLORS.BLUE,
      legendItems: [],
      labels: [],
      activities: [],
      errors: []
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
     * Generates a chart based on the provided data values.
     * It populates the labels, activities, and errors arrays from the data values, then creates a chartData object with labels and datasets.
     * Finally, it configures the chart and creates it in the specified canvas element.
     */
    generateChart() {
      if (this.data && this.data.values) {
        this.data.values.forEach((row) => {
          this.labels.push(row.month)
          this.activities.push(row.activities)
          this.errors.push(row.errors)
        })
      }

      const chartData = {
        labels: this.labels,
        datasets: [
          {
            label: `Actividad`,
            data: this.activities,
            backgroundColor: this.colorActivities,
            borderColor: this.colorActivities,
            pointStyle: true,
            pointHoverRadius: 8,
            yAxisID: 'y'
          },
          {
            label: `Errores`,
            data: this.errors,
            backgroundColor: this.colorErrors,
            borderColor: this.colorErrors,
            pointStyle: true,
            pointHoverRadius: 8,
            yAxisID: 'y1'
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
                  const text = value.toLocaleString()
                  return `${text} M`
                }
              },
              title: {
                text: `% Ejecuciones`,
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
                text: `N° Errores`,
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

      const ctx = document.getElementById('monthlyActivityAndErrors')
      monthlyActivityAndErrorsChart = new Chart(ctx, config)
    },
    /**
     * Update the legend items based on the options of the chart.
     *
     * @return {void}
     */
    updateLegendItems() {
      this.legendItems = monthlyActivityAndErrorsChart.options.plugins.legend.labels.generateLabels(monthlyActivityAndErrorsChart)
    },
    /**
     * Update a legend item to be visible or not.
     *
     * @param {type} item - the legend item
     * @return {void}
     */
    updateLegendItem(item) {
      monthlyActivityAndErrorsChart.setDatasetVisibility(item.datasetIndex, !monthlyActivityAndErrorsChart.isDatasetVisible(item.datasetIndex))
      monthlyActivityAndErrorsChart.update()
      this.updateLegendItems()
    },
    /**
     * Update the chart with new data.
     *
     * @param {Object} newData - The new data to update the chart with
     * @param {Object[]} newData.values - Array of individual data objects
     * @param {String} newData.values[].month - The month
     * @param {Number} newData.values[].activities - The activities
     * @param {Number} newData.values[].errors - The errors
     * @return {void}
     */
    updateChart(newData) {
      if (!newData) return

      const labels = []
      const activities = []
      const errors = []

      const preLabels = this.labels
      const preActivities = this.activities
      const preErrors = this.errors

      newData.values.forEach((row) => {
        labels.push(row.month)
        activities.push(row.activities)
        errors.push(row.errors)
      })

      if (preLabels !== labels || preActivities !== activities || preErrors !== errors) {
        monthlyActivityAndErrorsChart.data.labels = labels
        monthlyActivityAndErrorsChart.data.datasets[0].data = activities
        monthlyActivityAndErrorsChart.data.datasets[0].label = `Actividad`
        monthlyActivityAndErrorsChart.data.datasets[1].data = errors
        monthlyActivityAndErrorsChart.data.datasets[1].label = `Errores`
        monthlyActivityAndErrorsChart.options.scales.y.ticks.callback = (value) => {
          const text = value.toLocaleString()
          return `${text} M`
        }
        monthlyActivityAndErrorsChart.options.scales.y1.ticks.callback = (value) => {
          const text = value.toLocaleString()
          return `${text}`
        }
        monthlyActivityAndErrorsChart.update()
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
    this.generateChart()
    this.updateLegendItems()
  }
}
</script>

<template>
  <div class="pa-6 w-100 h-auto bg-white">
    <h3 class="mb-6">Actividad Anual</h3>
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

    <canvas id="monthlyActivityAndErrors"> </canvas>
  </div>
</template>

<style lang="scss" scoped>
.color-square {
  width: 16px;
  height: 16px;
}
#monthlyActivityAndErrors {
  width: 100%;
  height: auto;
  max-height: 520px;
}
</style>
