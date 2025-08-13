import { instanceAxiosAPI } from "./axiosconfig";
import { queryFilter } from "@/utils/requests";
import { replaceKey } from "@/utils/general";
import { pagination } from '@/constants/pagination';

/*
 * This function gets the data for service level table by BU
 *
 * @param {Object[]}  filters           Filter to send into the request
 * @param {String}    filters[].name    Name of the filter
 * @param {String}    filters[].value   Value of the filter, the type can be different
 *
 * @return Promise
 */
export const getServiceLevelsBuAPI = (filters = [] )=> {
  const query = queryFilter(filters);
  replaceKey(query, 'cfsId', 'modelIds');
  return instanceAxiosAPI.post('/v1/rum/board/results/bucfs', query);
};

/*
 * This function gets the data for service level table by CFS
 *
 * @param {Object[]}  filters           Filter to send into the request
 * @param {String}    filters[].name    Name of the filter
 * @param {String}    filters[].value   Value of the filter, the type can be different
 *
 * @return Promise
 */
export const getServiceLevelsCFSAPI = (filters = []) => {
  const query = queryFilter(filters);
  return instanceAxiosAPI.post('/v1/rum/board/results/cfs', query);
};

/*
 * This function gets the data for service level table by CBP
 *
 * @param {Object[]}  filters           Filter to send into the request
 * @param {String}    filters[].name    Name of the filter
 * @param {String}    filters[].value   Value of the filter, the type can be different
 *
 * @return Promise
 */
export const getServiceLevelsCBPAPI = (filters = []) => {
  const query = queryFilter(filters);
  return instanceAxiosAPI.post('/v1/rum/board/results/cbp', query);
};

/*
 * This function gets the data for service level table by Operative
 *
 * @param {Object[]}  filters           Filter to send into the request
 * @param {String}    filters[].name    Name of the filter
 * @param {String}    filters[].value   Value of the filter, the type can be different
 *
 * @return Promise
 */
export const getServiceLevelsOperativeAPI = (filters = []) => {
  const query = queryFilter(filters);
  return instanceAxiosAPI.post('/v1/rum/board/results/operative', query);
};

/*
 * This function get excel file for service level table
 *
 * @param {Number} id  Model's id
 *
 * @return Promise
 */
export const getExcelFileServiceLevel = (filters) => {
  const query = queryFilter(filters);
  replaceKey(query, 'cfsId', 'modelIds');
  return instanceAxiosAPI.post(
    '/v1/rum/board/export/bucfs',
    query,
    {
      responseType: 'blob'
    }
  );
};

/*
 * This function get the excel file for service levels by cfs
 *
 * @param {Number} id  Model's id
 *
 * @return Promise
 */
export const getExcelFileServiceLevelCfs = (filters) => {
  const query = queryFilter(filters);
  return instanceAxiosAPI.post(
    '/v1/rum/board/export/bucfsoperative',
    query,
    {
      responseType: 'blob'
    }
  );
};
