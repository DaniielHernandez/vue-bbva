import { instanceAxiosAPI } from "./axiosconfig";
import { queryFilter } from "@/utils/requests";
import { pagination } from '@/constants/pagination';

/*
 * This function execute the request to creates a dashboard
 *
 * @param {Object} data                              Data to update the Dashboard
 * @param {Number} year                              Data's year
 * @param {Number} data.partnershipId               Partnership's ID
 * @param {Number} data.geographyN1Id              Geography's ID
 * @param {Number} data.statusModelId            Model status's ID
 * @param {String} data.dateLastUpdate   Date of last update
 * @param {Number} data.criticalityId                Criticality's ID
 * @param {Number} data.statusMeasurementId          Status easurement's ID
 * @param {String} data.dashboardName             Dashboard's name
 * @param {Number} data.buId                        Business unit's ID
 * @param {Number[]} data.roles                      Arra with th roles's IDs
 *
 * @return Promise
 */
export const createDashboardAPI = (data) => {
  return instanceAxiosAPI.post( '/v1/dashboard/add', data );
};

/*
 * This function execute the request to update a dashboard
 *
 * @param {Number} id                                Dashboard's ID
 * @param {Object} data                              Data to update the Dashboard
 * @param {Number} year                              Data's year
 * @param {Number} data.partnershipId               Partnership's ID
 * @param {Number} data.geographyN1Id              Geography's ID
 * @param {Number} data.statusModelId            Model status's ID
 * @param {String} data.dateLastUpdate   Date of last update
 * @param {Number} data.criticalityId                Criticality's ID
 * @param {Number} data.statusMeasurementId          Status easurement's ID
 * @param {String} data.dashboardName             Dashboard's name
 * @param {Number} data.buId                        Business unit's ID
 * @param {Number[]} data.roles                      Arra with th roles's IDs
 *
 * @return Promise
 */
export const updateDashboardAPI = (id, data) => {
  return instanceAxiosAPI.patch( `/v1/dashboard/update/${id}`, data );
};

/*
 * This metghod removes the dashboard
 * @param {Number} id   Dashboard's ID
 *
 * @return Promise
 */
export const removeDashboardAPI = (id) => {
  return instanceAxiosAPI.delete( `/v1/dashboard/${id}`);
};

/*
 * This method executes the requests to get a dashboard
 *
 * @param {Number}    pageNumber     Page's number
 * @param {pageSize}  pageSize       Page's size
 * @param {Object[]}  filters           Filter to send into the request
 * @param {String}    filters[].name    Name of the filter
 * @param {String}    filters[].value   Value of the filter, the type can be different
 *
 * @return Promise
 */
export const getDashboardsAPI = (
  pageNumber = pagination.number,
  pageSize = pagination.size,
  filters = []
) => {
  const query = queryFilter(filters, pageSize, pageNumber);

  return instanceAxiosAPI.post('/v1/dashboard/list', query);
};

/*
 * This method executes the request to get dashboards by the user that makes the requests
 * @return Promise
 */
export const getDashboardByUserAPI = () => {
 return instanceAxiosAPI.get('/v1/dashboard/listbyuser');
};
