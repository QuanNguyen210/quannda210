import React, { useState, useEffect, Fragment, useRef } from 'react';
import { Button, Col, Input, Pagination, Popconfirm, Row, Select, Space, Spin, Table, notification } from 'antd';
import staffAPI from '~/api/staffAPI';
import { DeleteOutlined, FilterFilled, ReloadOutlined, SyncOutlined } from '@ant-design/icons';
import styles from './index.module.scss';
// import FormStaffViewDetails from '../../StaffViewDetails/FormStaffViewDetails';
import FormStaffEdit from '../../StaffEdit/FormEdit/FormStaffEdit';
import SearchForm from './FormSearch/SearchForm';
import FormStaffCreate from '../../StaffEdit/FormCreate/FormStaffCreate';
const TableContent = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagesSize, setPagesSize] = useState(10);
  const [totalItem, setTotalItem] = useState();
  const [search, setSearch] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState('');
  const [gender, setGender] = useState('');
  const [role, setRole] = useState('');
  const typingTimeoutRef = useRef(null);
  const onCancel = () => { };


  const lamMoiTrang = () => {
    setSearchTerm('');
    setSearch('');
    setStatus('');
    setGender('');
    setRole('');
  };

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


  useEffect(() => {
    getAll(currentPage, pagesSize);
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, [loading, search, status, gender, role]);

  const getAll = async (current, pageSize) => {
    try {
      const response = await staffAPI.getAlls(search, status, gender, role, current, pageSize);
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
      dataIndex: 'staffCode',
      sorter: (a, b) => a.staffCode.localeCompare(b.staffCode),
      width: '7%',
    },
    {
      title: 'Chức vụ',
      dataIndex: ['users', 'role'],
      width: '8%',
      render: (text, record) => {
        let statusText;
        let statusClass;

        switch (record.users.role) {
          case 'ROLE_ADMIN':
            statusText = 'Admin';
            break;
          case 'ROLE_STAFF':
            statusText = 'Nhân viên';
            break;
          default:
            statusText = 'Null';
            statusClass = 'inactive-status';
        }
        return <span className={statusClass}>{statusText}</span>;
      },
    },
    {
      title: 'Họ và tên',
      dataIndex: ['users', 'fullName'],
      sorter: (a, b) => a.users.fullName.localeCompare(b.users.fullName),
      width: '13%',
    },
    {
      title: 'Email',
      dataIndex: ['users', 'email'],
      width: '15%',
    },

    {
      title: 'SĐT',
      dataIndex: ['users', 'phoneNumber'],
      sorter: (a, b) => a.users.phoneNumber.localeCompare(b.users.phoneNumber),
      width: '10%',
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
      // sorter: (a, b) => a.users.userNote.localeCompare(b.users.userNote),
      width: '14%',
    },

    {
      title: 'Trạng thái',
      dataIndex: 'staffStatus',
      width: '8%',
      render: (text, record) => {
        let statusText;
        let statusClass;

        switch (record.staffStatus) {
          case 1:
            statusText = 'Đang làm';
            statusClass = 'active-status';
            break;
          case 0:
            statusText = 'Tạm dừng';
            statusClass = 'other_status';
            break;
          case -1:
            statusText = 'Nghỉ làm';
            statusClass = 'inactive-status';
            break;
          default:
            statusText = 'Nghỉ làm';
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
          <FormStaffEdit
            staffData={record}
            reload={() => {
              setLoading(true);
            }}
          />
          <Popconfirm
            title="Xác nhận"
            description="Bạn có chắc chắn muốn cho nhân viên nghỉ làm?"
            okText="Đồng ý"
            cancelText="Không"
            onConfirm={() => {
              deleteHandle(record.staffId, -1, record.staffCode);
              setLoading(true);
            }}
            onCancel={onCancel}
          >
            <Button type="default" danger icon={<DeleteOutlined />}>
              Nghỉ làm
            </Button>
          </Popconfirm>
        </Space>
      ),

      width: 100,
    },
  ];

  const deleteHandle = async (id, status, code) => {
    const xoa = await staffAPI.updateStatus(id, status);
    notification.success({
      message: 'Thành công',
      description: 'Cập nhật nhân viên có mã: ' + code + ' là: nghỉ làm!',
    });
    setLoading(true);
  };

  return (
    <div>
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
        <Col span={5}>
          <div style={{ marginTop: '15px' }}>
            <span style={{ marginTop: '20px', fontSize: '20px', fontWeight: 600 }}>
              Chức vụ
              <Select
                bordered={false}
                style={{ width: '40%', borderBottom: '1px solid #ccc', marginLeft: '10px' }}
                onChange={(value) => {
                  setRole(value);
                }}
                value={role}
              >
                <Select.Option value="">Tất cả</Select.Option>
                <Select.Option value="ROLE_ADMIN">Admin</Select.Option>
                <Select.Option value="ROLE_STAFF">Nhân viên</Select.Option>
              </Select>
            </span>
          </div>
        </Col>
        <Col span={5}>
          <div style={{ marginTop: '15px' }}>
            <span style={{ marginLeft: '10%', marginTop: '20px', fontSize: '20px', fontWeight: 600 }}>
              Trạng thái
              <Select
                bordered={false}
                style={{ width: '40%', borderBottom: '1px solid #ccc', marginLeft: '10px' }}
                onChange={(value) => {
                  setStatus(value);
                }}
                value={status}
              >
                <Select.Option value="">Tất cả</Select.Option>
                <Select.Option value="1">Đang làm</Select.Option>
                <Select.Option value="0">Tạm dừng</Select.Option>
                <Select.Option value="-1">Nghỉ làm</Select.Option>
              </Select>
            </span>
          </div>
        </Col>
        <Col span={5}>
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

        <Col span={9}>
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

      <FormStaffCreate reload={() => setLoading(true)} />
      <Button icon={<ReloadOutlined />} onClick={() => setLoading(true)} style={{ marginLeft: '10px' }} loading={loading}></Button>

      <Table
        style={{ margin: '10px' }}
        className="table table-striped"
        scroll={{
          x: 1000,
          y: 590,
        }}
        rowKey={(record) => record.staffId}
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
