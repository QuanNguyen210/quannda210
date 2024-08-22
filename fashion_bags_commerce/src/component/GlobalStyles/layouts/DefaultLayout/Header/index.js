import { AudioOutlined } from '@ant-design/icons';
import { Badge } from 'antd';
import Search from 'antd/es/input/Search';
import Title from 'antd/es/typography/Title';
import NotificationIcon from './NotificationIcon';
import MessageIcon from './MessageIcon';
import PopupProfile from './PopupProfile';
import styles from './index.module.scss';
import { useState } from 'react';

const headerIcons = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
};
function HeaderContent(props) {
  const [day, setDay] = useState(null);
  const [month, setMonth] = useState(null);
  const [year, setYear] = useState(null);
  const [time, setTime] = useState(null);
  const months = [
    'Tháng 1',
    'Tháng 2',
    'Tháng 3',
    'Tháng 4',
    'Tháng 5',
    'Tháng 6',
    'Tháng 7',
    'Tháng 8',
    'Tháng 9',
    'Tháng 10',
    'Tháng 11',
    'Tháng 12',
  ];
  const updateDateTime = () => {
    const currentDate = new Date();
    const localTime = currentDate.toLocaleTimeString('en-US', { hour12: false });
    const localDate = currentDate.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
    const day = currentDate.getDate();
    setDay(day);
    const month = months[currentDate.getMonth()];
    setMonth(month);
    const year = currentDate.getFullYear();
    setYear(year);
    const currentTime = localTime.split(':').slice(0, 2).join(' : ');
    setTime(currentTime);
  };
  setInterval(updateDateTime, 1000);
  return (
    <header className={styles.header}>
      <div>
        <div className="row">
          <div className="col-md-4">
            <Title style={{ color: 'black' }} level={1}>
              {props.titlePage}
            </Title>
          </div>
          <div className="col-md-8">
            <div style={headerIcons}>
              <span>
                <h5>{`${time} - Hà Nội, Ngày ${day} ${month} Năm ${year}`}</h5>
              </span>
              <PopupProfile />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default HeaderContent;
