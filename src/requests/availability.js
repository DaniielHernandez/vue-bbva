import { queryFilter } from '../utils/requests'
import { instanceAxiosAPI } from './axiosconfig'

/**
 * This function execute the request to get the data for the daily availability
 *
 * @param {array} filters - array of filters to apply
 * @param {string} filters[].name - name of the filter
 * @param {string} filters[].value - value of the filter
 * @return {Promise} Promise that resolves to the result of the API call
 * @example
 *   getDailyAvailabilityAPI({
 *     'days': [
 *       {
 *         'dia': '01',
 *         'value': '2022-01-01'
 *       },
 *       {
 *         'dia': '02',
 *         'value': '2022-01-02'
 *       }
 *     ]
 *   })
 */
export const getDailyAvailabilityAPI = (filters = []) => {
  const query = queryFilter(filters)
  return instanceAxiosAPI.post('v1/rum/graph/unavail/daily/unweighted', query)
}

/**
 * Function to get daily cumulative availability API data.
 *
 * @param {array} filters - The filters to apply to the API request
 * @param {string} filters[].name - The name of the filter
 * @param {string} filters[].value - The value of the filter
 * @return {Promise} A Promise that resolves with the API response data
 * @example
 *   getDailyCumulativeAvailabilityAPI({
 *     'days': [
 *       {
 *         'dia': '01',
 *         'contribution': 0.0752,
 *         'accumulated': 0.0740
 *       },
 *       {
 *         'dia': '02',
 *         'contribution': 0.0742
 *         'accumulated': 0.0720
 *       }
 *     ],
 *     'summation': 0.0752,
 *     'exceedsTheGoal': true
 *   })
 */
export const getDailyCumulativeAvailabilityAPI = (filters = []) => {
  const query = queryFilter(filters)
  return instanceAxiosAPI.post('v1/rum/graph/unavail/daily/weighted', query)
}

/**
 * Function to get daily cumulative availability API data.
 *
 * @param {array} filters - The filters to apply to the API request
 * @param {string} filters[].name - The name of the filter
 * @param {string} filters[].value - The value of the filter
 * @return {Promise} A Promise that resolves with the API response data
 * @example
 *   getDailyActivityAndErrorsAPI({
 *     'days': [
 *       {
 *         'day': '01',
 *         'activities': 50,,
 *         'errors': 15
 *       },
 *       {
 *         'day': '02',
 *         'activities': 98,
 *         'errors': 30
 *       }
 *     ],
 *     'summationActivities': 128,
 *     'summationErrors': 45
 *   })
 */
export const getDailyActivityAndErrorsAPI = (filters = []) => {
  const query = queryFilter(filters)
  return instanceAxiosAPI.post('v1/rum/graph/activity/daily', query)
}

/**
 * Function to get daily cumulative availability API data.
 *
 * @param {array} filters - The filters to apply to the API request
 * @param {string} filters[].name - The name of the filter
 * @param {string} filters[].value - The value of the filter
 * @return {Promise} A Promise that resolves with the API response data
 * @example
 *   getMonthlyActivityAndErrorsAPI({
 *     'days': [
 *       {
 *         'month': 'Ene',
 *         'activities': 50,,
 *         'errors': 15
 *       },
 *       {
 *         'month': 'Feb',
 *         'activities': 98,
 *         'errors': 30
 *       }
 *     ]
 *   })
 */
export const getMonthlyActivityAndErrorsAPI = (filters = []) => {
  const query = queryFilter(filters)
  return instanceAxiosAPI.post('v1/rum/graph/activity/monthly', query)
}

/**
 * Function to get daily cumulative availability API data.
 *
 * @param {array} filters - The filters to apply to the API request
 * @param {string} filters[].name - The name of the filter
 * @param {string} filters[].value - The value of the filter
 * @return {Promise} A Promise that resolves with the API response data
 * @example
 *   getMonthlyActivityAndErrorsAPI({
 *     'days': [
 *       {
 *         'month': 'Ene',
 *         'monthly': 13.1,
 *         'accumulated': 1.23
 *       },
 *       {
 *         'month': 'Feb',
 *         'monthly': 14.5,
 *         'accumulated': 1.25
 *       }
 *     ]
 *   })
 */
export const getMonthlyCumulativeAvailabilityAPI = (filters = []) => {
  const query = queryFilter(filters)
  return instanceAxiosAPI.post('v1/rum/graph/unavail/monthly', query)
}

/**
 * Retrieves monthly impacts data from the API based on the provided filters.
 *
 * @param {Object} filters - The filters to be applied to the monthly impacts data retrieval
 * @param {Number} filters.buId - The BU ID to filter by
 * @param {Number} filters.cfsId - The CFS ID to filter by
 * @param {Number} filters.cbpId - The CFP ID to filter by
 * @param {Number} filters.operativeId - The operative ID to filter by
 * @param {String} filters.date - The date to filter by
 * @param {String} filters.ticketNumber - The number ticket to filter by
 * @param {String} filters.ticketProblem - The problem ticket to filter by
 * @param {Number} filters.pageNumber - The page number to retrieve
 * @param {Number} filters.pageSize - The page size
 * @return {Promise} A Promise that resolves to an object containing the monthly impacts data
 */
export const getMonthlyImpactsAPI = (filters) => {
  return instanceAxiosAPI.post('v1/impacts/by/channel/list', filters)
}

/**
 * Retrieves an Excel file containing monthly impacts based on the provided filters.
 *
 * @param {Object} filters - The filters to apply to the data.
 * @param {Number} filters.buId - The BU ID to filter by.
 * @param {Number} filters.cfsId - The CFS ID to filter by.
 * @param {String} filters.date - The date to filter by.
 * @return {Promise<Blob>} A Promise that resolves to a Blob object representing the Excel file.
 */
export const getExcelMonthlyImpactsAPI = (filters) => {
  return instanceAxiosAPI.get(
    `v1/impacts/by/channel/excel/impact/by/channel/${filters.buId}/${filters.cfsId}/${filters.date}`,
    {
      responseType: 'blob'
    }
  )
}
