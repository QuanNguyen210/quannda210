import { UserOutlined } from '@ant-design/icons';
import { Avatar, Badge, Button, Card, Popover } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { getCustomer } from '~/api/auth/helper/UserCurrent';
import styles from './UserProfile.module.scss'
const { Meta } = Card;

function UserProfile(props) {
  const { changeLoggedIn } = props;
  const navigate = useNavigate();
  const location = useLocation();

  const customerTokenString = localStorage.getItem('customerTokenString');
  const customerId = localStorage.getItem('customerId');
  const customerToken = localStorage.getItem('customerToken');

  const handleLgOut = () => {
    changeLoggedIn();
  };

  const customer = getCustomer().users.fullName;

  // console.log(customer);

  const PopupProContent = (
    <Card
      style={{
        width: 300,
      }}
      actions={[
        <Button
          onClick={() => {
            navigate('/profile', {
              state: {
                customer: customer,
              },
            });
          }}
        >
          Thông tin cá nhân
        </Button>,
        <Button key="logout" onClick={handleLgOut}>
          Đăng Xuất
        </Button>,
      ]}
    >
      <Meta
        avatar={
          <Avatar
            style={{
              // backgroundColor: '#87d068',
              backgroundColor: 'gold',
              color: 'black',
              // fontSize: '30px',
              // width: '40px',
              // height: '40px',
            }}
            icon={<UserOutlined />}
          />
        }
        title={`Xin chào, ${customer}`}
        description="Chúc bạn 1 ngày tốt lành"
      />
    </Card>
  );

  return (
    <Popover content={PopupProContent} title="Tài Khoản" trigger="hover">
      <Badge dot={false}>
        <div style={{ cursor: 'pointer' }}>
          <Avatar
           className={styles.iconUser}
            icon={<UserOutlined />}
          />
        </div>
      </Badge>
    </Popover>
  );
}

export default UserProfile;
