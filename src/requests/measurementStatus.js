import { instanceAxiosAPI }  from './axiosconfig.js';

/*
 * This method get all the measurement statuses
 
 * @return Promise
 */
export const getMeasurementStatusesAPI = () => {
  return instanceAxiosAPI.get('/v1/catalogs/statusMeasurement');
};
