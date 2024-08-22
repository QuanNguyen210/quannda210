import React, { useEffect, useState } from 'react';
import { EditOutlined, EllipsisOutlined, LogoutOutlined, SettingOutlined } from '@ant-design/icons';
import { Avatar, Badge, Button, Card, Popconfirm, Popover, message } from 'antd';
import { Navigate, useNavigate } from 'react-router-dom';
import Constants from '~/Utilities/Constants';
import { getStaff } from '~/api/auth/helper/UserCurrent';
const { Meta } = Card;
const CryptoJS = require('crypto-js');

function PopupProfile() {
  const [messageApi, contextHolder] = message.useMessage();

  const [staff, setStaff] = useState(getStaff());
  const key = 'updatable';
  const navigate = useNavigate();
  let canNavigate = false;
  const handleLgOut = () => {
    messageApi.open({
      key,
      type: 'loading',
      content: 'Đang đăng xuất...',
    });
    setTimeout(() => {
      messageApi.open({
        key,
        type: 'success',
        content: 'Mời đăng nhập lại!!!',
        duration: 2,
      });
      canNavigate = true;
      setTimeout(() => {
        localStorage.removeItem('staffDecodeString');
        localStorage.removeItem('staffId');

        localStorage.removeItem('staffToken');
        navigate('/admin/login');
        window.location.reload();
      }, 1000);
    }, 1000);
  };

  const PopupProContent = (
    <Card
      size="1"
      style={{
        width: 300,
      }}
      actions={[
        <Popconfirm
          title="Xác Nhận"
          description="Bạn Có chắc chắn muốn đăng xuất?"
          okText="Đồng ý"
          cancelText="Không"
          onConfirm={handleLgOut}
          onCancel={() => {}}
        >
          <Button icon={<LogoutOutlined />}>Đăng xuất</Button>
        </Popconfirm>,
        <Button
          icon={<EditOutlined />}
          onClick={() => {
            navigate('/frofile');
          }}
        >
          Thông Tin
        </Button>,
      ]}
    >
      <Meta
        avatar={
          <Avatar src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Windows_10_Default_Profile_Picture.svg/2048px-Windows_10_Default_Profile_Picture.svg.png" />
        }
        title="Nhân Viên"
        description={staff ? staff.users.fullName : ''}
      />
    </Card>
  );
  return (
    <Popover content={PopupProContent} title="Thông tin Nhân Viên" trigger="click">
      {contextHolder}
      <Badge dot={true}>
        <div style={{ cursor: 'pointer' }}>
          <Avatar
            style={{ marginLeft: '20px' }}
            size="large"
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Windows_10_Default_Profile_Picture.svg/2048px-Windows_10_Default_Profile_Picture.svg.png"
          />
        </div>
      </Badge>
    </Popover>
  );
}
export default PopupProfile;
