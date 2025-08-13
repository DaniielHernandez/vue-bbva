import { getCfsModelAPI } from '@/requests/cfs';
import { validateRequired } from '@/utils/form';
import { getBusinessUnitsAPI } from '@/requests/businessUnit';
import { stringToday } from '@/utils/general';

/*
 * constants for the headers table
 */
export const headers = [
  { hidden: false, title: 'BU/CFS', label: 'BU/CFS' },
  { hidden: false, title: 'Meta', label: 'META' },
  { hidden: false, title: 'Anual', label: 'ANUAL' },
  { hidden: false, title: 'Enero', label: 'ENE', month: 1 },
  { hidden: false, title: 'Febrero', label: 'FEB', month: 2 },
  { hidden: false, title: 'Marzo', label: 'MAR', month: 3 },
  { hidden: false, title: 'Abril', label: 'ABR', month: 4 },
  { hidden: false, title: 'Mayo', label: 'MAY', month: 5 },
  { hidden: false, title: 'Junio', label: 'JUN', month: 6 },
  { hidden: false, title: 'Julio', label: 'JUL', month: 7 },
  { hidden: false, title: 'Agosto', label: 'AGO', month: 8 },
  { hidden: false, title: 'Septiembre', label: 'SEP', month: 9 },
  { hidden: false, title: 'Octubre', label: 'OCT', month: 10 },
  { hidden: false, title: 'Noviembre', label: 'NOV', month: 11 },
  { hidden: false, title: 'Diciembre', label: 'DIC', month: 12 },
]

/*
 * constants for headers CFS
 */
export const headersCFS = [
  { hidden: false, title: 'cfs', label: 'CFS/CBP/OPERATIVA' },
  { hidden: false, title: 'Meta', label: 'META' },
  { hidden: false, title: 'Activ', label: 'ACTIV' },
  { hidden: false, title: 'Peso', label: 'PESO' },
  { hidden: false, title: 'Anual', label: 'ANUAL' },
  { hidden: false, title: 'Enero', label: 'ENE' },
  { hidden: false, title: 'Febrero', label: 'FEB'  },
  { hidden: false, title: 'Marzo', label: 'MAR'  },
  { hidden: false, title: 'Abril', label: 'ABR'  },
  { hidden: false, title: 'Mayo', label: 'MAY'  },
  { hidden: false, title: 'Junio', label: 'JUN'  },
  { hidden: false, title: 'Julio', label: 'JUL'  },
  { hidden: false, title: 'Agosto', label: 'AGO'  },
  { hidden: false, title: 'Septiembre', label: 'SEP'  },
  { hidden: false, title: 'Octubre', label: 'OCT'  },
  { hidden: false, title: 'Noviembre', label: 'NOV'  },
  { hidden: false, title: 'Diciembre', label: 'DIC'  },
]

/*
 * Constants used by the component Filters
 */
export const filtersServiceLevels = [
  {
    name: 'buId', label: 'Business Unit', type: 'select', options: [],
    request: getBusinessUnitsAPI, classes: 'z-index-25', required: true
  },
  {
    name: 'cfsId', label: 'CFS', type: 'select-multiple', options: [], request: getCfsModelAPI,
    required: true
  },
  {
    name: 'date', label: 'Fecha', type: 'date', classes: 'z-index-20', required: true,
    max: stringToday()
  },
];

/*
 * constant validation used by the Filter component
 */
export const validationsFilterFields =  {
  buId: (value) => validateRequired(value),
  cfsId: (value) => validateRequired(value),
  date: (value) => validateRequired(value),
}
