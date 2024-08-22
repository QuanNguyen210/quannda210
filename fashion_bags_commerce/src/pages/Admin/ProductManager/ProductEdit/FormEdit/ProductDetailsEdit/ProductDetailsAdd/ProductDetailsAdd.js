import styles from './ProductDetailsAdd.module.scss';

import { EditOutlined } from '@ant-design/icons';
import { Button, Drawer, Popconfirm, Space, notification } from 'antd';
import { Fragment, useEffect, useState } from 'react';
import ProductAddForm from '../../../ProductAdd/ProductAddForm/ProductAddForm';
import ProductDetailsPreviewForm from './BaloDetailsPreviewForm/ProductDetailsPreviewForm';

function ProductDetailsAdd(props) {
  const [baloList, setBaloList] = useState([]);
  const [baloListPreview, setBaloListPreview] = useState([]);
  const [open, setOpen] = useState(false);
  const onClose = () => {
    setOpen(false);
  };
  const showDrawer = () => {
    setOpen(true);
  };

  return (
    <Fragment>
      <Button
        shape="round"
        size="middle"
        style={{ borderColor: 'blue', color: 'blue' }}
        onClick={showDrawer}
        icon={<EditOutlined />}
      >
        Sửa
      </Button>
      <Drawer
        title={'Edit - ' + props.product.productCode}
        width={1600}
        onClose={onClose}
        open={open}
        styles={{
          body: {
            paddingBottom: 80,
          },
        }}
        extra={<Space></Space>}
      >
        <h1>Thông tin Balo</h1>
        <hr />
        <ProductDetailsPreviewForm
          product={props.product}
          productDetailList={props.productDetailList}
          brand={props.brand}
          handleRefresh={props.handleRefresh}
        />
      </Drawer>
    </Fragment>
  );
}

export default ProductDetailsAdd;
