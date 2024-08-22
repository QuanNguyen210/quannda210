import Sidebar from '~/component/GlobalStyles/layouts/DefaultLayout/SideBar';
import { Layout } from 'antd';
import HeaderContent from '~/component/GlobalStyles/layouts/DefaultLayout/Header';
import ProductDetailsViewer from './ProductDetailsViewer';
import { useEffect } from 'react';

const { Header, Footer, Sider, Content } = Layout;

function ProductDetailsViewerPage() {
  useEffect(() => {
    document.title = 'Sản phẩm chi tiết';
  });
  return (
    <Layout style={{ height: '100%', background: 'white' }}>
      <Sider width={260} style={{ background: 'white', zIndex: '999', position: 'fixed', overflowY: 'auto' }}>
        <Sidebar keyIndex="sub4.3" openKey="sub4" />
      </Sider>
      <Layout className="layoutContent">
        <Header className="headerStyle">
          <HeaderContent titlePage="Sản Phẩm Chi Tiết" />
        </Header>
        <Content className="contentStyle">
          <ProductDetailsViewer style={{ boder: 'black solid 1px' }} />
        </Content>

        {/* <Footer className="footerStyle">Đây là component của Footer</Footer> */}
      </Layout>
    </Layout>
  );
}

export default ProductDetailsViewerPage;
