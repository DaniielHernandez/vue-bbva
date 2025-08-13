<template>
  <v-card class="pa-6">
    <div class="d-flex flex-column">
      <span class="fs-22 font-weight-bold">{{ title }}</span>
      <span class="fs-22"> {{ subtitle }} </span>

      <v-table density="compact">
        <thead>
          <tr>
            <th
              v-for="header in headers"
              :id="`table-header${header.value}`"
              :key="header.value"
              class="text-left fs-12 font-weight-light"
            >
              <bbva-web-table-header-text>{{ header.title }}</bbva-web-table-header-text>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in items" :key="item.id">
            <td
              v-for="header in headers"
              :key="header.value"
              class="text-left fs-15 font-weight-light"
            >
              <span v-if="header.value === 'date' || header.value === 'time'">
                {{ item[header.value].start }} - {{ item[header.value].end }}
              </span>
              <span v-else>{{ item[header.value] }}</span>
            </td>
          </tr>
        </tbody>
      </v-table>

      <v-col cols="auto">
        <bbva-button-default variant="positive" text="Cerrar" @click="closeDialog">
        </bbva-button-default>
      </v-col>
    </div>
  </v-card>
</template>

<script>
// Components
import '@/components/bbva-web-components/bbva-web-table-header.js'

// Requests
import { getImpactAdjustmentsSummary } from '@/requests/impactAdjustments'

const headers = [
  { title: 'Business Unit', value: 'bu' },
  { title: 'CFS', value: 'cfs' },
  { title: 'ESCENARIO', value: 'scenario' },
  { title: 'FECHA INICIO - FIN', value: 'date' },
  { title: 'HORA DE INICIO - FIN', value: 'time' },
  { title: 'FOLIO', value: 'ticket' }
]

export default {
  name: 'ImpactAdjustmentsSummary',
  props: {},
  data() {
    return {
      title: 'Listado de ajustes guardados',
      subtitle: 'Edita los datos de usuario',
      headers,
      items: []
    }
  },
  methods: {
    closeDialog() {
      this.$emit('close')
    }
  },
  async mounted() {
    const { data: response } = await getImpactAdjustmentsSummary()
    this.items = response.items
  }
}
</script>
