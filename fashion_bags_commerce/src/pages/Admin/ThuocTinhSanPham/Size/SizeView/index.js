import Sidebar from '~/component/GlobalStyles/layouts/DefaultLayout/SideBar';
import { Layout } from 'antd';
import HeaderContent from '~/component/GlobalStyles/layouts/DefaultLayout/Header';
import TableContent from '../SizeView/Table/Table';

import FormSizeCreate from '../SizeEdit/FormCreate/FormSizeCreate';
import { useEffect } from 'react';

const { Header, Footer, Sider, Content } = Layout;

function SizeView() {
  useEffect(() => {
    document.title = 'Quản lí Kích thước';
  });
  return (
    <div style={{ height: '100%', background: '#f4f3f4' }}>
      <Sider width={260} style={{ background: '#fff', zIndex: '999', position: 'fixed', overflowY: 'auto' }}>
        <Sidebar keyIndex="sub5.3" openKey="sub5" />
      </Sider>
      <Layout className="layoutContent">
        <Header className="headerStyle">
          <HeaderContent titlePage="Danh Sách Kích Cỡ" />
        </Header>
        <Content className="contentStyle">
          <TableContent />
        </Content>
      </Layout>
    </div>
  );
}
export default SizeView;
