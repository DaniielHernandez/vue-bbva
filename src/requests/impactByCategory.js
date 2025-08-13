import { queryFilter } from "@/utils/requests";
import { instanceAxiosAPI } from "./axiosconfig";

/*
 * This methods executes the request to get impacts by category
 *
 * @param {Object[]}  filters           Filter to send into the request
 * @param {String}    filters[].name    Name of the filter
 * @param {String}    filters[].value   Value of the filter, the type can be different
 
 * return Promise
 */
export const getAvailabilityByPeriodAPI = (
  filters = []
) => {
  const query = queryFilter(filters);
  return instanceAxiosAPI.post('v1/impacts/distribution/period/availability', query);
};


/*
 * This methods executes the request to get impacts by category
 *
 * @param {Object[]}  filters           Filter to send into the request
 * @param {String}    filters[].name    Name of the filter
 * @param {String}    filters[].value   Value of the filter, the type can be different
 
 * return Promise
 */
export const getImpactsByCategoryAPI = (
  filters = []
) => {
  const query = queryFilter(filters);
  return instanceAxiosAPI.post('/v1/impacts/distribution/category', query);
};

/*
 * This methods executes the request to get impacts by category
 *
 * @param {Object[]}  filters           Filter to send into the request
 * @param {String}    filters[].name    Name of the filter
 * @param {String}    filters[].value   Value of the filter, the type can be different
 
 * return Promise
 */
export const getImpactsBySubcategoryAPI = (
  filters = []
) => {
  const query = queryFilter(filters);
  return instanceAxiosAPI.post('/v1/impacts/distribution/subcategory', query);
};


/*
 * This function executes the request to get xsls file about impacts
 *
 * @param {Object[]}  filters           Filter to send into the request
 * @param {String}    filters[].name    Name of the filter|
 * @param {String}    filters[].value   Value of the filter, the type can be different
 *
 * @return Promise
 */
export const getExcelImpactsByCategoryAPI = (filters) => {
  const query = queryFilter(filters);

  return instanceAxiosAPI.post(
    '/v1/impacts/distribution/excel/impact/by/category',
    query,
    {
      responseType: 'blob'
    }
  );
}
