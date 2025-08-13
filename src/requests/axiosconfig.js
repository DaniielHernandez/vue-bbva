import axios from 'axios';

/*
 * Add intance and configuration initial for axios
 */
export const instanceAxiosAPI = axios.create({
  baseURL: `/gateway/service-level-plat/`,
  headers: {
    "Content-Type": "application/json", Accept: "application/json",
  },
});

export default instanceAxiosAPI;
