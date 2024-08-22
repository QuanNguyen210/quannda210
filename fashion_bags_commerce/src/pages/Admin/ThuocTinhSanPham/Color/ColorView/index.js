import Sidebar from '~/component/GlobalStyles/layouts/DefaultLayout/SideBar/index';
import { Layout } from 'antd';
import HeaderContent from '~/component/GlobalStyles/layouts/DefaultLayout/Header/index';
import TableContent from './Table/Table';
import { useEffect } from 'react';

const { Header, Footer, Sider, Content } = Layout;

function ColorView() {
  useEffect(() => {
    document.title = 'Quản lí Màu sắc';
  });
  return (
    <div style={{ height: '100%', background: '#f4f3f4' }}>
      <Sider width={260} style={{ background: '#fff', zIndex: '999', position: 'fixed', overflowY: 'auto' }}>
        <Sidebar keyIndex="sub5.1" openKey="sub5" />
      </Sider>
      <Layout className="layoutContent">
        <Header className="headerStyle">
          <HeaderContent titlePage="Danh Sách Màu Sắc" />
        </Header>
        <Content className="contentStyle1">
          <TableContent />
        </Content>
      </Layout>
    </div>
  );
}

export default ColorView;
