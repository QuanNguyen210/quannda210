import Sidebar from '~/component/GlobalStyles/layouts/DefaultLayout/SideBar';
import { Layout } from 'antd';
import HeaderContent from '~/component/GlobalStyles/layouts/DefaultLayout/Header';
import ThongKeContent from './ThongKeView/ThongKeView';
import { useEffect } from 'react';

const { Header, Footer, Sider, Content } = Layout;

function ThongKeView() {
  useEffect(() => {
    document.title = 'Thống kê';
  });
  return (
    <Layout style={{ height: '100%', background: '#f4f3f4' }}>
      <Sider width={260} style={{ background: '#fff', zIndex: '999', position: 'fixed', overflowY: 'auto' }}>
        <Sidebar keyIndex="sub9" openKey="sub9" />
      </Sider>
      <Layout className="layoutContent">
        <Header className="headerStyle">
          <HeaderContent titlePage="Thống kê" />
        </Header>
        <Content className="contentStyle1">
          <ThongKeContent></ThongKeContent>
        </Content>
      </Layout>
    </Layout>
  );
}
export default ThongKeView;
