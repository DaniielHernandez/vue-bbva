import { instanceAxiosAPI }  from './axiosconfig.js';

/*
 * This method get all the partnerships measurements
 *
 * @return Promise
 */
export const getPartnershipMeasurementAPI = () => {
  return instanceAxiosAPI.get('/v1/catalogs/measurementPartnership');
};
