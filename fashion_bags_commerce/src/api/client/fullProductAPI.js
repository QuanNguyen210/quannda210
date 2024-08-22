import axiosClient from '../axiosClient';

const fullProductAPI = {
  // getAll() {
  //   const url = 'api/products/getall';
  //   return axiosClient.get(url, {});
  // },

  getAll(pageNum, pageSize, productName, productCode, brandName, productStatus, sortList, sortOrder) {
    const url = 'api/product';

    return axiosClient.get(url, {
      params: {
        page: pageNum - 1,
        size: pageSize,
        productName: productName,
        productCode: productCode,
        brandName: brandName,
        productStatus: productStatus,
        sortList: sortList,
        sortOrder: sortOrder,
      },
    });
  },
  findById(id) {
    const url = `api/detail-product/${id}`;
    return axiosClient.get(url);
  },

  searchByKeyword(keyword) {
    const url = 'api/products/search';
    return axiosClient.get(url, {
      params: {
        keyword: keyword,
      },
    });
  },
};

export default fullProductAPI;
