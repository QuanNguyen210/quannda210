import axiosClient from '../axiosClient';

const brandAPI = {
  getAllPagination(pageNum, pageSize) {
    const url = 'api/brand/pagination';
    return axiosClient.get(url, {
      params: {
        page: pageNum - 1,
        size: pageSize,
      },
    });
  },
  getAll() {
    const url = 'api/brand/';
    return axiosClient.get(url, {});
  },
  get(id) {
    const url = `api/brand?id=${id}`;
    return axiosClient.get(url);
  },
  add(data) {
    const url = `api/brand`;
    return axiosClient.post(url, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  },
  update(id, data) {
    const url = `api/brand?id=${id}`;
    return axiosClient.put(url, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  },
  updateStatus(id, status) {
    const url = `api/brand/update-status?id=${id}&status=${status}`;
    return axiosClient.put(url, null, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  },
  delete(id) {
    const url = `api/brand?id=${id}`;
    return axiosClient.delete(url);
  },
};

export default brandAPI;
