import { queryFilter } from "@/utils/requests";
import { instanceAxiosAPI } from "./axiosconfig";
import { pagination } from '@/constants/pagination';

/**
 * Retrieves CFS impacts based on the provided ticketId.
 *
 * @param {Object} filters - The filters to apply to the request.
 * @param {number} filters.ticketId - The ID of the ticket to retrieve impacts for.
 * @param {number} filters.typeId - The ID of the ticket type to retrieve impacts for.
 * @return {Promise} A Promise that resolves with an object containing impact data.
 */
export const getCfsImpacts = (filters) => {
  return instanceAxiosAPI.post('/v1/ticket/getTicketsCfs', filters);
}

/**
 * A function to delete CFS impact based on the provided filters.
 *
 * @param {Object} filters - The filters to apply to the deletion request.
 * @param {Number} filters.impactId - The impact ID to filter by.
 * @return {Promise} A Promise that resolves with the response data from the API.
 */
export const deleteCfsImpact = async (filters) => {
  return await instanceAxiosAPI.post('/v1/ticket/deleteTicketCfs', filters);
}

/**
 * A function to update CFS impact based on the provided filters.
 *
 * @param {Object} filters - The filters to apply to the deletion request.
 * @param {Number} filters.ticketId - The ticket ID to filter by.
 * @param {Number} filters.typeTicketId - The type ticket ID to filter by.
 * @param {string} filters.symptom - The symptom to filter by.
 * @param {string} filters.originId - The origin id to filter by.
 * @param {string} filters.totalImpact - The total impact to filter by.
 * @param {string} filters.accessImpact - The access impact to filter by.
 * @param {Number} filters.cfsId - The CFS id to filter by.
 * @return {Promise} A Promise that resolves with the response data from the API.
 */
export const updateCfsImpact = async (filters) => {
  return await instanceAxiosAPI.post('/v1/ticket/updateTicketCfs', filters);
}

/**
 * Retrieves the origin data from the API.
 *
 * @return {Promise} A Promise that resolves to an object containing the origin data.
 */
export const getOriginAPI = () => {
  return instanceAxiosAPI.get('/v1/catalog/origin');
}

/*
 * This methods executes the request to get impact ticket types
 *
 * return Promise
 */
export const getTicketsTypesAPI = () => {
  return instanceAxiosAPI.get('/v1/catalog/type/ticket');
};

/*
 * This methods executes the request to get impact tickets
 *
 * @param {Number}    pageNumber     Page's number
 * @param {pageSize}  pageSize       Page's size
 * @param {Object[]}  filters           Filter to send into the request
 * @param {String}    filters[].name    Name of the filter
 * @param {String}    filters[].value   Value of the filter, the type can be different
 
 * return Promise
 */
export const getImpactTicketsAPI = (
  pageNumber = pagination.number,
  pageSize = pagination.size,
  filters = []
) => {
  const query = queryFilter(filters, pageSize, pageNumber);
  return instanceAxiosAPI.post('/v1/ticket/getTicketsBu', query);
};

/*
 * This function executes the request to get xsls file about impact tickets
 *
 * @param {Object[]}  filters           Filter to send into the request
 * @param {String}    filters[].name    Name of the filter|
 * @param {String}    filters[].value   Value of the filter, the type can be different
 *
 * @return Promise
 */
export const getExcelImpactTicketsAPI = (filters) => {
  const query = queryFilter(filters);

  return instanceAxiosAPI.post(
    '/v1/impact/ticket/excel/impact/by/ticket',
    query,
    {
      responseType: 'blob'
    }
  );
}


/*
 * This function executes the request to remove an impact ticket
 *
 * @param {Number} id Ticket's Id
 *
 * @return Promise
 */
export const removeImpactTicketAPI = (id) => {
  return instanceAxiosAPI.post( '/v1/ticket/deleteTicketBu', {id} );
};

/*
 * This function executes the request to update an impact ticket
 *
 * @param {Object}  values                  Data to be updated
 * @param {String} values.ticket             Ticket
 * @param {Number} values.typeId            Ticket's type
 * @param {Boolean} value.incidentByChange  Flag
 *
 * @return Promise
 */

export const editImpactTicketAPI = (values) => {
  return instanceAxiosAPI.post( '/v1/ticket/updateTicketBu', values);
};

/**
 * Retrieves the contribution of CFS impact based on the provided filters.
 *
 * @param {Object} filters - An array of filter objects.
 * @param {Number} filters.ticketId - The ticket ID to filter by.
 * @param {Number} filters.cfsId - The CFS ID to filter by.
 * @returns {Promise} A promise that resolves to an object containing the data of the contribution of CFS impact.
 */
export const getContributionCfsImpact = async (filters) => {
  const { ticketId, cfsId } = filters;
  return await instanceAxiosAPI.get(`/v1/ticket/contribution/modal/contributiond1/${ticketId}/${cfsId}`);
}

/**
 * Retrieve the impact of operatives based on the provided filters.
 *
 * @param {Object} filters - The filters to apply to the request.
 * @param {Number} filters.ticketId - The ticket ID to filter by.
 * @param {Number} filters.buId - The BU ID to filter by.
 * @param {Number} filters.cfsId - The CFS ID to filter by.
 * @return {Promise} A Promise that resolves with the response data from the API.
 */
export const getOperativesImpact = async (filters) => {
  return await instanceAxiosAPI.post('/v1/ticket/getTicketOpeImpac', filters);
}

/**
 * A function to delete operative impact based on the provided filters.
 *
 * @param {Object} filters - The filters to apply to the deletion request.
 * @param {Number} filters.impactId - The impact ID to filter by.
 * @param {Number} filters.operativeId - The operative ID to filter by.
 * @return {Promise} A Promise that resolves with the response data from the API.
 */
export const deleteOperativeImpact = async (filters) => {
  return await instanceAxiosAPI.post('/v1/ticket/deleteTicketOpeImpac', filters);
}
