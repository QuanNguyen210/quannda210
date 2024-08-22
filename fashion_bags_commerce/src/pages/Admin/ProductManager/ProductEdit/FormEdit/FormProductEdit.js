import styles from '../FormEdit/FormProductEdit.module.scss';

import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { EditOutlined, InboxOutlined, PlusOutlined } from '@ant-design/icons';
import {
  Button,
  Col,
  Drawer,
  Form,
  Image,
  Input,
  Modal,
  Popconfirm,
  Row,
  Select,
  Space,
  Table,
  Upload,
  message,
  notification,
} from 'antd';
import ProductDetailsEdit from './ProductDetailsEdit/ProductDetailsEdit';
import baloDetailsAPI from '~/api/productDetailsAPI';
import brandAPI from '~/api/propertitesBalo/brandAPI';
import productAPI from '~/api/productsAPI';
import productDetailsAPI from '~/api/productDetailsAPI';
import { deleteObject, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '~/firebase/firebase';
import Dragger from 'antd/es/upload/Dragger';
import imageAPI from '~/api/ImageAPI';
import { generateCustomCode } from '~/Utilities/GenerateCustomCode';
import VNDFormaterFunc from '~/Utilities/VNDFormaterFunc';
import ProductDetailsAdd from './ProductDetailsEdit/ProductDetailsAdd/ProductDetailsAdd';
const { Option } = Select;

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

function FormProductEdit(props) {
  notification.config({
    getContainer: () => document.getElementById('notification-container'),
  });
  const [form] = Form.useForm();
  const [isFirst, setIsFirst] = useState(false);

  const [open, setOpen] = useState(false);
  const [product, setProduct] = useState(props.product);
  const [brand, setBrand] = useState([]);
  const [productBrand, setProductBrand] = useState(props.brand || {});
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [baloList, setBaloList] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [imageList, setImageList] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });
  const [fileList, setFileList] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    console.log(props.product.productStatus);
    setProduct(props.product);
  }, [open, product, props]);
  const start = () => {
    setLoading(true);

    setLoading(false);
    fetchProducts(product.productId);
    props.handleRefresh();
  };
  const fetchProducts = useCallback(async (productId) => {
    setLoading(true);

    try {
      const response = await baloDetailsAPI.getAllByProductId(productId);
      const data = response.data;

      setBaloList(data);
      if (response.status === 200) {
        setLoading(false);
      }
    } catch (error) {
      console.error('Đã xảy ra lỗi: ', error);
    }
  }, []);
  const handleLoadBrand = async () => {
    const brandData = await brandAPI.getAll();
    setBrand(brandData.data);
  };
  const handleCovertImg = (downloadedImageList) => {
    const imgListConvert = props.product.images || [];
    imgListConvert.push(...downloadedImageList);
    const transformedImageList = imgListConvert.map((image) => ({
      uid: image.imageId,
      name: image.imgName,
      status: 'done', // Hoặc bạn có thể set giá trị status khác nếu cần thiết
      url: image.imgUrl,
    }));

    setImageList(transformedImageList);
  };
  useEffect(() => {
    if (true) {
      handleCovertImg([]);
      setProductBrand(props.brand || '');
    }
  }, []);
  const columns = [
    {
      title: 'STT',
      dataIndex: 'index',
      key: 'index',
      width: 70,
      fixed: 'left',
      render: (text, record, index) => <span>{(pagination.current - 1) * pagination.pageSize + index + 1}</span>,
    },
    {
      title: 'Màu Sắc',
      dataIndex: ['color', 'colorName'],
      width: 200,
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
      width: 200,
      sorter: (a, b) => a.material.materialName.localeCompare(b.material.materialName),
    },
    {
      title: 'Kích Thước',
      dataIndex: ['size', 'sizeName'],
      width: 200,
      sorter: (a, b) => a.size.sizeName.localeCompare(b.size.sizeName),
    },
    {
      title: 'Thương Hiệu',
      dataIndex: ['product', 'brand', 'brandName'],
      width: 200,
      sorter: (a, b) => a.product.brand.brandName.localeCompare(b.product.brandbrandName),
    },
    {
      title: 'Kiểu Ngăn',
      dataIndex: ['compartment', 'compartmentName'],
      width: 200,
      sorter: (a, b) => a.compartment.compartmentName.localeCompare(b.compartment.compartmentName),
    },
    {
      title: 'Nhà Sản Xuất',
      dataIndex: ['producer', 'producerName'],
      width: 200,
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
      width: 200,
      sorter: (a, b) => a.productDetailStatus - b.productDetailStatus,
      render: (productDetailStatus) => {
        switch (productDetailStatus) {
          case 1:
            return 'Hoạt Động';
          case 0:
            return 'Ngưng Hoạt Động';
          case -1:
            return 'Hủy Hoạt Động';
          default:
            return 'Không Xác Định';
        }
      },
    },
    {
      title: 'Giá Nhập',
      dataIndex: 'importPrice',
      fixed: 'right',
      width: 150,
      sorter: (a, b) => a.importPrice - b.importPrice,
      render: (importPrice) => VNDFormaterFunc(importPrice) + ' / Cái',
    },
    {
      title: 'Giá Bán',
      dataIndex: 'retailPrice',
      fixed: 'right',
      width: 150,
      sorter: (a, b) => a.retailPrice - b.retailPrice,
      render: (retailPrice) => VNDFormaterFunc(retailPrice) + ' / Cái',
    },
    {
      title: 'Số Lượng',
      dataIndex: 'productDetailAmount',
      fixed: 'right',
      width: 150,
      sorter: (a, b) => a.productDetailAmount - b.productDetailAmount,
      render: (productDetailAmount) => productDetailAmount + ' cái',
    },
  ];
  const showDrawer = () => {
    fetchProducts(product.productId);
    handleLoadBrand();
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };
  const handleEdit = () => {
    form.submit();
  };
  const handleEditProductDetails = async (values) => {
    const editBalo = {
      productId: props.product.productId,
      productCode: values.productCode,
      productName: values.productName,
      productStatus: values.productStatus,
      brand: {
        brandId: values.brandId,
      },
    };
    try {
      const response = await productAPI.update(editBalo);

      if (response.status === 200) {
        message.success('Sửa thành công');
        props.handleRefresh();
      } else {
        message.error('Sửa không thành công!!!');
      }
    } catch (error) {
      notification.error({
        message: 'Lỗi',
        description: 'Lỗi',
        duration: 2,
      });
    }
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedKeys) => {
      setSelectedRowKeys(selectedKeys);
    },
  };
  const handleDeleteSelected = async (status) => {
    setSelectedRowKeys([]);
    if (selectedRowKeys.length === 0) {
      notification.info({
        message: 'Lỗi',
        description: 'Vui lòng Chọn Sản phẩm chi tiết cần xóa!!!!',
        duration: 2,
      });
    } else {
      var isDone = true;
      for (const e of selectedRowKeys) {
        try {
          const response = await productDetailsAPI.updateStatus(e, status);
          if (response.status !== 200) {
            isDone = false;
          }
        } catch (error) {
          isDone = false;
        }
      }
      if (isDone === true) {
        // start();
        notification.success({
          message: 'Thành công',
          description: 'Đã xóa thành công!!!!',
          duration: 2,
        });
        fetchProducts(props.product.productId);
      } else {
        notification.error({
          message: 'Lỗi',
          description: 'Đã có lỗi trong quá trình xóa!!!!',
          duration: 2,
        });
      }
    }
  };
  useEffect(() => {
    if (true) {
      let err = '';
      var tempList = fileList;
      if (imageList.length + fileList.length > 6) {
        err = `Mỗi sản phẩm chỉ tối đa 6 ảnh (Đã có ${imageList.length} cái) , vui lòng chọn lại!!!!`;
        tempList = [];
        setFileList([]);
      } else {
        for (let i = 0; i < fileList.length; i++) {
          const element = fileList[i];

          if (!(element.type !== 'image/jpg' || element.type !== 'image/png')) {
            err = 'Vui lòng chọn ảnh có định dạng PNG/JPG';
            tempList = [];
            setFileList([]);
            break;
          }
          if (element.size / 1024 / 1024 > 5) {
            err = 'Size ảnh quá lớn (nhỏ hơn 5Mb), vui lòng chọn lại';
            tempList = [];
            setFileList([]);
            break;
          }
        }
      }
      if (err !== '') {
        message.error(err);
        err = '';
      }
      if (tempList.length !== 0 && err === '') {
        handleUploadImage(tempList);
      }
    }
  }, [fileList]);

  const handleUploadImage = async (moreImgList) => {
    const key = 'updatable';
    var waitingTime = 9999999;
    messageApi.open({
      key,
      type: 'loading',
      content: 'Đang Upload ảnh lên hệ thống',
      duration: waitingTime,
    });
    for (let i = 0; i < moreImgList.length; i++) {
      var isDone = false;
      const addCodeImg = generateCustomCode('image', 5);
      const now = new Date();
      const dateString = `${now.getMonth()}_${now.getDate()}_${now.getFullYear()}_${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}:${now.getMilliseconds()}`;
      const file = moreImgList[i];
      const name = addCodeImg + '_' + dateString;
      const renamedFile = new File([file], name, { type: file.type });
      const storageRef = ref(storage, `mulitpleFiles/${name}`);
      try {
        await uploadBytes(storageRef, renamedFile);
        const downloadURL = await getDownloadURL(storageRef);

        const uploadedImage = {
          imgUrl: downloadURL,
          imgCode: addCodeImg,
          imgName: name,
          isPrimary: true,
          products: {
            productId: product.productId,
          },
        };
        //// save vào db
        const response = await imageAPI.upload(uploadedImage);
        if (response.status === 200) {
          const tempList = [];
          tempList.push(response.data);
          handleCovertImg(tempList);
        }
      } catch (error) {
        console.log('Lỗi khi tải lên:', error);
        message.error('Lỗi khi tải lên hình ảnh');
      }
      isDone = true;
      waitingTime = 0;
    }

    messageApi.open({
      key,
      type: 'success',
      content: 'Đã tải ảnh thành công!',
      duration: 2,
    });

    // return newList;
  };
  const addFileImg = (fileLists) => {
    setFileList(fileLists);
  };
  const beforeUpload = (file, fileLists) => {
    addFileImg(fileLists);
    return false;
  };
  const UploadDragger = (
    <Dragger multiple name="files" showUploadList={false} beforeUpload={beforeUpload}>
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">Kéo thả hình ảnh vào đây</p>
    </Dragger>
  );
  const handleCancel = () => setPreviewOpen(false);
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
  };
  const handleChange = ({ fileList: newFileList }) => {
    const deletedFiles = imageList.filter((oldFile) => !newFileList.some((newFile) => newFile.uid === oldFile.uid));
    handleDeleteImage(deletedFiles[0]);

    setImageList(newFileList);
  };
  const handleDeleteImage = async (file) => {
    const desertRef1 = ref(storage, 'mulitpleFiles/' + file.name);
    deleteObject(desertRef1)
      .then(async () => {
        try {
          const response = await imageAPI.delete(file.uid);
          if (response.status === 200) {
            notification.success({
              message: 'Thành Công',
              description: 'Xóa thành công ' + file.name,
              duration: 2,
            });
            props.handleRefresh();
            fetchProducts(product.productId);
          } else {
            notification.error({
              message: 'Lỗi',
              description: 'Xóa lỗi',
              duration: 2,
            });
          }
        } catch (error) {}
      })
      .catch((error) => {
        notification.error({
          message: 'Lỗi',
          description: 'Xóa ' + file.fileName + 'lỗi',
          duration: 2,
        });
      });
  };
  const DeleteButton = (
    <div>
      <Row>
        <Col span={9}>
          <Popconfirm
            title="Xác Nhận"
            description="Bạn Có chắc chắn sửa Sản phẩm hoạt động?"
            okText="Đồng ý"
            cancelText="Không"
            onConfirm={() => {
              handleDeleteSelected(1);
            }}
            onCancel={() => {}}
          >
            <Button type="primary" shape="round" loading={false} disabled={selectedRowKeys.length === 0}>
              Hoạt động
            </Button>
          </Popconfirm>
        </Col>
        <Col span={5}>
          <Popconfirm
            title="Xác Nhận"
            description="Bạn Có chắc chắn hủy ?"
            okText="Đồng ý"
            cancelText="Không"
            onConfirm={() => {
              handleDeleteSelected(-1);
            }}
            onCancel={() => {}}
          >
            <Button type="primary" danger shape="round" loading={false} disabled={selectedRowKeys.length === 0}>
              Hủy
            </Button>
          </Popconfirm>
        </Col>
        <Col span={8}>
          <Popconfirm
            title="Xác Nhận"
            description="Bạn Có chắc chắn sửa hết hàng Sản phẩm?"
            okText="Đồng ý"
            cancelText="Không"
            onConfirm={() => {
              handleDeleteSelected(0);
            }}
            onCancel={() => {}}
          >
            <Button type="dashed" danger shape="round" loading={false} disabled={selectedRowKeys.length === 0}>
              Ngưng Hoạt động
            </Button>
          </Popconfirm>
        </Col>
      </Row>
    </div>
  );
  return (
    <Fragment>
      {contextHolder}
      <div id="notification-container">
        {contextHolder}
        <Button style={{ borderColor: 'blue', color: 'blue' }} onClick={showDrawer} icon={<EditOutlined />}>
          Sửa
        </Button>
        <Drawer
          title={'Edit - ' + product.productCode}
          width={1600}
          onClose={onClose}
          open={open}
          styles={{
            body: {
              paddingBottom: 80,
            },
          }}
          extra={<div></div>}
        >
          <h1>Thông tin Balo</h1>
          <div>
            <Popconfirm
              title="Xác Nhận"
              description="Bạn Có chắc chắn muốn Sửa?"
              okText="Đồng ý"
              cancelText="Không"
              onConfirm={handleEdit}
              onCancel={() => {}}
            >
              <Button type="primary" loading={false}>
                Sửa Balo
              </Button>
            </Popconfirm>
          </div>
          <hr></hr>
          <Form
            layout="vertical"
            hideRequiredMark
            initialValues={{
              productCode: product.productCode,
              productName: product.productName,
              productStatus: props.product.productStatus,
              brandId: productBrand.brandId,
            }}
            onFinish={handleEditProductDetails}
            form={form}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="productCode"
                  label="Mã Code Balo "
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng điền Mã Code Balo',
                    },
                  ]}
                >
                  <Input placeholder="Vui lòng điền Mã Code Balo" readOnly />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="productName"
                  label="Tên "
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng điền Tên Balo',
                    },
                  ]}
                >
                  <Input name="baloName" placeholder="Vui lòng điền Tên Balo" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="productStatus"
                  label="Trạng Thái Balo"
                  rules={[
                    {
                      required: true,
                      message: 'Please select an owner',
                    },
                  ]}
                >
                  <Select value={props.product.productStatus} placeholder="Vui lòng chọn Trạng Thái Balo">
                    <Option value={1}>Hoạt Động</Option>
                    <Option value={0}>Không Hoạt Động</Option>
                    <Option value={-1}>Hủy Hoạt Động</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Row>
                  <Col span={12}>
                    <Form.Item
                      label="Thương Hiệu"
                      name="brandId"
                      rules={[
                        {
                          required: true,
                          message: 'Vui lòng chọn Thương Hiệu!',
                        },
                      ]}
                    >
                      <Select
                        size="large"
                        style={{
                          width: 200,
                        }}
                      >
                        {brand.map((o) => (
                          <Select.Option key={o.brandId} value={o.brandId}>
                            {o.brandName}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12}></Col>
                </Row>
              </Col>
            </Row>
          </Form>
          <hr></hr>
          <div>
            <Upload
              listType="picture-card"
              fileList={imageList}
              onPreview={handlePreview}
              onChange={handleChange}
            ></Upload>
            {imageList.length >= 96 || fileList.length >= 96 ? null : UploadDragger}
            <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
              <Image
                onClick={() => {
                  setPreviewOpen(false);
                }}
                alt="example"
                style={{
                  width: '100%',
                }}
                src={previewImage}
              />
            </Modal>
          </div>
          <hr></hr>
          <div>
            <h1>Thông tin Balo Chi tiết</h1>
            <hr></hr>
            <div
              style={{
                marginBottom: 16,
              }}
            >
              <div style={{ padding: '10px' }}>
                <Row>
                  <Col span={2}>
                    <Button type="primary" shape="round" onClick={start} loading={loading}>
                      Reload
                    </Button>
                  </Col>
                  <Col span={2}>
                    <ProductDetailsAdd
                      productDetailList={baloList}
                      brand={props.brand}
                      handleRefresh={start}
                      product={props.product}
                    />
                  </Col>
                  <Col span={2}></Col>
                  <Col span={2}></Col>
                  <Col span={2}></Col>
                  <Col span={2}></Col>
                  <Col span={2}></Col>
                  <Col span={2}></Col>
                  <Col span={2}></Col>
                  <Col span={5}>{selectedRowKeys.length === 0 ? null : DeleteButton}</Col>
                </Row>
              </div>
              <Table
                rowKey={(record) => record.productDetailId}
                rowSelection={rowSelection}
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
          </div>
        </Drawer>
      </div>
    </Fragment>
  );
}
export default FormProductEdit;
