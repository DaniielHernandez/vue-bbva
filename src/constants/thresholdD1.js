import { validateRequired } from '@/utils/form';
/*
 * Table's headers
 */
export const headersTable = [
  { title: 'Fecha de configuración' },
  { title: 'Fecha vigencia' },
  { title: 'Nombre y apellidos' },
  { title: 'High - mayor qué' },
  { title: 'High - menor o igual qué' },
  { title: 'Very High - mayor qué' },
];

/*
 * Table's filters
 */
export const filtersTable = [];

export const validationsForm = {
  lesserThan: (value) => validateRequired(value),
  greaterThan: (value) => validateRequired(value),
  veryHighGreaterThan: (value) => validateRequired(value),
  effectiveDate: (value) => validateRequired(value)
};

/*
 * Form's fields
 */
export const fieldsForm = [
  { name: 'greaterThan', label: 'High - Mayor qué', type: 'number' },
  { name: 'lesserThan', label: 'High - Menor o igual qué', type: 'number' },
  { name: 'veryHighGreaterThan', label: 'Very High - Mayor qué', type: 'number' },
  { name: 'effectiveDate' , label: 'Fecha de Vigencia', type: 'date'}
];

/*
 * Requested data keys
 */
export const requestDataKeys = [
  'configurationDate', 'effectiveDate', 'user', 'greaterThan',
  'lesserThan', 'veryHighGreaterThan'
];
