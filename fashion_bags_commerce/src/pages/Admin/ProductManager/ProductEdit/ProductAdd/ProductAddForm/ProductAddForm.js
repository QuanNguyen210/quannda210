//CSS
import styles from './index.module.scss';
//React Component
import React, { Fragment, memo, useContext, useEffect, useState } from 'react';
import {
  AppstoreAddOutlined,
  InboxOutlined,
  PlusCircleFilled,
  PlusOutlined,
  PlusSquareOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import {
  Button,
  Col,
  Form,
  Image,
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
import BaloDetailsPreview from './BaloDetailsPreview/BaloDetailsPreview';
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
import { MdRefresh } from 'react-icons/md';

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
//Function Component
function ProductAddForm() {
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
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);
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
  const [addPropsform] = Form.useForm();
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
      description: errorMessages,
      duration: 2,
    });
  };
  const onClose = () => {
    form.resetFields();
    setOpen(false);
  };
  const handleresetForm = () => {
    form.resetFields([
      'colorId',
      'typeId',
      'materialId',
      // 'sizeName',
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
      messageApi.open({
        type: 'error',
        content: 'Giá bán không thể nhỏ hơn hoặc bằng Giá nhập!!!',
      });
      return;
    }
    const keyProduct =
      values.buckleTypeId +
      values.colorId +
      values.compartmentId +
      values.materialId +
      values.producerId +
      values.typeId +
      values.sizeId +
      values.brandId;
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

    if (indexBaloList !== -1 || indexBaloListPreview !== -1) {
      messageApi.open({
        type: 'error',
        content: 'Các trường thuộc tính này Bạn đa đã thêm trước đó, vui lòng chọn khác!!!',
      });
      return;
    }
    setIsFirst(true);
    const genCodeAuto = generateCustomCode('baloCode', 9);

    let addBalo = { ...values, productCode: genCodeAuto };
    setBaloList([...baloList, addBalo]);

    let colorSelected = color.find((option) => option.colorId === values.colorId);
    const colorSelectedName = colorSelected.colorName;
    let brandSelected = brand.find((option) => option.brandId === values.brandId);
    const brandSelectedName = brandSelected.brandName;
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

  const resetForm = () => {
    form.resetFields();
    setIsFirst(false);
    setBaloList([]);
    setBaloListPreview([]);
    notification.success({
      message: 'Hoàn Thành',
      description: 'Đã xóa toàn bộ !!!!',
      duration: 2,
    });
  };
  const reFreshForm = () => {
    form.resetFields([
      'colorId',
      'typeId',
      'materialId',
      'sizeId',
      // "brandId",
      'compartmentId',
      'buckleTypeId',
      'producerId',
      'productDetailStatus',
      'productDetailDescribe',
      // 'imageUrl',
      'importPrice',
      'retailPrice',
      'baloDetailAmount',
    ]);
    setFileList([]);
    notification.success({
      message: 'Hoàn Thành',
      description: 'Đã Reset Form thành công !!!!',
      duration: 2,
    });
  };
  const onConfirm = () => {
    form.submit();
    setPopconfirmVisible(false);
  };

  const testCase = () => {
    message.success('Đây là Test Case thử xem như nào');
    return 'Tết đây!!!';
  };
  const onCancel = () => {
    setPopconfirmVisible(false); // Đóng Popconfirm sau khi xác nhận
  };

  const [fileList, setFileList] = useState([]);

  const handleSendUpload = async () => {
    const urls = await handleUpload();
    return urls;
  };
  const handleUpload = async () => {
    const newList = [];

    if (fileList.length === 0) {
      message.info('Vui lòng chọn ảnh!!!!');
      return;
    }
    for (let i = 0; i < fileList.length; i++) {
      const addCodeImg = generateCustomCode('image', 5);
      const now = new Date();
      const dateString = `${now.getMonth()}_${now.getDate()}_${now.getFullYear()}_${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}:${now.getMilliseconds()}`;

      const file = fileList[i];
      console.log('file');
      console.log([file.originFileObj]);
      const name = addCodeImg + '_' + dateString;
      const renamedFile = new File([file.originFileObj], name, { type: file.type });
      console.log(renamedFile);
      console.log(name);
      const storageRef = ref(storage, `mulitpleFiles/${name}`);

      try {
        await uploadBytes(storageRef, renamedFile);
        const downloadURL = await getDownloadURL(storageRef);

        const uploadedImage = {
          imgUrl: downloadURL,
          imgCode: addCodeImg,
          imgName: name,
        };
        newList.push(uploadedImage);

        message.success('Tải lên hình ảnh thành công');
      } catch (error) {
        console.log('Lỗi khi tải lên:', error);
        message.error('Lỗi khi tải lên hình ảnh');
      }
    }

    setDownloadedURL(newList);
    return newList;
  };

  useEffect(() => {
    let err = '';

    if (fileList.length > 6) {
      err = 'Chỉ được chọn tối đa 6 ảnh , vui lòng chọn lại!!!!';
      setFileList([]);
    } else {
      for (let i = 0; i < fileList.length; i++) {
        const element = fileList[i];

        if (!(element.type !== 'image/jpg' || element.type !== 'image/png')) {
          err = 'Vui lòng chọn ảnh có định dạng PNG/JPG';

          setFileList([]);
          break;
        }
        if (element.size / 1024 / 1024 > 5) {
          err = 'Size ảnh quá lớn (nhỏ hơn 5Mb), vui lòng chọn lại';

          setFileList([]);
          break;
        }
      }
    }
    if (err !== '') {
      message.error(err);
      err = '';
    } else {
      if (fileList.length !== 0) {
        message.success(`Đã thêm ${fileList.length} ảnh thành công !`);
      }
    }
  }, [fileList]);
  const addFileImg = (fileLists) => {
    console.log(fileLists);
    setFileList(fileLists);
  };
  const handlePreview = async (file) => {
    console.log(file);
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
  };
  const beforeUpload = (file, fileLists) => {
    addFileImg(fileLists);
    return false;
  };
  const filterOption = (input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase());
  const [fileList1, setFileList1] = useState([]);
  const addPropsHandle = async (values) => {
    const namePropsList = Object.keys(values);
    const nameProps = namePropsList[0];
    const props = values;
    var isErr = true;

    try {
      switch (nameProps) {
        case 'color':
          const addColor = {
            colorCode: generateCustomCode('color', 5),
            colorName: props.color,
            colorStatus: 1,
          };
          const colorResponse = await colorAPI.add(addColor);
          if (colorResponse.status === 200) isErr = false;
          break;
        case 'type':
          const addType = {
            typeCode: generateCustomCode('type', 5),
            typeName: props.type,
            typeStatus: 1,
          };
          const typeResponse = await typeAPI.add(addType);
          if (typeResponse.status === 200) isErr = false;
          break;
        case 'material':
          const addMaterial = {
            materialCode: generateCustomCode('material', 5),
            materialName: props.material,
            materialStatus: 1,
          };
          const materialResponse = await materialAPI.add(addMaterial);
          if (materialResponse.status === 200) isErr = false;
          break;
        case 'size':
          const addSize = {
            sizeCode: generateCustomCode('size', 5),
            sizeName: props.size,
            sizeStatus: 1,
          };
          const sizeResponse = await sizeAPI.add(addSize);
          if (sizeResponse.status === 200) isErr = false;
          break;
        case 'compartment':
          const compartmentAdd = {
            compartmentCode: generateCustomCode('compartment', 5),
            compartmentName: props.type,
            compartmentStatus: 1,
          };
          const compartmentResponse = await compartmentAPI.add(compartmentAdd);
          if (compartmentResponse.status === 200) isErr = false;
          break;
        case 'brand':
          const brandAdd = {
            brandCode: generateCustomCode('brand', 5),
            brandName: props.brand,
            brandStatus: 1,
          };
          const brandResponse = await brandAPI.add(brandAdd);
          if (brandResponse.status === 200) isErr = false;
          break;
        case 'producer':
          const producerAdd = {
            producerCode: generateCustomCode('producer', 5),
            producerName: props.producer,
            producerStatus: 1,
          };
          const producerResponse = await producerAPI.add(producerAdd);
          if (producerResponse.status === 200) isErr = false;
          break;
        case 'buckleType':
          const buckleTypeAdd = {
            buckleTypeCode: generateCustomCode('buckleType', 5),
            buckleTypeName: props.buckleType,
            buckleTypeStatus: 1,
          };
          const buckleTypeResponse = await buckleTypeAPI.add(buckleTypeAdd);
          if (buckleTypeResponse.status === 200) isErr = false;
          break;

        default:
          message.error('Không phù hợp');
          break;
      }
      if (isErr === true) {
        message.error('Thêm không thành công!!!');
      } else {
        message.success('Thêm thành công!!!');
        viewBaloProps();
      }
    } catch (error) {}
  };
  const addExtendComp = (name, nameProps) =>
    Modal.info({
      title: `Thêm nhanh ${name}`,
      content: (
        <div>
          <Form onFinish={addPropsHandle} form={addPropsform}>
            <Form.Item
              label={'Giá Trị ' + name}
              name={nameProps}
              rules={[
                {
                  required: true,
                  message: 'Vui lòng điền giá trị Thuộc tính!',
                },
                {
                  pattern: /^[A-Za-z0-9]+$/,
                  message: 'Tên chỉ bao gồm chữ cái và số!',
                },
              ]}
            >
              <Input></Input>
            </Form.Item>
          </Form>
          <Button onClick={addPropsform.submit}>ADD</Button>
        </div>
      ),
    });
  const handleCancel = () => setPreviewOpen(false);
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

      messageApi.open({
        type: 'error',
        content: 'Xóa thành công!!!',
      });
    }
  };
  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };
  return (
    <div className="contentStyle222">
      {contextHolder}
      <div>
        <BaloDetailsPreview
          baloList={baloList}
          baloListPreview={baloListPreview}
          testCase={testCase}
          handleSendUpload={handleSendUpload}
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
          imageUrl: '',
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
                label="Balo Name"
                name="productName"
                rules={[
                  {
                    required: true,
                    message: 'Tên Balo không hợp lệ!',
                    whitespace: true,
                    validator: (rule, value) => {
                      if (value && value.trim() !== value) {
                        return Promise.reject('Tên không được chứa khoảng trắng ở hai đầu!');
                      }
                      // if (value.length === 0) {
                      //   return Promise.reject('Tên không hợp lệ!');
                      // }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <Input disabled={isFirst} />
              </Form.Item>
              <Form.Item
                label="Balo Status"
                name="productStatus"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng chọn trạng thái Balo!',
                  },
                ]}
              >
                <Select
                  disabled={isFirst}
                  style={{
                    width: 200,
                  }}
                  placeholder="Tình Trạng"
                  showSearch
                  optionFilterProp="children"
                  filterOption={filterOption}
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

          <hr></hr>
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
                  min={0}
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
                  min={0}
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
                    message: 'Số lượng chỉ được chứa số không âm!',
                    // whitespace: true,
                    validator: (_, value) => {
                      const regex = /^[0-9]+$/; // Chỉ chấp nhận số không âm
                      if (!regex.test(value)) {
                        return Promise.reject('Số lượng chỉ được chứa số không âm!');
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <InputNumber
                  size="large"
                  style={{ width: 200 }}
                  step={1}
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
                label={
                  <span
                    onClick={() => {
                      addExtendComp('Màu sắc', 'color');
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    Màu sắc
                  </span>
                }
                name="colorId"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng chọn màu sắc Balo!',
                  },
                ]}
              >
                <Select
                  onChange={(value) => {
                    console.log(value);
                  }}
                  size="large"
                  style={{
                    width: 200,
                  }}
                  placeholder="Màu sắc"
                  showSearch
                  optionFilterProp="label"
                  filterOption={filterOption}
                  options={color.map((item) => ({
                    value: item.colorId,
                    label: item.colorName,
                  }))}
                ></Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label={
                  <span
                    onClick={() => {
                      addExtendComp('Kiểu Balo', 'type');
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    Kiểu Balo
                  </span>
                }
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
                  placeholder="Kiểu Balo"
                  showSearch
                  optionFilterProp="label"
                  filterOption={filterOption}
                  options={type.map((item) => ({
                    value: item.typeId,
                    label: item.typeName,
                  }))}
                ></Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label={
                  <span
                    onClick={() => {
                      addExtendComp('Chất liệu', 'material');
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    Chất liệu Balo
                  </span>
                }
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
                  placeholder="Chất Liệu"
                  showSearch
                  optionFilterProp="label"
                  filterOption={filterOption}
                  options={material.map((item) => ({
                    value: item.materialId,
                    label: item.materialName,
                  }))}
                ></Select>
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col span={8}>
              <Form.Item
                label={
                  <span
                    onClick={() => {
                      addExtendComp('Kiểu Ngăn', 'compartment');
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    Kiểu Ngăn
                  </span>
                }
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
                  placeholder="Kiểu ngăn"
                  showSearch
                  optionFilterProp="label"
                  filterOption={filterOption}
                  options={compartment.map((item) => ({
                    value: item.compartmentId,
                    label: item.compartmentName,
                  }))}
                ></Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label={
                  <span
                    onClick={() => {
                      addExtendComp('Balo Size', 'size');
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    Balo Size
                  </span>
                }
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
                  placeholder="Size Balo"
                  showSearch
                  optionFilterProp="label"
                  filterOption={filterOption}
                  options={size.map((item) => ({
                    value: item.sizeId,
                    label: item.sizeName,
                  }))}
                ></Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label={
                  <span
                    onClick={() => {
                      addExtendComp('Thương Hiệu', 'brand');
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    Thương Hiệu
                  </span>
                }
                name="brandId"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng chọn Thương Hiệu!',
                  },
                ]}
              >
                <Select
                  disabled={isFirst}
                  size="large"
                  style={{
                    width: 200,
                  }}
                  placeholder="Thương hiệu"
                  showSearch
                  optionFilterProp="label"
                  filterOption={filterOption}
                  options={brand.map((item) => ({
                    value: item.brandId,
                    label: item.brandName,
                  }))}
                ></Select>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <Form.Item
                label={
                  <span
                    onClick={() => {
                      addExtendComp('NSX', 'producer');
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    Nhà Sản Xuất
                  </span>
                }
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
                  placeholder="NSX"
                  showSearch
                  optionFilterProp="label"
                  filterOption={filterOption}
                  options={producer.map((item) => ({
                    value: item.producerId,
                    label: item.producerName,
                  }))}
                ></Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label={
                  <span
                    onClick={() => {
                      addExtendComp('Kiểu Khóa', 'buckleType');
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    Kiểu Khóa{' '}
                  </span>
                }
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
                  placeholder="Kiểu khóa"
                  showSearch
                  optionFilterProp="label"
                  filterOption={filterOption}
                  options={buckleType.map((item) => ({
                    value: item.buckleTypeId,
                    label: item.buckleTypeName,
                  }))}
                ></Select>
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
                  placeholder="Tình Trạng"
                  showSearch
                  optionFilterProp="children"
                  filterOption={filterOption}
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
            <Col span={16} className={styles.dragger}>
              <Dragger
                fileList={fileList}
                listType="picture-card"
                multiple
                name="files"
                showUploadList={true}
                onPreview={handlePreview}
                beforeUpload={beforeUpload}
                onChange={handleChange}
                height={'90%'}
                style={{ width: '80%' }}
              >
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">Kéo thả hình ảnh vào đây</p>
              </Dragger>
              <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                <Image
                  alt="example"
                  style={{
                    width: '100%',
                  }}
                  src={previewImage}
                />
              </Modal>
            </Col>
          </Row>
        </div>
        <Form.Item
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          <Row>
            <Col span={8}>
              <Popconfirm
                title="Xác Nhận"
                description="Bạn Có chắc chắn muốn Thêm?"
                okText="Đồng ý"
                cancelText="Không"
                onConfirm={onConfirm}
                onCancel={onCancel}
              >
                <Button type="primary" size="large" shape="round" icon={<PlusOutlined />}>
                  Thêm Chi Tiết Balo
                </Button>
              </Popconfirm>
            </Col>
            <Col span={4}>
              <Popconfirm
                title="Xác Nhận"
                description="Bạn Có chắc chắn muốn ResetForm và xóa hết Chi tiết Balo?"
                okText="Đồng ý"
                cancelText="Không"
                onConfirm={resetForm}
                onCancel={onCancel}
              >
                <Button type="primary" size="large" shape="round" icon={<MdRefresh />}>
                  Xóa Hết
                </Button>
              </Popconfirm>
            </Col>
            <Col span={4}>
              <Popconfirm
                title="Xác Nhận"
                description="Bạn Có chắc chắn muốn làm mới Form?"
                okText="Đồng ý"
                cancelText="Không"
                onConfirm={reFreshForm}
                onCancel={onCancel}
              >
                <Button type="primary" size="large" shape="round" icon={<MdRefresh />}>
                  Làm mới form
                </Button>
              </Popconfirm>
            </Col>
          </Row>
        </Form.Item>
      </Form>
    </div>
  );
}
export default ProductAddForm;
