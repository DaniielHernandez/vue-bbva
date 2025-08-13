import { instanceAxiosAPI } from './axiosconfig'
/**
 * Retrieves the event map data from the API.
 * @param {Object} filters
 * @param {String} filters.buId - The ID of the business unit
 * @param {String} filters.date - The date of the event
 * @param {Array} filters.ticketTypeIds - The IDs of the tickets types
 * @param {Array} filters.criticalityIds - The IDs of the criticalities
 * @param {Array} filters.originIds - The IDs of the origins
 * @param {String} filters.sort - The sort order
 * @param {String} filters.sortBy - The sort field
 * @param {Number} filters.sortByCfsId - The sort field for CFS
 *
 * @return {Promise} A Promise that resolves to an object containing the event map data.
 */
export const getEventMapAPI = (filters) => {
  return instanceAxiosAPI.post('/v1/map/event/list', filters)
}


/**
 * Retrieves the excel event map data from the API.
 * @param {Object} filters
 * @param {String} filters.buId - The ID of the business unit
 * @param {String} filters.date - The date of the event
 * @param {Array} filters.ticketTypeIds - The IDs of the tickets types
 * @param {Array} filters.criticalityIds - The IDs of the criticalities
 * @param {Array} filters.originIds - The IDs of the origins
 * @param {String} filters.sort - The sort order
 * @param {String} filters.sortBy - The sort field
 * @param {Number} filters.sortByCfsId - The sort field for CFS
 *
 * @return {Promise} A Promise that resolves to an object containing the event map data.
 */
export const getExcelEventMapAPI = (filters) => {
  return instanceAxiosAPI.post('/v1/map/event/excel', filters, {
    responseType: 'blob'
  })
}
