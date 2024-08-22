import React, { useState, useEffect, Fragment, useRef } from 'react';
import { Button, Col, Input, Pagination, Popconfirm, Row, Select, Space, Spin, Table, notification } from 'antd';
import customerAPI from '~/api/customerAPI';
import { DeleteOutlined, FilterFilled, ReloadOutlined, SyncOutlined } from '@ant-design/icons';
import styles from './index.module.scss';
import { tab } from '@testing-library/user-event/dist/tab';
import FormCustomerEdit from '../../CustomerEdit/FormEdit/FormCustomerEdit';
import SearchForm from './FormSearch/SearchForm';
import FormCustomerCreate from '../../CustomerEdit/FormCreate/FormCustomerCreate';

const TableContent = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagesSize, setPagesSize] = useState(10);
  const [totalItem, setTotalItem] = useState();
  const [search, setSearch] = useState('');
  const typingTimeoutRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState('');
  const [gender, setGender] = useState('');
  const [ranking, setRanking] = useState('');
  const [sortList, setSortList] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [sortListPlaceHolder, setSortListPlaceHolder] = useState('');

  const onCancel = () => { };

  useEffect(() => {
    getAll(currentPage, pagesSize);
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, [loading, search, status, gender, ranking, sortList, sortOrder, sortListPlaceHolder]);



  const onChange = (current, pageSize) => {
    setCurrentPage(current);
    setPagesSize(pageSize);
    setLoading(true);
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value.target.value.toString());
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      setSearch(value.target.value.trim().toString());
    }, 500);
    setLoading(true);
    setCurrentPage(1);
  };

  const getAll = async (page, size) => {
    try {
      const response = await customerAPI.getSearchPagination(
        search,
        status,
        gender,
        ranking,
        page,
        size,
        sortList,
        sortOrder,
        sortListPlaceHolder
      );
      const data = response.data.content;
      setTotalItem(response.data.totalElements);
      setData(data);
    } catch (error) { }
  };

  // Define your table columns
  const columns = [
    {
      title: 'STT',
      width: '4%',
      render: (text, record, index) => <span>{(currentPage - 1) * pagesSize + index + 1}</span>,
    },
    {
      title: 'Mã',
      dataIndex: 'customerCode',
      sorter: (a, b) => a.customerCode.localeCompare(b.customerCode),
      width: '6%',
    },
    {
      title: 'Họ và tên',
      dataIndex: ['users', 'fullName'],
      sorter: (a, b) => a.users.fullName.localeCompare(b.users.fullName),
      width: '12%',
    },
    {
      title: 'Email',
      dataIndex: ['users', 'email'],
      sorter: (a, b) => a.users.email.localeCompare(b.users.email),
      width: '15%',
    },

    {
      title: 'SĐT',
      dataIndex: ['users', 'phoneNumber'],
      sorter: (a, b) => a.users.phoneNumber.localeCompare(b.users.phoneNumber),
      width: '8%',
    },
    {
      title: 'Giới tính',
      dataIndex: ['users', 'gender'],
      width: '5%',
      render: (gender) => {
        return gender ? 'Nam' : 'Nữ';
      },
    },
    {
      title: 'Địa chỉ',
      dataIndex: ['users', 'address'],
      // sorter: (a, b) => a.users.address.localeCompare(b.users.address),
      width: '15%',
    },
    {
      title: 'Điểm tiêu dùng',
      dataIndex: 'consumePoints',
      // sorter: (a, b) => a.rankingPoints.localeCompare(b.rankingPoints),
      width: '5%',
    },
    {
      title: 'Điểm hạng',
      dataIndex: 'rankingPoints',
      // sorter: (a, b) => a.rankingPoints.localeCompare(b.rankingPoints),
      width: '5%',
    },
    {
      title: 'Hạng',
      dataIndex: 'customerRanking',
      // sorter: (a, b) => a.users.userNote.localeCompare(b.users.userNote),
      width: '7%',
      render: (text, record) => {
        let statusText;

        switch (record.customerRanking) {
          case 'KH_TIEMNANG':
            statusText = 'Tiềm năng';
            break;
          case 'KH_THANTHIET':
            statusText = 'Thân thiết';
            break;
          case 'KH_BAC':
            statusText = 'Bạc';
            break;
          case 'KH_VANG':
            statusText = 'Vàng';
            break;
          case 'KH_KIMCUONG':
            statusText = 'Kim cương';
            break;
          default:
            statusText = 'Vô rank';
        }

        return <span>{statusText}</span>;
      },
    },

    {
      title: 'Trạng thái',
      dataIndex: 'customerStatus',
      width: '11%',
      render: (status) => {
        let statusText;
        let statusClass;

        switch (status) {
          case 1:
            statusText = 'Hoạt động';
            statusClass = 'active-status';
            break;
          case -1:
            statusText = 'Không hoạt động';
            statusClass = 'inactive-status';
            break;
          default:
            statusText = 'Null';
            statusClass = 'inactive-status';
        }

        return <span className={statusClass}>{statusText}</span>;
      },
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <FormCustomerEdit
            customerData={record}
            reload={() => {
              setLoading(true);
            }}
          />

          <Popconfirm
            title="Xác Nhận"
            description="Bạn Có chắc chắn muốn xóa?"
            okText="Đồng ý"
            cancelText="Không"
            onConfirm={() => {
              deleteHandle(record.customerId, -1);
              setLoading(true);
            }}
            onCancel={onCancel}
          >
            <Button type="default" danger icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),

      width: 100,
    },
  ];

  const deleteHandle = async (id, status) => {
    await customerAPI.updateStatus(id, status);
    notification.info({
      message: 'Thông báo',
      description: 'Đã xóa thành công khách khàng',
    });
    setLoading(true);
  };
  const lamMoiTrang = () => {
    setSearchTerm('');
    setSearch('');
    setStatus('');
    setGender('');
    setRanking('');
    setSortList('');
    setSortListPlaceHolder('');
    setSortOrder('');
  };

  return (
    <div
      style={{
        padding: '10px',
      }}
    >
      <Row>
        <Col span={2.5}>
          <h2 style={{ margin: '15px 30px 15px 15px ' }}>
            <FilterFilled /> Bộ lọc
          </h2>
        </Col>
        <Col>
          <Button icon={<ReloadOutlined />} onClick={lamMoiTrang} style={{ marginTop: '20px' }} loading={loading}> Làm mới</Button>
        </Col>
      </Row>
      <Row style={{ textAlign: 'center' }}>
        <Col span={4}>
          <div style={{ marginTop: '15px' }}>
            <span style={{ marginTop: '20px', fontSize: '20px', fontWeight: 600 }}>
              Hạng
              <Select
                bordered={false}
                style={{ width: '40%', borderBottom: '1px solid #ccc', marginLeft: '10px' }}
                onChange={(value) => {
                  setRanking(value);
                }}
                value={ranking}
              >
                <Select.Option value="">Tất cả</Select.Option>
                <Select.Option value="KH_TIEMNANG">Tiềm năng</Select.Option>
                <Select.Option value="KH_THANTHIET">Thân thiết</Select.Option>
                <Select.Option value="KH_BAC">Bạc</Select.Option>
                <Select.Option value="KH_VANG">Vàng</Select.Option>
                <Select.Option value="KH_KIMCUONG">Kim cương</Select.Option>
              </Select>
            </span>
          </div>
        </Col>
        <Col span={4}>
          <div style={{ marginTop: '15px' }}>
            <span style={{ marginTop: '20px', fontSize: '20px', fontWeight: 600 }}>
              Trạng thái
              <Select
                bordered={false}
                style={{ width: '55%', borderBottom: '1px solid #ccc', marginLeft: '10px' }}
                onChange={(value) => {
                  setStatus(value);
                }}
                value={status}
              >
                <Select.Option value="">Tất cả</Select.Option>
                <Select.Option value="1">Hoạt động</Select.Option>
                <Select.Option value="-1">Không hoạt động</Select.Option>
              </Select>
            </span>
          </div>
        </Col>
        <Col span={4}>
          <div style={{ marginTop: '15px' }}>
            <span style={{ marginLeft: '10%', marginTop: '20px', fontSize: '20px', fontWeight: 600 }}>
              Giới tính
              <Select
                bordered={false}
                style={{ width: '40%', borderBottom: '1px solid #ccc', marginLeft: '10px' }}
                onChange={(value) => {
                  setGender(value);
                }}
                value={gender}
              >
                <Select.Option value="">Tất cả</Select.Option>
                <Select.Option value="true">Nam</Select.Option>
                <Select.Option value="false">Nữ</Select.Option>
              </Select>
            </span>
          </div>
        </Col>
        <Col span={6}>
          <div style={{ marginTop: '15px' }}>
            <span style={{ marginTop: '20px', fontSize: '20px', fontWeight: 600 }}>
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
                  if (value === 'pointsDESC') {
                    setSortOrder('DESC');
                    setSortList('consumePoints');
                    setSortListPlaceHolder('Điểm tiêu dùng giảm dần');
                  } else if (value === 'pointsASC') {
                    setSortOrder('ASC');
                    setSortList('consumePoints');
                    setSortListPlaceHolder('Điểm tiêu dùng tăng dần');
                  } else if (value === 'rankPointDESC') {
                    setSortOrder('DESC');
                    setSortList('rankingPoints');
                    setSortListPlaceHolder('Hạng khách hàng giảm dần');
                  } else if (value === 'rankPointASC') {
                    setSortOrder('ASC');
                    setSortList('rankingPoints');
                    setSortListPlaceHolder('Hạng khách hàng tăng dần');
                  } else {
                    setSortOrder('');
                    setSortList('');
                    setSortListPlaceHolder('Không sắp xếp');
                  }
                }}
              >
                <Select.Option key={'0'} value={''}>
                  Không sắp xếp
                </Select.Option>
                <Select.Option key={'1'} value={'pointsDESC'}>
                  Điểm tiêu dùng giảm dần
                </Select.Option>
                <Select.Option key={'2'} value={'pointsASC'}>
                  Điểm tiêu dùng tăng dần
                </Select.Option>
                <Select.Option key={'3'} value={'rankPointDESC'}>
                  Hạng khách hàng giảm dần
                </Select.Option>
                <Select.Option key={'4'} value={'rankPointASC'}>
                  Hạng khách hàng tăng dần
                </Select.Option>
              </Select>
            </span>
          </div>
        </Col>
        <Col span={6}>
          <div className={styles.searchContainer}>
            <Input
              className={styles.searchIinput}
              type="text"
              placeholder="Tìm kiếm"
              value={searchTerm}
              onChange={handleSearchChange}
            ></Input>
          </div>
        </Col>
      </Row>
      <FormCustomerCreate reload={() => setLoading(true)} />
      <Button icon={<ReloadOutlined />} style={{ marginLeft: '10px' }} onClick={() => setLoading(true)} loading={loading}></Button>

      <Table
        // scroll={{
        //   x: 550,
        //   y: 570,
        // }}
        style={{ marginTop: '10px' }}
        rowKey={(record) => record.customerId}
        columns={columns}
        dataSource={data}
        pagination={false}
        loading={loading}
      // onChange={handlePageChange} // Handle page changes
      />

      <Pagination
        style={{ margin: '20px' }}
        className={styles.pagination}
        showSizeChanger
        total={totalItem}
        onChange={onChange}
        defaultCurrent={1}
        current={currentPage}
        defaultPageSize={pagesSize}
      />
    </div>
  );
};

export default TableContent;

//add nhan vien
