import { getBusinessUnitsAPI } from '@/requests/businessUnit';
import { separator } from '@/constants/general';
import { getGeographyN1sAPI } from '@/requests/geographyN1';
import { getCriticalitiesAPI } from '@/requests/criticality';
import { getRolesAPI } from '@/requests/roles';
import { getStatusModelAPI } from '@/requests/statusModel';
import { getMeasurementStatusesAPI } from '@/requests/measurementStatus';
import { getPartnershipAPI } from '@/requests/partnership';
import { validateRequired } from '@/utils/form';

/*
 * Constants to show the headers into teh table
 */
export const headersTable = [
  { title: 'Dashboard' }, { title: 'Bu/geografía' }, { title: 'Rol' }, { title: 'Año' },
  { title: 'Clasificación de criticidad'}, { title: 'Última actualización'}
];

/*
 * Constant with the filters used by the table
 */
export const filtersTable = [
  { name: 'buId', label: 'Business Unit', type: 'select', options: [], request: getBusinessUnitsAPI },
  { name: 'roleId', label: 'Rol', type: 'select', options: [], request: getRolesAPI },
  { name: 'criticalityId', label: 'Clasificación de criticidad', type: 'select', options: [], request: getCriticalitiesAPI }
];

/*
 * Constant with the validation of the form inputs
 */
export const validationsForm = {
  dashboardName: (value) => validateRequired(value),
  buId: (value) => validateRequired(value),
  geographyN1Id: (value) => validateRequired(value),
  roles: (value) => validateRequired(value),
  criticalityId: (value) => validateRequired(value),
  modelStatusId: (value) => validateRequired(value),
  measurementStatusId: (value) => validateRequired(value),
  partnershipId: (value) => validateRequired(value),
  year: (value) => validateRequired(value),
};


/*
 * Constant with fields to show the form
 */
export const fieldsForm = [
  { name: 'dashboardName', label: 'Nombre del Dashboard', type: 'text', max: 40, required: true },
  { name: 'geographyN1Id', label: 'Geografía N1', request: getGeographyN1sAPI, type: 'select', removeItemsById: [3], required: true  },
  { name: 'buId', label: 'Business Unit', request: getBusinessUnitsAPI, type: 'select' },
  {
    name: 'roles', label: 'Roles', request: getRolesAPI, type: 'select-multiple',
    getIds: (array) => (
      array.map((item) => ( `${item.roleId}` ))
    ), required: true 
  },
  { name: 'criticalityId', label: 'Clasificación de criticidad', request: getCriticalitiesAPI, type: 'select', required: true  },
  { name: 'modelStatusId', label: 'Estatus de modelo', request: getStatusModelAPI, type: 'select', required: true  },
  { name: 'measurementStatusId', label: 'Estatus de medición', request: getMeasurementStatusesAPI, type: 'select', required: true  },
  { name: 'partnershipId', label: 'Partnership', request: getPartnershipAPI, type: 'select', required: true  },
  { name: 'year', label: 'Año', type: 'number', required: true  },
];

/*
 * Constant to set nested fields into the form
 */
export const nestedFields = {
  geographyN1Id: ['buId']
};

/*
 * Constant with the field's names to show rows by the table
 */
export const requestDataKeys = [
  "dashboardName",
  `buName${separator}geographyN1Name`,
  "roles",
  "year",
  "nameCriticality",
  "lastUpdateDate",
];

/*
 * Constant with the field's names with the hidden fields in every row,
 * it's showed by the table
 */
export const hiddenDataKeys =  [
  "modelStatusName",
  "measurementStatusName",
  "namePartnerShip",
]

/*
 * It has the hidden headers used by the component DataTable
 */
export const hiddenHeaders = {
  measurementStatusName: 'Estatus de medición',
  namePartnerShip: 'Partnership',
  modelStatusName: 'Estatus de modelo'
}

