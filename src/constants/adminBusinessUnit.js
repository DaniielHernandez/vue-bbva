import { getGeographyN1sAPI } from '@/requests/geographyN1';
import { validateRequired } from '@/utils/form';

/*
 * It has the headers to be showed by the table admin business units
 */
export const headersTable = [
  { title: 'Business Unit' },
  { title: 'Geografía' },
];

/*
 * Filters to be used in table admin business units
 */
export const filtersTable = [
  {
    name: 'name',
    label: 'Business Unit',
    type: 'text'
  },
  {
    name: 'geographyN1Id',
    label: 'Geografía',
    type: 'select',
    options: [],
    request: getGeographyN1sAPI,
  },
];

/*
 * It has the validations to edit/create a business unit
 */
export const validationsForm = {
  name: (value) => validateRequired(value),
  geographyN1Id: (value) => validateRequired(value),
};

/*
 * It has the fields form
 */
export const fieldsForm = [
  { name: 'name', label: 'Business Unit', type: 'text', required: true },
  {
    name: 'geographyN1Id', label: 'Geografía N1', request: getGeographyN1sAPI, type: 'select',
    removeItemsById: [3], required: true
  },
];

/*
 * It has the requested data keys used in admin business unit
 */
export const requestDataKeys = [
  'bu', 'geographyN1'
];
