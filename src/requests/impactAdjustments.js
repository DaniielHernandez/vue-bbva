import { queryFilter } from "@/utils/requests";
import { instanceAxiosAPI } from "./axiosconfig";
import { pagination } from '@/constants/pagination';
import { replaceKey } from '@/utils/general.js';

/**
 * This function executes the request to get data for impact adjustments table
 *
 * @param {Number}    pageNumber     Page's number
 * @param {pageSize}  pageSize       Page's size
 * @param {Object[]}  filters           Filter to send into the request
 * @param {String}    filters[].name    Name of the filter|
 * @param {String}    filters[].value   Value of the filter, the type can be different
 *
 * @return Promise
 */
export const getImpactAdjustmentsAPI = (
  pageNumber = pagination.number,
  pageSize = pagination.size,
  filters = []
) => {
  const query = queryFilter(filters, pageSize, pageNumber);
  return instanceAxiosAPI.post('/v1/impact/adjustments/list', query);
}

/**
 * This function executes the request to get data showan adjustment
 *
 * @param {Number}    id     Adjustment's id
 *
 * @return Promise
 */
export const getImpactAdjustmentAPI = (id) => {
  return instanceAxiosAPI.get(`/v1/impact/adjustments/adjustment/${id}`);
}

/**
 * This function executes the request to remove an adjustment
 *
 * @param {Number}    id     Adjustment's id
 *
 * @return Promise
 */
export const revertImpactAdjustmentAPI = (id) => {
  return instanceAxiosAPI.delete(`/v1/impact/adjustments/revert/${id}`);
}

/**
 * This function executes the request to associate ticket to an adjustment
 *
 * @param {Object}  data              Ticket's data
 * @param {String}  data.ticketId      Ticket
 * @param {Number}  data.buId         BU's id
 * @param {String}  data.description  Ticket's description
 * @param {Number}  data.adjustmentId Adjustment's id
 *
 * @return Promise
 */
export const associateTicketAPI = (data) => {
  return instanceAxiosAPI.post('/v1/ticket/adjustment/associate', data);
}

/**
 * This function executes the request to create a ticket
 *
 * @param {Object}  data              Ticket's data
 * @param {String}  data.ticketId      Ticket
 * @param {Number}  data.buId         BU's id
 * @param {String}  data.description  Ticket's description
 * @param {Number}  data.adjustmentId Adjustment's id
 *
 * @return Promise
 */
export const createTicketAPI = (data) => {
  return instanceAxiosAPI.post('/v1/ticket/adjustment/create', data);
}

/**
 * This function executes the request to search a ticket
 *
 * @param {String}  ticketId        Ticket
 * @param {Number}  buId           BI's id
 *
 * @return Promise
 */
export const searchTicketAPI = (ticketId, buId) => {
  return instanceAxiosAPI.get(`v1/ticket/adjustment/search/${buId}/${ticketId}`)
}

/**
 * This function executes the request to get xsls file about impact adjustments
 *
 * @param {Object[]}  filters           Filter to send into the request
 * @param {String}    filters[].name    Name of the filter|
 * @param {String}    filters[].value   Value of the filter, the type can be different
 *
 * @return Promise
 */
export const getExcelImpactAdjustmentsAPI = (filters) => {
  const query = queryFilter(filters);

  return instanceAxiosAPI.post(
    '/v1/impact/adjustments/export/excel/adjustments',
    query,
    {
      responseType: 'blob'
    }
  );
}

/**
 * Get operations by CFS ID.
 *
 * @param {Object} filters - The filters to apply to the operations.
 * @param {Number} filters.cfsId - The CFS ID to filter by.
 * @return {Promise} A promise that resolves to an object containing CFS and operations.
 */
export const getOperationsByCfsId = (filters) => {
  const query = {...filters};
  replaceKey(query, 'cfsId', 'modelId');
  return instanceAxiosAPI.post('v1/model/operatives/channel', query);
}

/**
 * Get similar impact days based on the provided filters.
 *
 * @param {Object} filters - The filters to apply for retrieving similar impact days.
 * @param {Number} filters.buId - The BU ID to filter by.
 * @param {Date} filters.date - The date to filter by.
 * @return {Promise} A promise that resolves with an object containing the similar impact days.
 */
export const getSimilarImpactDays = (filters) => {
  return instanceAxiosAPI.get(`v1/day/similar/days/${filters.date}/${filters.buId}`)
}

/**
 * Retrieves impact graph data based on the provided filters.
 *
 * @param {object} filters - The filters to be applied to the data retrieval
 * @param {number} filters.cfsId - The CFS ID to filter by
 * @param {number} filters.cbpId - The CFP ID to filter by
 * @param {number} filters.operationId - The operation ID to filter by
 * @param {number} filters.interval - The interval to filter by
 * @param {string} filters.elements - The elements to filter by
 * @param {object} filters.time - The time range to filter by
 * @param {string} filters.time.start - The start time of the time range
 * @param {string} filters.time.end - The end time of the time range
 * @param {array} filters.days - The days to filter by
 * @return {Promise} A promise that resolves with the impact graph data
 */
export const getImpactGraphData = (filters) => {
  return instanceAxiosAPI.post('v1/rum/graph/adjustment/5/min/operative', filters)
}

/**
 * Retrieves scenarios from the server.
 *
 * @return {Promise} An array of scenarios with their ids and names.
 */
export const getScenarios = () => {
  return instanceAxiosAPI.get('v1/impact/adjustments/scenarios')
}

/**
 * @param {Object} filters - The filters to apply for creating the adjustment impact.
 * @param {Number} filters.idScenery - The ID of the scenery to use.
 * @param {Number} filters.buId - The ID of the BU to use.
 * @param {Number} filters.cfsId - The ID of the CFS to use.
 * @param {Array} filters.operativesIds - The IDs of the operations to use.
 * @param {Array} filters.similarDays - The days to use.
 * @param {Array} filters.timezones - The timezones to use.
 * @param {Boolean} filters.timezones.normalize - The normalization of the timezones.
 * @param {String} filters.timezones.description - The description of the timezones.
 * @param {Date} filters.timezones.date.start - The start date of the timezones.
 * @param {Date} filters.timezones.date.end - The end date of the timezones.
 * @param {Date} filters.time - The time to use.
 * @param {String} filters.time.start - The start time of the time.
 * @param {String} filters.time.end - The end time of the time.
 * @param {Date} filters.date - The date to use.
 * @param {String} filters.date.start - The start date of the date.
 * @param {String} filters.date.end - The end date of the date.
 * @return {Promise} A Promise that resolves to an object containing the created adjustment impact data.
 */
export const createAdjustmentImpact = (filters) => {
  const query = {...filters};
  replaceKey(query, 'cfsId', 'modelId');
  return instanceAxiosAPI.post('v1/impact/adjustments/add', query)
}

/**
 * Retrieves the summary of impact adjustments.
 *
 * @return {Promise} A Promise that resolves to an object containing the impact adjustments summary.
 */
export const getImpactAdjustmentsSummary = () => {
  return instanceAxiosAPI.get('v1/impact/adjustments/list/today/by/user')
}
