import axiosClient from './axiosClient';

const weatherAPI = {
  getAll() {
    const url =
      'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/Hanoi?unitGroup=metric&key=A242JEVPJGXX7E7VPFUNP4CNJ&contentType=json';
    return axiosClient.get(url, {});
  },
};

export default weatherAPI;
