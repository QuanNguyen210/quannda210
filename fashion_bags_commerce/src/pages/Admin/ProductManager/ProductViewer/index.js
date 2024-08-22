import Sidebar from '~/component/GlobalStyles/layouts/DefaultLayout/SideBar';
import { Layout } from 'antd';
import HeaderContent from '~/component/GlobalStyles/layouts/DefaultLayout/Header';
import TableContent from '../ProductViewer/Table/Table';
import { useEffect } from 'react';

const { Header, Footer, Sider, Content } = Layout;

function ProductViewer() {
  useEffect(() => {
    document.title = 'Quản lí Sản phẩm';
  });
  return (
    <Layout style={{ height: '100%', background: '#f4f3f4' }}>
      <Sider width={260} style={{ background: '#fff', zIndex: '999', position: 'fixed', overflowY: 'auto' }}>
        <Sidebar keyIndex="sub4.2" openKey="sub4" />
      </Sider>
      <Layout className="layoutContent">
        <Header className="headerStyle">
          <HeaderContent titlePage="Danh Sách Sản Phẩm" />
        </Header>
        <Content className="contentStyle">
          <TableContent />
        </Content>
      </Layout>
    </Layout>
  );
}

export default ProductViewer;
