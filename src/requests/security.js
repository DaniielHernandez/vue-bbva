import { instanceAxiosAPI }  from './axiosconfig.js';

/*
 * This method execute the request to check if ther user has access to some path
 *
 * @param {String} path  Path to check the permission
 *
 * @return Promise
 */
export const checkPermissionAPI = (path) => {
  return instanceAxiosAPI.post('/v1/User/checkPermission', {path});
};
