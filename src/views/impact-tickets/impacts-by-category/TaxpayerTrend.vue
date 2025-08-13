<template>
  <app-bar />
  <simple-section-header
    :title="title"
    :subtitle="subtitle"
    backLabel="Volver a tabla"
    backPath="/impact-tickets/impacts-by-category?back=true"
    :icon="icon"
  />
  <v-container fluid class="px-12">
    <v-row>
      <v-col cols="auto">
        <div
          class="fs-15 text-white fw-350 font-italic px-3"
          :style="{ backgroundColor: colors.green }"
        >
          Meta: {{ goal }}
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="auto" class="fs-14 fw-500"> Indisponibilidad por contribuyentes: </v-col>
      <v-col cols="auto" v-for="(menu, index) in menuOptions" :key="index">
        <div class="d-flex align-center ga-2">
          <div class="d-flex align-center ga-2 cursor-pointer" @click="changeMenu(menu, index)">
            <span class="colorRectangle" :style="{ backgroundColor: menu.color }"></span>
            <p class="fs-14 fw-350" :class="{ 'text-disabled': !menu.visible }">
              {{ menu.label }}
            </p>
          </div>
          <taxpayer-trend-tooltip
            :id="index"
            :menu="menu"
            @open="openTooltip"
            @close="closeTooltip"
            @changeSubMenu="changeSubMenu"
          >
          </taxpayer-trend-tooltip>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="auto" class="fs-14 fw-500"> Meta indisponibilidad: </v-col>
      <v-col cols="auto">
        <div class="d-flex align-center ga-2 cursor-pointer" @click="changeGoal()">
          <span class="colorRectangle" :style="{ backgroundColor: goalOption.color }"></span>
          <p class="fs-14 fw-350" :class="{ 'text-disabled': !goalOption.visible }">
            {{ goalOption.label }}
          </p>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <div class="custom-font-graph w-100 h-auto bg-white">
          <canvas id="taxpayerTrendGraph"> </canvas>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" class="fs-15 fw-500 mt-4"> Resultado disponibilidad del mes </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <div class="d-flex flex-wrap gap-1 justify-space-between">
          <div
            class="d-flex flex-fill flex-column ga-1"
            v-for="(month, index) in unavailabilityItems"
            :key="index"
          >
            <div class="fs-14 fw-500 px-2 py-1">{{ month.month }}</div>
            <div
              class="fc-white fs-14 fw-500 pa-2"
              :style="{
                backgroundColor: month.backgroundColor,
                color: month.backgroundColor === '#F8CD51' ? 'black !important' : 'white !important'
              }"
            >
              {{ month.unavailability ? month.unavailability : '-' }}
            </div>
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
// Components
import AppBar from '@/components/AppBar/AppBar.vue'
import SimpleSectionHeader from '@/components/headers/SimpleSectionHeader.vue'
import TaxpayerTrendTooltip from '@/components/tooltips/TaxpayerTrendTooltip.vue'

// Libs
import { Chart } from 'chart.js/auto'
let taxpayerTrendChart = null

// Constants
import { numberToMonth } from '../../../constants/general'
import { goalOption, menuOptions, colors } from '../../../constants/taxpayerTrend'

// Requests
import {
  getTaxpayerTrendGoal,
  getTaxpayerTrendDataGraph,
  getTaxpayerTrendUnavailability
} from '../../../requests/taxpayerTrend'

export default {
  name: 'TaxpayerTrend',
  components: {
    AppBar,
    SimpleSectionHeader,
    TaxpayerTrendTooltip
  },
  data() {
    return {
      // Constants
      title: 'Tendencia de contribuyentes - [BU] - [CFS]',
      subtitle: 'Resultados [Month] del [Year]',
      icon: '/icons/SendTicket.svg',
      colors,
      menuOptions,
      goalOption,

      // Variables
      filters: {
        buId: null,
        cfsId: null,
        year: null,
        month: null
      },
      goal: null,
      goalUnavailability: null,
      labels: [],
      graphDataSets: {
        goal: [],
        incidents: {
          relevants: [],
          irrelevants: [],
          total: []
        },
        changes: {
          technicalInterventions: [],
          applicationChanges: [],
          relevantIncidents: [],
          irrelevantIncidents: [],
          total: []
        },
        errors: {
          diagnostics: [],
          baseLine: [],
          total: []
        }
      },
      unavailabilityItems: []
    }
  },
  methods: {
    /**
     * Asynchronously loads data for the component.
     *
     * @return {Promise<void>} A promise that resolves when the data is loaded.
     */
    async loadData() {
      const promises = [
        getTaxpayerTrendGoal(this.filters),
        getTaxpayerTrendDataGraph(this.filters),
        getTaxpayerTrendUnavailability(this.filters)
      ]

      const [{ data: goalResponse }, { data: graphResponse }, { data: unavailabilityResponse }] =
        await Promise.all(promises)

      // Set data
      this.goal = goalResponse?.goal || 0
      this.goalUnavailability = (100 - this.goal).toFixed(2)
      this.title = `Tendencia de contribuyentes - ${graphResponse.buName} - ${graphResponse.cfsName}`

      // Set labels and dataset goal
      graphResponse.months?.forEach((month) => {
        this.labels.push(`${month.month} ${String(month.year).substring(2, 4).toUpperCase()}`)
        this.graphDataSets.goal.push(this.goalUnavailability)

        // Set datasetasets
        this.menuOptions.forEach((menu) => {
          this.graphDataSets[menu.key][menu.subKey].push(month[menu.key][menu.subKey] || 0)
          menu.subMenus.forEach((subMenu) => {
            this.graphDataSets[menu.key][subMenu.subKey].push(month[menu.key][subMenu.subKey] || 0)
          })
        })
      })

      // Set unavailability
      unavailabilityResponse.months?.forEach((month) => {
        this.unavailabilityItems.push({
          month: `${month.month} ${String(month.year).substring(2, 4).toUpperCase()}`,
          unavailability: month.availability,
          backgroundColor: month.backgroundColor
        })
      })
    },
    /**
     * Generates a chart based on the current data and options.
     *
     * @return {void}
     */
    generateChart() {
      // datasets goalOptions
      const datasets = [
        {
          label: this.goalOption.label,
          data: this.graphDataSets.goal,
          backgroundColor: this.goalOption.color,
          borderColor: this.goalOption.color,
          pointStyle: true,
          pointHoverRadius: 8,
          order: this.goalOption.order,
          hidden: !this.goalOption.visible,
          cubicInterpolationMode: 'monotone',
          tension: 0.5
        }
      ]

      // datasets menuOptions
      this.menuOptions.forEach((menu) => {
        datasets.push({
          label: menu.label,
          data: this.graphDataSets[menu.key][menu.subKey],
          backgroundColor: menu.color,
          borderColor: menu.color,
          pointStyle: true,
          pointHoverRadius: 8,
          order: menu.order,
          hidden: !menu.visible,
          cubicInterpolationMode: 'monotone',
          tension: 0.5
        })
      })

      // datasets subMenuOptions
      this.menuOptions.forEach((menu) => {
        menu.subMenus.forEach((subMenu) => {
          datasets.push({
            label: subMenu.label,
            data: this.graphDataSets[menu.key][subMenu.subKey],
            backgroundColor: subMenu.color,
            borderColor: subMenu.color,
            pointStyle: true,
            pointHoverRadius: 8,
            borderDash: [10, 10],
            order: subMenu.order,
            hidden: !subMenu.visible,
            cubicInterpolationMode: 'monotone',
            tension: 0.5
          })
        })
      })
      const ctx = document.getElementById('taxpayerTrendGraph')
      taxpayerTrendChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: this.labels,
          datasets: datasets
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
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
                title: (ctx) => `Mes: ${ctx[0].label}`,
                label: (item) => item.dataset.label + ': ' + (item.parsed.y)
              }
            }
          },
          scales: {
            x: {
              grid: {
                lineWidth: 0
              },
              title: {
                display: false
              },
              padding: {
                top: 20
              }
            },
            y: {
              grid: {
                lineWidth: 0
              },
              title: {
                text: 'Indisponibilidad',
                display: true
              },
              padding: {
                top: 20
              },
              ticks: {
                callback: (value) => {
                  const text = value.toFixed(2)
                  return `${text}`
                }
              }
            }
          }
        }
      })
    },
    /**
     * Toggles the visibility of a menu option and updates the chart accordingly.
     *
     * @param {Object} menu - The menu option object.
     * @param {number} menu.order - The order of the menu option.
     * @param {number} index - The index of the menu option in the menuOptions array.
     * @return {void}
     */
    changeMenu(menu, index) {
      const visible = this.menuOptions[index].visible
      this.menuOptions[index].visible = !visible
      taxpayerTrendChart.setDatasetVisibility(menu.order, !visible)
      taxpayerTrendChart.update()
    },
    /**
     * Toggles the visibility of a sub-menu option and updates the chart accordingly.
     *
     * @param {Object} options - The options object.
     * @param {number} options.menuIndex - The index of the menu option.
     * @param {Object} options.subMenu - The sub-menu option object.
     * @param {number} options.subMenu.order - The order of the sub-menu option.
     * @param {number} options.index - The index of the sub-menu option.
     * @return {void}
     */
    changeSubMenu({ menuIndex, subMenu, index }) {
      const visible = this.menuOptions[menuIndex].subMenus[index].visible
      this.menuOptions[menuIndex].subMenus[index].visible = !visible
      taxpayerTrendChart.setDatasetVisibility(subMenu.order, !visible)
      taxpayerTrendChart.update()
    },
    /**
     * Toggles the visibility of the goal option and updates the chart accordingly.
     *
     * @return {void}
     */
    changeGoal() {
      const visible = this.goalOption.visible
      this.goalOption.visible = !visible
      taxpayerTrendChart.setDatasetVisibility(this.goalOption.order, !visible)
      taxpayerTrendChart.update()
    },
    /**
     * Opens the tooltip at the specified index by hiding the menu option and showing its sub-menus.
     *
     * @param {number} index - The index of the menu option to open the tooltip for.
     * @return {void}
     */
    openTooltip(index) {
      this.menuOptions[index].visible = false
      taxpayerTrendChart.setDatasetVisibility(this.menuOptions[index].order, false)
      const subMenus = this.menuOptions[index].subMenus || []
      subMenus.forEach((subMenu) => {
        taxpayerTrendChart.setDatasetVisibility(subMenu.order, true)
        subMenu.visible = true
      })
      taxpayerTrendChart.update()
    },
    /**
     * Closes the tooltip at the specified index by hiding the menu option and hiding its sub-menus.
     *
     * @param {number} index - The index of the menu option to close the tooltip for.
     * @return {void}
     */
    closeTooltip(index) {
      this.menuOptions[index].visible = true
      taxpayerTrendChart.setDatasetVisibility(this.menuOptions[index].order, true)
      const subMenus = this.menuOptions[index].subMenus || []
      subMenus.forEach((subMenu) => {
        taxpayerTrendChart.setDatasetVisibility(subMenu.order, false)
      })
      taxpayerTrendChart.update()
    }
  },
  /**
   * Lifecycle hook that is called after the component has been created.
   *
   * @return {void}
   */
  async created() {
    try {
      this.emitter.emit('load', { loading: true })
      let { buId, cfsId, year, month } = this.$route.query

      if (![buId, cfsId, year, month].every((param) => param && !isNaN(param))) {
        throw new Error('Verifique que los parámetros de consulta sean correctos')
      }

      // Parse querys
      buId = parseInt(buId)
      cfsId = parseInt(cfsId)
      year = parseInt(year)
      month = parseInt(month)

      // Set filters
      this.filters.buId = buId
      this.filters.cfsId = cfsId
      this.filters.year = year
      this.filters.month = month

      this.subtitle = `Resultados ${numberToMonth[month]} del ${year}`
      await this.loadData()
      this.generateChart()
    } catch (error) {
      this.emitter.emit('informational', {
        type: 'error',
        title: 'Error al obtener la información',
        message: error
      })
    } finally {
      this.emitter.emit('load', { loading: false })
    }
  }
}
</script>

<style scoped lang="scss">
.customFontGraph {
  font-family: --font-family-benton-sans, sans-serif;
}
.colorRectangle {
  width: 16px;
  height: 4px;
}
.dash {
  border: none;
  width: 18px;
  height: 4px;
}
#taxpayerTrendGraph {
  width: 100%;
  min-width: 100%;
  height: auto;
  max-height: 420px;
  position: relative;
  z-index: 100;
}
.v-row + .v-row {
  margin-top: 0px !important;
}
.gap-1 {
  gap: 1px !important;
}
</style>
