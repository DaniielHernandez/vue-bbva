import { instanceAxiosAPI }  from './axiosconfig.js';

/*
 * This method get all the model types
 *
 * @return Promise
 */
export const getTypesModelsAPI = () => {

  return instanceAxiosAPI.get('/v1/catalogs/typesModel');
}
