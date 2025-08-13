import { queryFilter } from '@/utils/requests'
import { pagination } from '@/constants/pagination'
import { instanceAxiosAPI } from '@/requests/axiosconfig'

/*
 * This function execute the request to create a Business Unit
 *
 * @param {Object} data                    Data to update the business unit
 * @param {String} data.name             Name of the Business unit
 * @param {Number} data.greographyN1Id   Geography's ID
 *
 * @return Promise
 */
export const createBusinessUnitAPI = (data) => {
  return instanceAxiosAPI.post('/v1/bu/add', data)
}

/*
 * This function execute the request to update a Business Unit
 *
 * @param {Number} id                      Business Unit's id
 * @param {Object} data                    Data to update the business unit
 * @param {String} data.name             Name of the Business unit
 * @param {Number} data.greographyN1Id   Geography's ID
 *
 * @return Promise
 */
export const updateBusinessUnitAPI = (id, data) => {
  return instanceAxiosAPI.patch(`/v1/bu/${id}`, data)
}

/*
 * This function execute the request to update status of a Business Unit
 *
 * @param {Number} id        Business Unit's id
 * @param {Boolean} active   Flag, true if it must change to active
 *
 * @return Promise
 */
export const updateStatusBusinessUnitAPI = (id, active) => {
  return instanceAxiosAPI.patch(`/v1/bu/${id}`, { active: active })
}

/*
 * This function get many Business unit
 *
 * @param {Number}    pageNumber     Page's number
 * @param {pageSize}  pageSize       Page's size
 * @param {Object[]}  filters           Filter to send into the request
 * @param {String}    filters[].name    Name of the filter
 * @param {String}    filters[].value   Value of the filter, the type can be different
 *
 * @return Promise
 */
export const getBusinessUnitsAPI = (
  pageNumber = pagination.number,
  pageSize = pagination.size,
  filters = []
) => {
  const query = queryFilter(filters, pageSize, pageNumber)
  return instanceAxiosAPI.post('/v1/bu/list', query)
}

export const getBusinessUnitAPI = (id) => {
  return instanceAxiosAPI.get(`/v1/bu/${id}`)
}

/**
 * This function fetches all Business Units without pagination.
 *
 * @return Promise
 */
export const getBuAll = () => {
  return instanceAxiosAPI.get(`v1/bu/listAll`)
}

/**
 * This function fetches all CFS associated with a specific Business Unit.
 *
 * @param {Number} id   Business Unit's ID
 *
 * @return Promise
 */
export const getCFS = (id) => {
  return instanceAxiosAPI.get(`v1/cfs/getAllByBu/${id}`)
}

/**
 * This function fetches all available environments.
 *
 * @return Promise
 */
export const getEnvironmentsByStatus = () => {
  return instanceAxiosAPI.get(`v1/catalogoEntorno/estatus/1`)
}
/**
 * This function fetches all available environments.
 *
 * @return Promise
 */
export const getEnvironments = () => {
  return instanceAxiosAPI.get(`v1/catalogoEntorno/list`)
}

/**
 * This function fetches information about a specific model by its ID.
 *
 * @param {Number} modelId   Model's ID
 *
 * @return Promise
 */
export const getInfoModel = (modelId) => {
  return instanceAxiosAPI.get(`v1/modelEEPP/getById/${modelId}`)
}

/**
 * This function searches for environments by specific filters.
 *
 * @param {Object} payload   Filters to use for the search
 *
 * @return Promise
 */
export const searchEnvironment = (payload) => {
  return instanceAxiosAPI.post(`v1/modelEEPP/getByFilters`, payload)
}

/**
 * This function fetches the service owner for a specific Business Unit.
 *
 * @param {Number} buId   Business Unit's ID
 *
 * @return Promise
 */
export const getServiceOwner = (buId) => {
  return instanceAxiosAPI.get(`v1/User/listCatalogUsersNames/${buId}`)
}

/**
 * This function searches for operative details based on a given payload.
 *
 * @param {Object} payload   Filters to use for the search
 *
 * @return Promise
 */
export const searchOperatives = (payload) => {
  return instanceAxiosAPI.post(`v1/modelEEPP/availability`, payload)
}

/**
 * This function searches for calculations validation using the provided payload.
 *
 * @param {Object} payload   Data required for validation search
 *
 * @return Promise
 */
export const searchCalculation = (payload) => {
  return instanceAxiosAPI.post(`v1/modelEEPP/getvalidationCalculation`, payload)
}

/**
 * This function downloads a validation file related to data validation.
 *
 * @param {Object} payload   Data for file download request
 *
 * @return Promise
 */
export const downloadFile = (payload) => {
  return instanceAxiosAPI.post(`v1/eepp/files/download/dataValidation`, payload, {
    responseType: 'blob'
  })
}

/**
 * This function downloads the validation file.
 *
 * @param {Object} payload   Data for file download request
 *
 * @return Promise
 */
export const downloadValidationDay = (payload) => {
  return instanceAxiosAPI.post(`v1/eepp/files/download/dailyCalculationValidation`, payload, {
    responseType: 'blob'
  })
}

/**
 * This function downloads the validation file for a specific month, including the current month.
 *
 * @param {Object} payload   Data for file download request
 *
 * @return Promise
 */
export const downloadValidationMonth = (payload) => {
  return instanceAxiosAPI.post(
    `v1/eepp/files/download/monthlyCalculationValidation/year/2025/includeCurrentMonth/true/weighted/true`,
    payload,
    { responseType: 'blob' }
  )
}

/**
 * This function adds a new modeling entry to the system.
 *
 * @param {Object} payload   Data required to add the model
 *
 * @return Promise
 */
export const addModel = (payload) => {
  return instanceAxiosAPI.post(`v1/modelEEPP/add`, payload)
}

/**
 * This function activates a specific model using the provided payload.
 *
 * @param {Object} payload   Data for activating a model
 *
 * @return Promise
 */
export const updateActive = (payload) => {
  return instanceAxiosAPI.patch(`v1/modelEEPP/update/active`, payload)
}

/**
 * This function deactivates a specific model using the provided payload.
 *
 * @param {Object} payload   Data for deactivating a model
 *
 * @return Promise
 */
export const updateInactive = (payload) => {
  return instanceAxiosAPI.patch(`v1/modelEEPP/update/inactive `, payload)
}

/**
 * This function downloads a summary report (PDF) for a specific model by its ID.
 *
 * @param {Number} id   Model's ID
 *
 * @return Promise
 */
export const downloadSummaryModel = (id) => {
  return instanceAxiosAPI.get(`v1/eepp/files/downloadPdf/${id}`, {
    responseType: 'blob',
    headers: { Accept: 'application/pdf' }
  })
}
