import axiosClient from '../axiosClient';

const typeAPI = {
  getAll(params) {
    const url = 'api/type/';
    return axiosClient.get(url, { params });
  },
  getAllPhanTrang(pageNum, pageSize) {
    const url = `api/type/pagination`;
    return axiosClient.get(url, {
      params: {
        page: pageNum - 1,
        size: pageSize,
      },
    });
  },
  get(id) {
    const url = `api/type?id=${id}`;
    return axiosClient.get(url);
  },
  add(data) {
    const url = `api/type`;
    return axiosClient.post(url, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  },
  update(id, data) {
    const url = `api/type?id=${id}`;
    return axiosClient.put(url, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  },
  updateStatus(id, status) {
    const url = `api/type/update-status?id=${id}&status=${status}`;
    return axiosClient.put(url, null, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  },
  delete(id) {
    const url = `api/type?id=${id}`;
    return axiosClient.delete(url);
  },
};

export default typeAPI;
