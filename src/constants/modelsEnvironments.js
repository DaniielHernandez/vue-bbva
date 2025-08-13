export const weekDays = [
  { id: 1, label: 'Lunes' },
  { id: 2, label: 'Martes' },
  { id: 3, label: 'Miércoles' },
  { id: 4, label: 'Jueves' },
  { id: 5, label: 'Viernes' },
  { id: 6, label: 'Sábado' },
  { id: 7, label: 'Domingo' }
]

export const filters = {
  units: { value: '', error: null },
  cfs: { value: '', error: null },
  environment: { value: '', error: null },
  status: { value: 0, error: null }
}

export const ventana = {
  horaInicio: { value: '', error: null },
  diaInicio: { value: '', error: null },
  horaFin: { value: '', error: null },
  diaFin: { value: '', error: null },
  excluirDiasInhabiles: false // No requiere validación
}

export const stateAdminModels = {
  units: { value: '', error: null },
  cfs: { value: '', error: null },
  environment: { value: '', error: null },
  owner: { value: '', error: null },
  ventanasGenerales: [ventana],
  fechaInicioMedicion: { value: '', error: null },
  fechaFinMedicion: { value: '', error: null },
  version: { value: '', error: null },
  disponibilidad: { value: '', error: null },
  estatusModelo: { value: 0, error: null }
}

export const titleWindow = [
  { id: 1, label: 'Nuevo Modelo' },
  { id: 2, label: 'Editar Modelo' },
  { id: 3, label: 'Clonar Modelo' },
]



export const percentageWithThreeDecimalsPattern = /^(100(\.0{1,3})?|[0-9]{1,2}(\.[0-9]{1,3})?)$/
export const percentageWithTwoDecimalsPattern = /^(100(\.0{1,2})?|[0-9]{1,2}(\.[0-9]{1,2})?)$/
export const integerPattern = /^[0-9]+$/
