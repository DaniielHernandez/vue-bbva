import { getCfsModelAPI } from '@/requests/cfs';
import { getBusinessUnitsAPI } from '@/requests/businessUnit';

/*
 * Headers for teh table impact adjustments
 */
export const headers = [
  { title: 'BUSINESS UNIT' },
  { title: 'CFS' },
  { title: 'ESCENARIO' },
  { title: 'FECHA INICIO-FIN' },
  { title: 'HORA INICIO-FIN' },
  { title: 'FOLIO' },
  { title: 'USUARIO' }
];

/*
 * Filters to use over view impact adjustemnts
 */
export const filtersTable = [
  { name: 'buId', label: 'Business Unit', type: 'select', options: [], request: getBusinessUnitsAPI },
  { name: 'cfsId', label: 'CFS', type: 'select', options: [], request: getCfsModelAPI },
  { name: 'date', label: 'Fechas', type: 'range-date', from: 'startDate', to: 'endDate' }
];

/*
 * Constant to set nested fields for the component Filter
 */
export const nestedFilterFields = {
  buId: [{ field: 'cfsId', request: getCfsModelAPI }]
}
