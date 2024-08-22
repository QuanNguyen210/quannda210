import {
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
} from 'antd';
import { useEffect, useState, useContext, useRef } from 'react';
import FormProductEdit from '../../ProductEdit/FormEdit/FormProductEdit';
import FormProductViewDetails from '../../ProductViewDetails/FormViewer/FormProductViewDetails';
import Highlighter from 'react-highlight-words';
import baloAPI from '~/api/productsAPI';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import * as XLSX from 'xlsx';
import styles from './index.module.scss';
import { DeleteOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { CSVLink } from 'react-csv';
import brandAPI from '~/api/propertitesBalo/brandAPI';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

function TableContent() {
  const moment = require('moment');

  const [productList, setProductList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagesSize, setPagesSize] = useState(10);
  const [totalItem, setTotalItem] = useState();
  const [sortedInfo, setSortedInfo] = useState({});
  const [filteredInfo, setFilteredInfo] = useState({});
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);

  const [brand, setBrand] = useState([]);

  var productCodeTemp = '';
  var productNameTemp = '';

  const [productName, setProductName] = useState(null);
  const [productCode, setProductCode] = useState(null);
  const [productStatus, setProductStatus] = useState(null);
  const [brandName, setBrandName] = useState(null);
  const [sortList, setSortList] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const viewBaloProps = async () => {
    try {
      const brandData = await brandAPI.getAll();
      setBrand(brandData.data);
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
  const getColumnSearchProps = (dataIndex, name) => ({
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
      const filteredData = name ? record[dataIndex][name] : record[dataIndex];
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
  const columns = [
    {
      title: 'STT',
      dataIndex: 'index',
      key: 'index',
      width: 40,
      render: (text, record, index) => <span>{(currentPage - 1) * pagesSize + index + 1}</span>,
    },
    {
      title: 'Mã Balo',
      dataIndex: 'productCode',
      width: 85,

      sorter: (a, b) => a.productCode.localeCompare(b.productCode),
      ...getColumnSearchProps('productCode'),
    },
    {
      title: 'Tên Balo',
      dataIndex: 'productName',
      width: 270,
      sorter: (a, b) => a.productName.localeCompare(b.productName),
      ...getColumnSearchProps('productName'),
    },
    {
      title: 'Thương Hiệu',
      dataIndex: ['brand', 'brandName'],
      width: 80,
      sorter: (a, b) => a.brand.brandName.localeCompare(b.brand.brandName),
      ...getColumnSearchProps('brand', 'brandName'),
    },
    {
      title: 'Trạng Thái',
      dataIndex: 'productStatus',
      width: 80,
      render: (status) => {
        switch (status) {
          case 1:
            return 'Hoạt động';
          case 0:
            return 'Tạm ngưng';
          case -1:
            return 'Hủy hoạt động';
          default:
            return 'Không xác định';
        }
      },
      sorter: (a, b) => a.productStatus - b.productStatus,
    },
    {
      title: 'Action',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space size="middle">
          <FormProductViewDetails product={record} handleRefresh={reload} brand={record.brand} />
          <FormProductEdit product={record} brand={record.brand} handleRefresh={reload} />
          <Popconfirm
            title="Xác Nhận"
            description="Bạn Có chắc chắn muốn hủy?"
            okText="Đồng ý"
            cancelText="Không"
            onConfirm={() => {
              handleDeleteBalo(record.productId, 0);
              reload();
            }}
            onCancel={onCancel}
          >
            <Button type="default" danger icon={<DeleteOutlined />}>
              Hủy
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];
  const onCancel = () => {};
  const reload = () => {
    setLoading(true);
    getAllBalo(currentPage, pagesSize, productName, productCode, brandName, productStatus, sortList, sortOrder);
  };
  useEffect(() => {
    handleLoading();
    getAllBalo(currentPage, pagesSize, productName, productCode, brandName, productStatus, sortList, sortOrder);
  }, [currentPage, pagesSize, productName, productCode, brandName, productStatus, sortList, sortOrder]);

  const getAllBalo = async (
    pageNum,
    pageSize,
    productName,
    productCode,
    brandName,
    productStatus,
    sortList,
    sortOrder,
  ) => {
    try {
      setLoading(true);
      const response = await baloAPI.getAll(
        pageNum,
        pageSize,
        productName,
        productCode,
        brandName,
        productStatus,
        sortList,
        sortOrder,
      );
      const data = response.data.content;
      setTotalItem(response.data.totalElements);
      setProductList(data);

      if (response.status === 200) {
        setLoading(false);
      }
      if (productList.length === 0) {
        messageApi.success({
          type: 'success',
          content: `Đã tìm thấy ${response.data.totalElements} sản phẩm!`,
        });
      }
    } catch (error) {
      console.error('Đã xảy ra lỗi: ', error);
    }
  };
  const handleFilterProduct = () => {
    setProductCode(productCodeTemp);
    setProductName(productNameTemp);
  };
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
      getAllBalo(currentPage, pagesSize, productName, productCode, brandName, productStatus, sortList, sortOrder);
    } catch (error) {
      console.error('Đã xảy ra lỗi khi xóa sản phẩm: ', error);
    }
  };

  const onHandleSizeChange = (current, pageSize) => {
    setCurrentPage(1);
    setPagesSize(pageSize);
    getAllBalo(current, pageSize, productName, productCode, brandName, productStatus, sortList, sortOrder);
    handleLoading();
  };
  const onHandlePageNum = (current, pageSize) => {
    setCurrentPage(1);
    setPagesSize(pageSize);
    getAllBalo(1, pageSize, productName, productCode, brandName, productStatus, sortList, sortOrder);
    handleLoading();
  };

  const handlePrint = () => {
    let newList = [];
    // let columnsName = [];
    productList.forEach((item) => {
      newList.push({
        productId: item.productId,
        productCode: item.productCode,
        productName: item.productName,
        brand: item.brand,
        productStatus: item.productStatus,
      });
    });

    localStorage.setItem('printList', JSON.stringify(newList));
    localStorage.setItem('columnsName', JSON.stringify(columns));
    window.open('/print-table', '_blank');
  };
  const tableRows = [['ID', 'Mã Balo', 'Tên Balo', 'Thương Hiệu', 'Trạng Thái']];

  productList.forEach((product) => {
    let statusText = '';
    if (product.productStatus === 1) {
      statusText = 'Còn Hàng';
    } else if (product.productStatus === 0) {
      statusText = 'Tạm Ngưng';
    } else if (product.productStatus === -1) {
      statusText = 'Hủy Hoạt Động';
    } else {
      statusText = 'Trạng Thái Không Xác Định';
    }
    const productData = [
      product.productId,
      product.productCode,
      product.productName,
      product.brand.brandName,
      statusText,
    ];
    tableRows.push(productData);
  });

  const generatePDF = () => {
    const tableColumn = ['ID', 'Mã Balo', 'Tên Balo', 'Thương Hiệu', 'Trạng Thái'];
    const tableRows = [['ID', 'Mã Balo', 'Tên Balo', 'Thương Hiệu', 'Trạng Thái']];

    productList.forEach((product) => {
      let statusText = '';
      if (product.productStatus === 1) {
        statusText = 'Còn Hàng';
      } else if (product.productStatus === 2) {
        statusText = 'Hết Hàng';
      } else if (product.productStatus === 3) {
        statusText = 'Đã Ngừng Sản Xuất';
      } else {
        statusText = 'Trạng Thái Không Xác Định';
      }
      const productData = [
        product.productId,
        product.productCode,
        product.productName,
        product.brand.brandName,
        statusText,
      ];
      tableRows.push(productData);
    });
    const currentTime = new Date();
    const docDefinition = {
      content: [
        {
          text: 'Danh sách sản phẩm',
          fontSize: 20,
          bold: true,
          alignment: 'center', // Thêm alignment để căn giữa
          margin: [0, 0, 0, 10],
        },
        {
          text: 'Thời Gian: ' + currentTime,
          fontSize: 10,
          bold: false,
        },
        {
          table: {
            headerRows: 1,
            widths: [90, 90, 120, 70, 90],
            body: tableRows.map((row) => row.map((cell) => ({ text: cell, alignment: 'center' }))),
            // body: tableRows,
          },
        },
      ],
    };

    const pdfDoc = pdfMake.createPdf(docDefinition); // Create the PDF
    pdfDoc.download(`danh_sach_san_pham-trang_${currentPage}.pdf`); // Initiate the download
  };

  const exportToExcel = () => {
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let currentTime = moment().format();
    const fileExtension = '.xlsx';
    const ws = XLSX.utils.json_to_sheet(tableRows);
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: fileType });
    const fileName = currentTime + fileExtension;
    saveAs(blob, fileName);
  };

  const saveAs = (blob, fileName) => {
    if (window.navigator.msSaveOrOpenBlob) {
      // Cho trình duyệt Edge/IE
      window.navigator.msSaveBlob(blob, fileName);
    } else {
      // Cho các trình duyệt khác
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.href = window.URL.createObjectURL(blob);
      a.download = fileName;
      a.click();
      document.body.removeChild(a);
    }
  };
  const handleRefresh = () => {
    setSortList(null);
    setSortOrder(null);
    setProductStatus(null);
    setBrandName(null);
    setProductCode(null);
    setProductName(null);
    form.resetFields();
    messageApi.open({
      type: 'success',
      content: 'Reset lọc thành công!',
    });
  };
  return (
    <div
      style={{
        padding: '10px',
      }}
    >
      {contextHolder}
      <div>
        <h3>Tìm kiếm</h3>
        <Form form={form}>
          <Row>
            <Col span={6}>
              <Form.Item label="Mã Balo" name="productCode">
                <Input
                  size="large"
                  onChange={(e) => {
                    productCodeTemp = e.target.value;
                  }}
                  value={productCode}
                ></Input>
              </Form.Item>
            </Col>
            <Col span={1}></Col>
            <Col span={6}>
              <Form.Item label="Tên Balo" name={'productName'}>
                <Input
                  size="large"
                  onChange={(e) => {
                    productNameTemp = e.target.value;
                  }}
                  value={productName}
                ></Input>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={6}>
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
            <Col span={1}></Col>
            <Col span={6}>
              <Form.Item label="Trạng Thái" name={'productStatus'}>
                <Select
                  allowClear
                  size="large"
                  placeholder="Trạng Thái"
                  value={productStatus}
                  style={{ width: 200 }}
                  onChange={(value) => {
                    setProductStatus(value);
                  }}
                  options={[
                    { value: 1, label: 'Đang hoạt động' },
                    { value: 0, label: 'Tạm ngưng' },
                    { value: -1, label: 'Hủy hoạt động' },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Lọc theo" name={'sortBy'}>
            <Select
              allowClear
              size="large"
              placeholder="Lọc theo"
              style={{ width: 200 }}
              options={[
                { value: 'maGiamDan', label: 'Mã [A-Z]' },
                { value: 'maTangDan', label: 'Mã [Z-A]' },
                { value: 'tenTangDan', label: 'Tên [A-Z]' },
                { value: 'tenGiamDan', label: 'Tên [Z-A]' },
                { value: 'thuongHieuTangDan', label: 'Tên [A-Z]' },
                { value: 'thuongHieuGiamDan', label: 'Tên [Z-A]' },
                { value: 'trangThaiTangDan', label: 'Trạng thái [A-Z]' },
                { value: 'trangThaiGiamDan', label: 'Trạng thái [Z-A]' },
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
                } else if (value === 'trangThaiTangDan') {
                  setSortOrder('ASC');
                  setSortList('productStatus');
                } else if (value === 'trangThaiGiamDan') {
                  setSortOrder('DESC');
                  setSortList('productStatus');
                } else {
                  setSortOrder(null);
                  setSortList(null);
                }
              }}
            />
          </Form.Item>
          <Row>
            <Col span={2}>
              <Form.Item label="" name={'tìm kiếm'}>
                <Button size="large" type="primary" shape="round" onClick={handleFilterProduct}>
                  Tìm kiếm
                </Button>
              </Form.Item>
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
                <Button type="primary" size="small" shape="round">
                  Reset
                </Button>
              </Popconfirm>
            </Col>
          </Row>
        </Form>
      </div>
      <Button size="middle" type="primary" shape="round" icon={<ReloadOutlined />} onClick={reload} loading={loading}>
        Làm mới
      </Button>
      <div>
        <Row>
          <Col span={19}></Col>
          <Col span={5}>
            <Button type="Button" onClick={handlePrint} style={{ backgroundColor: 'gray', color: 'white' }}>
              Print
            </Button>

            <Button type="Button" onClick={exportToExcel} style={{ backgroundColor: 'gray', color: 'white' }}>
              Excel
            </Button>
            <Button type="Button" onClick={() => {}} style={{ backgroundColor: 'gray', color: 'white' }}>
              <CSVLink data={tableRows} filename={`Product-List-${moment().format()}_Page-${currentPage}.csv`}>
                CSV
              </CSVLink>
            </Button>
            <Button type="Button" onClick={generatePDF} style={{ backgroundColor: 'gray', color: 'white' }}>
              PDF
            </Button>
          </Col>
        </Row>
      </div>
      <Table
        id="table"
        className="table table-striped"
        scroll={{
          x: 1000,
          y: 670,
        }}
        loading={loading}
        rowKey={(record) => record.productId}
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
export default TableContent;
