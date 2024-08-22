import axiosClient from './axiosClient';

const staffAPI = {


  getAll(pageNum, pageSize) {
    const url = 'api/staff/pagination';
    return axiosClient.get(url, {
      params: {
        page: pageNum - 1,
        size: pageSize,
      },
    });
  },
  getAllStaffs() {
    const url = 'api/staff/get-all';
    return axiosClient.get(url);
  },
  getAlls(search, status, gender, role, pageNum, pageSize) {
    const url = 'api/staff/pagination';
    return axiosClient.get(url, {
      params: {
        search: search,
        status: status,
        gender: gender,
        role: role,
        page: pageNum - 1,
        size: pageSize,
      },
    });
  },

  getAllStaff(search, pageNum, pageSize) {
    const url = 'api/staff/pagination';
    return axiosClient.get(url, {
      params: {
        search: search,
        page: pageNum - 1,
        size: pageSize,
      },
    });
  },
  getSearchPagination(key, pageNum, pageSize) {
    const url = 'api/staff/search';
    return axiosClient.get(url, {
      params: {
        keyword: key,
        page: pageNum - 1,
        size: pageSize,
      },
    });
  },
  findByEmail(email) {
    const url = `api/staff/findByEmail?email=${email}`;
    return axiosClient.get(url);
  },
  findByPhoneNumber(phoneNumber) {
    const url = `api/staff/findByPhoneNumber?phoneNumber=${phoneNumber}`;
    return axiosClient.get(url);
  },

  getRoles(params) {
    const url = 'api/role/';
    return axiosClient.get(url, { params });
  },
  get(id, data) {
    const url = `api/staff?id=${id}`;
    return axiosClient.get(url, data);
  },
  getOne(id, data) {
    const url = `api/staff?id=${id}`;
    return axiosClient.get(url, data);
  },
  add(data) {
    const url = `api/staff`;
    return axiosClient.post(url, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  },
  signup(data) {
    const url = `api/staff/signup`;
    return axiosClient.post(url, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  },
  update(id, data) {
    const url = `api/staff?id=${id}`;
    return axiosClient.put(url, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  },
  staffUpdate(data) {
    const url = `api/staff/update`;
    return axiosClient.put(url, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  },
  updatePassword(staffId, password) {
    const url = `api/staff/forget-password?staffId=${staffId}&password=${password}`;
    return axiosClient.put(url, null, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  },
  updateStatus(id, status) {
    const url = `api/staff/update-status?id=${id}&status=${status}`;
    return axiosClient.put(url, null, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  },
  delete(id) {
    const url = `api/staff?id=${id}`;
    return axiosClient.delete(url);
  },
  findByUserId(userId) {
    const url = `api/staff/findByUserId?userId=${userId}`;
    return axiosClient.get(url);
  },
};

export default staffAPI;
