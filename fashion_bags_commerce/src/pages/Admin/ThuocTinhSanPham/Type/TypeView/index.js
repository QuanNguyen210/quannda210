import Sidebar from '~/component/GlobalStyles/layouts/DefaultLayout/SideBar';
import { Layout } from 'antd';
import HeaderContent from '~/component/GlobalStyles/layouts/DefaultLayout/Header';
import TableContent from '../TypeView/TableType/TableType';
import { useEffect } from 'react';

const { Header, Footer, Sider, Content } = Layout;

function TypeView() {
  useEffect(() => {
    document.title = 'Quản lí Kiểu Balo';
  });
  return (
    <div style={{ height: '100%', background: '#f4f3f4' }}>
      <Sider width={260} style={{ background: '#fff', zIndex: '999', position: 'fixed', overflowY: 'auto' }}>
        <Sidebar keyIndex="sub5.5" openKey="sub5" />
      </Sider>
      <Layout className="layoutContent">
        <Header className="headerStyle">
          <HeaderContent titlePage="Danh Sách Kiểu Balo" />
        </Header>
        <Content className="contentStyle">
          <TableContent />
        </Content>
      </Layout>
    </div>
  );
}

export default TypeView;
