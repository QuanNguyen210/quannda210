import axiosClient from '../axiosClient';
import axiosClientNotAuth from '../axiosClientNotAuth';
import axiosCustomerAuth from '../axiosCustomerAuth';

const AuthAPI = {
  login(data) {
    const url = '/api/authentication/login-basic';

    return axiosCustomerAuth.post(url, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  },
  signup(data) {
    const url = '/api/authentication/register';

    return axiosCustomerAuth.post(url, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  },
  getCustomerToken(role) {
    const url = `/api/authentication/getUserToken?role=ROLE_CUSTOMER`;

    return axiosCustomerAuth.get(url);
  },
  getStaffToken(role) {
    const url = `/api/authentication/getUserToken?role=ROLE_STAFF`;

    return axiosClient.get(url);
  },
  validateToken(token) {
    const url = '/api/authentication/validateToken?token=' + token;

    return axiosClientNotAuth.get(url);
  },
};

export default AuthAPI;
