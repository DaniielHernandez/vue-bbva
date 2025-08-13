import { instanceAxiosAPI }  from './axiosconfig.js';

/*
 * This method get all the criticalities
 *
 * @return Promise
 */
export const getCriticalitiesAPI = () => {
  return instanceAxiosAPI.get('/v1/catalogs/criticality');
}
