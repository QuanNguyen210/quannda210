import { Layout } from 'antd';
import Header from '../Header/index';
import Footer from '../Footer/index';
import ShopDetailView from './ShopDetailView/index';
import { Fragment, useEffect } from 'react';
import MainLayout from '../MainLayout';
function ShopDetail() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <MainLayout>
    <ShopDetailView />
  </MainLayout>
  );
}

export default ShopDetail;
