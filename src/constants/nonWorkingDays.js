import { getBusinessUnitsAPI } from '@/requests/businessUnit';
import { translateMonth } from '@/utils/date.js';

/*
 * Headers of the table
 */
export const headersTable = [
  { title: 'Business Unit' }, { title: 'Días' }, { title: 'Mes' }, { title: 'Año' },
];

/*
 * Filters to be used into the table
 */
export const filtersTable = [
  { name: 'buId', label: 'Business Unit', type: 'select', options: [], request: getBusinessUnitsAPI },
  { name: 'date', label: 'Mes / Día / Año', type: 'date' },
];

/*
 * keys ot use in response of request
 */
export const requestDataKeys = [ 'bu', 'day', 'monthText', 'year' ];

/*
 * Format columns for the table
 */
export const formatColumns = {
  monthText: translateMonth
};
