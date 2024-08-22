import {
  Button,
  Card,
  Col,
  DatePicker,
  Input,
  Pagination,
  Popconfirm,
  Popover,
  Row,
  Select,
  Space,
  Table,
  Tabs,
  Typography,
  notification,

} from 'antd';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  FilterFilled,
  ReloadOutlined,
  StarFilled,
  StarOutlined,
  SyncOutlined,
  TableOutlined,
} from '@ant-design/icons';
import React, { useEffect, useRef, useState } from 'react';
import billsAPI from '~/api/BillApi';
import styles from './index.module.scss';
import SearchForm from '~/Utilities/FormSearch/SearchForm';
import dayjs from 'dayjs';
import VNDFormaterFunc from '~/Utilities/VNDFormaterFunc';
import FormCapNhatTrangThai from '../../CapNhatHoaDon/CapNhatTrangThai';
import productDetailsAPI from '~/api/productDetailsAPI';
import billDetailsAPI from '~/api/BillDetailsAPI';
import FormChiTietHoaDon from '../../ChiTietHoaDon/FormChiTietHoaDon';
import customerAPI from '~/api/customerAPI';
const { RangePicker } = DatePicker;

function TableHoaDon() {
  const [data, setData] = useState([]);
  const [listCustomer, setListCustomer] = useState([]);
  const [totalItem, setTotalItem] = useState();
  const [loading, setLoading] = useState(true);
  const [PageNum, setPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortList, setSortList] = useState('billCreateDate');
  const [sortOrder, setSortOrder] = useState('DESC');
  const [sortListPlaceHolder, setSortListPlaceHolder] = useState('timeDESC');
  const [searchTerm, setSearchTerm] = useState('');
  const typingTimeoutRef = useRef(null);
  const [customerPhoneNumber, setCustomerPhoneNumber] = useState('');
  const [filterRank, setFilterRank] = useState('');




  const thongTinKhachHang = (values) => {
    return (
      <div >
        <h5 style={{ margin: '10px', fontWeight: 'bold' }}>Khách hàng: {values.customer.customerCode} </h5>
        <ul >
          <li >
            <span style={{ fontSize: '16px', fontWeight: 'bold' }}>Tên: </span>
            <span style={{ color: 'red', fontSize: '16px' }}>{values.customer.users.fullName} </span>
          </li>
          <li >
            <span style={{ fontSize: '16px', fontWeight: 'bold' }}>SĐT: </span>
            <span style={{ color: 'red', fontSize: '16px' }}>{values.customer.users.phoneNumber} </span>
          </li>
          <li >
            <span style={{ fontSize: '16px', fontWeight: 'bold' }}>Email: </span>
            <span style={{ color: 'red', fontSize: '16px' }}>{values.customer.users.email} </span>
          </li>
          <li >
            <span style={{ fontSize: '16px', fontWeight: 'bold' }}>Địa chỉ: </span>
            <span style={{ color: 'red', fontSize: '16px' }}>{values.customer.users.address} </span>
          </li>
          <li >
            <span style={{ fontSize: '16px', fontWeight: 'bold' }}>Điểm tiêu dùng: </span>
            <span style={{ color: 'red', fontSize: '16px' }}>{values.customer.consumePoints + ' điểm'} </span>
          </li>
          <li >
            <span style={{ fontSize: '16px', fontWeight: 'bold' }}>Điểm hạng: </span>
            <span style={{ color: 'red', fontSize: '16px' }}>{values.customer.rankingPoints + ' điểm'} </span>
          </li>
          <li >
            <span style={{ fontSize: '16px', fontWeight: 'bold' }}>Hạng: </span>
            <span style={{ color: 'red', fontSize: '16px' }}>{rankKhachHangViewHover(values)} </span>
          </li>
        </ul>
      </div>
    );
  }
  const rankKhachHangViewHover = (values) => {
    if (values.customer == null) {
      return (<span>
        <StarOutlined /><StarOutlined /><StarOutlined /><StarOutlined /><StarOutlined />
        Khách hàng lẻ
      </span>);
    } else if (values.customer.customerRanking === 'KH_TIEMNANG') {
      return (<span>
        <StarFilled /><StarOutlined /><StarOutlined /><StarOutlined /><StarOutlined />  Tiềm năng
      </span>);
    } else if (values.customer.customerRanking === 'KH_THANTHIET') {
      return (<span>
        <StarFilled /><StarFilled /><StarOutlined /><StarOutlined /><StarOutlined /> Thân thiết
      </span>);
    } else if (values.customer.customerRanking === 'KH_BAC') {
      return (<span>
        <StarFilled /><StarFilled /><StarFilled /><StarOutlined /><StarOutlined /> Bạc
      </span>);
    } else if (values.customer.customerRanking === 'KH_VANG') {
      return (<span>
        <StarFilled /><StarFilled /><StarFilled /><StarFilled /><StarOutlined /> Vàng
      </span>);
    } else if (values.customer.customerRanking === 'KH_KIMCUONG') {
      return (<span>
        <StarFilled /><StarFilled /><StarFilled /><StarFilled /><StarFilled /> Kim cương
      </span>);
    } else {
      return 'Chưa có hạng';
    }
  }
  const setRankKhachHang = (values) => {
    if (values.customer == null) {
      return (<span>
        <StarOutlined /><StarOutlined /><StarOutlined /><StarOutlined /><StarOutlined /><br></br>
        Khách hàng lẻ
      </span>);
    } else if (values.customer.customerRanking === 'KH_TIEMNANG') {
      return (<span>
        <StarFilled /><StarOutlined /><StarOutlined /><StarOutlined /><StarOutlined /> <br></br> Tiềm năng
      </span>);
    } else if (values.customer.customerRanking === 'KH_THANTHIET') {
      return (<span>
        <StarFilled /><StarFilled /><StarOutlined /><StarOutlined /><StarOutlined /><br></br> Thân thiết
      </span>);
    } else if (values.customer.customerRanking === 'KH_BAC') {
      return (<span>
        <StarFilled /><StarFilled /><StarFilled /><StarOutlined /><StarOutlined /><br></br> Bạc
      </span>);
    } else if (values.customer.customerRanking === 'KH_VANG') {
      return (<span>
        <StarFilled /><StarFilled /><StarFilled /><StarFilled /><StarOutlined /><br></br> Vàng
      </span>);
    } else if (values.customer.customerRanking === 'KH_KIMCUONG') {
      return (<span>
        <StarFilled /><StarFilled /><StarFilled /><StarFilled /><StarFilled /><br></br> Kim cương
      </span>);
    } else {
      return 'Chưa có hạng';
    }
  }
  const hanhDong = (record, capNhat, xoa) => {
    return (
      <div>
        <Space size="middle" >
          <FormCapNhatTrangThai disabled={capNhat} status={record} reload={() => setLoading(true)} />
          <Popconfirm
            title="Xác Nhận"
            description="Bạn có chắc chắn muốn hủy đơn hàng?"
            okText="Đồng ý"
            cancelText="Không"
            onConfirm={() => {
              deleteHandle(record.billId, -1, record.billCode);
              setLoading(true);
            }}
            onCancel={onCancel}
          >
            <Button disabled={xoa} type="primary" danger icon={<CloseCircleOutlined />}>Hủy</Button>
          </Popconfirm>
        </Space>
      </div>

    )
  };
  const columns = [
    {
      key: 'stt',
      dataIndex: 'index',
      title: 'STT',
      // fixed: "left",
      width: '50px',
      render: (text, record, index) => {
        return <span id={record.id}>{(PageNum - 1) * pageSize + (index + 1)}</span>;
      },
    },
    {
      title: 'Mã hóa đơn',
      dataIndex: 'billCode',
      key: 'code',
      // fixed: "left",
      width: '80px'
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'billCreateDate',
      width: '140px',
      sorter: (a, b) => a.billCreateDate.localeCompare(b.billCreateDate),
      render: (date) => {
        const formattedDate = dayjs(date).format('HH:mm:ss DD-MM-YYYY');
        return <span>{formattedDate}</span>;
      },
    },
    {
      title: 'Tên khách hàng',
      dataIndex: 'receiverName',
      key: 'receiverName',
      width: '130px',
      render: (text, record) => {
        if (record.customer == null) {
          return <span>
            {record.receiverName}
          </span>;
        } else {
          return (
            <Popover placement="top" content={thongTinKhachHang(record)} >
              <Typography.Text>{record.receiverName}</Typography.Text>
            </Popover>
          );
        }
      },
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'orderPhone',
      key: 'orderPhone',
      width: '100px',
      render: (text, record) => {
        if (record.customer == null) {
          return <span>
            {record.orderPhone}
          </span>;
        } else {
          return (
            <Popover placement="top" content={thongTinKhachHang(record)} >
              <Typography.Text>{record.orderPhone}</Typography.Text>
            </Popover>
          );
          // return record.customer.users.phoneNumber;
        }
      },
    },
    {
      title: 'Hạng khách hàng',
      dataIndex: 'customerRanking',
      key: 'customerRanking',
      width: '150px',
      render: (text, record) => {
        if (record.customer == null) {
          return <span>
            {setRankKhachHang(record)}
          </span>;
        } else {
          return (
            <Popover placement="top" content={thongTinKhachHang(record)} >
              <Typography.Text>{setRankKhachHang(record)}</Typography.Text>
            </Popover>
          );
        }
        // return (setRankKhachHang(record));
      },
    },
    {
      title: 'Tổng thanh toán',
      dataIndex: 'billPriceAfterVoucher',
      key: 'billPriceAfterVoucher',
      render: (price) => {
        return <span>{VNDFormaterFunc(price)}</span>;
      },
      width: '130px',
    },

    {
      title: 'Trạng thái',
      dataIndex: 'billStatus',
      width: '200px',
      key: 'status',
      render: (status) => {
        let statusText;
        let statusClass;
        let backgroundColor; // Define a variable for text color

        switch (status) {
          case 4:
            statusText = 'Chờ xác nhận';
            statusClass = 'active-status';
            backgroundColor = '#ffcc00';
            break;
          case 3:
            statusText = 'Đang đóng gói';
            statusClass = 'inactiveStatus';
            backgroundColor = '#66cc66';
            break;
          case 2:
            statusText = 'Đang giao';
            statusClass = 'inactiveStatus';
            backgroundColor = '#99cc00';
            break;
          case 1:
            statusText = 'Thành công';
            statusClass = 'inactiveStatus';
            backgroundColor = '#3399ff';
            break;
          case -1:
            statusText = 'Đã hủy';
            statusClass = 'other-status';
            backgroundColor = '#ff3333';
            break;
          default:
            statusText = 'Không xác định';
            statusClass = 'other-status';
            backgroundColor = '#ff3333';
        }
        const textStyles = {
          backgroundColor: backgroundColor,
          padding: '13px',
          fontSize: '16px',
          fontWeight: 'bold',
          borderRadius: '20px',
          color: 'white',
        };
        return (
          <span className={statusClass} style={textStyles}>
            {statusText}
          </span>
        );
      },
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (text, record) => {
        if (record.billStatus === 1) {
          return (
            <div>
              <Space size="middle" style={{ marginTop: '10px' }}>
                <FormChiTietHoaDon bills={record} reload={() => setLoading(true)} />
                {hanhDong(record, true, true)}
              </Space>
            </div>
          );
        } else if (record.billStatus === 2) {
          return (
            <div>
              <Space size="middle" style={{ marginTop: '10px' }}>
                <FormChiTietHoaDon bills={record} reload={() => setLoading(true)} />
                {hanhDong(record, false, true)}
              </Space>
            </div>
          );
        } else if (record.billStatus !== -1) {
          return (
            <div>
              <Space size="middle" style={{ marginTop: '10px' }}>
                <FormChiTietHoaDon bills={record} reload={() => setLoading(true)} />
                {hanhDong(record, false, false)}
              </Space>
            </div>
          );
        } else {
          return (
            <div>
              <Space size="middle" style={{ marginTop: '10px' }}>
                <FormChiTietHoaDon bills={record} reload={() => setLoading(true)} />
                {hanhDong(record, true, true)}
              </Space>
            </div>
          );
        }
      },
      width: 100,
    },
  ];


  const updateAmount = async (billId) => {
    const list = await billDetailsAPI.getBillDetailsByBillIdUpdateAmount(billId);
    if (Array.isArray(list.data)) {
      await Promise.all(
        list.data.map(async (o) => {
          await productDetailsAPI.updateAmount(o.productDetails.productDetailId, -o.amount);
        }),
      );
    }

  };
  // const getAllByBillId = async (billId) => {
  //   const response = await billDetailsAPI.getAllByBillId(billId);
  //   const data = response.data;
  //   setListBillDetais(data);
  // };
  const deleteHandle = async (billId, status, code) => {
    updateAmount(billId);
    await billsAPI.updateStatus(billId, status);
    notification.success({
      message: 'Hủy thành công',
      description: 'Đơn hàng ' + code + ' hủy thành công!',
    });
  };
  const onCancel = () => { };

  const onRangeChange = (dates, dateStrings) => {
    if (dates) {
      setStartDate(dateStrings[0]);
      setEndDate(dateStrings[1]);
      setPageNum(1);
    } else {
      setStartDate('0001-01-01');
      setEndDate('9999-02-02');
      setPageNum(1);
    }
  };

  const rangePresets = [
    {
      label: 'Hôm nay',
      value: [dayjs(), dayjs().add(1, 'd')],
    },
    {
      label: '7 ngày qua',
      value: [dayjs().add(-7, 'd'), dayjs().add(1, 'd')],
    },
    {
      label: '14 ngày qua',
      value: [dayjs().add(-14, 'd'), dayjs().add(1, 'd')],
    },
    {
      label: '30 ngày qua',
      value: [dayjs().add(-30, 'd'), dayjs().add(1, 'd')],
    },
    {
      label: '90 ngày qua',
      value: [dayjs().add(-90, 'd'), dayjs().add(1, 'd')],
    },
  ];

  const handleSearchChange = (value) => {
    setSearchTerm(value.target.value.toString());
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      setSearch(value.target.value.trim().toString());
    }, 500);
    setLoading(true);
    setPageNum(1);
  };

  const onChangeBill = (e) => {
    setStatus(e);
    setPageNum(1);
  };
  const onChangePage = (current, pageSize) => {
    setPageNum(current);
    setPageSize(pageSize);
    setLoading(true);
  };

  const getAllPhanTrangCompartment = async (pageNum, pageSize) => {
    try {
      const response = await billsAPI.getAllSearchPagination(
        startDate,
        endDate,
        status,
        search,
        pageNum,
        pageSize,
        filterRank,
        customerPhoneNumber,
        sortList,
        sortOrder,
        sortListPlaceHolder
      );
      const data = response.data.content;
      setTotalItem(response.data.totalElements);
      setData(data);
    } catch (error) {
      console.error('Đã xảy ra lỗi: ', error);
    }
  };

  const getAllCustomer = async () => {
    try {
      const responseCustomer = await customerAPI.getAllNotPagination();
      setListCustomer(responseCustomer.data);
    } catch (error) {
      console.error('Error fetching staff data:', error);
    }
  };
  const renderCustomerOptions = () => {
    return (
      <>
        <Select.Option value=''>Tất cả</Select.Option>
        {(listCustomer ?? []).map((item, index) => {
          if (filterRank === '' || filterRank === item.customerRanking) {
            return (
              <Select.Option key={index} value={item.customerId}>
                {item.customerCode + ' - ' + item.users.phoneNumber + ' - ' + item.users.fullName}
              </Select.Option>
            );
          }
          return null;
        })}
      </>
    );
  };


  useEffect(() => {
    getAllCustomer();
    getAllPhanTrangCompartment(PageNum, pageSize);
    // console.log('Khách hàng: ' + filterRank + customerPhoneNumber);
    setTimeout(() => {
      setLoading(false);
    }, 500);
    // console.log(filterRank + filterCustomerId);

  }, [loading, search, status, startDate, endDate, sortList, sortOrder, customerPhoneNumber, filterRank, sortListPlaceHolder]);

  useEffect(() => {
    renderCustomerOptions();
  }, [filterRank]);

  // lọc theo khách hàng
  const onChangeKhachHang = (value) => {
    // trả về customerId
    setCustomerPhoneNumber(value);
    // console.log(`selected ${value}`);
  };
  const onSearchKhachHang = (value) => {
    // trả về những kí tự tìm kiếm
    // console.log('search:', value);
  };
  const filterOption = (input, option) =>
    (option?.children ?? '').toLowerCase().includes(input.trim().toLowerCase());


  return (
    <div>
      <Card>
        <section>
          <Row>
            <h2 style={{ marginBottom: '30px' }}>
              <FilterFilled /> Bộ lọc
            </h2>
          </Row>
          <Row>
            <Col span={9}>
              <div style={{ paddingTop: '10px', fontSize: '18px' }}>
                <span style={{ fontWeight: 500 }}>Ngày tạo</span>
                <RangePicker placeholder={['Ngày bắt đầu', 'Ngày kết thúc']} className={styles.filter_inputSearch} style={{ marginLeft: '10px' }} presets={rangePresets} onChange={onRangeChange} />
              </div>
            </Col>
            <Col span={7}>
              <div style={{ paddingTop: '10px', fontSize: '18px' }}>
                <span style={{ paddingTop: '20px', fontSize: '18px', fontWeight: 500 }}>
                  Sắp xếp
                  <Select
                    allowClear
                    value={sortListPlaceHolder}
                    placeholder={'Sắp xếp theo...'}
                    size="large"
                    style={{
                      width: 250, marginLeft: '10px'
                    }}
                    onChange={(value) => {
                      if (value === 'priceASC') {
                        setSortOrder('ASC');
                        setSortList('billPriceAfterVoucher');
                        setSortListPlaceHolder('Tổng thanh toán tăng dần');
                      } else if (value === 'priceDESC') {
                        setSortOrder('DESC');
                        setSortList('billPriceAfterVoucher');
                        setSortListPlaceHolder('Tổng thanh toán giảm dần');
                      } else if (value === 'timeASC') {
                        setSortOrder('ASC');
                        setSortList('billCreateDate');
                        setSortListPlaceHolder('Thời gian tăng dần');
                      } else if (value === 'timeDESC') {
                        setSortOrder('DESC');
                        setSortList('billCreateDate');
                        setSortListPlaceHolder('Thời gian giảm dần');
                      } else {
                        setSortOrder(null);
                        setSortList(null);
                        setSortListPlaceHolder('Không sắp xếp');
                      }
                    }}
                  >
                    <Select.Option key={'0'} value={'0'}>
                      Không sắp xếp
                    </Select.Option>
                    <Select.Option key={'1'} value={'priceASC'}>
                      Tổng thanh toán tăng dần
                    </Select.Option>
                    <Select.Option key={'2'} value={'priceDESC'}>
                      Tổng thanh toán giảm dần
                    </Select.Option>
                    <Select.Option key={'3'} value={'timeASC'}>
                      Thời gian tăng dần
                    </Select.Option>
                    <Select.Option key={'4'} value={'timeDESC'}>
                      Thời gian giảm dần
                    </Select.Option>
                  </Select>
                </span>
              </div>
            </Col>
          </Row>
          <Row style={{ marginTop: '10px' }}>
            <Col span={9}>
              <div style={{ paddingTop: '10px', fontSize: '18px' }}>
                <span style={{ paddingTop: '20px', fontSize: '18px', fontWeight: 500 }}>
                  Hạng khách hàng
                  <Select
                    placeholder="Lọc theo hạng khách hàng"
                    style={{ width: '40%', marginLeft: '10px' }}
                    onChange={(value) => {
                      setFilterRank(value);
                      setCustomerPhoneNumber('');
                    }}
                  >
                    <Select.Option value="">Tất cả</Select.Option>
                    <Select.Option value="khachHangLe">Khách hàng lẻ</Select.Option>
                    <Select.Option value="KH_TIEMNANG">Tiềm năng</Select.Option>
                    <Select.Option value="KH_THANTHIET">Thân thiết</Select.Option>
                    <Select.Option value="KH_BAC">Bạc</Select.Option>
                    <Select.Option value="KH_VANG">Vàng</Select.Option>
                    <Select.Option value="KH_KIMCUONG">Kim cương</Select.Option>
                  </Select>
                </span>
              </div>
            </Col>
            <Col span={9}>
              <div style={{ paddingTop: '10px', fontSize: '18px' }}>
                <span style={{ paddingTop: '20px', fontSize: '18px', fontWeight: 500 }}>
                  Khách hàng
                  <Select
                    showSearch
                    placeholder="Tìm và lọc hóa đơn theo khách hàng"
                    optionFilterProp="children"
                    disabled={(filterRank === 'khachHangLe') ? true : false}
                    onChange={onChangeKhachHang}
                    onSearch={onSearchKhachHang}
                    filterOption={filterOption}
                    value={customerPhoneNumber}
                    style={{ marginLeft: '10px', width: '68%' }}
                  >
                    {renderCustomerOptions()}
                  </Select>
                </span>
              </div>
            </Col>
          </Row>
        </section>
      </Card>
      <Card>
        <section>
          <Row style={{ margin: '10px' }}>
            <Col span={5.5}>
              <h2 >
                <TableOutlined /> Danh sách hóa đơn online
              </h2>
            </Col>
            <Col span={10}>
              <Button icon={<ReloadOutlined />} onClick={() => { setLoading(true) }} style={{ marginTop: '7px', marginLeft: '15px' }} loading={loading}></Button>
            </Col>
            <Col span={7}>
              {/* <div className={styles.searchContainer}> */}
              <Input
                className={styles.searchIinput}
                type="text"
                placeholder="Tìm kiếm thông tin trên hóa đơn"
                value={searchTerm}
                onChange={handleSearchChange}
              ></Input>
              {/* </div> */}
            </Col>
          </Row>
          <Tabs
            defaultActiveKey={status}
            onChange={(e) => onChangeBill(e)}
            items={[
              SyncOutlined,
              ClockCircleOutlined,
              ClockCircleOutlined,
              ClockCircleOutlined,
              CheckCircleOutlined,
              CloseCircleOutlined,
            ].map((Icon, i) => {
              const id = String(i + 1);
              return {
                label: (
                  <span>
                    {React.createElement(Icon)} {/* Use React.createElement to create the icon */}
                    {id === '1'
                      ? 'Tất cả'
                      : id === '2'
                        ? 'Chờ xác nhận'
                        : id === '3'
                          ? 'Đang đóng gói'
                          : id === '4'
                            ? 'Đang giao'
                            : id === '5'
                              ? 'Thành công'
                              : id === '6'
                                ? 'Đã hủy'
                                : ''}
                  </span>
                ),
                key: id === '1' ? '' : id === '2' ? '4' : id === '3' ? '3' : id === '4' ? '2' : id === '5' ? '1' : id === '6' ? '-1' : '',
                children: (
                  <div style={{ padding: '8px' }}>
                    <span style={{ fontWeight: 500 }}>{/* <TableOutlined /> Danh sách yêu cầu */}</span>
                    <Table
                      style={{ marginTop: '10px' }}
                      dataSource={data}
                      columns={columns}
                      loading={loading}
                      rowKey={(record) => record.billId}
                      loadingIndicator={<div>Loading...</div>}
                      pagination={false}
                    />
                    <Pagination
                      className={styles.pagination}
                      showSizeChanger
                      total={totalItem}
                      onChange={onChangePage}
                      defaultCurrent={1}
                      current={PageNum}
                      defaultPageSize={pageSize}
                    />
                  </div>
                ),
              };
            })}
          />
        </section>
      </Card>
    </div>
  );
}
export default TableHoaDon;
