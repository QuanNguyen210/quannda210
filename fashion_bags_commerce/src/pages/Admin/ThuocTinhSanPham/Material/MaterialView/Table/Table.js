import React, { useState, useEffect, Fragment } from 'react';
import { Button, Pagination, Popconfirm, Space, Spin, Table, notification } from 'antd';
import materialAPI from '~/api/propertitesBalo/materialAPI';
import { DeleteOutlined, ReloadOutlined, SyncOutlined } from '@ant-design/icons';
import styles from './index.module.scss';
import FormMaterialEdit from '../../MaterialEdit/FormEdit/FormMaterialEdit';
import FormMaterialCreate from '../../MaterialEdit/FormCreate/FormMaterialCreate';
// import FormBrandEdit from '../../BrandEdit/FormEdit/FormBrandEdit';
const TableContent = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagesSize, setPagesSize] = useState(10);
  const [totalItem, setTotalItem] = useState();

  const onCancel = () => {};
  const reload = () => {
    setLoading(true);
    getAllPage(currentPage, pagesSize);
    setTimeout(() => {
      setLoading(false);
    }, 300);
  };

  useEffect(() => {
    // Fetch brand data using the brandAPI.getAll function
    getAllPage(currentPage, pagesSize);
    reload();
  }, []); // Update data when page or page size changes

  const onChange = (current, pageSize) => {
    console.log(current);
    console.log(pageSize);
    setCurrentPage(current);
    setPagesSize(pageSize);
    getAllPage(current, pageSize);
  };

  const getAllPage = async (current, pageSize) => {
    try {
      const response = await materialAPI.getAllPage(current, pageSize);
      const data = response.data.content;
      console.log(data);
      setTotalItem(response.data.totalElements);
      setData(data);
    } catch (error) {}
  };
  useEffect(() => {
    if (loading) {
      // Tải lại bảng khi biến trạng thái thay đổi
      getAllPage(currentPage, pagesSize);
      setLoading(false); // Reset lại trạng thái
    }
  }, [loading]);
  // Define your table columns
  const columns = [
    {
      title: 'STT',
      width: 40,
      render: (text, record, index) => <span>{(currentPage - 1) * pagesSize + index + 1}</span>,
    },
    {
      title: 'Mã',
      dataIndex: 'materialCode',
      sorter: (a, b) => a.materialCode.localeCompare(b.materialCode),
      width: 150,
    },
    {
      title: 'Tên chất liệu ',
      dataIndex: 'materialName',
      width: 150,
      sorter: (a, b) => a.materialName.localeCompare(b.materialName),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'materialStatus',

      width: 150,
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
          <FormMaterialEdit material={record}  reload={()=>setLoading(true)}/>
          <Popconfirm
            title="Xác Nhận"
            description="Bạn Có chắc chắn muốn hủy trạng thái?"
            okText="Đồng ý"
            cancelText="Không"
            onConfirm={() => {
              deleteHandle(record.materialId, 0);
              reload();
            }}
            onCancel={onCancel}
          >
            <Button
              type="default"
              disabled={record.materialStatus !== 1 ? true : false}
              danger
              icon={<DeleteOutlined />}
            >
              Hủy
            </Button>
          </Popconfirm>
        </Space>
      ),

      width: 150,
    },
  ];

  const deleteHandle = async (id, status) => {
    const xoa = await materialAPI.updateStatus(id, status);
    notification.info({
      message: 'Hủy trạng thái',
      description: 'Đã hủy trang thái thành công',
    });
    getAllPage(currentPage, pagesSize);
    console.log(xoa);
  };

  return (
    <div
      style={{
        padding: '10px',
      }}
    >
      <FormMaterialCreate reload={()=>setLoading(true)} />
      <Button icon={<ReloadOutlined />} onClick={reload} loading={loading}></Button>
      <Table
        size="middle"
        className="table table-striped"
        scroll={{
          x: 1000,
          y: 570,
        }}
        rowKey={(record) => record.materialId}
        columns={columns}
        dataSource={data}
        pagination={false}
        // onChange={handlePageChange} // Handle page changes
        // loading={loading}
      />
      <div className={styles.pagination}>
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
    </div>
  );
};

export default TableContent;
