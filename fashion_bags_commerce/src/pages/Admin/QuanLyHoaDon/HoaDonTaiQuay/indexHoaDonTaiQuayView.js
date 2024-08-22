import Sidebar from '~/component/GlobalStyles/layouts/DefaultLayout/SideBar';
import { Layout } from 'antd';
import HeaderContent from '~/component/GlobalStyles/layouts/DefaultLayout/Header';
import TableHoaDonTaiQuay from './TableHoaDonTaiQuay/TableHoaDonTaiQuay';
import { useEffect } from 'react';

const { Header, Footer, Sider, Content } = Layout;

function HoaDonTaiQuayView() {
  useEffect(() => {
    document.title = 'Hóa đơn';
  });
  return (
    <Layout style={{ height: '100%', background: '#f4f3f4' }}>
      <Sider width={260} style={{ background: '#fff', zIndex: '999', position: 'fixed', overflowY: 'auto' }}>
        <Sidebar keyIndex="7" openKey="sub3" />
      </Sider>
      <Layout className="layoutContent">
        <Header className="headerStyle">
          <HeaderContent titlePage="Danh Sách Hóa Đơn" />
        </Header>
        <Content className="contentStyle">
          <TableHoaDonTaiQuay style={{ boder: 'black solid 1px' }} />
        </Content>
      </Layout>
    </Layout>
  );
}
export default HoaDonTaiQuayView;
