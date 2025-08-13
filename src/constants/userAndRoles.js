import { getProfilesAPI } from '@/requests/profiles';
import { getAreasAPI } from '@/requests/areas';
import { getBusinessUnitsAPI } from '@/requests/businessUnit';
import { getGeographyN1sAPI } from '@/requests/geographyN1';
import { getRolesAPI } from '@/requests/roles';
import { separator } from '@/constants/general';
import {
  validateRequired, validateEmail, manyValidations
} from '@/utils/form';

/*
 * Table's headers
 */
export const headersTable = [
  { title: 'NOMBRE/APELLIDOS/MAIL' },
  { title: 'ID' },
  { title: 'GEOGRAFÍA/BU' },
  { title: 'ROL' },
  { title: 'PERFIL' },
  { title: 'CARGO/AREA' }
];

/*
 * Table's filters
 */
export const filtersTable = [
  { name: 'fullName', label: 'Nombre y apellidos', type: 'text' },
  { name: 'buId', label: 'Business Unit', type: 'select', options: [], request: getBusinessUnitsAPI },
  { name: 'roleId', label: 'Rol', type: 'select', options: [], request: getRolesAPI },
  { name: 'employeeId', label: 'ID', type: 'text' },
  { name: 'email', label: 'Email', type: 'text' },
  { name: 'profileId', label: 'Perfil', type: 'select', options: [], request: getProfilesAPI },
  { name: 'areaId', label: 'Cargo/Área', type: 'select', options: [], request: getAreasAPI },
  { name: 'geographyN1Id', label: 'Geografía', type: 'select', options: [], request: getGeographyN1sAPI },
];

/*
 * Form's validations
 */
export const validationsForm = {
  fullName: (value) => validateRequired(value),
  employeeId: (value) => validateRequired(value),
  email: (value) => manyValidations([validateRequired, validateEmail], value),
  buId: (value) => validateRequired(value),
  geographyN1Id: (value) => validateRequired(value),
  profileId: (value) => validateRequired(value),
  areaId: (value) => validateRequired(value),
  roleId: (value) => validateRequired(value)
};

/*
 * Form's fields
 */
export const fieldsForm = [
  { name: 'fullName', label: 'Nombre y apellidos', type: 'text' },
  { name: 'email', label: 'Email', type: 'text' },
  { name: 'employeeId', label: 'ID usuario', type: 'text' },
  { name: 'geographyN1Id', label: 'Geografía', type: 'select', request: getGeographyN1sAPI },
  { name: 'buId', label: 'Business unit', type: 'select', request: getBusinessUnitsAPI  },
  { name: 'roleId', label: 'Rol', type: 'select', request: getRolesAPI  },
  { name: 'profileId', label: 'Perfil', type: 'select', request: getProfilesAPI  },
  { name: 'areaId', label: 'Cargo/Área', type: 'select', request: getAreasAPI  },
];

/*
 * Requested data keys
 */
export const requestDataKeys = [
  `fullName${separator}email`,  "employeeId",  `geographyN1${separator}bu`,  "role",  "profile",  "area"
];

/*
 * Nested fields into the form
 */
export const nestedFields = {
  geographyN1Id: ['buId']
}

