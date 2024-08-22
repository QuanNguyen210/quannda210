import styles from './BaloDetailsPreview.module.scss';

import React, { Fragment, useEffect, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import {
  Button,
  Col,
  Drawer,
  Form,
  Input,
  InputNumber,
  Popconfirm,
  Row,
  Select,
  Space,
  Table,
  message,
  notification,
} from 'antd';
import baloAPI from '~/api/productsAPI';
import baloDetailsAPI from '~/api/productDetailsAPI';
import imageAPI from '~/api/ImageAPI';
import { generateCustomCode } from '~/Utilities/GenerateCustomCode';

const { Option } = Select;
function ProductDetailsPreviewTable(props) {
  const [loading, setLoading] = useState(false);

  const [baloList, setBaloList] = useState(props.baloList);
  const [baloListPreview, setBaloListPreview] = useState(props.baloListPreview);
  const columns = [
    {
      title: 'Màu Sắc',
      dataIndex: 'colorName',
      width: 100,
      sorter: (a, b) => a.productColor.localeCompare(b.productColor),
    },
    {
      title: 'Kiểu Balo',
      dataIndex: 'typeName',
      width: 200,
      sorter: (a, b) => a.typeName.localeCompare(b.typeName),
    },
    {
      title: 'Chất Liệu',
      dataIndex: 'materialName',
      width: 100,
      sorter: (a, b) => a.materialName.localeCompare(b.materialName),
    },
    {
      title: 'Kích Thước',
      dataIndex: 'sizeName',
      width: 100,
      sorter: (a, b) => a.sizeName.localeCompare(b.sizeName),
    },
    {
      title: 'Thương Hiệu',
      dataIndex: 'brandName',
      width: 100,
      sorter: (a, b) => a.brandName.localeCompare(b.brandName),
    },
    {
      title: 'Kiểu Ngăn',
      dataIndex: 'compartmentName',
      width: 100,
      sorter: (a, b) => a.compartmentName.localeCompare(b.compartmentName),
    },
    {
      title: 'Kiểu Khóa',
      dataIndex: 'buckleTypeName',
      width: 100,
      sorter: (a, b) => a.buckleTypeName.localeCompare(b.buckleTypeName),
    },
    {
      title: 'NSX',
      dataIndex: 'producerName',
      width: 100,
      sorter: (a, b) => a.producerName.localeCompare(b.producerName),
    },

    {
      title: 'Mô Tả',
      dataIndex: 'productDetailDescribe',
      width: 300,
      sorter: (a, b) => a.productDetailDescribe.localeCompare(b.productDetailDescribe),
    },
    {
      title: 'Trạng Thái',
      dataIndex: 'productDetailStatus',
      width: 100,
      sorter: (a, b) => a.baloDetailStatus - b.baloDetailStatus,
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
      width: 120,
      sorter: (a, b) => a.importPrice - b.importPrice,
      render: (text, record) => (
        <InputNumber
          value={text}
          onChange={(value) => handleEditChange(value, record.productCode, 'importPrice')}
          formatter={(value) => ` ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          parser={(value) => value.replace(/\₫\s?|(,*)/g, '')}
        />
      ),
    },
    {
      title: 'Giá Bán',
      dataIndex: 'retailPrice',
      fixed: 'right',
      width: 120,
      sorter: (a, b) => a.retailPrice - b.retailPrice,
      render: (text, record) => (
        <InputNumber
          value={text}
          onChange={(value) => handleEditChange(value, record.productCode, 'retailPrice')}
          formatter={(value) => ` ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          parser={(value) => value.replace(/\₫\s?|(,*)/g, '')}
        />
      ),
    },
    {
      title: 'Số Lượng',
      dataIndex: 'baloDetailAmount',
      fixed: 'right',
      width: 120,
      sorter: (a, b) => a.baloDetailAmount - b.baloDetailAmount,
      render: (text, record) => (
        <InputNumber
          value={text}
          onChange={(value) => handleEditChange(value, record.productCode, 'baloDetailAmount')}
          formatter={(value) => ` ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          parser={(value) => value.replace(/\₫\s?|(,*)/g, '')}
        />
      ),
    },
    {
      title: 'Action',
      key: 'action',
      width: 100,
      fixed: 'right',
      render: (text, record) =>
        record.productId === undefined ? (
          <Button
            onClick={() => {
              console.log(record);
              props.handleDelete(record);
            }}
          >
            Xóa
          </Button>
        ) : (
          ''
        ),
    },
  ];

  useEffect(() => {
    setBaloList(props.baloList);
    setBaloListPreview(props.baloListPreview);
  }, [props.baloList, props.baloListPreview]);

  const handleEditChange = (value, key, field) => {
    if (value <= 0) {
      message.error('Giá trị không hợp lệ ! (giá trị sẽ không thay đổi)');
    } else {
      const newData = [...baloListPreview];
      const target = newData.find((item) => item.productCode === key);

      if (target) {
        target[field] = value;
        setBaloListPreview(newData);
      }

      const newDataAdd = [...baloList];
      const targetAdd = newDataAdd.find((item) => item.productCode === key);
      if (targetAdd) {
        targetAdd[field] = value;
        setBaloList(newDataAdd);
      }
    }
  };
  const save = async () => {
    if (baloList.length !== 0) {
      const tempBalo = baloList[0];

      let baloDetails = baloList.map(
        ({
          productId,
          productDetailId,
          buckleTypeId,
          colorId,
          compartmentId,
          materialId,
          producerId,
          sizeId,
          typeId,
          productDetailStatus,
          importPrice,
          retailPrice,
          productDetailDescribe,
          baloDetailAmount,
        }) => ({
          product: {
            productId: props.product.productId,
          },
          buckleType: {
            buckleTypeId: buckleTypeId,
          },
          color: {
            colorId: colorId,
          },
          compartment: {
            compartmentId: compartmentId,
          },
          material: {
            materialId: materialId,
          },
          producer: {
            producerId: producerId,
          },
          size: {
            sizeId: sizeId,
          },
          type: {
            typeId: typeId,
          },
          productDetailId: productDetailId || null,
          importPrice: importPrice,
          retailPrice: retailPrice,
          productDetailDescribe: productDetailDescribe,
          productDetailAmount: baloDetailAmount,
          productDetailStatus: baloDetailAmount > 0 ? 1 : productDetailStatus,
        }),
      );

      try {
        var isDoneSuccess = true;
        for (const element of baloDetails) {
          var addElement = {
            ...element,
            product: {
              productId: props.product.productId,
            },
          };
          // if(element.productDetailAmount > 0) {
          //   element.productDetailStatus
          // }
          const response2 = await baloDetailsAPI.add(addElement);
          if (response2.status !== 200) {
            isDoneSuccess = false;
          }
        }

        if (isDoneSuccess === true) {
          notification.success({
            message: 'Sửa thành công',
            description: 'Chi tiết balo sửa thành công',
            duration: 2,
          });
          props.handleRefresh();
        }
      } catch (error) {
        console.log(error);
        notification.error({
          message: 'Lỗi',
          description: 'Đã có lỗi',
          duration: 2,
        });
      }
    } else {
      notification.error({
        message: 'Lỗi',
        description: 'Chưa có sản phẩm nào trong Danh sách thêm, vui lòng điền Form bên dưới để thêm',
        duration: 2,
      });
    }
  };
  const start = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };
  useEffect(() => {
    start();
    setBaloList(props.baloList);
    setBaloListPreview(props.baloListPreview);
  }, [props.baloList, props.baloListPreview]);
  return (
    <Fragment>
      <div>
        <div
          style={{
            marginBottom: 16,
          }}
        >
          <div className={styles.handleButton}>
            <div>
              <Button type="primary" onClick={start} loading={loading} shape="round" size="large">
                Reload
              </Button>
            </div>
            <div className={styles.buttonSave}>
              <Popconfirm
                getPopupContainer={(triggerNode) => triggerNode.parentNode}
                title="Xác Nhận"
                description="Bạn Có chắc chắn muốn lưu?"
                okText="Đồng ý"
                cancelText="Không"
                onConfirm={save}
                onCancel={start}
              >
                <Button type="primary" loading={loading} shape="round" size="large">
                  Lưu
                </Button>
              </Popconfirm>
            </div>
          </div>
          <span
            style={{
              marginLeft: 8,
            }}
          ></span>
        </div>
        <Table
          rowKey={(record) =>
            record.productDetailId +
            record.brandId +
            record.buckleTypeId +
            record.colorId +
            record.compartmentId +
            record.materialId
          }
          loading={loading}
          columns={columns}
          dataSource={baloListPreview}
          pagination={false}
          scroll={{
            x: 1500,
            y: 600,
          }}
          style={{ maxHeight: '700px' }}
        />
      </div>
    </Fragment>
  );
}
export default ProductDetailsPreviewTable;
