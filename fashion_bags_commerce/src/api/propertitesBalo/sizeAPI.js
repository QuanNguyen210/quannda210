import axiosClient from '../axiosClient';

const sizeAPI = {
  getAllPaginantion(pageNum, pageSize) {
    const url = 'api/size/pagination';
    return axiosClient.get(url, {
      params: {
        page: pageNum - 1,
        size: pageSize,
      },
    });
  },
  getAll() {
    const url = 'api/size/';
    return axiosClient.get(url, {});
  },
  get(id) {
    const url = `api/size?id=${id}`;
    return axiosClient.get(url);
  },
  add(data) {
    const url = `api/size`;
    return axiosClient.post(url, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  },
  update(id, data) {
    const url = `api/size?id=${id}`;
    return axiosClient.put(url, data);
  },
  updateStatus(id, status) {
    const url = `api/size/update-status?id=${id}&status=${status}`;
    return axiosClient.put(url, null, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  },
  delete(id) {
    const url = `api/size?id=${id}`;
    return axiosClient.delete(url);
  },
};

export default sizeAPI;
