import axiosClient from './axiosClient';

const imageAPI = {
  getAll(pageNum, pageSize) {
    const url = 'api/image/pagination';
    return axiosClient.get(url, {
      params: {
        page: pageNum - 1,
        size: pageSize,
      },
    });
  },
  upload(data) {
    const url = `api/image`;
    return axiosClient.post(url, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  },
  delete(imageId) {
    const url = `api/image?imageId=${imageId}`;
    return axiosClient.delete(url);
  },
};

export default imageAPI;
