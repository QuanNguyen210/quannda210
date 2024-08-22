import axiosClient from '../axiosClient';

const buckleTypeAPI = {
  getAll() {
    const url = 'api/buckletype/';
    return axiosClient.get(url);
  },
  getAllPhanTrang(pageNum, pageSize) {
    const url = `api/buckletype/pagination?id=${pageNum}`;
    return axiosClient.get(url, {
      params: {
        page: pageNum - 1,
        size: pageSize,
      },
    });
  },
  get(id) {
    const url = `api/buckletype?id=${id}`;
    return axiosClient.get(url);
  },
  add(data) {
    const url = `api/buckletype`;
    return axiosClient.post(url, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  },
  update(id, data) {
    const url = `api/buckletype?id=${id}`;
    return axiosClient.put(url, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  },
  updateStatus(id, status) {
    const url = `api/buckletype/update-status?id=${id}&status=${status}`;
    return axiosClient.put(url, null, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  },
  delete(id) {
    const url = `api/buckletype?id=${id}`;
    return axiosClient.delete(url);
  },
};

export default buckleTypeAPI;
