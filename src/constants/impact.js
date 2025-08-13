/*
 * Intervals used by the input time
 */
export const optionsInterval = Object.freeze([
  { label: '1 Hora', id: 60 },
  { label: '5 Min', id: 5 }
])

/*
 * Options used by a select
 */
export const optionsElements = Object.freeze([
  { label: 'Todos', id: 'All' },
  { label: 'Actividad', id: 'Activity' },
  { label: 'Errores', id: 'Errors' }
])

/*
 * Normalization options used by a input select
 */
export const optionsNormalization = Object.freeze([
  { label: 'Normalizar', id: true },
  { label: 'No normalizar', id: false }
])

/*
 * Pattern to validate the time
 */
export const timePattern = /^([01]\d|2[0-3]):(00|05|10|15|20|25|30|35|40|45|50|55|59)$/

/*
 * Pattern to validate two decimals
 */
export const percentageWithTwoDecimalsPattern = /^\d{1,3}(\.\d{1,2})?$/

/*
 * Ids of the scenarios
 */
export const scenariosIds = Object.freeze({
  ASOCIAR_IMPACTO: 1,
  REINTENTOS: 2,
  SIN_SERVICIO: 3,
  IMPACTO_LIBRE: 4,
  DISMINUCION_ACTIVIDAD: 5
})
