import {
  Button,
  Col,
  Collapse,
  Form,
  Input,
  InputNumber,
  Pagination,
  Popconfirm,
  Popover,
  QRCode,
  Row,
  Select,
  Space,
  Spin,
  Table,
  Typography,
  message,
  notification,
} from 'antd';
import { useEffect, useState, useContext, useRef, Fragment, useCallback } from 'react';
import Highlighter from 'react-highlight-words';
import baloAPI from '~/api/productsAPI';

import styles from './index.module.scss';
import { CaretRightOutlined, DeleteOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import productDetailsAPI from '~/api/productDetailsAPI';
import brandAPI from '~/api/propertitesBalo/brandAPI';
import buckleTypeAPI from '~/api/propertitesBalo/buckleTypeAPI';
import colorAPI from '~/api/propertitesBalo/colorAPI';
import compartmentAPI from '~/api/propertitesBalo/compartmentAPI';
import materialAPI from '~/api/propertitesBalo/materialAPI';
import producerAPI from '~/api/propertitesBalo/producerAPI';
import sizeAPI from '~/api/propertitesBalo/sizeAPI';
import typeAPI from '~/api/propertitesBalo/typeAPI';
import VNDFormaterFunc from '~/Utilities/VNDFormaterFunc';
import NumberFormaterFunc from '~/Utilities/NumberFormaterFunc';
import { ready } from 'jquery';

function ProductDetailsViewer() {
  const [productList, setProductList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagesSize, setPagesSize] = useState(10);
  const [totalItem, setTotalItem] = useState();
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [sortedInfo, setSortedInfo] = useState('');
  const [filteredInfo, setFilteredInfo] = useState('');
  const [openPopover, setOpenPopover] = useState(false);

  const [brand, setBrand] = useState([]);
  const [buckleType, setBuckleType] = useState([]);
  const [color, setColor] = useState([]);
  const [compartment, setCompartment] = useState([]);
  const [material, setMaterial] = useState([]);
  const [producer, setProducer] = useState([]);
  const [size, setSize] = useState([]);
  const [type, setType] = useState([]);

  const [productName, setProductName] = useState(null);
  const [productCode, setProductCode] = useState(null);
  const [colorName, setColorName] = useState(null);
  const [typeName, setTypeName] = useState(null);
  const [materialName, setMaterialName] = useState(null);
  const [sizeName, setSizeName] = useState(null);
  const [brandName, setBrandName] = useState(null);
  const [compartmentName, setCompartmentName] = useState(null);
  const [producerName, setProducerName] = useState(null);
  const [buckleTypeName, setBuckleTypeName] = useState(null);
  const [productDetailDescribe, setProductDetailDescribe] = useState(null);
  const [minProductDetailAmount, setMinProductDetailAmount] = useState(null);
  const [maxProductDetailAmount, setMaxProductDetailAmount] = useState(null);
  const [minImportPrice, setMinImportPrice] = useState(null);
  const [maxImportPrice, setMaxImportPrice] = useState(null);
  const [minRetailPrice, setMinRetailPrice] = useState(null);
  const [maxRetailPrice, setMaxRetailPrice] = useState(null);
  const [productDetailStatus, setProductDetailStatus] = useState(null);
  const [sortList, setSortList] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);
  const [sortListPlaceHolder, setSortListPlaceHolder] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();

  const searchInput = useRef(null);

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
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };
  const getColumnSearchProps = (dataIndex, props1, props2) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block',
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? '#1677ff' : undefined,
        }}
      />
    ),
    // onFilter: (value, record) => record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilter: (value, record) => {
      var filteredData = props1 ? record[dataIndex][props1] : record[dataIndex];
      if (record[dataIndex]) {
        filteredData = record[dataIndex];
      }
      if (record[dataIndex][props1]) {
        filteredData = record[dataIndex][props1];
      }
      if (record[dataIndex][props1][props2]) {
        filteredData = record[dataIndex][props1][props2];
      }
      return filteredData?.toString().toLowerCase().includes(value.toLowerCase());
    },

    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: '#ffc069',
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  const handleTableChange = (pagination, filters, sorter) => {
    setFilteredInfo(filters);
    setSortedInfo(sorter);
  };
  const clearFilters = () => {
    setFilteredInfo({});
  };
  const clearAll = () => {
    setFilteredInfo({});
    setSortedInfo({});
  };
  const QRDisplay = (props) => {
    const productDetailId = props.product.productDetailId;
    const id = 'myqrcode' + productDetailId;

    const downloadQRCode = () => {
      const canvas = document.getElementById(id)?.querySelector('canvas');
      if (canvas) {
        const url = canvas.toDataURL();
        const a = document.createElement('a');
        a.download = `QRCode_` + productDetailId + `.png`;
        a.href = url;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    };
    return (
      <div id={id}>
        <QRCode
          size={300}
          value={productDetailId}
          bgColor="#fff"
          style={{
            marginBottom: 16,
          }}
        />
        <Button type="primary" onClick={downloadQRCode}>
          Download
        </Button>
      </div>
    );
  };
  const columns = [
    {
      title: 'STT',
      dataIndex: 'index',
      key: 'index',
      width: 60,
      fixed: 'left',
      render: (text, record, index) => <span>{(currentPage - 1) * pagesSize + index + 1}</span>,
    },
    {
      title: 'Mã Balo',
      dataIndex: ['product', 'productCode'],
      width: 170,
      fixed: 'left',
      sorter: (a, b) => a.product.productCode.localeCompare(b.product.ButtonproductCode),
      ...getColumnSearchProps('product', 'productCode'),
      render: (text, record) => (
        <Popover placement="right" content={<QRDisplay product={record} />} title="QR Code Sản Phẩm">
          <Typography.Text>{text}</Typography.Text>
        </Popover>
      ),
    },
    {
      title: 'Tên Balo',
      dataIndex: ['product', 'productName'],
      width: 200,
      fixed: 'left',
      sorter: (a, b) => a.product.productName.localeCompare(b.product.productName),
      ...getColumnSearchProps('product', 'productName'),
    },
    {
      title: 'Màu Sắc',
      dataIndex: ['color', 'colorName'],
      width: 150,
      sorter: (a, b) => a.color.colorName.localeCompare(b.color.colorName),
      ...getColumnSearchProps('color', 'colorName'),
    },
    {
      title: 'Kiểu Balo',
      dataIndex: ['type', 'typeName'],
      width: 150,
      sorter: (a, b) => a.type.typeName.localeCompare(b.type.typeName),
      ...getColumnSearchProps('type', 'typeName'),
    },
    {
      title: 'Chất Liệu',
      dataIndex: ['material', 'materialName'],
      width: 150,
      sorter: (a, b) => a.material.materialName.localeCompare(b.material.materialName),
      ...getColumnSearchProps('type', 'typeName'),
    },
    {
      title: 'Size Balo',
      dataIndex: ['size', 'sizeName'],
      width: 150,
      sorter: (a, b) => a.size.sizeName.localeCompare(b.size.sizeName),
      ...getColumnSearchProps('type', 'typeName'),
    },
    {
      title: 'Thương Hiệu',
      dataIndex: ['product', 'brand', 'brandName'],
      width: 150,
      sorter: (a, b) => a.product.brand.brandName.localeCompare(b.product.brandbrandName),
      ...getColumnSearchProps('product', 'brand', 'brandName'),
    },
    {
      title: 'Kiểu Ngăn',
      dataIndex: ['compartment', 'compartmentName'],
      width: 150,
      sorter: (a, b) => a.compartment.compartmentName.localeCompare(b.compartment.compartmentName),
      ...getColumnSearchProps('compartment', 'compartmentName'),
    },
    {
      title: 'NSX',
      dataIndex: ['producer', 'producerName'],
      width: 150,
      sorter: (a, b) => a.producer.producerName.localeCompare(b.producer.producerName),
      ...getColumnSearchProps('producer', 'producerName'),
    },

    {
      title: 'Mô Tả',
      dataIndex: 'productDetailDescribe',
      width: 200,
      sorter: (a, b) => a.productDetailDescribe.localeCompare(b.productDetailDescribe),
      ...getColumnSearchProps('productDetailDescribe'),
    },
    {
      title: 'Giá Nhập',
      dataIndex: 'importPrice',
      fixed: 'right',
      width: 130,
      sorter: (a, b) => a.importPrice - b.importPrice,
      render: (text, record) => VNDFormaterFunc(text),
      // ...getColumnSearchProps('importPrice'),
    },
    {
      title: 'Giá Bán',
      dataIndex: 'retailPrice',
      fixed: 'right',
      width: 130,
      sorter: (a, b) => a.retailPrice - b.retailPrice,
      render: (text, record) => VNDFormaterFunc(text),
    },
    {
      title: 'Số Lượng',
      dataIndex: 'productDetailAmount',
      fixed: 'right',
      width: 80,
      sorter: (a, b) => a.productDetailAmount - b.productDetailAmount,
      render: (text, record) => NumberFormaterFunc(text) + ' Cái',
    },
    {
      title: 'Trạng Thái',
      dataIndex: 'productDetailStatus',
      width: 180,
      fixed: 'right',
      sorter: (a, b) => a.productDetailStatus - b.productDetailStatus,
      render: (productDetailStatus) => {
        switch (productDetailStatus) {
          case 1:
            return (
              <Popover
                content={
                  <Typography.Text type="success" strong>
                    Sản Phẩm này sẵn hàng
                  </Typography.Text>
                }
                title="Tình Trạng"
              >
                <Button type="primary" shape="round">
                  Đang hoạt động
                </Button>
              </Popover>
            );
          case 0:
            return (
              <Popover
                content={
                  <Typography.Text type="danger" strong>
                    Sản Phẩm này tạm thời ngưng hoạt động
                  </Typography.Text>
                }
                title="Tình Trạng"
              >
                {' '}
                <Button type="primary" danger shape="round">
                  Ngưng hoạt động
                </Button>
              </Popover>
            );
          case -1:
            return (
              <Popover
                content={
                  <Typography.Text type="secondary" strong>
                    Sản Phẩm này đã dừng hoạt động
                  </Typography.Text>
                }
                title="Tình Trạng"
              >
                <Button shape="round">Dừng Hoạt Động</Button>
              </Popover>
            );
          default:
            return 'Không xác định';
        }
      },
    },
  ];
  const onCancel = () => {};
  const reload = () => {
    getAllBalo(
      currentPage,
      pagesSize,
      productName,
      productCode,
      colorName,
      typeName,
      materialName,
      sizeName,
      brandName,
      compartmentName,
      producerName,
      buckleTypeName,
      productDetailDescribe,
      minProductDetailAmount,
      maxProductDetailAmount,
      minImportPrice,
      maxImportPrice,
      minRetailPrice,
      maxRetailPrice,
      productDetailStatus,
      sortList,
      sortOrder,
    );
  };
  const getAllBalo = useCallback(
    async (
      currentPage,
      pagesSize,
      productName,
      productCode,
      colorName,
      typeName,
      materialName,
      sizeName,
      brandName,
      compartmentName,
      producerName,
      buckleTypeName,
      productDetailDescribe,
      minProductDetailAmount,
      maxProductDetailAmount,
      minImportPrice,
      maxImportPrice,
      minRetailPrice,
      maxRetailPrice,
      productDetailStatus,
      sortList,
      sortOrder,
    ) => {
      try {
        setLoading(true);
        const response = await productDetailsAPI.getAll(
          currentPage,
          pagesSize,
          productName,
          productCode,
          colorName,
          typeName,
          materialName,
          sizeName,
          brandName,
          compartmentName,
          producerName,
          buckleTypeName,
          productDetailDescribe,
          minProductDetailAmount,
          maxProductDetailAmount,
          minImportPrice,
          maxImportPrice,
          minRetailPrice,
          maxRetailPrice,
          productDetailStatus,
          sortList,
          sortOrder,
        );
        const data = response.data.content;
        setTotalItem(response.data.totalElements);
        setProductList(data);
        if (response.status === 200) {
          setLoading(false);
        } else {
          messageApi.open({
            type: 'loading',
            content: 'Đang cố lấy data......',
          });
        }
      } catch (error) {
        console.error('Đã xảy ra lỗi: ', error);
      }
    },
    [],
  );
  useEffect(() => {
    handleLoading();
    getAllBalo(
      currentPage,
      pagesSize,
      productName,
      productCode,
      colorName,
      typeName,
      materialName,
      sizeName,
      brandName,
      compartmentName,
      producerName,
      buckleTypeName,
      productDetailDescribe,
      minProductDetailAmount,
      maxProductDetailAmount,
      minImportPrice,
      maxImportPrice,
      minRetailPrice,
      maxRetailPrice,
      productDetailStatus,
      sortList,
      sortOrder,
    );
  }, [
    currentPage,
    pagesSize,
    productName,
    productCode,
    colorName,
    typeName,
    materialName,
    sizeName,
    brandName,
    compartmentName,
    producerName,
    buckleTypeName,
    productDetailDescribe,
    minProductDetailAmount,
    maxProductDetailAmount,
    minImportPrice,
    maxImportPrice,
    minRetailPrice,
    maxRetailPrice,
    productDetailStatus,
    sortOrder,
    sortList,
    getAllBalo,
  ]);

  const handleLoading = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };
  const handleDeleteBalo = async (id, status) => {
    try {
      await baloAPI.updateStatus(id, status);
      notification.info({
        message: 'Xóa thành Công',
        description: 'Sản Phẩm Có ID: ' + id + ' đã được xóa thành công!!!',
        duration: 2,
      });
      getAllBalo(
        currentPage,
        pagesSize,
        productName,
        productCode,
        colorName,
        typeName,
        materialName,
        sizeName,
        brandName,
        compartmentName,
        producerName,
        buckleTypeName,
        productDetailDescribe,
        minProductDetailAmount,
        maxProductDetailAmount,
        minImportPrice,
        maxImportPrice,
        minRetailPrice,
        maxRetailPrice,
        productDetailStatus,
        sortList,
        sortOrder,
      );
    } catch (error) {
      console.error('Đã xảy ra lỗi khi xóa sản phẩm: ', error);
    }
  };
  const onHandleSizeChange = (current, pageSize) => {
    setCurrentPage(1);
    setPagesSize(pageSize);
    getAllBalo(
      current,
      pageSize,
      productName,
      productCode,
      colorName,
      typeName,
      materialName,
      sizeName,
      brandName,
      compartmentName,
      producerName,
      buckleTypeName,
      productDetailDescribe,
      minProductDetailAmount,
      maxProductDetailAmount,
      minImportPrice,
      maxImportPrice,
      minRetailPrice,
      maxRetailPrice,
      productDetailStatus,
      sortList,
      sortOrder,
    );
    handleLoading();
  };
  const onHandlePageNum = (current, pageSize) => {
    setCurrentPage(current);
    setPagesSize(pageSize);
    getAllBalo(
      current,
      pageSize,
      productName,
      productCode,
      colorName,
      typeName,
      materialName,
      sizeName,
      brandName,
      compartmentName,
      producerName,
      buckleTypeName,
      productDetailDescribe,
      minProductDetailAmount,
      maxProductDetailAmount,
      minImportPrice,
      maxImportPrice,
      minRetailPrice,
      maxRetailPrice,
      productDetailStatus,
      sortList,
      sortOrder,
    );
    handleLoading();
  };
  const hide = () => {
    setOpenPopover(false);
  };
  const handleOpenPopoverChange = (newOpen) => {
    setOpenPopover(newOpen);
  };
  const filterComponent = () => {
    var productCodeTemp = '';
    var productNameTemp = '';
    var productDetailDescribeTemp = '';
    var minProductDetailAmountTemp = '';
    var maxProductDetailAmountTemp = '';
    var minImportPriceTemp = '';
    var maxImportPriceTemp = '';
    var minRetailPriceTemp = '';
    var maxRetailPriceTemp = '';

    const handleFilt = () => {
      setProductCode(productCodeTemp);
      setProductName(productNameTemp);
      setProductDetailDescribe(productDetailDescribeTemp);
      setMinImportPrice(minImportPriceTemp);
      setMaxImportPrice(maxImportPriceTemp);
      setMinRetailPrice(minRetailPriceTemp);
      setMaxRetailPrice(maxRetailPriceTemp);
      setMinProductDetailAmount(minProductDetailAmountTemp);
      setMaxProductDetailAmount(maxProductDetailAmountTemp);
    };
    return (
      <Fragment>
        {contextHolder}
        <Form>
          <Row>
            <Col span={24}>
              <Form.Item label="Balo Code" name="productCode">
                <Input
                  size="large"
                  placeholder=""
                  onChange={(e) => {
                    productCodeTemp = e.target.value;
                  }}
                ></Input>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item label="Tên Balo" name="productName">
                <Input
                  size="large"
                  placeholder=""
                  onChange={(e) => {
                    productNameTemp = e.target.value;
                  }}
                ></Input>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item label="Mô Tả" name="productDetailDescribe">
                <Input
                  size="large"
                  placeholder=""
                  onChange={(e) => {
                    productDetailDescribeTemp = e.target.value;
                  }}
                ></Input>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item label="Khoảng Số Lượng" name="amount">
                <InputNumber
                  size="large"
                  style={{ width: 400 }}
                  step={1}
                  min={0}
                  addonBefore="Min"
                  addonAfter="Cái"
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={(value) => value.replace(/\₫\s?|(,*)/g, '')}
                  onChange={(value) => {
                    minProductDetailAmountTemp = value;
                  }}
                />

                <span> </span>
                <span>_</span>
                <span> </span>

                <InputNumber
                  size="large"
                  style={{ width: 400 }}
                  step={1}
                  min={0}
                  addonBefore="Max"
                  addonAfter="Cái"
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={(value) => value.replace(/\₫\s?|(,*)/g, '')}
                  onChange={(value) => {
                    maxProductDetailAmountTemp = value;
                  }}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item label="Khoảng Giá Nhập" name="importPrice">
                <InputNumber
                  size="large"
                  style={{ width: 400 }}
                  step={1000}
                  min={0}
                  addonBefore="Min"
                  addonAfter="VND"
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={(value) => value.replace(/\₫\s?|(,*)/g, '')}
                  onChange={(value) => {
                    minImportPriceTemp = value;
                  }}
                />

                <span> </span>
                <span>_</span>
                <span> </span>

                <InputNumber
                  size="large"
                  style={{ width: 400 }}
                  step={1000}
                  min={0}
                  addonBefore="Min"
                  addonAfter="VND"
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={(value) => value.replace(/\₫\s?|(,*)/g, '')}
                  onChange={(value) => {
                    maxImportPriceTemp = value;
                  }}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item label="Khoảng Giá Bán " name="retailPrice">
                <InputNumber
                  size="large"
                  style={{ width: 400 }}
                  step={1000}
                  min={0}
                  addonBefore="Min"
                  addonAfter="VND"
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={(value) => value.replace(/\₫\s?|(,*)/g, '')}
                  onChange={(value) => {
                    minRetailPriceTemp = value;
                  }}
                />
                <span> </span>
                <span>_</span>
                <span> </span>
                <InputNumber
                  size="large"
                  style={{ width: 400 }}
                  step={1000}
                  min={0}
                  addonBefore="Max"
                  addonAfter="VND"
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={(value) => value.replace(/\₫\s?|(,*)/g, '')}
                  onChange={(value) => {
                    maxRetailPriceTemp = value;
                  }}
                />
              </Form.Item>
            </Col>
          </Row>
          <Col span={2}>
            <Button onClick={handleFilt}>Filter</Button>
          </Col>
        </Form>
      </Fragment>
    );
  };
  const handleRefresh = () => {
    setColorName(null);
    setTypeName(null);
    setMaterialName(null);
    setSizeName(null);
    setBrandName(null);
    setCompartmentName(null);
    setProducerName(null);
    setBuckleTypeName(null);
    setProductDetailStatus(null);
    setSortList(null);
    setSortOrder(null);

    setProductCode(null);
    setProductName(null);
    setProductDetailDescribe(null);
    setMinImportPrice(null);
    setMaxImportPrice(null);
    setMinRetailPrice(null);
    setMaxRetailPrice(null);
    setMinProductDetailAmount(null);
    setMaxProductDetailAmount(null);

    setSortListPlaceHolder(null);
  };
  return (
    <div
      style={{
        padding: '10px',
      }}
    >
      <div>
        <h1>Lọc - Tìm Kiếm</h1>
        <Row>
          <Col span={4} className={styles.selectProps}>
            <Select
              allowClear
              placeholder={'Màu Sắc'}
              value={colorName}
              size="large"
              style={{
                width: 200,
              }}
              onChange={(value) => {
                setColorName(value); // Lấy giá trị được chọn
              }}
            >
              {color.map((o) => (
                <Select.Option key={o.colorId} value={o.colorName}>
                  {o.colorName}
                </Select.Option>
              ))}
            </Select>
          </Col>
          <Col span={4} className={styles.selectProps}>
            <Select
              allowClear
              placeholder={'Kiểu Balo'}
              value={typeName}
              size="large"
              style={{
                width: 200,
              }}
              onChange={(value) => {
                setTypeName(value); // Lấy giá trị được chọn
              }}
            >
              {type.map((o) => (
                <Select.Option key={o.typeId} value={o.typeName}>
                  {o.typeName}
                </Select.Option>
              ))}
            </Select>
          </Col>
          <Col span={4} className={styles.selectProps}>
            <Select
              allowClear
              placeholder={'Chất Liệu'}
              value={materialName}
              size="large"
              style={{
                width: 200,
              }}
              onChange={(value) => {
                setMaterialName(value); // Lấy giá trị được chọn
              }}
            >
              {material.map((o) => (
                <Select.Option key={o.materialId} value={o.materialName}>
                  {o.materialName}
                </Select.Option>
              ))}
            </Select>
          </Col>
          <Col span={4} className={styles.selectProps}>
            <Select
              allowClear
              placeholder={'Kiểu Ngăn'}
              value={compartmentName}
              size="large"
              style={{
                width: 200,
              }}
              onChange={(value) => {
                setCompartmentName(value); // Lấy giá trị được chọn
              }}
            >
              {compartment.map((o) => (
                <Select.Option key={o.compartmentId} value={o.compartmentName}>
                  {o.compartmentName}
                </Select.Option>
              ))}
            </Select>
          </Col>
          <Col span={4} className={styles.selectProps}></Col>
          <Col span={4} className={styles.selectProps}>
            <Select
              placeholder={'Tình Trạng'}
              value={productDetailStatus}
              size="large"
              style={{
                width: 200,
              }}
              onChange={(value) => {
                setProductDetailStatus(value);
              }}
              allowClear
            >
              <Select.Option key={'1'} value={1}>
                Còn Hàng
              </Select.Option>
              <Select.Option key={'2'} value={0}>
                Hết Hàng
              </Select.Option>
              <Select.Option key={'3'} value={-1}>
                Tạm Ngưng
              </Select.Option>
            </Select>
          </Col>
        </Row>
        <Row>
          <Col span={4} className={styles.selectProps}>
            <Select
              allowClear
              placeholder={'Size Balo'}
              value={sizeName}
              size="large"
              style={{
                width: 200,
              }}
              onChange={(value) => {
                setSizeName(value); // Lấy giá trị được chọn
              }}
            >
              {size.map((o) => (
                <Select.Option key={o.sizeId} value={o.sizeName}>
                  {o.sizeName}
                </Select.Option>
              ))}
            </Select>
          </Col>
          <Col span={4} className={styles.selectProps}>
            <Select
              allowClear
              placeholder={'Thương Hiệu'}
              value={brandName}
              size="large"
              style={{
                width: 200,
              }}
              onChange={(value) => {
                setBrandName(value); // Lấy giá trị được chọn
              }}
            >
              {brand.map((o) => (
                <Select.Option key={o.brandId} value={o.brandName}>
                  {o.brandName}
                </Select.Option>
              ))}
            </Select>
          </Col>
          <Col span={4} className={styles.selectProps}>
            <Select
              allowClear
              placeholder={'NSX'}
              value={producerName}
              size="large"
              style={{
                width: 200,
              }}
              onChange={(value) => {
                setProducerName(value); // Lấy giá trị được chọn
              }}
            >
              {producer.map((o) => (
                <Select.Option key={o.producerId} value={o.producerName}>
                  {o.producerName}
                </Select.Option>
              ))}
            </Select>
          </Col>
          <Col span={4} className={styles.selectProps}>
            <Select
              allowClear
              placeholder={'Kiểu Khóa'}
              value={buckleTypeName}
              size="large"
              style={{
                width: 200,
              }}
              onChange={(value) => {
                setBuckleTypeName(value); // Lấy giá trị được chọn
              }}
            >
              {buckleType.map((o) => (
                <Select.Option key={o.buckleTypeId} value={o.buckleTypeName}>
                  {o.buckleTypeName}
                </Select.Option>
              ))}
            </Select>
          </Col>
          <Col span={4} className={styles.selectProps}>
            {' '}
          </Col>
          <Col span={4} className={styles.selectProps}>
            <Select
              allowClear
              value={sortListPlaceHolder}
              placeholder={'Lọc Theo'}
              size="large"
              style={{
                width: 200,
              }}
              onChange={(value) => {
                if (value === 'importPriceASC') {
                  setSortOrder('ASC');
                  setSortList('importPrice');
                  setSortListPlaceHolder('Giá Nhập tăng dần');
                } else if (value === 'importPriceDESC') {
                  setSortOrder('DESC');
                  setSortList('importPrice');
                  setSortListPlaceHolder('Giá Nhập giảm dần');
                } else if (value === 'retailPriceASC') {
                  setSortOrder('ASC');
                  setSortList('retailPrice');
                  setSortListPlaceHolder('Giá Bán tăng dần');
                } else if (value === 'retailPriceDESC') {
                  setSortOrder('DESC');
                  setSortList('retailPrice');
                  setSortListPlaceHolder('Giá Nhập giảm dần');
                } else {
                  setSortOrder(null);
                  setSortList(null);
                }
              }}
            >
              <Select.Option key={'1'} value={'importPriceASC'}>
                Giá nhập tăng dần
              </Select.Option>
              <Select.Option key={'2'} value={'importPriceDESC'}>
                Giá nhập giảm dần
              </Select.Option>
              <Select.Option key={'3'} value={'retailPriceASC'}>
                Giá bán tăng dần
              </Select.Option>
              <Select.Option key={'4'} value={'retailPriceDESC'}>
                Giá bán giảm dần
              </Select.Option>
            </Select>
          </Col>
        </Row>
      </div>
      <div>
        <Row>
          <Col span={4} className={styles.selectProps}>
            <Popover
              placement="rightTop"
              content={filterComponent}
              title="Title"
              trigger="click"
              open={openPopover}
              on
              onOpenChange={handleOpenPopoverChange}
            >
              <Button type="primary">Lọc Thêm</Button>
            </Popover>
          </Col>
          <Col span={4} className={styles.selectProps}>
            <Popconfirm
              title="Reset"
              description="Bạn chăc chắn Reset Lọc và Tìm kiếm?"
              onConfirm={handleRefresh}
              onCancel
              okText="Có"
              cancelText="Không"
            >
              <Button type="primary">Reset</Button>
            </Popconfirm>
          </Col>
        </Row>
      </div>

      <hr />
      <div className={styles.RefreshButton}>
        <Button icon={<ReloadOutlined />} onClick={reload} loading={loading}>
          Làm mới
        </Button>
      </div>
      <Table
        className="table table-striped"
        scroll={{
          x: 1000,
          y: 670,
        }}
        loading={loading}
        rowKey={(record) => record.productDetailId}
        columns={columns}
        dataSource={productList}
        onChange={handleTableChange}
        pagination={false}
      />
      <div>
        <Pagination
          className={styles.pagination}
          showSizeChanger
          pageSizeOptions={['10', '20', '30', '100']}
          onShowSizeChange={onHandleSizeChange}
          onChange={onHandlePageNum}
          defaultCurrent={1}
          total={totalItem}
        />
      </div>
    </div>
  );
}
export default ProductDetailsViewer;
