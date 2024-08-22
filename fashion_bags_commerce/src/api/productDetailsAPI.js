import axiosClient from './axiosClient';

const productDetailsAPI = {
  getAll(
    pageNum,
    pageSize,
    productName,
    productCode,
    colorName,
    typeName,
    materialName,
    sizeName,
    brandName,
    compartmentName,
    producerName,
    buckleTypeName,
    productDetailDescribe,
    minProductDetailAmount,
    maxProductDetailAmount,
    minImportPrice,
    maxImportPrice,
    minRetailPrice,
    maxRetailPrice,
    productDetailStatus,
    sortList,
    sortOrder,
  ) {
    const url = 'api/product-details';

    return axiosClient.get(url, {
      params: {
        page: pageNum - 1,
        size: pageSize,
        productName: productName,
        productCode: productCode,
        colorName: colorName,
        typeName: typeName,
        materialName: materialName,
        sizeName: sizeName,
        brandName: brandName,
        compartmentName: compartmentName,
        producerName: producerName,
        buckleTypeName: buckleTypeName,
        productDetailDescribe: productDetailDescribe,
        minProductDetailAmount: minProductDetailAmount,
        maxProductDetailAmount: maxProductDetailAmount,
        minImportPrice: minImportPrice,
        maxImportPrice: maxImportPrice,
        minRetailPrice: minRetailPrice,
        maxRetailPrice: maxRetailPrice,
        productDetailStatus: productDetailStatus,
        sortList: sortList,
        sortOrder: sortOrder,
      },
    });
  },
  get(id) {
    const url = `api/product-details?id=${id}`;
    return axiosClient.get(url);
  },
  findById(productDetailId) {
    const url = `api/product-details/${productDetailId}`;
    return axiosClient.get(url);
  },
  getAllByProductCode(productCode) {
    const url = `api/product-detail/${productCode}`;
    return axiosClient.get(url);
  },
  getAllByProductId(productId) {
    const url = `api/product-detail/getProductDetailsByProductId/${productId}`;
    return axiosClient.get(url);
  },
  add(data) {
    const url = `api/product-details`;
    return axiosClient.post(url, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  },
  update(data) {
    const url = `api/product-details?id=${data.id}`;
    return axiosClient.put(url, data);
  },
  updateStatus(productDetailId, status) {
    const url = `api/product-details/update-status?productDetailId=${productDetailId}&status=${status}`;
    return axiosClient.put(url);
  },
  delete(productDetailId) {
    const url = `api/product-details?productDetailId=${productDetailId}`;
    return axiosClient.delete(url);
  },
  findByKeywork(keyword) {
    const url = `api/product-details/search?keyword=${keyword}`;
    return axiosClient.get(url, { keyword });
  },
  updateAmount(productDetailId, amount) {
    const url = `api/product-detail/update-amount?productDetailId=${productDetailId}&amount=${amount}`;
    return axiosClient.post(url);
  },
};

export default productDetailsAPI;
