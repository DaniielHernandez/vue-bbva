import { getBusinessUnitsAPI } from '@/requests/businessUnit';
import { validateRequired } from '@/utils/form';

/*
 * it has the headers of the table for
 * the view admin cfs
 */
export const headersTable = [
  { title: 'CFS' },
  { title: 'Business Unit' },
];

/*
 * It has the filters used into the table
 * for the view admin cfs
 */
export const filtersTable = [
  {
    name: 'name',
    label: 'CFS',
    type: 'text',
  },
  {
    name: 'buId',
    label: 'Business Unit',
    type: 'select',
    options: [],
    request: getBusinessUnitsAPI
  },
];

/*
 * It has the validations used into the form fields
 */
export const validationsForm = {
  buId: (value) => validateRequired(value),
  name: (value) => validateRequired(value)
};

/*
 * The form fields used into the form edit/create cfs
 */
export const fieldsForm = [
  { name: 'name', label: 'CFS', type: 'text' },
  {
    name: 'buId', label: 'Business Unit', request: getBusinessUnitsAPI, type: 'select',
    required: true
  },
];

/*
 * The key used in the table admin cfs
 */
export const requestDataKeys = [ 'name', 'bu' ];
