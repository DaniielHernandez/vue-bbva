import { getBusinessUnitsAPI } from '@/requests/businessUnit'
import { getCfsModelAPI } from '@/requests/cfs'
import { validateRequired } from '@/utils/form'

/*
 * Constants to use foe the component Filter
 */
export const filters = [
  {
    name: 'buId',
    label: 'Business Unit',
    type: 'select',
    options: [],
    request: getBusinessUnitsAPI,
    required: true
  },
  {
    name: 'cfsId',
    label: 'CFS',
    type: 'select',
    options: [],
    request: getCfsModelAPI,
    required: true
  },
  {
    name: 'date',
    label: 'Fecha',
    type: 'date',
    required: true
  }
]

/*
 * Constant to set nested fields for the component Filter
 */
export const nestedFilterFields = {
  buId: [{ field: 'cfsId', request: getCfsModelAPI }]
}

/*
 * Constant to add the validations to the filter fields
 */
export const validationsFilterFields = {
  buId: (value) => validateRequired(value),
  cfsId: (value) => validateRequired(value),
  date: (value) => validateRequired(value)
}
