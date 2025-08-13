import { getEnvironmentsAPI } from '@/requests/environments';
import { getBusinessUnitsAPI } from '@/requests/businessUnit';
import { getMeasurementStatusesAPI } from '@/requests/measurementStatus';
import { getSourceModelsAPI } from '@/requests/sourceModel';
import { getStatusModelAPI } from '@/requests/statusModel';

/*
 * It has the headers showed into the table
 * for the view admin models
 */
export const headersTable = [
  { title: 'Business Unit' },
  { title: 'CFS' },
  { title: 'Entorno' },
  { title: 'Estatus modelo' },
  { title: 'Estatus medición' },
  { title: 'Versión' },
  { title: 'Fuente' },
];

/*
 * It has the filters used by the table
 */
export const filtersTable = [
  {
    name: 'buId',
    label: 'Business Unit',
    type: 'select',
    options: [],
    request: getBusinessUnitsAPI
  },
  {
    name: 'statusId',
    label: 'Estatus modelo',
    type: 'select',
    options: [],
    request: getStatusModelAPI
  },
  {
    name: 'measurementStatusId',
    label: 'Estatus medición',
    type: 'select',
    options: [],
    request: getMeasurementStatusesAPI
  },
  {
    name: 'version',
    label: 'Versión',
    type: 'text'
  },
  {
    name: 'sourceId',
    label: 'Fuente',
    type: 'select',
    options: [],
    request: getSourceModelsAPI
  },
  {
    name: 'enviromentId',
    label: 'Entorno',
    type: 'select',
    options: [],
    request: getEnvironmentsAPI
  },
];

/*
 * It has the keys of the request fields
 */
export const requestDataKeys = [
  "bu",  "cfs",  "environment",  "status",  "statusMeasurement",  "version", "source"
];

/*
 * It has the format of specific column showed by the table
 */
export const formatColumns = {
  status: (value) => {
    let color = '#004481';
    if('Activo' === value) {
      color = '#277A3E';
    } else if( value === 'Inactivo') {
      color = '#B92A45';
    }

    return `<span style="color: ${color};"> ${value} </span>`;
  }
}
