import { instanceAxiosAPI } from './axiosconfig.js';
import { queryFilter } from '@/utils/requests';
import { pagination } from '@/constants/pagination';
import { replaceKey } from "@/utils/general";
/*
 * This method get setup alerts
 *
 * @return Promise
 */
export const getSetupAlertsAPI = (
  pageNumber = pagination.number,
  pageSize = pagination.size,
  filters = []
) => {
  const query = queryFilter(filters, pageSize, pageNumber);

  replaceKey(query, 'cfsId', 'modelId');
  return instanceAxiosAPI.post('/v1/alert/list', query);
}

/*
 * This method get all elements to alert
 *
 * @return Promise
 */
export const getElementsToAlertAPI = () => {
  return instanceAxiosAPI.get('/v1/alert/catalog/element/to/alert');
}

/*
 * This method get all operators
 *
 * @return Promise
 */
export const getOperatorsAPI = () => {
  return instanceAxiosAPI.get('/v1/alert/catalog/operator');
};

/*
 * This method get all executions periods
 *
 * @return Promise
 */
export const getExecutionPeriodAPI = () => {
  return instanceAxiosAPI.get('/v1/alert/catalog/execution/periodicity');
};

/*
 * This method get all time periods
 *
 * @return Promise
 */
export const getTimePeriodsAPI = () => {
  return instanceAxiosAPI.get('/v1/alert/catalog/time/periods');
};

/*
 * This method subscribe a setup alert
 *
 * @param {number} idAlert Setup alert's
 * @param {boolean} subscribe Flag, true is you mus be subscribed to the alert
 *
 * @return Promise
 */
export const subscribeSetupAlertAPI = (alertId, subscribe) => {
  return instanceAxiosAPI.post('v1/alert/subscribe', { alertId, subscribe });
};

/*
 * This method activate/deactiva a setup alert
 *
 * @param {number} idAlert Setup alert's id
 * @param {boolean} active Flag, true is setup alert must be active 
 *
 * @return Promise
 */
export const activateSetupAlertAPI = (id, active) => {
  return instanceAxiosAPI.post('/v1/alert/toggle', { id, active });
};

/*
 * This method deletes a setup alert
 *
 * @param {number} id Setup alert's
 *
 * @return Promise
 */
export const deleteSetupAlertAPI = (id) => {
  return instanceAxiosAPI.delete(`v1/alert/delete/${id}`);
};

/*
 * This method executes a setup alert
 *
 * @param {Object} data Setup alert's
 *
 * @return Promise
 */
export const executeSetupAlertAPI = (data) => {
  return instanceAxiosAPI.post('v1/alert/run', data);
};

/*
 * This method get a setup alert
 *
 * @param {number} id Setup alert's
 *
 * @return Promise
 */
export const getSetupAlertAPI = (id) => {
  return instanceAxiosAPI.post('/v1/alert/list', { id });
};

/*
 * Searches alert notifications using different filters
 *
 * @return Promise
 */
export const getAlertNotificationsListAPI = (
  pageNumber = pagination.number,
  pageSize = pagination.size,
  filters = []
) => {
  const query = queryFilter(filters, pageSize, pageNumber);
  return instanceAxiosAPI.post('/v1/notification/list', query);
};

/*
 * Searches alert notifications using different filters
 *
 * @return Promise
 */
export const getUnattendedAlertNotificationsListAPI = (
  pageNumber = pagination.number,
  pageSize = pagination.size,
  filters = []
) => {
  const query = queryFilter(filters, pageSize, pageNumber);
  return instanceAxiosAPI.post('v1/notification/unattended/list', query);
};

/*
 * Marks an alert as "attended" 
 * 
 * @param {number} id The alert ID
 * 
 * @return Promise
 */
export const setAlertAsAttended = (id) => {
  return instanceAxiosAPI.get(`v1/notification/attend/${id}`);
};

/*
 * It creates a setup alert
 *
 * @return Promise
 */
export const createSetupAlertAPI = (data) => {
  return instanceAxiosAPI.post('/v1/alert/add', data);
}

/*
 * It updates a setup alert
 *
 * @return Promise
 */
export const updateSetupAlertAPI = (id, data) => {
  return instanceAxiosAPI.patch('/v1/alert/update', { id, ...data });
}

/*
 * Gets the alert's authors list
 * 
 * @return Promise
 */
export const getAlertAuthors = () => {
  return instanceAxiosAPI.get('v1/author/in/alerts');
};

/*
 * Gets the user's notification amount
 * 
 * @return Promise
 */
export const getNotificationCount = () => {
  return instanceAxiosAPI.get('v1/notification/number');
};

export const downloadNotificactionAPI = (id) => {
  return instanceAxiosAPI.get(
    `v1/notification//ticket/agata/export/${id}`,
    {
      responseType: 'blob'
    }
  );
};
