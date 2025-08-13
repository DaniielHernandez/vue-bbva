import { instanceAxiosAPI } from "./axiosconfig";
import { queryFilter } from "@/utils/requests";
import { pagination } from '@/constants/pagination';
import { getMonthFromString } from '@/utils/general.js';

/*
 * This function get the items of omega report
 *
 * @param {Number}    pageNumber        Page's number
 * @param {pageSize}  pageSize          Page's size
 * @param {Object[]}  filters           Filter to send into the request
 * @param {String}    filters[].name    Name of the filter
 * @param {String}    filters[].value   Value of the filter, the type can be different
 *
 * @return Promise
 */
export const getOmegaReportAPI = (
  pageNumber = pagination.number,
  pageSize = pagination.size,
  filters = []
) => {
  const query = queryFilter(filters, pageSize, pageNumber);
  return instanceAxiosAPI.post( '/v1/omega/report/list', query );
};

/*
 * This function get the excel file for omega report
 *
 * @param {Object[]}  filters           Filter to send into the request
 * @param {String}    filters[].name    Name of the filter
 * @param {String}    filters[].value   Value of the filter, the type can be different
 *
 * @return Promise
 */
export const getExcelFileOmegaReport = (filters) => {
  const query = queryFilter(filters);
  return instanceAxiosAPI.post(
    '/v1/omega/export',
    query,
    {
      responseType: 'blob'
    }
  );
};
