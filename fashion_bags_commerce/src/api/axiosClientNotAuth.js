import axios from 'axios';
import { getToken } from './auth/helper/UserCurrent';

const axiosClientNotAuth = axios.create({
  baseURL: 'http://localhost:8080/',
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
  },
});

//interceptor
// Add a request interceptor
axiosClientNotAuth.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  },
);

// Add a response interceptor
axiosClientNotAuth.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    // if (error.response && (error.response.status === 401 || error.response.status === 403)) {
    //   window.location.href = '/not-found';
    // }
    return Promise.reject(error);
  },
);

export default axiosClientNotAuth;
