import axiosClient from './axiosClient';

const billDetailsAPI = {
  getAll(pageNum, pageSize) {
    const url = 'api/bill-details/';
    return axiosClient.get(url, {
      params: {
        page: pageNum - 1,
        size: pageSize,
      },
    });
  },
  get(id) {
    const url = `api/billDetails?id=${id}`;
    return axiosClient.get(url);
  },
  getAllByBillId(billId, status) {
    const url = `api/bill-detail/getBillDetailsByBillIdOfQuan?billId=${billId}&status=${status}`;
    return axiosClient.get(url);
  },
  getBillDetailsByBillIdUpdateAmount(billId) {
    const url = `api/bill-detail/getBillDetailsByBillIdUpdateAmount?billId=${billId}`;
    return axiosClient.get(url);
  },

  getAllBillDetailsError(
    loaiHoaDon,
    filterStaffCode,
    startDate,
    endDate,
    status,
    search,
    pageNum,
    pageSize,
    customerId,
    sortList,
    sortOrder,
    sortListPlaceHolder
  ) {
    const url = 'api/bill-detail/getBillDetailsByBillIdNotStatus';
    return axiosClient.get(url, {
      params: {
        loaiHoaDon: loaiHoaDon,
        staffId: filterStaffCode,
        startDate: startDate,
        endDate: endDate,
        search: search,
        status: status,
        page: pageNum - 1,
        size: pageSize,
        customerId: customerId,
        sortList: sortList,
        sortOrder: sortOrder,
        sortListPlaceHolder: sortListPlaceHolder
      },
    });
  },
  add(data) {
    const url = `api/bill-details`;
    return axiosClient.post(url, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  },
  update(data) {
    const url = `api/billDetails?id=${data.id}`;
    return axiosClient.put(url, data);
  },
  updateAmountProductDetail(billDetailId, amount) {
    const url = `api/bill-detail/update-amount-product-detail?billDetailId=${billDetailId}&amount=${amount}`;
    return axiosClient.put(url, null, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  },
  updateAmountProductError(billDetailId, amountError) {
    const url = `api/bill-detail/update-amount-product-error?billDetailId=${billDetailId}&amountError=${amountError}`;
    return axiosClient.put(url, null, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  },
  updateStatus(billDetailsID, status) {
    const url = `api/billDetails/update-status?billDetailsID=${billDetailsID}&status=${status}`;
    return axiosClient.put(url, null, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  },
  delete(id) {
    const url = `api/billDetails?id=${id}`;
    return axiosClient.delete(url);
  },
};

export default billDetailsAPI;
