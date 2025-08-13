import { instanceAxiosAPI } from './axiosconfig'

/**
 * Retrieves the origin data from the API.
 *
 * @return {Promise} A Promise that resolves to an object containing the origin data.
 */
export const getOriginAPI = () => {
  return instanceAxiosAPI.get('/v1/catalog/origin')
}
