import { instanceAxiosAPI }  from './axiosconfig.js';

/*
 * This method get all the areas from the backend
 *
 * @return Promise
 */
export const getAreasAPI = () => {
  return instanceAxiosAPI.get('/v1/catalogs/area');
};
