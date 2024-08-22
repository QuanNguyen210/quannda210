import Sidebar from '~/component/GlobalStyles/layouts/DefaultLayout/SideBar';
import { Layout } from 'antd';
import HeaderContent from '~/component/GlobalStyles/layouts/DefaultLayout/Header';

import TableContent from './Table/Table';
import { useEffect } from 'react';

const { Header, Footer, Sider, Content } = Layout;

function CustomerView() {
  useEffect(() => {
    document.title = 'Quản lí Khách hàng';
  });
  return (
    <Layout style={{ height: '100%', background: '#f4f3f4' }}>
      <Sider width={260} style={{ background: '#fff', zIndex: '999', position: 'fixed', overflowY: 'auto' }}>
        <Sidebar keyIndex="sub8" openKey="sub8" />
      </Sider>
      <Layout className="layoutContent">
        <Header className="headerStyle">
          <HeaderContent titlePage="Danh Sách Khách Hàng" />
        </Header>
        <Content className="contentStyle">
          <TableContent style={{ boder: 'black solid 1px' }} />
        </Content>
      </Layout>
    </Layout>
  );
}
export default CustomerView;
