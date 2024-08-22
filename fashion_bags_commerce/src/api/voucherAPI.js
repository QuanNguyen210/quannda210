import axiosClient from './axiosClient';

const voucherAPI = {
  getAll(pageNum, pageSize) {
    const url = 'api/voucher/pagination';
    return axiosClient.get(url, {
      params: {
        page: pageNum - 1,
        size: pageSize,
      },
    });
  },
  get(id) {
    const url = `api/voucher?id=${id}`;
    return axiosClient.get(url);
  },
  findByVoucherCode(voucherCode) {
    const url = `api/voucher/findByVoucherCode?voucherCode=${voucherCode}`;
    return axiosClient.get(url);
  },
  add(data) {
    const url = `api/voucher`;
    return axiosClient.post(url, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  },
  update(id, data) {
    const url = `api/voucher?id=${id}`;
    return axiosClient.put(url, data);
  },
  updateStatus(id, status) {
    const url = `api/voucher/update-status?id=${id}&status=${status}`;
    return axiosClient.put(url, null, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  },
  updateAmountBeforeAplied(voucherId, amount) {
    const url = `api/voucher/update-amount?voucherId=${voucherId}&amount=${amount}`;
    return axiosClient.put(url, null, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  },
  delete(id) {
    const url = `api/voucher?id=${id}`;
    return axiosClient.delete(url);
  },
};

export default voucherAPI;
