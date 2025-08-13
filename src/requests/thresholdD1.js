import { instanceAxiosAPI } from "./axiosconfig";
import { queryFilter } from "@/utils/requests";
import { pagination } from '@/constants/pagination';

/*
 * This function create a threshold D+1
 *
 * @param {String} effectiveDate      Expiration date
 * @param {Number} lesserThan      Number high lower than
 * @param {Number} greaterThan      Number high bigger than
 * @param {Number} veryHighGreaterThan Number Very high lower than
 * @param {Number} userId          User's id
 *
 */
export const createThresholdD1API = (data) => {
  return instanceAxiosAPI.post( `/v1/thresholdD/add`, data );
};

/*
 * This function get many CFS
 *
 * @param {Number}    pageNumber     Page's number
 * @param {pageSize}  pageSize       Page's size
 *
 * @return Promise
 */
export const getThresholdsD1API = (
  pageNumber = pagination.number,
  pageSize = pagination.size,
  filters = []
) => {
  const query = queryFilter(filters, pageSize, pageNumber);

  return instanceAxiosAPI.post('/v1/thresholdD/list', query);
}
