import { Layout } from 'antd';
import Sider from 'antd/es/layout/Sider';
import { Content, Footer, Header } from 'antd/es/layout/layout';
import { Fragment, useEffect } from 'react';
import HeaderContent from '~/component/GlobalStyles/layouts/DefaultLayout/Header';
import Sidebar from '~/component/GlobalStyles/layouts/DefaultLayout/SideBar';
import ProductAddForm from './ProductAddForm/ProductAddForm';
import './index.css';
function ProductAdd() {
  useEffect(() => {
    document.title = 'Thêm Sản phẩm';
  });
  return (
    <Fragment>
      <Layout className="layout" style={{ height: '100%', background: 'white' }}>
        <Sider width={260} style={{ background: '#fff', zIndex: '999', position: 'fixed', overflowY: 'auto' }}>
          <Sidebar keyIndex="sub4.1" openKey="sub4" />
        </Sider>
        <Layout className="layoutContent">
          <Header className="headerStyle">
            <HeaderContent titlePage="Thêm Sản Phẩm Chi Tiết" />
          </Header>
          <Content className="contentStyle">
            <div>
              <ProductAddForm />
            </div>
            <Footer className="footerStyle">Đây là component của Footer2</Footer>
          </Content>
        </Layout>
      </Layout>
    </Fragment>
  );
}

export default ProductAdd;
