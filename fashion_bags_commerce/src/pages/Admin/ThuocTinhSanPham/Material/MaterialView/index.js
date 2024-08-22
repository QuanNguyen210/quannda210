import Sidebar from '~/component/GlobalStyles/layouts/DefaultLayout/SideBar/index';
import { Layout } from 'antd';
import HeaderContent from '~/component/GlobalStyles/layouts/DefaultLayout/Header/index';
import TableContent from './Table/Table';
import { Fragment, useEffect } from 'react';
const { Header, Footer, Sider, Content } = Layout;

function MaterialView() {
  useEffect(() => {
    document.title = 'Quản lí Chất liệu';
  });
  return (
    <div style={{ height: '100%', background: '#f4f3f4' }}>
      <Sider width={260} style={{ background: '#fff', zIndex: '999', position: 'fixed', overflowY: 'auto' }}>
        <Sidebar keyIndex="sub5.4" openKey="sub5" />
      </Sider>
      <div className="layoutContent">
        <Header className="headerStyle">
          <HeaderContent titlePage="Danh Sách Chất Liệu" />
        </Header>
        <Content className="contentStyle">
          <TableContent />
        </Content>
      </div>
    </div>
  );
}

export default MaterialView;
