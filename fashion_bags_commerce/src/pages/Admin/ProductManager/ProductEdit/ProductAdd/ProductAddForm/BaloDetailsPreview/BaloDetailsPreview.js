import styles from './BaloDetailsPreview.module.scss';

import React, { Fragment, useEffect, useState } from 'react';
import { PlusOutlined, SaveOutlined } from '@ant-design/icons';
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
import { MdRefresh } from 'react-icons/md';

const { Option } = Select;
function BaloDetailsPreview(props) {
  const [loading, setLoading] = useState(false);

  const [baloList, setBaloList] = useState(props.baloList);
  const [baloListPreview, setBaloListPreview] = useState(props.baloListPreview);
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 4,
    },
  });
  // console.log(props.baloListPreview);
  const columns = [
    {
      title: 'STT',
      dataIndex: 'stt',
      fixed: 'left',
      width: 100,
      render: (text, record, index) => <span>{index + 1}</span>,
    },
    {
      title: 'Mã Balo',
      dataIndex: 'productCode',
      fixed: 'left',
      width: 100,
      sorter: (a, b) => a.productCode.localeCompare(b.productCode),
    },
    {
      title: 'Tên Balo',
      dataIndex: 'productName',
      width: 300,
      fixed: 'left',
      sorter: (a, b) => a.productName.localeCompare(b.productName),
    },
    {
      title: 'Màu Sắc',
      dataIndex: 'colorName',
      width: 100,
      sorter: (a, b) => a.colorName.localeCompare(b.colorName),
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
      width: 250,
      sorter: (a, b) => a.productDetailDescribe.localeCompare(b.productDetailDescribe),
    },
    {
      title: 'Trạng Thái',
      dataIndex: 'productDetailStatus',
      width: 100,
      sorter: (a, b) => a.productDetailStatus - b.productDetailStatus,
      render: (status) => {
        switch (status) {
          case 1:
            return 'Hoạt động';
          case 0:
            return 'Không hoạt động';
          case -1:
            return 'Trạng thái khác';
          default:
            return 'Không xác định';
        }
      },
    },
    {
      title: 'Giá Nhập',
      dataIndex: 'importPrice',
      fixed: 'right',
      width: 150,
      sorter: (a, b) => a.importPrice - b.importPrice,
      render: (text, record) => (
        <InputNumber
          value={text}
          style={{
            width: '100%',
          }}
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
      width: 150,
      sorter: (a, b) => a.retailPrice - b.retailPrice,
      render: (text, record) => (
        <InputNumber
          style={{
            width: '100%',
          }}
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
          style={{
            width: '100%',
          }}
          value={text}
          onChange={(value) => handleEditChange(value, record.productCode, 'baloDetailAmount')}
          formatter={(value) => ` ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          parser={(value) => value.replace(/\₫\s?|(,*)/g, '')}
        />
      ),
    },
    {
      title: 'Hành Động',
      key: 'action',
      width: 100,
      fixed: 'right',
      render: (text, record) => <Button onClick={() => props.handleDelete(record)}>Xóa</Button>,
    },
  ];

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
      console.log('====================================');
      console.log('tempBalo');
      console.log(tempBalo);
      console.log('====================================');
      const baloAdd = {
        productCode: tempBalo.productCode,
        productName: tempBalo.productName,
        brand: { brandId: tempBalo.brandId },
        productStatus: tempBalo.productStatus,
      };

      let baloDetails = baloList.map(
        ({
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

          importPrice: importPrice,
          retailPrice: retailPrice,
          productDetailDescribe: productDetailDescribe,
          productDetailAmount: baloDetailAmount,
          productDetailStatus: productDetailStatus,
        }),
      );

      try {
        const response = await baloAPI.add(baloAdd);
        const id = response.data.productId;
        const result = await props.handleSendUpload();
        if (result !== undefined) {
          for (const obj of result) {
            const uploadedImage = obj;
            const imageAdd = {
              imgCode: uploadedImage.imgCode,
              imgName: uploadedImage.imgName,
              imgUrl: uploadedImage.imgUrl,
              isPrimary: true,
              products: {
                productId: id,
              },
            };
            const response = await imageAPI.upload(imageAdd);
          }
        } else {
          return;
        }

        baloDetails.forEach((element) => {
          element = {
            ...element,
            product: {
              productId: id,
            },
          };
          console.log('đây là detail');
          console.log(element);
          const response2 = baloDetailsAPI.add(element);
        });

        notification.success({
          message: 'Add thành công',
          description: 'Dữ liệu đã được thêm thành công',
          duration: 2,
        });
      } catch (error) {
        console.log(error);
        notification.error({
          message: 'Lỗi',
          description: 'Đã có lỗi vui lòng thử lại!',
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
    }, 1000);
  };
  useEffect(() => {
    start();

    setBaloList(props.baloList);
    setBaloListPreview(props.baloListPreview);
  }, [props.baloList, props.baloListPreview]);
  const handleTableChange = (pagination, filters, sorter) => {
    setTableParams({
      pagination,
    });
  };
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
              <Button size="large" shape="round" icon={<MdRefresh />} type="primary" onClick={start} loading={loading}>
                Làm Mới
              </Button>
            </div>
            <div className={styles.buttonSave}>
              <Popconfirm
                title="Xác Nhận"
                description="Bạn Có chắc chắn muốn Thêm?"
                okText="Đồng ý"
                cancelText="Không"
                onConfirm={save}
                onCancel={start}
              >
                <Button size="large" shape="round" type="primary" icon={<SaveOutlined />} loading={loading}>
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
          rowKey={(record) => record.productCode}
          loading={loading}
          columns={columns}
          dataSource={baloListPreview}
          pagination={tableParams.pagination}
          onChange={handleTableChange}
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
export default BaloDetailsPreview;
