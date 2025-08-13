import { instanceAxiosAPI } from "./axiosconfig";
import { queryFilter } from "@/utils/requests";
import { pagination } from '@/constants/pagination';

/*
 * This function exeucute the request to create weighing weekend
 *
 * @param {Object} data                Data to update  weighing weekend
 * @param {Number} data.buId          Business Unit's ID
 * @param {Number} data.cfsId         CFS's ID
 * @param {String} data.effectiveDate Expiration date format YYYY-MM-DD
 * @param {Number} data.weighingSaturday      Number weighing saturday
 * @param {Number} data.weighingSunday     Number weighing sunday
 *
 * @return Promise
 */
export const createWeighingWeekendAPI = ( data) => {
  return instanceAxiosAPI.post( `/v1/weighing/add`, data );
};

/*
 * This function execute the request to remove a weighing weekend
 *
 * @param {Number} id weighing weekend's ID
 *
 * @return Promise
 */
export const removeWeighingWeekendAPI = (id) => {
  return instanceAxiosAPI.delete( `/v1/weighing/${id}`);
};

/*
 * This function exeucute the request to update weighing weekend
 *
 * @param {Number}  id                 weighing weekend
 * @param {Object} data                Data to update  weighing weekend
 * @param {Number} data.buId          Business Unit's ID
 * @param {Number} data.cfsId         CFS's ID
 * @param {String} data.effectiveDate Expiration date format YYYY-MM-DD
 * @param {Number} data.weighingSaturday      Number weighing saturday
 * @param {Number} data.weighingSunday     Number weighing sunday
 *
 * @return Promise
 */
export const updateWeighingWeekendAPI = (id, data) => {
  return instanceAxiosAPI.patch( `/v1/weighing/${id}`, data );
};

/*
 * This function get many CFS
 *
 * @param {Number}    pageNumber        Page's number
 * @param {pageSize}  pageSize          Page's size
 * @param {Object[]}  filters           Filter to send into the request
 * @param {String}    filters[].name    Name of the filter
 * @param {String}    filters[].value   Value of the filter, the type can be different
 *
 * @return Promise
 */
export const getWeighingWeekendsAPI = (
  pageNumber = pagination.number,
  pageSize = pagination.size,
  filters = []
) => {
  const query = queryFilter(filters, pageSize, pageNumber);

  return instanceAxiosAPI.post('/v1/weighing/list', query);
};
