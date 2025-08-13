<script>
import { Chart } from 'chart.js/auto'
import { COLORS } from '@/constants/availability'

let dailyActivityAndErrorsChart = null

export default {
  name: 'DailyActivityAndErrors',
  data() {
    return {
      colorActivities: COLORS.YELLOW,
      colorErrors: COLORS.BLUE,
      legendItems: [],
      labels: [],
      activities: [],
      errors: [],
      summationActivities: 0,
      summationErrors: 0
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
     * Generates a chart based on the data retrieved.
     */
    generateChart() {
      this.summationActivities = this.data.summationActivities.toLocaleString() || 0
      this.summationErrors = this.data.summationErrors.toLocaleString() || 0
      if (this.data && this.data.days) {
        this.data.days.forEach((row) => {
          this.labels.push(row.day)
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

      const ctx = document.getElementById('dailyActivityAndErrors')
      dailyActivityAndErrorsChart = new Chart(ctx, config)
    },

    /**
     * Update the legend items based on the options and chart data.
     *
     * @return {void}
     */
    updateLegendItems() {
      this.legendItems = dailyActivityAndErrorsChart.options.plugins.legend.labels.generateLabels(dailyActivityAndErrorsChart)
    },

    /**
     * Updates the legend item.
     *
     * @param {type} item - description of parameter
     * @return {type} description of return value
     */
    updateLegendItem(item) {
      dailyActivityAndErrorsChart.setDatasetVisibility(item.datasetIndex, !dailyActivityAndErrorsChart.isDatasetVisible(item.datasetIndex))
      dailyActivityAndErrorsChart.update()
      this.updateLegendItems()
    },

    /**
     * Updates the chart with new data.
     *
     * @param {type} newData - the new data for the chart
     * @param {type} newData.days - array of days
     * @param {type} newData.days.day - the day
     * @param {type} newData.days.activities - the activities
     * @param {type} newData.days.errors - the errors
     * @return {type} description of return value
     */
    updateChart(newData) {
      if (!newData) return

      this.summationActivities = newData.summationActivities.toLocaleString() || 0
      this.summationErrors = newData.summationErrors.toLocaleString() || 0

      const labels = []
      const activities = []
      const errors = []

      const preLabels = this.labels
      const preActivities = this.activities
      const preErrors = this.errors

      newData.days.forEach((row) => {
        labels.push(row.day)
        activities.push(row.activities)
        errors.push(row.errors)
      })

      if (preLabels !== labels || preActivities !== activities || preErrors !== errors) {
        dailyActivityAndErrorsChart.data.labels = labels
        dailyActivityAndErrorsChart.data.datasets[0].data = activities
        dailyActivityAndErrorsChart.data.datasets[0].label = `Actividad`
        dailyActivityAndErrorsChart.data.datasets[1].data = errors
        dailyActivityAndErrorsChart.data.datasets[1].label = `Errores`
        dailyActivityAndErrorsChart.options.scales.y.ticks.callback = (value) => {
          const text = value.toLocaleString()
          return `${text} M`
        }
        dailyActivityAndErrorsChart.options.scales.y1.ticks.callback = (value) => {
          const text = value.toLocaleString()
          return `${text}`
        }
        dailyActivityAndErrorsChart.update()
        this.updateLegendItems()
      }
    }
  },
  mounted() {
    this.generateChart()
    this.updateLegendItems()
  }
}
</script>

<template>
  <div class="pa-6 w-100 h-auto bg-white">
    <h3 class="mb-6">Actividad Mensual</h3>
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
          <span>Acumulado actividad (Σ) </span>
          <span class="font-weight-bold">{{ summationActivities }}</span>
        </div>
        <div class="d-flex align-center ga-2">
          <span>Acumulado errores (Σ) </span>
          <span class="font-weight-bold">{{ summationErrors }}</span>
        </div>
      </div>
    </div>

    <canvas id="dailyActivityAndErrors"> </canvas>
  </div>
</template>

<style lang="scss" scoped>
.color-square {
  width: 16px;
  height: 16px;
}
#dailyActivityAndErrors {
  width: 100%;
  height: auto;
  max-height: 520px;
}
</style>
