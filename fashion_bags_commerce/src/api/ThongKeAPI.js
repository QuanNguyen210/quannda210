import axiosClient from './axiosClient';

const ThongKeAPI = {

    getBillStatisticsByDateRange(startDate, endDate) {
        const url = 'api/thong-ke/amount-bill-amount-product';
        return axiosClient.get(url, {
            params: {
                startDate: startDate,
                endDate: endDate,
            },
        });
    },
    getTotalPricesByDay(month, year) {
        const url = 'api/thong-ke/total-prices-by-day';
        return axiosClient.get(url, {
            params: {
                month: month,
                year: year,
            },
        });
    },
    getTopFiveCustomer(startDate, endDate) {
        const url = 'api/thong-ke/top-customer';
        return axiosClient.get(url, {
            params: {
                startDate: startDate,
                endDate: endDate,
            },
        });
    },
    getTopFiveProduct(startDate, endDate) {
        const url = 'api/thong-ke/top-products';
        return axiosClient.get(url, {
            params: {
                startDate: startDate,
                endDate: endDate,
            },
        });
    },
    getProductsFail(startDate, endDate) {
        const url = 'api/thong-ke/top-products-fail';
        return axiosClient.get(url, {
            params: {
                startDate: startDate,
                endDate: endDate,
            },
        });
    },
    getThongKeStatus(startDate, endDate) {
        const url = 'api/thong-ke/statisticPercentByBillStatus';
        return axiosClient.get(url, {
            params: {
                startDate: startDate,
                endDate: endDate,
            },
        });
    },

};

export default ThongKeAPI;
