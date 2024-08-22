import axiosClient from './axiosClient';

const billsAPI = {
  getAll(pageNum, pageSize) {
    const url = 'api/bills/';
    return axiosClient.get(url, {
      params: {
        page: pageNum - 1,
        size: pageSize,
      },
    });
  },
  getAllSearchPagination(startDate, endDate, status, search, pageNum, pageSize, filterRank, customerPhoneNumber, sortList, sortOrder, sortListPlaceHolder) {
    const url = 'api/bills/pagination';
    return axiosClient.get(url, {
      params: {
        startDate: startDate,
        endDate: endDate,
        search: search,
        status: status,
        page: pageNum - 1,
        size: pageSize,
        customerRanking: filterRank,
        customerId: customerPhoneNumber,
        sortList: sortList,
        sortOrder: sortOrder,
        sortListPlaceHolder: sortListPlaceHolder
      },
    });
  },

  getAllBillsOffline(loaiHoaDon, filterStaffCode, startDate, endDate, status, search, pageNum, pageSize, filterRank, customerPhoneNumber, sortList, sortOrder, sortListPlaceHolder) {
    const url = 'api/bills/bill-offline';
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
        customerRanking: filterRank,
        customerId: customerPhoneNumber,
        sortList: sortList,
        sortOrder: sortOrder,
        sortListPlaceHolder: sortListPlaceHolder
      },
    });
  },

  getAllBillOfCustomer(status, pageNum, pageSize, customerId) {
    const url = 'api/bills/customer';
    return axiosClient.get(url, {
      params: {
        status: status,
        page: pageNum - 1,
        size: pageSize,
        customerId: customerId
      },
    });
  },

  get(id) {
    const url = `api/bills?id=${id}`;
    return axiosClient.get(url);
  },
  add(data) {
    const url = `api/bills`;
    return axiosClient.post(url, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  },
  update(data) {
    const url = `api/bills?id=${data.id}`;
    return axiosClient.put(url, data);
  },
  updateStatus(billsID, status) {
    const url = `api/bills/update-status?id=${billsID}&status=${status}`;
    return axiosClient.put(url, null, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  },
  delete(id) {
    const url = `api/bills?id=${id}`;
    return axiosClient.delete(url);
  },
};

export default billsAPI;
