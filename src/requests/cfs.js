import { instanceAxiosAPI } from './axiosconfig';
import { queryFilter } from '@/utils/requests';
import { pagination } from '@/constants/pagination';

/*
 * This function exeucute the request to update the status of the CFS
 *
 * @param {Number}  id     CFS's id
 * @param {Boolean} active Flag, if it's true then activate the CFS
 *
 * @return Promise
 */
export const updateStatusCfsAPI = (id, active) => {
  return instanceAxiosAPI.patch(
    `/v1/cfs/${id}`, { active: active }
  )
};

/*
 * This function execute the request to update a CFS
 *
 * @param {Number} id           CFS's id
 * @param {Object} data         Data to update the CFS
 * @param {String} data.name  Name of the CFS
 * @param {Number} data.active  Flag, true is it's active
 * @param {Number} data.buId   Business unit's ID
 *
 * @return Promise
 */
export const updateCfsAPI = (id, data) => {
  return instanceAxiosAPI.patch(
    `/v1/cfs/${id}`, data
  );
};

/*
 * This function execute the request to create a CFS
 *
 * @param {Object} data         Data to update the CFS
 * @param {String} data.name  Name of the CFS
 * @param {Number} data.active  Flag, true is it's active
 * @param {Number} data.buId   Business unit's ID
 *
 * @return Promise
 */
export const createCfsAPI = (data) => {
  return instanceAxiosAPI.post('/v1/cfs/add', data );
};

/*
 * This function execute the request to remove a CFS
 *
 * @param {Number} id CFS's ID
 *
 * @return Promise
 */
export const removeCfsAPI = (id) => {
  return instanceAxiosAPI.delete(`/v1/cfs/${id}`);
};

/*
 * This function get many CFS
 *
 * @param {Number}    pageNumber     Page's number
 * @param {pageSize}  pageSize       Page's size
 * @param {Object[]}  filters           Filter to send into the request
 * @param {String}    filters[].name    Name of the filter
 * @param {String}    filters[].value   Value of the filter, the type can be different
 *
 * @return Promise
 */
export const getCfsesAPI = (
  pageNumber = pagination.number,
  pageSize = pagination.size,
  filters = []
) => {
  const query = queryFilter(filters, pageSize, pageNumber);

  return instanceAxiosAPI.post('/v1/cfs/list', query);
};

/*
 * This function get a CFS with its CBPs and operatives
 *
 * @param {Number} id CFS's ID
 *
 * @return Promise
 */
export const getCfsAPI = (id) => {
  return instanceAxiosAPI.get(`/v1/cfs/detailed/${id}`);
};

/*
 * This function get the CFS model options required by the graphs
 *
 * @param {Number}    pageNumber     Page's number
 * @param {pageSize}  pageSize       Page's size
 * @param {Object[]}  filters           Filter to send into the request
 * @param {String}    filters[].name    Name of the filter
 * @param {String}    filters[].value   Value of the filter, the type can be different
 *
 * @return Promise
 */
export const getCfsModelAPI = (
  pageNumber = pagination.number,
  pageSize = pagination.size,
  filters = []
) => {
  const query = queryFilter(filters, pageSize, pageNumber);
  return instanceAxiosAPI.post('/v1/cfs/model/list', query);
};
