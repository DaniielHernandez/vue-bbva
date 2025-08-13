import { instanceAxiosAPI }  from './axiosconfig.js';

/*
 * This method get all the roles
 *
 * @return Promise
 */
export const getRolesAPI = () => {
  return instanceAxiosAPI.get('/v1/catalogs/role');
};
