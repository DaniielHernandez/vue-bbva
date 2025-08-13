/**
 * Filters used by the ResponseTimesDetail View
 */
export const filtersResponseTimesDetail = Object.freeze([
  {
    name: 'compliance',
    label: 'Selecciona una opción',
    defaultValue: true,
    options: [
      {
        value: true,
        label: 'Cumplimiento'
      },
      {
        value: false,
        label: 'Incumplimiento'
      }
    ]
  },
  {
    name: 'decimals',
    label: 'Selecciona una opción',
    defaultValue: 2,
    options: [
      {
        value: 2,
        label: '2 decimales'
      },
      {
        value: 3,
        label: '3 decimales'
      }
    ]
  }
])
