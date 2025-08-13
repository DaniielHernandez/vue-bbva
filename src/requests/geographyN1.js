import { instanceAxiosAPI }  from './axiosconfig.js';

/*
 *
 * This method get all the geographies
 *
 * @return Promise
 */
export const getGeographyN1sAPI = () => {
  return instanceAxiosAPI.get('/v1/catalogs/geography');
};
