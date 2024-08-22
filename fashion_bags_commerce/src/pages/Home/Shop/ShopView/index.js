import React, { Fragment, useEffect, useState } from 'react';
import {
  Image,
  Button,
  Col,
  Form,
  Input,
  Pagination,
  Popconfirm,
  Row,
  Select,
  Space,
  Spin,
  Table,
  message,
  notification,
  Modal,
} from 'antd';
import fullProductAPI from '~/api/client/fullProductAPI';
import { FullscreenExitOutlined, FullscreenOutlined, RightOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import styles from './index.module.scss';
import { Link, useLocation } from 'react-router-dom';
import VNDFormaterFunc from '~/Utilities/VNDFormaterFunc';
import BeatLoader from 'react-spinners/ClipLoader';
import queryString from 'query-string';
import brandAPI from '~/api/propertitesBalo/brandAPI';
import colorAPI from '~/api/propertitesBalo/colorAPI';
library.add(faShoppingCart);

function ShopView({ titleContent }) {
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [columnType, setColumnType] = useState('col-3');
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagesSize, setPagesSize] = useState(8);
  const [totalItem, setTotalItem] = useState();
  const failesImgg =
    'data:image/png;base64,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';
  const [isHovered, setIsHovered] = useState(false);

  const [productName, setProductName] = useState('');
  const [productCode, setProductCode] = useState('');
  const [brandName, setBrandName] = useState('');
  const [brand, setBrand] = useState([]);
  const [colorName, setColorName] = useState('');
  const [color, setColor] = useState([]);
  const [sortList, setSortList] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);
  const [selectedColor, setSelectedColor] = useState('');

  const [productStatus, setProductStatus] = useState(null);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [form] = Form.useForm();
// Add this to the list of state variables at the beginning of your component
const [searchKeyword, setSearchKeyword] = useState('');

  const [open, setOpen] = useState(false);

  const handleColumnChange = (type) => {
    setColumnType(type);
  };

  const handlePageChange = (currentPage, pageSize) => {
    setCurrentPage(currentPage);
    setPagesSize(pageSize);
    setLoadingProducts(true);
  };
  var productNameTemp = '';
  const handleFilterProduct = () => {
    // Sử dụng giá trị thực từ trường nhập liệu
    const values = form.getFieldsValue();
    const { productName, colorName, productCode, brandName, productStatus, minPrice, maxPrice } = values;

    // Gọi hàm fetchProducts với các giá trị vừa lấy được
    fetchProducts(
      currentPage,
      pagesSize,
      productName,
      productCode,
      brandName,
      colorName,
      selectedColor,
      productStatus,
      sortList,
      sortOrder,
      minPrice,
      maxPrice,
    );
  };
  const viewBrand = async () => {
    try {
      const brandData = await brandAPI.getAll();
      setBrand(brandData.data);
    } catch (error) {
      console.error('Đã xảy ra lỗi: ', error);
    }
  };
  useEffect(() => {
    viewBrand();
  }, []);

  const viewColor = async () => {
    try {
      const colorData = await colorAPI.getAll();
      setColor(colorData.data);
    } catch (error) {
      console.error('Đã xảy ra lỗi: ', error);
    }
  };
  useEffect(() => {
    viewColor();
  }, []);

  useEffect(() => {
    fetchProducts(currentPage, pagesSize);
  }, [currentPage, pagesSize]);

  useEffect(() => {
    handleLoading();
    fetchProducts(currentPage, pagesSize, productName, productCode, brandName, productStatus, sortList, sortOrder);
  }, [currentPage, pagesSize, productName, productCode, brandName, colorName, productStatus, sortList, sortOrder]);

  const fetchProducts = async (
    pageNum,
    pagesSize,
    productName,
    productCode,
    brandName,
    colorName,
    productStatus,
    sortList,
    sortOrder,
    minPrice,
    maxPrice,
  ) => {
    try {
      setLoadingProducts(true);
      const response = await fullProductAPI.getAll(
        pageNum,
        pagesSize,
        productName,
        productCode,
        brandName,
        colorName,
        productStatus,
        sortList,
        sortOrder,
        minPrice,
        maxPrice,
      );
      const allProducts = response.data.content;
      setData(allProducts);
      setLoadingProducts(false);
      setTotalItem(response.data.totalElements);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoadingProducts(false);
    }
  };

  const handleLoading = () => {
    setLoadingProducts(true);
    setTimeout(() => {
      setLoadingProducts(false);
    }, 500);
  };

  const Breadcrumb = ({ steps }) => {
    return (
      <div className="breadcrumb">
        {steps.map((step, index) => (
          <Fragment key={index}>
            <span>{step}</span>
            {index !== steps.length - 1 && (
              <span>
                {' '}
                <RightOutlined style={{ fontSize: '14px' }} />{' '}
              </span>
            )}
          </Fragment>
        ))}
      </div>
    );
  };

  const steps = ['Trang chủ', 'Sản phẩm'];
  return (
    <Fragment>
      <div>
        <h3 className={styles.sortTitle}>
          <Button
            type="default"
            style={{
              with: 300,
              // marginLeft: -200,
              marginRight: 30,
              background: 'gold',
              textAlign: 'center',
            }}
            onClick={() => setOpen(true)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={isHovered ? 'hovered' : ''}
          >
            Lọc +
          </Button>
          <Modal
            title="Lọc Sản Phẩm"
            centered
            open={open}
            onOk={() => setOpen(false)}
            onCancel={() => setOpen(false)}
            width={1300}
            style={{
              background: 'gold',
              color: 'black',
              textAlign: 'center',
            }}
            footer={null}
          >
            <div>
              <Form form={form}>
                <Row>
                  <Col span={6}>
                    <Form.Item label="Mã Balo" name="productCode">
                      <Input
                        size="large"
                        style={{
                          width: 200,
                          border: 'black 1px solid',
                        }}
                        // onChange={(e) => setProductName(e.target.value)}
                        value={productCode}
                      />
                    </Form.Item>
                  </Col>

                  <Col span={6}>
                    <Form.Item label="Tên Balo" name="productName">
                      <Input
                        size="large"
                        style={{
                          width: 200,
                          border: 'black 1px solid',
                        }}
                        // onChange={(e) => setProductName(e.target.value)}
                        value={productName}
                      />
                    </Form.Item>
                  </Col>

                  <Col span={6} style={{ marginLeft: '' }}>
                    <Form.Item label="Thương Hiệu" name={'brandName'}>
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
                    </Form.Item>
                  </Col>
                  <Col span={6} style={{ marginLeft: '' }}>
                    <Form.Item label="Sắp xếp" name={'sortBy'}>
                      <Select
                        allowClear
                        size="large"
                        placeholder="Sắp xếp theo"
                        style={{ width: 200 }}
                        options={[
                          { value: 'maGiamDan', label: 'Mã Sản phẩm [A-Z]' },
                          { value: 'maTangDan', label: 'Mã Sản phẩm [Z-A]' },
                          { value: 'tenTangDan', label: 'Tên Sản Phẩm [A-Z]' },
                          { value: 'tenGiamDan', label: 'Tên Sản Phẩm [Z-A]' },
                          { value: 'thuongHieuTangDan', label: 'Tên Thương hiệu [A-Z]' },
                          { value: 'thuongHieuGiamDan', label: 'Tên Thương hiệu [Z-A]' },
                        ]}
                        onChange={(value) => {
                          if (value === 'maTangDan') {
                            setSortOrder('ASC');
                            setSortList('productCode');
                          } else if (value === 'maGiamDan') {
                            setSortOrder('DESC');
                            setSortList('productCode');
                          } else if (value === 'tenTangDan') {
                            setSortOrder('ASC');
                            setSortList('productName');
                          } else if (value === 'tenGiamDan') {
                            setSortOrder('DESC');
                            setSortList('productName');
                          } else if (value === 'thuongHieuTangDan') {
                            setSortOrder('ASC');
                            setSortList('brandName');
                          } else if (value === 'thuongHieuGiamDan') {
                            setSortOrder('DESC');
                            setSortList('brandName');
                          } else {
                            setSortOrder(null);
                            setSortList(null);
                          }
                        }}
                      />
                    </Form.Item>
                  </Col>

                  <Col span={18}>
                    <Button
                      size="large"
                      // type="primary"
                      shape="round"
                      style={{ marginLeft: '250px', background: 'gold', color: 'whtie' }}
                      onClick={handleFilterProduct}
                    >
                      Tìm kiếm
                    </Button>
                  </Col>
                </Row>
              </Form>
            </div>
          </Modal>
          Tùy chọn hiển thị
          <button className={styles.line_col} onClick={() => handleColumnChange('col-4')}>
            <FullscreenOutlined />
          </button>
          <button className={styles.line_col} onClick={() => handleColumnChange('col-3')}>
            <FullscreenExitOutlined />
          </button>
        </h3>

        <div className={styles.listSanPham}>
          {loadingProducts ? (
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <BeatLoader color="#d64336" loading={true} size={50} />
              <p>Loading...</p>
            </div>
          ) : (
            <div className="row">
              <div className={styles.scrollableList}>
                {data
                  .filter((product) => product.productStatus === 1)
                  .map((product) => (
                    <div key={product.productId} className={`${styles.scrollableList} ${columnType}`}>
                      <div className={styles.producItem}>
                        <div className={styles.productImage}>
                          <Link to={`/shop/detail/${product.productId}`}>
                            <div className={styles.contentImage}>
                              <Image
                                src={product.images[0] ? product.images[0].imgUrl : ''}
                                fallback={failesImgg}
                              ></Image>
                            </div>
                          </Link>
                        </div>
                        <div className={styles.describer}>
                          <span className={styles.productPrice}>
                            <a>
                              <span className={styles.price}>
                                {product.productDetails[0]
                                  ? VNDFormaterFunc(product.productDetails[0].retailPrice)
                                  : ''}
                              </span>
                            </a>
                          </span>
                          <Link to={`/shop/detail/${product.productId}`}>
                            <div className={styles.productTitle}>
                              {product.productName}-
                              {product.productDetails[0] ? product.productDetails[0].color.colorName : ''}-
                              {product.brand.brandName}{' '}
                            </div>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
              <Pagination
                showSizeChanger
                total={totalItem} // Tổng số sản phẩm
                onChange={handlePageChange} // Hàm xử lý khi thay đổi trang
                showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} sản phẩm`} // Hiển thị thông tin số sản phẩm
                className={styles.pagination} // Class CSS tùy chỉnh cho phân trang
                current={currentPage}
                defaultPageSize={pagesSize}
              />
            </div>
          )}
        </div>
      </div>
    </Fragment>
  );
}

export default ShopView;
