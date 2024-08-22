import { KeyOutlined, RightOutlined, ShoppingCartOutlined, StarFilled, UserOutlined } from '@ant-design/icons';
import React, { useState, Fragment } from 'react';
import { Radio, Space, Tabs } from 'antd';
import { useLocation } from 'react-router-dom';
import './profile.css';
import AddressCustomer from '../InformationCustomer/InformationCustomer';
import { getCustomer } from '~/api/auth/helper/UserCurrent';
import ChanglePassword from '../FormChanglePassword/ChanglePassword';
import FormBillOfCustomer from '../FormBillOfCustomer/FormBillOfCustomer';
function ProfileView() {
  const location = useLocation();
  const { TabPane } = Tabs;

  // const [customer, setCutomer] = useState(JSON.parse(localStorage.getItem('customerTokenString')));
  const customer = getCustomer();

  // console.log(("thong tin khach hang",customer));
  const [displayTapTop, setDisplayTapTop] = useState(true);

  const handleTabClick = (key) => {
    if (key === '2' || key === '3' || key === '4' || key === '5') {
      setDisplayTapTop(false);
    } else {
      setDisplayTapTop(true);
    }
  };

  const Breadcrumb = ({ steps }) => {
    return (
      <div className="breadcrumb">
        {steps.map((step, index) => (
          <Fragment key={index}>
            <span>{step}</span>
            {index !== steps.length - 1 && (
              <span>
                {' '}
                <RightOutlined style={{ fontSize: '14px' }} />{' '}
              </span>
            )}
          </Fragment>
        ))}
      </div>
    );
  };

  const steps = ['Trang chủ', 'Profile'];

  return (
    <div>
      <Breadcrumb steps={steps} />
      <div style={{ display: 'flex', flexDirection: 'row', gap: '15px' }}>
        <div className="tabLeft">
          <div className="tabLeftChild">
            <Tabs defaultActiveKey="1" tabPosition="left" onTabClick={handleTabClick}>
              <TabPane
                style={{ background: 'gray' }}
                tab={
                  <span className="tabLeftChildRow" style={{ fontSize: '20px', fontWeight: 'bold', color: 'red' }}>
                    <StarFilled />
                    TÀI KHOẢN VIP
                  </span>
                }
                key="1"
              ></TabPane>
              <TabPane
                tab={
                  <span className="tabLeftChildRow">
                    <UserOutlined />
                    Thông tin cá nhân
                  </span>
                }
                key="2"
              >
                <AddressCustomer />
              </TabPane>
              <TabPane
                tab={
                  <span className="tabLeftChildRow">
                    <KeyOutlined />
                    Đổi mật khẩu
                  </span>
                }
                key="3"
              >
                <ChanglePassword />
              </TabPane>

              <TabPane
                tab={
                  <span className="tabLeftChildRow">
                    <ShoppingCartOutlined />
                    Đơn hàng của tôi
                  </span>
                }
                key="5"
              >
                <FormBillOfCustomer></FormBillOfCustomer>
              </TabPane>
            </Tabs>
          </div>
        </div>
        {displayTapTop && (
          <div className="tabTop">
            <Tabs defaultActiveKey="1" tabPosition="top" className="tabTop">
              <TabPane
                className="tabTopChild"
                tab={<span style={{ fontSize: '25px', padding: '0 100px', color: 'red', fontWeight:'bold' }}>Hạng và điểm hiện tại</span>}
                key="1"
              >
                <h3>
                  Hạng khách hàng của bạn:
                  <span style={{ color: 'red', fontSize: '30px', fontWeight: 'bold' }}>
                    {' '}
                    {customer.customerRanking}
                  </span>
                </h3>

                <h3>
                  Điểm hiện tại của bạn:
                  <span style={{ color: 'red', fontSize: '30px', fontWeight: 'bold' }}> {customer.consumePoints}</span>
                </h3>
              </TabPane>
              <TabPane
                className="tabTopChild"
                tab={
                  <span style={{ fontSize: '25px', padding: '0 100px', background: 'white ', color: 'red', fontWeight:'bold' }}>
                    Quy chế lên hạng
                  </span>
                }
                key="3"
              >
                <h2>ĐIỀU KIỆN LÊN HẠNG THÀNH VIÊN</h2>
                <br />

                <h5>Chỉ những đơn hàng đã hoàn thành mới được tính điểm tích lũy và xét làm tiêu chí lên hạng.</h5>
                <hr></hr>
                <br />
                <p>
                  Thời gian cập nhật điểm tích lũy là từ 5 – 7 ngày (không tính thứ 7, Chủ nhật). Tài khoản thành viên
                  của khách hàng sẽ được nâng cấp lên hạng thành viên tương ứng ngay khi đạt được điều kiện giá trị đơn
                  hàng.
                </p>
                <br />
                <img style={{ width: '100%' }} src="https://i.imgur.com/VHT54Ln.png" />
                <hr></hr>
              </TabPane>
              <TabPane
                className="tabTopChild"
                tab={<span style={{ fontSize: '25px', padding: '0 100px', color: 'red', fontWeight:'bold' }}>Lịch sử giao dịch</span>}
                key="2"
              >
                Tạm thời chưa hoạt động
              </TabPane>
            </Tabs>
          </div>
        )}
      </div>
      <br></br>
    </div>
  );
}

export default ProfileView;
