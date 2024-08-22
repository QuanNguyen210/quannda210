import Sider from 'antd/es/layout/Sider';
import Layout, { Content, Header } from 'antd/es/layout/layout';
import HeaderContent from '~/component/GlobalStyles/layouts/DefaultLayout/Header';
import Sidebar from '~/component/GlobalStyles/layouts/DefaultLayout/SideBar';
import ProfileComponent from './ProfileComponent/ProfileComponent';
import { useEffect } from 'react';

const headerStyle = {
  borderLeft: '270px',
  color: '#fff',
  height: 'auto',
  paddingInline: 0,
  lineHeight: '64px',
  backgroundColor: 'white',
  margin: '10px',
};
const contentStyle = {
  margin: '0 30px 10px 20px',
  height: '800px',
  color: 'black',
  backgroundColor: 'white',
  borderRadius: '10px',
  border: '10px lightblue solid',
};
const footerStyle = {
  margin: '0 10px 10px 20px',
  borderLeft: '270px',
  color: 'black',
  backgroundColor: 'white',
};
const layoutContent = {
  marginLeft: '270px',
  flexGrow: '1',
  backgroundColor: 'white',
};
function ProfilePage() {
  useEffect(() => {
    document.title = 'Thông tin cá nhân';
  });
  return (
    <Layout style={{ height: '100%', background: 'white' }}>
      <Sider width={260} style={{ background: '#fff', zIndex: '999', position: 'fixed', overflowY: 'auto' }}>
        <Sidebar keyIndex="sub1" openKey="sub1" />
      </Sider>
      <Layout style={layoutContent}>
        <Header style={headerStyle}>
          <HeaderContent titlePage="Profile Nhân viên" />
        </Header>
        <Content style={contentStyle}>
          <ProfileComponent />
        </Content>
      </Layout>
    </Layout>
  );
}

export default ProfilePage;
