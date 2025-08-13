import { instanceAxiosAPI }  from './axiosconfig.js';

/*
 * This method get all the profiles
 *
 * @return Promise
 */
export const getProfilesAPI = () => {
  return instanceAxiosAPI.get('/v1/catalogs/profile');
};
