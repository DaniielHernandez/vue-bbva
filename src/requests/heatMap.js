import { queryFilter } from "@/utils/requests";
import { instanceAxiosAPI } from "./axiosconfig";
import { getDayFromString } from  '@/utils/general';
import { translateFilters } from '@/utils/serviceLevels';

/*
 * This function executes the request to get data to use by heat map
 *
 * @param {Object[]}  filters           Filter to send into the request
 * @param {String}    filters[].name    Name of the filter|
 * @param {String}    filters[].value   Value of the filter, the type can be different
 *
 * @return Promise
 */
export const getHeatMapAPI = (filters) => {
  const query = queryFilter( translateFilters(filters) );

  return instanceAxiosAPI.post( '/v1/rum/heatmap', query );
}

/*
 * This function executes the request to get data to use by heat map over the footer table
 *
 * @param {Object[]}  filters           Filter to send into the request
 * @param {String}    filters[].name    Name of the filter|
 * @param {String}    filters[].value   Value of the filter, the type can be different
 *
 * @return Promise
 */
export const getHeatMapFooterAPI = (filters) => {
  const query = queryFilter( translateFilters(filters) );

  return instanceAxiosAPI.post( '/v1/rum/heatmap/footer', query );
}
/*
 * This function executes the request to get data to use by every ceil in heat map
 *
 * @param {Object[]}  filters           Filter to send into the request
 * @param {String}    filters[].name    Name of the filter|
 * @param {String}    filters[].value   Value of the filter, the type can be different
 *
 * @return Promise
 */
export const getHeatMapDetailAPI = (filters) => {
  const query = queryFilter( translateFilters(filters) );

  return instanceAxiosAPI.post( 'v1/rum/heatmap/tooltip', query );
}

/*
 * This function executes the request to get a file
 *
 * @param {Object[]}  filters           Filter to send into the request
 * @param {String}    filters[].name    Name of the filter
 * @param {String}    filters[].value   Value of the filter, the type can be different
 *
 * @return Promise
 */
export const getExcelFileHeatMap = (filters) => {
  const query = queryFilter( translateFilters(filters) );
  return instanceAxiosAPI.post(
    '/v1/rum/heatmap/export',
    query,
    {
      responseType: 'blob'
    }
  );
}
