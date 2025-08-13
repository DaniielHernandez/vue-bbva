import { instanceAxiosAPI }  from './axiosconfig.js';

/*
 * This method get all the source models
 *
 * @return Promise
 */
export const getSourceModelsAPI = () => {
  return instanceAxiosAPI.get('/v1/catalogs/source');
};
