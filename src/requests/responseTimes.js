import { instanceAxiosAPI } from "./axiosconfig";
import { queryFilter } from "@/utils/requests";

/*
 * This function gets the data for responses times table by BU
 *
 * @param {Object[]}  filters           Filter to send into the request
 * @param {String}    filters[].name    Name of the filter
 * @param {String}    filters[].value   Value of the filter, the type can be different
 *
 * @return Promise
 */
export const getResponseTimesBuAPI = (filters = [] )=> {
  const query = queryFilter(filters);
  return instanceAxiosAPI.post('/v1/rum/board/results/slow/bucfs', query);
};

/*
 * This function gets the data for response time table by CFS
 *
 * @param {Object[]}  filters           Filter to send into the request
 * @param {String}    filters[].name    Name of the filter
 * @param {String}    filters[].value   Value of the filter, the type can be different
 *
 * @return Promise
 */
export const getResponseTimesCFSAPI = (filters = []) => {
  const query = queryFilter(filters);
  return instanceAxiosAPI.post('/v1/rum/board/results/slow/cfs', query);
};

/*
 * This function gets the data for response time table by CBP
 *
 * @param {Object[]}  filters           Filter to send into the request
 * @param {String}    filters[].name    Name of the filter
 * @param {String}    filters[].value   Value of the filter, the type can be different
 *
 * @return Promise
 */
export const getResponseTimesCBPAPI = (filters = []) => {
  const query = queryFilter(filters);
  return instanceAxiosAPI.post('/v1/rum/board/results/slow/cbp', query);
};

/*
 * This function gets the data for response time table by Operative
 *
 * @param {Object[]}  filters           Filter to send into the request
 * @param {String}    filters[].name    Name of the filter
 * @param {String}    filters[].value   Value of the filter, the type can be different
 *
 * @return Promise
 */
export const getResponseTimesOperativeAPI = (filters = []) => {
  const query = queryFilter(filters);
  return instanceAxiosAPI.post('/v1/rum/board/results/slow/operative', query);
};

/*
 * This function get excel file for response time table
 *
 * @param {Object[]}  filters           Filter to send into the request
 * @param {String}    filters[].name    Name of the filter
 * @param {String}    filters[].value   Value of the filter, the type can be different
 *
 * @return Promise
 */
export const getExcelFileResponseTime = (filters) => {
  const query = queryFilter(filters);
  return instanceAxiosAPI.post(
    '/v1/rum/board/slow/export/bucfs',
    query,
    {
      responseType: 'blob'
    }
  );
};

/*
 * This function get the excel file for response times by cfs
 *
 * @param {Object[]}  filters           Filter to send into the request
 * @param {String}    filters[].name    Name of the filter
 * @param {String}    filters[].value   Value of the filter, the type can be different
 *
 * @return Promise
 */
export const getExcelFileResponseTimeCfs = (filters) => {
  const query = queryFilter(filters);
  return instanceAxiosAPI.post(
    '/v1/rum/board/slow/export/bucfsoperative',
    query,
    {
      responseType: 'blob'
    }
  );
};

/**
 * Get daily compliance graph
 *
 * @param {object} filters - The filters to be applied to the data retrieval
 * @param {number} filters.idBU - The BU ID to filter by
 * @param {number} filters.idCFS - The CFS ID to filter by
 * @param {number} filters.idCBP - The CFP ID to filter by
 * @param {number} filters.idOperative - The operation ID to filter by
 * @param {string} filters.date - The date to filter by
 * @param {number} filters.decimals - The number of decimals to display
 * @param {boolean} filters.compliance - Whether to filter by compliance or not
 * @return {Promise}
 */
export const getDailyComplianceGraphAPI = (filters) => {
  return instanceAxiosAPI.post('/v1/rum/graph/slow/daily/unweighted', filters)
}

/**
 * Get daily cumulative compliance graph
 *
 * @param {object} filters - The filters to be applied to the data retrieval
 * @param {number} filters.idBU - The BU ID to filter by
 * @param {number} filters.idCFS - The CFS ID to filter by
 * @param {number} filters.idCBP - The CFP ID to filter by
 * @param {number} filters.idOperative - The operation ID to filter by
 * @param {string} filters.date - The date to filter by
 * @param {number} filters.decimals - The number of decimals to display
 * @param {boolean} filters.compliance - Whether to filter by compliance or not
 * @return {Promise}
 */
export const getDailyCumulativeComplianceGraphAPI = (filters) => {
  return instanceAxiosAPI.post('/v1/rum/graph/slow/daily/weighted', filters)
}
