import './FormProductViewDetails.css';

import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { InfoOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Col, Drawer, Form, Input, Row, Select, Space, Table } from 'antd';
import baloDetailsAPI from '~/api/productDetailsAPI';
import FormProductEdit from '../../ProductEdit/FormEdit/FormProductEdit';
import VNDFormaterFunc from '~/Utilities/VNDFormaterFunc';
const { Option } = Select;
function FormProductViewDetails(props) {
  const productId = props.product.productId;
  const [open, setOpen] = useState(false);
  const showDrawer = () => {
    fetchProducts(productId);
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  const [loading, setLoading] = useState(false);
  const [baloList, setBaloList] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  const fetchProducts = useCallback(async (productId) => {
    setLoading(true);

    try {
      const response = await baloDetailsAPI.getAllByProductId(productId);
      const data = response.data;
      setBaloList(data);
      setTimeout(() => {
        setLoading(false);
      }, 300);
    } catch (error) {
      console.error('Đã xảy ra lỗi: ', error);
    }
  }, []);
  useEffect(() => {
    if (productId && open) {
      fetchProducts(productId);
    }
  }, [productId]);

  const columns = [
    {
      title: 'STT',
      dataIndex: 'index',
      key: 'index',
      width: 50,
      fixed: 'left',
      render: (text, record, index) => <span>{(pagination.current - 1) * pagination.pageSize + index + 1}</span>,
    },
    {
      title: 'Mã Balo',
      dataIndex: ['product', 'productCode'],
      width: 100,
      fixed: 'left',
      sorter: (a, b) => a.product.productCode.localeCompare(b.product.ButtonproductCode),
    },
    {
      title: 'Tên Balo',
      dataIndex: ['product', 'productName'],
      width: 300,
      fixed: 'left',
      sorter: (a, b) => a.product.productName.localeCompare(b.product.productName),
    },
    {
      title: 'Màu Sắc',
      dataIndex: ['color', 'colorName'],
      width: 100,
      sorter: (a, b) => a.color.colorName.localeCompare(b.color.colorName),
    },
    {
      title: 'Kiểu Balo',
      dataIndex: ['type', 'typeName'],
      width: 200,
      sorter: (a, b) => a.type.typeName.localeCompare(b.type.typeName),
    },
    {
      title: 'Chất Liệu',
      dataIndex: ['material', 'materialName'],
      width: 100,
      sorter: (a, b) => a.material.materialName.localeCompare(b.material.materialName),
    },
    {
      title: 'Size Balo',
      dataIndex: ['size', 'sizeName'],
      width: 100,
      sorter: (a, b) => a.size.sizeName.localeCompare(b.size.sizeName),
    },
    {
      title: 'Thương Hiệu',
      dataIndex: ['product', 'brand', 'brandName'],
      width: 100,
      sorter: (a, b) => a.product.brand.brandName.localeCompare(b.product.brandbrandName),
    },
    {
      title: 'Kiểu Ngăn',
      dataIndex: ['compartment', 'compartmentName'],
      width: 100,
      sorter: (a, b) => a.compartment.compartmentName.localeCompare(b.compartment.compartmentName),
    },
    {
      title: 'NSX',
      dataIndex: ['producer', 'producerName'],
      width: 100,
      sorter: (a, b) => a.producer.producerName.localeCompare(b.producer.producerName),
    },

    {
      title: 'Mô Tả',
      dataIndex: 'productDetailDescribe',
      width: 500,
      sorter: (a, b) => a.productDetailDescribe.localeCompare(b.productDetailDescribe),
    },
    {
      title: 'Trạng Thái',
      dataIndex: 'productDetailStatus',
      width: 100,
      sorter: (a, b) => a.productDetailStatus - b.productDetailStatus,
      render: (productDetailStatus) => {
        switch (productDetailStatus) {
          case 1:
            return 'Hoạt động';
          case 0:
            return 'Ngưng hoạt động';
          case -1:
            return 'Dừng hoạt động';
          default:
            return 'Không xác định';
        }
      },
    },
    {
      title: 'Giá Nhập',
      dataIndex: 'importPrice',
      fixed: 'right',
      width: 100,
      sorter: (a, b) => a.importPrice - b.importPrice,
      render: (importPrice) => VNDFormaterFunc(importPrice),
    },
    {
      title: 'Giá Bán',
      dataIndex: 'retailPrice',
      fixed: 'right',
      width: 100,
      sorter: (a, b) => a.retailPrice - b.retailPrice,
      render: (retailPrice) => VNDFormaterFunc(retailPrice),
    },
    {
      title: 'Số Lượng',
      dataIndex: 'productDetailAmount',
      fixed: 'right',
      width: 100,
      sorter: (a, b) => a.productDetailAmount - b.productDetailAmount,
      render: (productDetailAmount) => productDetailAmount + ' cái',
    },
  ];

  const start = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      fetchProducts(productId);
      props.handleRefresh();
    }, 300);
  };

  return (
    <Fragment>
      <Button style={{ borderColor: 'green', color: 'green' }} icon={<InfoOutlined />} onClick={showDrawer}>
        Thông Tin
      </Button>
      <Drawer
        title={'View Details'}
        placement="top"
        height={900} // max=900
        onClose={onClose}
        open={open}
        styles={{
          body: {
            paddingBottom: 80,
          },
        }}
      >
        <div>
          <div
            style={{
              marginBottom: 16,
            }}
          >
            <Button type="primary" onClick={start} loading={loading}>
              Reload
            </Button>
            <span
              style={{
                marginLeft: 8,
              }}
            ></span>
          </div>
          <Table
            rowKey={(record) => record.productDetailId}
            loading={loading}
            columns={columns}
            dataSource={baloList}
            pagination={pagination}
            scroll={{
              x: 1500,
              y: 500,
            }}
          />
        </div>
      </Drawer>
    </Fragment>
  );
}
export default FormProductViewDetails;
