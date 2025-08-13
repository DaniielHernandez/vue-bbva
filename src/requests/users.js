import { instanceAxiosAPI } from "./axiosconfig";
import { queryFilter } from "@/utils/requests";
import { pagination } from '@/constants/pagination';

/*
 * This function execute the request to create an user
 *
 * @param {Object} data                   Data to update the user
 * @param {String} data.employeeId       Employee's ID
 * @param {String} data.fullName  Employee's name
 * @param {String} data.email             Employee's email
 * @param {Number} data.buId             Business unit's ID
 * @param {Number} data.areaId           Area's ID
 * @param {Number} data.rolId            Role's ID
 * @param {Number} data.profileId         Profile's ID
 * @param {Number} data.geographyN1Id   Geography's ID
 * @param {Boolean} data.active           Flag, true if thye employee is active
 *
 * @return Promise
 */
export const createUserAPI = (data) => {
  return instanceAxiosAPI.post( '/v1/User/add', data );
};

/*
 * This function execute the request to create an user
 *
 * @param {Object} data                   Data to update the user
 * @param {String} data.employeeId       Employee's ID
 * @param {String} data.fullName  Employee's name
 * @param {String} data.email             Employee's email
 * @param {Number} data.buId             Business unit's ID
 * @param {Number} data.areaId           Area's ID
 * @param {Number} data.rolId            Role's ID
 * @param {Number} data.profileId         Profile's ID
 * @param {Number} data.geographyN1Id   Geography's ID
 * @param {Boolean} data.active           Flag, true if thye employee is active
 *
 * @return Promise
 */
export const updateUserAPI = (id, data) => {
  return instanceAxiosAPI.patch( `/v1/User/update/${id}`, data );
};

/*
 * This function update the user's status
 *
 * @param {Number}  id      User's id
 * @param {Boolean} active  Flag, true if the user change status to active 
 *
 * @return Promise
 */
export const updateStatusUsersAPI = (ids, active) => {
  const employeeIds = ids.map((item) => parseInt(item) );
  return instanceAxiosAPI.post(
    '/v1/User/changeStatus',
    { employeeId:  employeeIds, active: active }
  )
};

/*
 * This function get many users
 *
 * @param {Number}    pageNumber        Page's number
 * @param {pageSize}  pageSize          Page's size
 * @param {Object[]}  filters           Filter to send into the request
 * @param {String}    filters[].name    Name of the filter
 * @param {String}    filters[].value   Value of the filter, the type can be different
 *
 * @return Promise
 */
export const getUsersAPI = (
  pageNumber = pagination.number,
  pageSize = pagination.size,
  filters = []
) => {
  const query = queryFilter(filters, pageSize, pageNumber);
  
  return instanceAxiosAPI.post('/v1/User/list', query);
};

/*
 * This method get all the user's name
 *
 * @return Promise
 */
export const getListUserNamesAPI = () => {
  return instanceAxiosAPI.get('/v1/User/listUserNames');
};
