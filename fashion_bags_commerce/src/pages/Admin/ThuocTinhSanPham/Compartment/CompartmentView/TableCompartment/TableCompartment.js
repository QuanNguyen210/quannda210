import { Button, Pagination, Popconfirm, Space, Spin, Table, notification } from 'antd';
import { DeleteOutlined, ReloadOutlined, SyncOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import compartmentAPI from '~/api/propertitesBalo/compartmentAPI';
import styles from './index.module.scss';
import FormEditCompartment from '../../CompartmentEdit/FormEditCompartment/FormEditCompartment';
import FormCreateCompartment from '../../CompartmentEdit/FormCreateCompartment/FormCreateCompartment';

function TableContent() {
  const [typeList, setTypeList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItem, setTotalItem] = useState(); // Số lượng dữ liệu tổng cộng

  const handleTableChange = (pagination, filters, sorter) => { };
  const columns = [
    {
      title: 'STT',
      width: 40,
      render: (text, record, index) => <span>{(currentPage - 1) * pageSize + index + 1}</span>,
    },
    {
      title: 'Mã ngăn',
      dataIndex: 'compartmentCode',
      width: 100,
      sorter: (a, b) => a.compartmentCode.localeCompare(b.compartmentCode),
    },
    {
      title: 'Tên mã ngăn',
      dataIndex: 'compartmentName',
      width: 100,
      sorter: (a, b) => a.compartmentName.localeCompare(b.compartmentName),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'compartmentStatus',
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
            statusText = 'Ngừng hoạt động';
            statusClass = 'inactive-status';
            break;
          default:
            statusText = 'Trạng thái khác';
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
          <FormEditCompartment
            type={record}
            reload={() => { setLoading(true); }}
          />
          <Popconfirm
            title="Xác Nhận"
            description="Bạn có chắc chắn muốn hủy?"
            okText="Đồng ý"
            cancelText="Không"
            onConfirm={() => {
              handleDeleteType(record, 0);
              setLoading(true);
            }}
            onCancel={onCancel}
          >
            <Button
              type="default"
              disabled={(record.compartmentStatus !== 1) ? true : false}
              danger
              icon={<DeleteOutlined />}>
              Hủy
            </Button>
          </Popconfirm>
        </Space>
      ),
      width: 100,
    },
  ];
  const onCancel = () => { };

  useEffect(() => {
    getAllPhanTrangType(currentPage, pageSize);
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, [loading]);
  useEffect(() => {
    if (loading) {
      // Tải lại bảng khi biến trạng thái thay đổi
      getAllPhanTrangType(currentPage, pageSize);
      setLoading(false); // Reset lại trạng thái
    }
  }, [loading]);

  const getAllPhanTrangType = async (pageNum, pageSize) => {
    try {
      const response = await compartmentAPI.getAllPhanTrang(pageNum, pageSize);
      const data = response.data.content;
      setTotalItem(response.data.totalElements);
      setTypeList(data);
      setTimeout(() => { }, 500);
    } catch (error) {
      console.error('Đã xảy ra lỗi: ', error);
    }
  };

  const handleDeleteType = async (values, status) => {
    try {
      await compartmentAPI.updateStatus(values.compartmentId, status);
      notification.info({
        message: 'Hủy thành công',
        description: 'Kiểu ngăn có mã: ' + values.compartmentCode + ' đã được hủy thành công!!!',
        duration: 2,
      });
      getAllPhanTrangType(currentPage, pageSize);
    } catch (error) {
      console.error('Đã xảy ra lỗi khi hủy kiểu ngăn: ', error);
    }
  };
  const onShowSizeChange = (current, pageSize) => {
    setPageSize(pageSize);
    setCurrentPage(current);
    getAllPhanTrangType(current, pageSize);
  };
  return (
    <div
      style={{
        padding: '10px',
      }}
    >
      <FormCreateCompartment reload={() => { setLoading(true) }} />
      <Button style={{ marginLeft: '5px' }} icon={<ReloadOutlined />} onClick={() => { setLoading(true) }} loading={loading}></Button>
      <Table
        className="table table-striped"
        scroll={{
          x: 1000,
          y: 570,
        }}
        rowKey={(record) => record.compartmentId}
        columns={columns}
        dataSource={typeList}
        onChange={handleTableChange}
        pagination={false}
      />
      <div className={styles.pagination} style={{ textAlign: 'center' }}>
        <Pagination
          showSizeChanger
          onShowSizeChange={onShowSizeChange}
          onChange={onShowSizeChange}
          defaultCurrent={1}
          total={totalItem}
          current={currentPage}
          defaultPageSize={pageSize}
        />
      </div>
    </div>
  );
}
export default TableContent;
