import { Layout } from 'antd';
import Header from './Header';
import Footer from './Footer';
import './index.scss';
import { Fragment, useState } from 'react';

const MainLayout = ({ children }) => {
  return (
    <div className="fullpage">
      <div className="header001">
        <Header />
      </div>
      <div className="page_content" style={{marginTop:'100px'}}>{children}</div>
      <div className="footer_client">
        <Footer />
      </div>
    </div>
  );
};

export default MainLayout;
