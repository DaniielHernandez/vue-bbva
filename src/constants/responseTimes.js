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
export const filtersResponseTimes = [
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
 * Constant nested filter fields, it's used by component Filter
 */
export const nestedFilterFields = {
  buId: [{field: 'cfsId', request: getCfsModelAPI }]
}

/*
 * constant validation used by the Filter component
 */
export const validationsFilterFields =  {
  buId: (value) => validateRequired(value),
  cfsId: (value) => validateRequired(value),
  date: (value) => validateRequired(value),
}
