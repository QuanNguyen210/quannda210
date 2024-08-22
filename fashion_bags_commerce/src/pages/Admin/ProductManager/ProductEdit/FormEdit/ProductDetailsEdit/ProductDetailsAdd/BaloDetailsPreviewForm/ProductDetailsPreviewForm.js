//CSS
import styles from './index.module.scss';
//React Component
import React, { Fragment, memo, useContext, useEffect, useState } from 'react';
import { InboxOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import {
  Button,
  Col,
  Form,
  InputNumber,
  Modal,
  Popconfirm,
  Row,
  Select,
  Table,
  Typography,
  Upload,
  message,
  notification,
} from 'antd';
import Input from 'antd/es/input/Input';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '~/firebase/firebase';

//API
import baloAPI from '~/api/productsAPI';
// Utils
import { generateCustomCode } from '~/Utilities/GenerateCustomCode';
import TextArea from 'antd/es/input/TextArea';
import Title from 'antd/es/skeleton/Title';
import colorAPI from '~/api/propertitesBalo/colorAPI';
import { Option } from 'antd/es/mentions';
import brandAPI from '~/api/propertitesBalo/brandAPI';
import compartmentAPI from '~/api/propertitesBalo/compartmentAPI';
import materialAPI from '~/api/propertitesBalo/materialAPI';
import producerAPI from '~/api/propertitesBalo/producerAPI';
import sizeAPI from '~/api/propertitesBalo/sizeAPI';
import typeAPI from '~/api/propertitesBalo/typeAPI';
import buckleTypeAPI from '~/api/propertitesBalo/buckleTypeAPI';
// import { useDropzone } from 'react-dropzone';
import imageAPI from '~/api/ImageAPI';
import { async } from '@firebase/util';
import Dragger from 'antd/es/upload/Dragger';
import ProductDetailsPreviewTable from '../ProductDetailsPreviewTable/ProductDetailsPreviewTable';
//Function Component
function ProductDetailsPreviewForm(props) {
  notification.config({
    getContainer: () => document.getElementById('notification-containerp2'),
  });

  const [images, setImages] = useState([]);
  const [isFirst, setIsFirst] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(true);
  const [isPopconfirmVisible, setPopconfirmVisible] = useState(false);
  const [baloList, setBaloList] = useState([]);
  const [baloListPreview, setBaloListPreview] = useState([]);
  const [brand, setBrand] = useState([]);
  const [buckleType, setBuckleType] = useState([]);
  const [color, setColor] = useState([]);
  const [compartment, setCompartment] = useState([]);
  const [material, setMaterial] = useState([]);
  const [producer, setProducer] = useState([]);
  const [size, setSize] = useState([]);
  const [type, setType] = useState([]);
  const [downloadedURL, setDownloadedURL] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const viewBaloProps = async () => {
    try {
      const brandData = await brandAPI.getAll();
      setBrand(brandData.data);
      const buckleTypeData = await buckleTypeAPI.getAll();
      setBuckleType(buckleTypeData.data);
      const colorData = await colorAPI.getAll();
      setColor(colorData.data);
      const compartmentData = await compartmentAPI.getAll();
      setCompartment(compartmentData.data);
      const materialData = await materialAPI.getAll();
      setMaterial(materialData.data);
      const producerData = await producerAPI.getAll();
      setProducer(producerData.data);
      const sizeData = await sizeAPI.getAll();
      setSize(sizeData.data);
      const typeData = await typeAPI.getAll();
      setType(typeData.data);
    } catch (error) {
      console.error('Đã xảy ra lỗi: ', error);
    }
  };

  useEffect(() => {
    viewBaloProps();
  }, []);
  const [form] = Form.useForm();
  const showDrawer = () => {
    setOpen(true);
  };

  const onFinishFailed = (errorInfo) => {
    setError(true);
    const errorMessages = Object.values(errorInfo.errorFields)
      .map((field) => field.errors)
      .flat();
    notification.error({
      message: 'Lỗi',
      description: errorMessages + '/n',
      duration: 2,
    });
  };
  const onClose = () => {
    form.resetFields();
    setOpen(false);
  };
  const handleresetForm = () => {
    form.resetFields([
      'colorName',
      'typeName',
      'materialName',
      'sizeName',
      'brandName',
      'compartmentName',
      'buckleTypeName',
      'producerName',
      'importPrice',
      'retailPrice',
      'baloDetailAmount',
      'baloDetailDescribe',
      'imageUrl',
      'baloDetailStatus',
    ]);
    setOpen(false);
  };
  const handleAddBaloDetails = (values) => {
    if (values.retailPrice <= values.importPrice) {
      console.log('abc');

      notification.error({
        message: 'Lỗi',
        description: 'Giá bán không thể nhỏ hơn hoặc bằng Giá nhập!!!',
        duration: 1,
      });
      setIsFirst(false);
      return;
    }
    const keyProduct =
      values.buckleTypeId +
      values.colorId +
      values.compartmentId +
      values.materialId +
      values.producerId +
      values.typeId +
      values.sizeId;

    const mangMoi = props.productDetailList.map((obj) => ({
      buckleTypeId: obj.buckleType.buckleTypeId,
      colorId: obj.color.colorId,
      compartmentId: obj.compartment.compartmentId,
      materialId: obj.material.materialId,
      producerId: obj.producer.producerId,
      typeId: obj.type.typeId,
      sizeId: obj.size.sizeId,
    }));
    const newArr = [...mangMoi, ...baloList, ...baloListPreview];

    const indexBaloProps = newArr.findIndex(
      (item) =>
        (
          item.buckleTypeId +
          item.colorId +
          item.compartmentId +
          item.materialId +
          item.producerId +
          item.typeId +
          item.sizeId
        ).toLowerCase() === keyProduct.toLowerCase(),
    );
    if (indexBaloProps !== -1) {
      notification.error({
        message: 'Lỗi',
        description: 'Các trường thuộc tính này Bạn đa đã thêm trước đó, vui lòng chọn khác!!!',
        duration: 1,
      });

      return;
    }
    setIsFirst(true);
    const genCodeAuto = generateCustomCode('BaloCode', 9);

    let addBalo = { ...values, productCode: genCodeAuto };
    setBaloList([...baloList, addBalo]);

    let colorSelected = color.find((option) => option.colorId === values.colorId);
    const colorSelectedName = colorSelected.colorName;

    const brandSelectedName = props.product.brand.brandName;
    let typeSelected = type.find((option) => option.typeId === values.typeId);
    const typeSelectedName = typeSelected.typeName;
    let materialSelected = material.find((option) => option.materialId === values.materialId);
    const materialSelectedName = materialSelected.materialName;
    let compartmentSelected = compartment.find((option) => option.compartmentId === values.compartmentId);
    const compartmentSelectedName = compartmentSelected.compartmentName;
    let sizeSelected = size.find((option) => option.sizeId === values.sizeId);
    const sizeSelectedName = sizeSelected.sizeName;
    let producerSelected = producer.find((option) => option.producerId === values.producerId);
    const producerSelectedName = producerSelected.producerName;
    let buckleTypeSelected = buckleType.find((option) => option.buckleTypeId === values.buckleTypeId);
    const buckleTypeSelectedName = buckleTypeSelected.buckleTypeName;

    let tempBalo = {
      ...values,
      productCode: genCodeAuto,
      colorName: colorSelectedName,
      brandName: brandSelectedName,
      typeName: typeSelectedName,
      materialName: materialSelectedName,
      compartmentName: compartmentSelectedName,
      sizeName: sizeSelectedName,
      producerName: producerSelectedName,
      buckleTypeName: buckleTypeSelectedName,
    };
    setBaloListPreview([...baloListPreview, tempBalo]);
    notification.success({
      message: 'Thành Công',
      description: 'Dữ liệu đã được thêm!!!!',
      duration: 2,
    });
  };
  useEffect(() => {
    const handleConvert = () => {
      const productDetailList = props.productDetailList;
      const brand = props.brand;
      const add = [];
      const preview = [];
      productDetailList.forEach((element) => {
        const genCodeAuto = generateCustomCode('baloCode', 9);
        const editProductDetailList = {
          productName: element.product.productName,

          productId: element.product.productId,

          productDetailId: element.productDetailId,
          productCode: genCodeAuto,

          productStatus: element.product.productStatus,
          importPrice: element.importPrice,

          retailPrice: element.retailPrice,

          baloDetailAmount: element.productDetailAmount,

          colorId: element.color.colorId,

          typeId: element.type.typeId,

          materialId: element.material.materialId,

          compartmentId: element.compartment.compartmentId,

          sizeId: element.size.sizeId,

          brandId: brand.brandId,

          producerId: element.producer.producerId,

          buckleTypeId: element.buckleType.buckleTypeId,

          productDetailStatus: element.productDetailStatus,
          productDetailDescribe: element.productDetailDescribe,
        };
        const previewProductDetailList = {
          productName: element.product.productName,
          productId: element.product.productId,
          productDetailId: element.productDetailId,
          productCode: genCodeAuto,
          productStatus: element.product.productStatus,
          importPrice: element.importPrice,
          retailPrice: element.retailPrice,
          baloDetailAmount: element.productDetailAmount,
          productDetailStatus: element.productDetailStatus,
          productDetailDescribe: element.productDetailDescribe,

          colorId: element.color.colorId,
          colorName: element.color.colorName,

          typeId: element.type.typeId,
          typeName: element.type.typeName,

          materialId: element.material.materialId,
          materialName: element.material.materialName,

          compartmentId: element.compartment.compartmentId,
          compartmentName: element.compartment.compartmentName,

          sizeId: element.size.sizeId,
          sizeName: element.size.sizeName,

          brandId: brand.brandId,
          brandName: brand.brandName,

          producerId: element.producer.producerId,
          producerName: element.producer.producerName,

          buckleTypeId: element.buckleType.buckleTypeId,
          buckleTypeName: element.buckleType.buckleTypeName,
        };
        add.push(editProductDetailList);
        preview.push(previewProductDetailList);
      });

      setBaloList(add);
      setBaloListPreview(preview);
    };
    handleConvert();
  }, [props.productDetailList, props.brand]);
  const resetForm = () => {
    form.resetFields();
    setIsFirst(false);

    notification.success({
      message: 'Hoàn Thành',
      description: 'Đã Reset Form thành công !!!!',
      duration: 2,
    });
  };
  const onConfirm = () => {
    setIsFirst(true);
    form.submit();
    setPopconfirmVisible(false);
  };

  const onCancel = () => {
    setPopconfirmVisible(false); // Đóng Popconfirm sau khi xác nhận
  };
  const handleDelete = (product) => {
    const keyProduct =
      product.buckleTypeId +
      product.colorId +
      product.compartmentId +
      product.materialId +
      product.producerId +
      product.typeId +
      product.sizeId +
      product.brandId;

    const indexBaloListPreview = baloListPreview.findIndex(
      (item) =>
        item.buckleTypeId +
          item.colorId +
          item.compartmentId +
          item.materialId +
          item.producerId +
          item.typeId +
          item.sizeId +
          item.brandId ===
        keyProduct,
    );

    const indexBaloList = baloList.findIndex(
      (item) =>
        item.buckleTypeId +
          item.colorId +
          item.compartmentId +
          item.materialId +
          item.producerId +
          item.typeId +
          item.sizeId +
          item.brandId ===
        keyProduct,
    );

    if (indexBaloListPreview !== -1) {
      const updatedBaloListPreview = [...baloListPreview];
      updatedBaloListPreview.splice(indexBaloListPreview, 1);
      setBaloListPreview(updatedBaloListPreview);
    }

    if (indexBaloList !== -1) {
      const updatedBaloList = [...baloList];
      updatedBaloList.splice(indexBaloList, 1);
      setBaloList(updatedBaloList);

      notification.success({
        message: 'Xóa thành công',
        description: 'Đã thành công!!!',
        duration: 2,
      });
    }
  };
  return (
    <Fragment>
      <div id="notification-containerp2">
        {contextHolder}
        <div>
          <ProductDetailsPreviewTable
            product={props.product}
            baloList={baloList}
            baloListPreview={baloListPreview}
            handleRefresh={props.handleRefresh}
            handleDelete={handleDelete}
          />
        </div>
        <div>
          <div>
            <Row>
              <h1 className={styles.titleInfo}>Thông Tin Balo Chi tiết</h1>
            </Row>
          </div>
        </div>
        <Form
          className={styles.lastDrawer}
          onFinish={handleAddBaloDetails}
          initialValues={{
            colorName: '',
            typeName: '',
            materialName: '',
            sizeName: '',
            brandName: '',
            compartmentName: '',
            buckleTypeName: '',
            producerName: '',
            baloDetailStatus: '',
            baloDetailDescribe: '',
          }}
          form={form}
          name="basic"
          onFinishFailed={onFinishFailed}
          autoComplete="on"
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          style={{}}
        >
          <div className={styles.form}>
            <Row>
              <Col span={8}>
                <Form.Item
                  label="Giá Nhập"
                  name="importPrice"
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng Điền giá nhập!',
                    },
                  ]}
                >
                  <InputNumber
                    size="large"
                    style={{ width: 200 }}
                    step={1000}
                    min={1}
                    addonAfter="VND"
                    formatter={(value) => ` ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={(value) => value.replace(/\₫\s?|(,*)/g, '')}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="Giá Bán"
                  name="retailPrice"
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng điền giá Bán!',
                    },
                  ]}
                >
                  <InputNumber
                    size="large"
                    style={{ width: 200 }}
                    step={1000}
                    min={1}
                    addonAfter="VND"
                    formatter={(value) => ` ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={(value) => value.replace(/\₫\s?|(,*)/g, '')}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="Số lượng"
                  name="baloDetailAmount"
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng điền Số lượng!',
                    },
                  ]}
                >
                  <InputNumber
                    size="large"
                    style={{ width: 200 }}
                    step={5}
                    min={1}
                    addonAfter="Cái"
                    formatter={(value) => ` ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={(value) => value.replace(/\₫\s?|(,*)/g, '')}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <Form.Item
                  label="Màu sắc"
                  name="colorId"
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng chọn màu sắc Balo!',
                    },
                  ]}
                >
                  <Select
                    size="large"
                    style={{
                      width: 200,
                    }}
                  >
                    {color.map((o) => (
                      <Select.Option key={o.colorId} value={o.colorId}>
                        {o.colorName}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="Kiểu Balo"
                  name="typeId"
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng chọn Kiểu Balo!',
                    },
                  ]}
                >
                  <Select
                    size="large"
                    style={{
                      width: 200,
                    }}
                  >
                    {type.map((o) => (
                      <Select.Option key={o.typeId} value={o.typeId}>
                        {o.typeName}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="Chất liệu Balo"
                  name="materialId"
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng chọn Chất Liệu Balo!',
                    },
                  ]}
                >
                  <Select
                    size="large"
                    style={{
                      width: 200,
                    }}
                  >
                    {material.map((o) => (
                      <Select.Option key={o.materialId} value={o.materialId}>
                        {o.materialName}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <Form.Item
                  label="Kiểu Ngăn"
                  name="compartmentId"
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng chọn Kiểu ngăn Balo!',
                    },
                  ]}
                >
                  <Select
                    size="large"
                    style={{
                      width: 200,
                    }}
                  >
                    {compartment.map((o) => (
                      <Select.Option key={o.compartmentId} value={o.compartmentId}>
                        {o.compartmentName}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="Balo Size"
                  name="sizeId"
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng chọn Size!',
                    },
                  ]}
                >
                  <Select
                    size="large"
                    style={{
                      width: 200,
                    }}
                  >
                    {size.map((o) => (
                      <Select.Option key={o.sizeId} value={o.sizeId}>
                        {o.sizeName} - {o.lengthSize}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}></Col>
            </Row>
            <Row>
              <Col span={8}>
                <Form.Item
                  label="Nhà Sản Xuất"
                  name="producerId"
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng Chọn NSX!',
                    },
                  ]}
                >
                  <Select
                    size="large"
                    style={{
                      width: 200,
                    }}
                  >
                    {producer.map((o) => (
                      <Select.Option key={o.producerId} value={o.producerId}>
                        {o.producerName}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="Kiểu Khóa"
                  name="buckleTypeId"
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng Chọn Kiếu Khóa!',
                    },
                  ]}
                >
                  <Select
                    size="large"
                    style={{
                      width: 200,
                    }}
                  >
                    {buckleType.map((o) => (
                      <Select.Option key={o.buckleTypeId} value={o.buckleTypeId}>
                        {o.buckleTypeName}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="Trạng Thái"
                  name="productDetailStatus"
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng Chọn Kiếu Khóa!',
                    },
                  ]}
                >
                  <Select
                    size="large"
                    style={{
                      width: 200,
                    }}
                    options={[
                      {
                        value: 1,
                        label: 'Hoạt Động',
                      },
                      {
                        value: 0,
                        label: 'Không Hoạt Động',
                      },
                    ]}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row className={styles.upload}>
              <Col span={8}>
                <Form.Item
                  label="Mô tả"
                  name="productDetailDescribe"
                  rules={[
                    {
                      required: false,
                      message: 'Vui lòng điền Tên Balo!',
                    },
                  ]}
                >
                  <TextArea rows={7} />
                </Form.Item>
              </Col>
              <Col span={8}></Col>
              <Col span={8}></Col>
            </Row>
          </div>
          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            <Row>
              <Col span={4}></Col>
              <Col span={5}>
                <Popconfirm
                  getPopupContainer={(triggerNode) => triggerNode.parentNode}
                  title="Xác Nhận"
                  description="Bạn Có chắc chắn muốn Thêm?"
                  okText="Đồng ý"
                  cancelText="Không"
                  onConfirm={onConfirm}
                  onCancel={onCancel}
                >
                  <Button type="primary" shape="round" size="large">
                    Thêm Chi Tiết Balo
                  </Button>
                </Popconfirm>
              </Col>
              <Col span={4}>
                <Popconfirm
                  getPopupContainer={(triggerNode) => triggerNode.parentNode}
                  title="Xác Nhận"
                  description="Bạn Có chắc chắn muốn ResetForm và thêm Balo Khác?"
                  okText="Đồng ý"
                  cancelText="Không"
                  onConfirm={resetForm}
                  onCancel={onCancel}
                >
                  <Button type="dashed" shape="round" size="large">
                    ResetForm
                  </Button>
                </Popconfirm>
              </Col>
            </Row>
          </Form.Item>
        </Form>
      </div>
    </Fragment>
  );
}
export default ProductDetailsPreviewForm;
