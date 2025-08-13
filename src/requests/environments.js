import { instanceAxiosAPI } from './axiosconfig.js'
import { queryFilter } from '@/utils/requests'
import { pagination } from '@/constants/pagination'

/*
 * This method get all the environments
 *
 * @return Promise
 */
export const getEnvironmentsAPI = () => {
  return instanceAxiosAPI.get('/v1/catalogs/environment')
}

/*
 * This function execute the request to update the status of the Environments
 *
 * @param {Number}  id     Environment id
 * @param {Boolean} active Flag, if it's true then activate the Environment
 *
 * @return Promise
 */
export const updateStatusEnvironmentApi = (id, data) => {
  return instanceAxiosAPI.patch(`/v1/catalogoEntorno/update/${id}`, data)
}

/*
 * This function execute the request to create a Environment
 *
 * @param {Object} data to update the Environment
 * @param {String} data.name of the Environment
 * @param {Number} data.active  Flag, true is it's active
 * @param {Number} data.buId   Business unit's ID
 *
 * @return Promise
 */
export const createEnvironmentApi = (data) => {
  return instanceAxiosAPI.post('/v1/catalogoEntorno/add', data)
}

/*
 * This function execute the request to remove an Environment
 *
 * @param {Number} id Environment's ID
 *
 * @return Promise
 */
export const removeEnvironmentApi = (id) => {
  return instanceAxiosAPI.delete(`/v1/catalogoEntorno/${id}`)
}

/*
 * This function get many Environment
 *
 * @param {Number}    pageNumber     Page's number
 * @param {pageSize}  pageSize       Page's size
 * @param {Object[]}  filters           Filter to send into the request
 * @param {String}    filters[].name of the filter
 * @param {String}    filters[].value of the filter, the type can be different
 *
 * @return Promise
 */
export const getEnvironmentsApi = () => {
  return instanceAxiosAPI.get('/v1/catalogoEntorno/list')
}
