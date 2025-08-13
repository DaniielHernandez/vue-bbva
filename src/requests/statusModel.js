import { instanceAxiosAPI }  from './axiosconfig.js';

/*
 * This method get all the status model
 *
 * @return Promise
 */
export const getStatusModelAPI = () => {
  return instanceAxiosAPI.get('/v1/catalogs/statusModel');
};
