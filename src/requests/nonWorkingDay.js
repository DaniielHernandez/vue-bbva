import { instanceAxiosAPI } from "./axiosconfig";
import { queryFilter } from "@/utils/requests";
import { pagination } from '@/constants/pagination';

/*
 * This function execute the request to create a non working day
 *
 * @param {Object} data         Data to update the non working day
 * @param {Number} data.date  Date of the non working day
 * @param {Number} data.buId   Business unit's ID
 *
 * @return Promise
 */
export const createNonWorkingDayAPI = (data) => {
  return instanceAxiosAPI.post( '/v1/day/add', data );
};

/*
 * This function execute the request to update a non working day
 *
 * @param {Number} data.date  Date of the non working day
 * @param {Number} data.buId   Business unit's ID
 *
 * @return Promise
 */
export const updateNonWorkingDayAPI = (id, data) => {
  return instanceAxiosAPI.patch( `/v1/day/${id}`, data );
};

/*
 * This function execute the request to remove a non working day
 *
 * @param {Number} id   Nonworking day's ID
 *
 * @return Promise
 */
export const removeNonWorkingDayAPI = (id) => {
  return instanceAxiosAPI.delete( `/v1/day/${id}`);
};

/*
 * This function get many non working days
 *
 * @param {Number}    pageNumber     Page's number
 * @param {pageSize}  pageSize       Page's size
 * @param {Object[]}  filters           Filter to send into the request
 * @param {String}    filters[].name    Name of the filter
 * @param {String}    filters[].value   Value of the filter, the type can be different
 *
 * @return Promise
 */
export const getNonWorkingDaysAPI = (
  pageNumber = pagination.number,
  pageSize = pagination.size,
  filters = []
) => {
  const query = queryFilter(filters, pageSize, pageNumber);

  return instanceAxiosAPI.post('/v1/day/list', query);
};
