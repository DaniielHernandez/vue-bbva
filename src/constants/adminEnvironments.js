import { validateRequired } from '@/utils/form'
/*
 * it has the headers of the table for
 * the view admin Environment
 */
export const headersTable = [{ title: 'Entornos' }]

/*
 * It has the filters used into the table
 * for the view admin environment
 */
export const filtersTable = []

/*
 * It has the validations used into the form fields
 */
export const validationsForm = {
  title: (value) => validateRequired(value)
}

/*
 * The form fields used into the form edit/create environment
 */
export const fieldsForm = [{ name: 'title', label: 'Titulo', type: 'text' }]

/*
 * The key used in the table admin environment
 */
export const requestDataKeys = ['title']
