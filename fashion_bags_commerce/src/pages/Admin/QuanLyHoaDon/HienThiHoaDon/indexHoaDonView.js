import Sidebar from '~/component/GlobalStyles/layouts/DefaultLayout/SideBar';
import { Layout } from 'antd';
import HeaderContent from '~/component/GlobalStyles/layouts/DefaultLayout/Header';
import TableHoaDon from '../HienThiHoaDon/TableHoaDon/TableHoaDon';
import { useEffect } from 'react';

const { Header, Footer, Sider, Content } = Layout;

function HoaDonOnlineView() {
  useEffect(() => {
    document.title = 'Hóa đơn đặt hàng';
  });
  return (
    <Layout style={{ height: '100%', background: '#f4f3f4' }}>
      <Sider width={260} style={{ background: '#fff', zIndex: '999', position: 'fixed', overflowY: 'auto' }}>
        <Sidebar keyIndex="sub3.1" openKey="sub3" />
      </Sider>
      <Layout className="layoutContent">
        <Header className="headerStyle">
          <HeaderContent titlePage="Danh Sách Hóa Đơn" />
        </Header>
        <Content className="contentStyle1">
          <TableHoaDon style={{ boder: 'black solid 1px' }} />
        </Content>
      </Layout>
    </Layout>
  );
}
export default HoaDonOnlineView;
