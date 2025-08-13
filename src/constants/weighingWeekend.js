import { validateTwoDecimal, validateRequired } from '@/utils/form';
import { getBusinessUnitsAPI } from '@/requests/businessUnit';
import { getCfsesAPI } from '@/requests/cfs';

/*
 * Header's table
 */
export const headersTable = [
  { title: 'Business unit' },
  { title: 'Cfs' },
  { title: 'Fecha de vigencia' },
  { title: 'Fecha configuración' },
  { title: 'Última modificación' },
  { title: 'Pond sábado' },
  { title: 'Pond domingo' },
];

/*
 * Table's filter
 */
export const filtersTable = [
  { name: 'buId', label: 'Business unit', type: 'select', options: [], request: getBusinessUnitsAPI },
  { name: 'channelId', label: 'CFS', type: 'select', options: [], request: getCfsesAPI },
];

/*
 * Form's validations
 */
export const validationsForm = {
  buId: (value) => validateRequired(value),
  channelId: (value) => validateRequired(value),
  effectiveDate: (value) => validateRequired(value),
  saturdayWeighting: (value) => validateRequired(value) || validateTwoDecimal(value),
  sundayWeighting: (value) => validateRequired(value) || validateTwoDecimal(value),
}

/*
 * Form's fields
 */
export const fieldsForm = [
  {
    name: 'buId', label: 'Business unit', type: 'select', request: getBusinessUnitsAPI,
    required: true
  },
  { name: 'channelId', label: 'CFS', type: 'select', request: getCfsesAPI, required: true },
  { name: 'effectiveDate', label: 'Fecha de vigencia', type: 'date' },
  {
    name: 'saturdayWeighting', label: 'Porcentaje ponderación sábado', type: 'number',
    max: 100, min: 0 },
  {
    name: 'sundayWeighting', label: 'Porcentaje ponderación domingo', type: 'number',
    max: 100, min: 0
  },
];


/*
 * Requested data keys
 */
export const requestDataKeys = [
  'bu', 'channel', 'effectiveDate', 'lastModification', 'user', 'saturdayWeighting', 'sundayWeighting'
];

/*
 * Format used by some columns into the table
 */
export const formatColumns = {
  saturdayWeighting: (value) => (`${value}%`) ,
  sundayWeighting: (value) => (`${value}%`)
}
