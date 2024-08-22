import React, { useState, useEffect, Fragment } from 'react';
import { Button, Pagination, Popconfirm, Space, Spin, Table, notification } from 'antd';
import sizeAPI from '~/api/propertitesBalo/sizeAPI';
import { DeleteOutlined, ReloadOutlined, SyncOutlined } from '@ant-design/icons';
import styles from './index.module.scss';
import FormSizeEdit from '../../SizeEdit/FormEdit/FormSizeEdit';
import FormSizeCreate from '../../SizeEdit/FormCreate/FormSizeCreate';
const TableContent = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagesSize, setPagesSize] = useState(10);
  const [totalItem, setTotalItem] = useState();

  const onCancel = () => {};

  const reload = () => {
    setLoading(true);
    getAll(currentPage, pagesSize);
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  useEffect(() => {
    if (loading) {
      // Tải lại bảng khi biến trạng thái thay đổi
      getAll(currentPage, pagesSize);
      setLoading(false); // Reset lại trạng thái
    }
  }, [loading]);
  useEffect(() => {
    // Fetch size data using the sizeAPI.getAll function
    getAll(currentPage, pagesSize);
    reload();
  }, []); // Update data when page or page size changes

  const onChange = (current, pageSize) => {
    console.log(current);
    console.log(pageSize);
    setCurrentPage(current);
    setPagesSize(pageSize);
    getAll(current, pageSize);
  };

  const getAll = async (current, pageSize) => {
    try {
      const response = await sizeAPI.getAllPaginantion(current, pageSize);
      const data = response.data.content;
      console.log(data);
      setTotalItem(response.data.totalElements);
      setData(data);
    } catch (error) {}
  };

  // Define your table columns
  const columns = [
    {
      title: 'STT',
      width: 49,
      render: (text, record, index) => <span>{(currentPage - 1) * pagesSize + index + 1}</span>,
    },
    {
      title: 'Mã',
      dataIndex: 'sizeCode',
      sorter: (a, b) => a.sizeCode.localeCompare(b.sizeCode),
      width: 100,
    },
    {
      title: 'Tên kích cỡ',
      dataIndex: 'sizeName',
      width: 100,
      sorter: (a, b) => a.sizeName.localeCompare(b.sizeName),
    },
    {
      title: 'Kích cỡ (dài x rộng x cao)',
      dataIndex: 'size', // Use a single dataIndex for the combined data
      width: 100,
      render: (text, record) => `${record.sizeLength} x ${record.sizeWidth} x ${record.sizeHeight}`,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'sizeStatus',

      width: 100,
      render: (status) => {
        let statusText;
        let statusClass;

        switch (status) {
          case 1:
            statusText = 'Hoạt động';
            statusClass = 'active-status';
            break;
          case 0:
            statusText = 'Không hoạt động';
            statusClass = 'inactive-status';
            break;
          case -1:
            statusText = 'Trạng thái khác';
            statusClass = 'other-status';
            break;
          default:
            statusText = 'Không hoạt động';
            statusClass = 'inactive-status';
        }

        return <span className={statusClass}>{statusText}</span>;
      },
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <FormSizeEdit size={record} reload={()=>setLoading(true)}/>
          <Popconfirm
            title="Xác Nhận"
            description="Bạn Có chắc chắn muốn hủy?"
            okText="Đồng ý"
            cancelText="Không"
            onConfirm={() => {
              deleteHandle(record.sizeId, 0);
              reload();
            }}
            onCancel={onCancel}
          >
            <Button type="default" 
            disabled={(record.sizeStatus !== 1) ? true : false}
            danger icon={<DeleteOutlined />}>
              Hủy
            </Button>
          </Popconfirm>
        </Space>
      ),

      width: 100,
    },
  ];

  const deleteHandle = async (id, status) => {
    const xoa = await sizeAPI.updateStatus(id, status);
    notification.info({
      message: 'Xoa trang thai',
      description: 'Đã hủy thành công trang thái của kich cỡ có id là :' + id,
    });
    getAll(currentPage, pagesSize);
    console.log(xoa);
  };

  return (
    <div
      style={{
        padding: '10px',
      }}
    >
      <FormSizeCreate  reload={() => setLoading(true)}/>
      <Button icon={<ReloadOutlined />} onClick={reload} loading={loading}></Button>
      <Table
        className="table table-striped"
        scroll={{
          x: 1000,
          y: 570,
        }}
        rowKey={(record) => record.sizeId}
        columns={columns}
        dataSource={data}
        pagination={false}
        // onChange={handlePageChange} // Handle page changes
        // loading={loading}
      />

      <Pagination
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
