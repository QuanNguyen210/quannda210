import {
  AppstoreOutlined,
  BarChartOutlined,
  CalendarOutlined,
  MenuFoldOutlined,
  PaperClipOutlined,
  RedEnvelopeOutlined,
  ShoppingCartOutlined,
  TeamOutlined,
  UserOutlined,
  ContactsOutlined,
  HomeOutlined,
} from '@ant-design/icons';
import { Menu } from 'antd';
import Avartar from '~/component/GlobalStyles/layouts/DefaultLayout/SideBar/Avartar/index';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import style from './index.module.scss';
import { hover } from '@testing-library/user-event/dist/hover';

function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}
const items = [
  getItem(
    <Link style={{ textDecoration: 'none' }} to={'/admin'}>
      Trang chủ
    </Link>,
    'sub1',
    <HomeOutlined style={{ fontSize: '23px' }} />,
  ),
  getItem('Quản lý Bán Hàng', 'sub2', <ShoppingCartOutlined style={{ fontSize: '23px' }} />, [
    getItem(
      <Link style={{ textDecoration: 'none' }} to={'/sales-counter'}>
        Bán Hàng Tại Quầy
      </Link>,
      'sub2.1',
    ),
  ]),
  getItem('Quản lý Hóa Đơn', 'sub3', <PaperClipOutlined style={{ fontSize: '23px' }} />, [
    getItem(
      <Link style={{ textDecoration: 'none' }} to={'/bill-offline-view'}>
        Tất cả hóa đơn
      </Link>,
      '7',
    ),
    getItem(
      <Link style={{ textDecoration: 'none' }} to={'/bill-online-view'}>
        Hóa đơn online
      </Link>,
      'sub3.1',
    ),

    getItem(
      <Link style={{ textDecoration: 'none' }} to={'/bill-error-view'}>
        Hóa đơn sản phẩm lỗi
      </Link>,
      'sub3.2',

    ),
  ]),

  getItem('Quản lý Sản Phẩm', 'sub4', <CalendarOutlined style={{ fontSize: '23px' }} />, [
    getItem(
      <Link style={{ textDecoration: 'none' }} to={'/product-add'}>
        Thêm Sản Phẩm
      </Link>,
      'sub4.1',
    ),
    getItem(
      <Link style={{ textDecoration: 'none' }} to={'/product-viewer'}>
        Danh Sách Sản Phẩm
      </Link>,
      'sub4.2',
    ),
    getItem(
      <Link style={{ textDecoration: 'none' }} to={'/view-productDetails'}>
        Sản Phẩm Chi Tiết
      </Link>,
      'sub4.3',
    ),
  ]),
  getItem('Danh mục sản phẩm', 'sub5', <AppstoreOutlined style={{ fontSize: '23px' }} />, [
    getItem(
      <Link style={{ textDecoration: 'none' }} to={'/color-view'}>
        Màu sắc
      </Link>,
      'sub5.1',
    ),
    getItem(
      <Link style={{ textDecoration: 'none' }} to={'/brand-view'}>
        Thương hiệu
      </Link>,
      'sub5.2',
    ),

    getItem(
      <Link style={{ textDecoration: 'none' }} to={'/size-view'}>
        Kích cỡ
      </Link>,
      'sub5.3',
    ),

    getItem(
      <Link style={{ textDecoration: 'none' }} to={'/material-view'}>
        Chất liệu
      </Link>,
      'sub5.4',
    ),
    getItem(
      <Link style={{ textDecoration: 'none' }} to={'/type-view'}>
        Kiểu balo
      </Link>,
      'sub5.5',
    ),

    getItem(
      <Link style={{ textDecoration: 'none' }} to={'/buckle-type-view'}>
        Kiểu khóa
      </Link>,
      'sub5.6',
    ),

    getItem(
      <Link style={{ textDecoration: 'none' }} to={'/compartment-view'}>
        Ngăn
      </Link>,
      'sub5.7',
    ),

    getItem(
      <Link style={{ textDecoration: 'none' }} to={'/producer-view'}>
        Nhà sản xuất
      </Link>,
      'sub5.8',
    ),
  ]),
  getItem(
    <Link style={{ textDecoration: 'none' }} to={'/voucher-view'}>
      Quản lý Voucher
    </Link>,
    'sub6',
    <RedEnvelopeOutlined style={{ fontSize: '23px' }} />,
  ),
  getItem(
    <Link style={{ textDecoration: 'none' }} to={'/staff-view'}>
      Quản lý Nhân Viên
    </Link>,
    'sub7',
    <UserOutlined style={{ fontSize: '23px' }} />,
  ),
  getItem(
    <Link style={{ textDecoration: 'none' }} to={'/customer-view'}>
      Quản lý Khách Hàng
    </Link>,
    'sub8',
    <TeamOutlined style={{ fontSize: '23px' }} />,
  ),
  getItem(
    <Link style={{ textDecoration: 'none' }} to={'/stastistic-view'}>
      Thống kê
    </Link>,
    'sub9',
    <BarChartOutlined style={{ fontSize: '23px' }} />,
  ),
];
const rootSubmenuKeys = ['sub1', 'sub2', 'sub4', 'sub5', 'sub6', 'sub7', 'sub8', 'sub9'];
function Sidebar(props) {
  const { key, keyIndex, openKey } = props;
  const [openKeys, setOpenKeys] = useState([props.openKey]);
  const onOpenChange = (keys) => {
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
    if (latestOpenKey && rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      setOpenKeys(keys);
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  };

  return (
    <div className={style.sidebar} style={{ height: '100vh' }}>
      <div style={{ padding: ' 0px 30px' }}>
        <Avartar />
      </div>
      <hr />
      <Menu
        className={style.menuCustom}
        mode="inline"
        openKeys={openKeys}
        onOpenChange={onOpenChange}
        defaultSelectedKeys={[props.keyIndex]}
        defaultOpenKeys={openKeys}
        style={{
          width: '260px',
          height: 'auto',
          // color: 'white',
        }}
        items={items}
      ></Menu>
    </div>
  );
}

export default Sidebar;
