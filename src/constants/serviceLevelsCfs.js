import { getCfsModelAPI } from '@/requests/cfs';
import { getBusinessUnitsAPI } from '@/requests/businessUnit';
import { validateRequired } from '@/utils/form';
import { stringToday } from '@/utils/general';
/*
 * Headers cfs table
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
 * constant used by Filter component
 */
export const filtersServiceLevels = [
  {
    name: 'buId', label: 'Business Unit', type: 'select', options: [],
    request: getBusinessUnitsAPI, required: true, classes: 'z-index-20'
  },
  {
    name: 'cfsId',
    label: 'CFS',
    type: 'select',
    options: [],
    request: getCfsModelAPI, required: true,
    classes: 'z-index-20'
  },
  { name: 'date', label: 'Fecha', type: 'date', classes: 'z-index-20', max: stringToday() },
];

/*
 * constants used by nested Filter fields
 */
export const nestedFilterFields = {
  buId: [{field: 'cfsId', request: getCfsModelAPI }]
}

/*
 * Validations used by Filter component
 */
export const validationsFilterFields =  {
  buId: (value) => validateRequired(value),
  cfsId: (value) => validateRequired(value),
  date: (value) => validateRequired(value),
}

