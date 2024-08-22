import { Button, Card, DatePicker, Image, Modal, Statistic, Typography } from 'antd';
import { Fragment, useEffect, useState } from 'react';
import styles from './index.module.scss';
import Meta from 'antd/es/card/Meta';
function AdminComponent() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [weatherObject, setWeatherObject] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);
  useEffect(() => {
    async function fetchData() {
      fetch(
        'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/Hanoi?unitGroup=metric&key=A242JEVPJGXX7E7VPFUNP4CNJ&contentType=json',
        {
          method: 'GET',
          headers: {},
        },
      )
        .then((response) => {
          if (!response.ok) {
            throw response;
          }

          return response.json();
        })
        .then((response) => {
          console.log(response);
          setWeatherObject(response);
        })
        .catch((errorResponse) => {
          if (errorResponse.text) {
            errorResponse.text().then((errorMessage) => {});
          } else {
          }
        });
    }
    fetchData();
  }, []);
  return (
    <Fragment>
      {weatherObject ? (
        <div
          style={{
            padding: '10px',
            color: 'white',
            border: 'black 0px solid',
            width: 'fit-content',

            borderRadius: '10px',
            margin: '10px',
          }}
        >
          <Card hoverable style={{ backgroundColor: '#ADD8E6' }}>
            <h6>
              Địa điểm: {weatherObject.resolvedAddress} - Nhiệt độ: {weatherObject.currentConditions.feelslike}*C - Độ
              Ẩm: {weatherObject.currentConditions.humidity}%
            </h6>
          </Card>
        </div>
      ) : (
        ''
      )}

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div className={styles.adminComponent}>
          <div>
            <Card hoverable style={{ backgroundColor: '#ADD8E6' }}>
              {' '}
              <Statistic value={currentTime.toLocaleTimeString()} valueStyle={{ fontSize: '150px', color: 'white' }} />
            </Card>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default AdminComponent;
