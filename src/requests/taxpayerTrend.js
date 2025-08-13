import { instanceAxiosAPI } from './axiosconfig'

/**
 * Retrieves the tax payer trend data goal from the API.
 *
 * @param {Object} filters - The filters to apply to the tax payer trend data retrieval.
 * @param {Number} filters.buId - The BU ID to filter by.
 * @param {Number} filters.cfsId - The CFS ID to filter by.
 * @return {Promise} A Promise that resolves to an object containing the tax payer trend data goal.
 */
export const getTaxpayerTrendGoal = async (filters) => {
  const { buId, cfsId } = filters
  return await instanceAxiosAPI.get(`/v1/taxpayer/trend/channel/goal/month/${buId}/${cfsId}`)
}

/**
 * Retrieves the tax payer trend data graph from the API.
 *
 * @param {Object} filters - The filters to apply to the tax payer trend data retrieval.
 * @param {Number} filters.buId - The BU ID to filter by.
 * @param {Number} filters.cfsId - The CFS ID to filter by.
 * @param {Number} filters.year - The year to filter by.
 * @param {Number} filters.month - The month to filter by.
 * @return {Promise} A Promise that resolves to an object containing the tax payer trend data graph.
 */
export const getTaxpayerTrendDataGraph = async (filters) => {
  const { buId, cfsId, year, month } = filters
  return await instanceAxiosAPI.get(`/v1/taxpayer/trend/channel/${buId}/${cfsId}/${year}/${month}`)
}

/**
 * Retrieves the tax payer trend data unavailability from the API.
 *
 * @param {Object} filters - The filters to be applied to the data retrieval
 * @param {Number} filters.buId - The BU ID to filter by
 * @param {Number} filters.cfsId - The CFS ID to filter by
 * @param {Number} filters.year - The year to filter by
 * @param {Number} filters.month - The month to filter by
 * @returns {Promise} - A promise that resolves to an object containing the tax payer trend data unavailability
 */
export const getTaxpayerTrendUnavailability = async (filters) => {
  const { buId, cfsId, year, month } = filters
  return await instanceAxiosAPI.get(
    `/v1/taxpayer/trend/channel/unavailability/${buId}/${cfsId}/${year}/${month}`
  )
}
