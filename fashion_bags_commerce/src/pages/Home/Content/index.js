import { Fragment } from 'react';
import LayoutCarousel from './LayoutCarousel';
import ShopView from '../Shop/ShopView/index';
import ExtendContent from './ExtendContent';
import ProductList from './ProductList/ProductList';

function Content() {
  return (
    <Fragment>
      <LayoutCarousel />
      <ShopView titleContent={'SẢN PHẨM BÁN CHẠY'} />
      <ProductList titleContent={'SẢN PHẨM KHUYẾN MÃI'} />
      <ExtendContent titleContent={'EVENT/TÀI TRỢ'} />
    </Fragment>
  );
}

export default Content;
