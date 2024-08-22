import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import Constants from '~/Utilities/Constants';
const CryptoJS = require('crypto-js');
export const getUserToken = () => {
  const userToken = JSON.parse(localStorage.getItem('usersTokenString'));
  return userToken || null;
};

export const getStaffIdUser = () => {
  const userToken = getStaffDetailUser();
  return userToken?.idUser || null;
};
export const getCustomerIdUser = () => {
  const userToken = getCustomerDetailUser();
  return userToken?.idUser || null;
};

export const getStaffToken = () => {
  const token = localStorage.getItem('staffToken');
  return token || null;
};
export const getCustomerToken = () => {
  const token = localStorage.getItem('customerToken');
  return token || null;
};

export const getStaffDetailUser = () => {
  const token = getStaffToken();
  return token ? jwtDecode(token) : null;
};
export const getCustomerDetailUser = () => {
  const token = getCustomerToken();
  return token ? jwtDecode(token) : null;
};
export const getCustomer = () => {
  const customerString = CryptoJS.AES.decrypt(localStorage.getItem('customerDecodeString'), Constants.key).toString(
    CryptoJS.enc.Utf8,
  );
  if(customerString==null){
    return null;
  }
  return customerString ? JSON.parse(customerString) : null;
};

export const getStaff = () => {
  const stringUserInfo = localStorage.getItem('staffDecodeString');
  if (stringUserInfo === null) {
    return null;
  }
  const staffString = CryptoJS.AES.decrypt(stringUserInfo, Constants.key).toString(CryptoJS.enc.Utf8);

  return staffString ? JSON.parse(staffString) : null;
};

export const covertObjectToDecode = (object) => {
  const userString = JSON.stringify(object);

  const decodeString = CryptoJS.AES.encrypt(userString, Constants.key).toString();

  return decodeString;
};

