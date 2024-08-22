import { Layout } from 'antd';
import Sider from 'antd/es/layout/Sider';
import { Content, Footer, Header } from 'antd/es/layout/layout';
import { Fragment, useEffect } from 'react';
import HeaderContent from '~/component/GlobalStyles/layouts/DefaultLayout/Header';
import Sidebar from '~/component/GlobalStyles/layouts/DefaultLayout/SideBar';
import SalesCounterForm from './SalesCounterForm';

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
  margin: '0px 10px 10px 10px',
  padding: '10px',
  height: 'fit-content',
  color: 'black',
  backgroundColor: 'white',
  borderRadius: '10px',
  border: '10px solid lightblue',
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

function SalesCounter() {
  useEffect(() => {
    document.title = 'Bán hàng tại quầy';
  });
  return (
    <Fragment>
      <Layout style={{ height: '100%', background: 'white' }}>
        <Sider width={260} style={{ background: '#fff', zIndex: '999', position: 'fixed', overflowY: 'auto' }}>
          <Sidebar keyIndex="sub2.1" openKey="sub2" />
        </Sider>
        <Layout style={layoutContent}>
          <Header style={headerStyle}>
            <HeaderContent titlePage="Bán hàng tại quầy" />
          </Header>
          <Content style={contentStyle}>
            <SalesCounterForm />
          </Content>
        </Layout>
      </Layout>
    </Fragment>
  );
}

export default SalesCounter;
