import { instanceAxiosAPI }  from './axiosconfig.js';

/*
 * This method get all the partnerships
 *
 * @return Promise
 */
export const getPartnershipAPI = () => {
  return instanceAxiosAPI.get('/v1/catalogs/partnership');
};
