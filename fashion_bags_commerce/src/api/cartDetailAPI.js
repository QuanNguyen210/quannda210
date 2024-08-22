import axiosClient from './axiosClient';

const cartDetailAPI = {
  getAll() {
    const url = 'api/cart-detail/';
    return axiosClient.get(url);
  },


    save(data) {
        const url = `api/cart-detail`;
        return axiosClient.post(url, data, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
      },
      updateAmount(id, amount) {
        const url = `api/cart-detail/${id}?amount=${amount}`;
        return axiosClient.put(url, amount, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
      },

      delete(id) {
        const url = `api/cart-detail/${id}`;
        return axiosClient.delete(url);
      },

      clearCartDetail(cartId) {
        const url = `api/all-cart-detail/${cartId}`;
        return axiosClient.delete(url);
      },


}

export default cartDetailAPI;
