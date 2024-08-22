import { Button, Pagination, Popconfirm, Space, Spin, Table, notification } from 'antd';
import { DeleteOutlined, ReloadOutlined, SyncOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import buckleTypeAPI from '~/api/propertitesBalo/buckleTypeAPI';
import styles from './index.module.scss';
import FormEditBuckleType from '../../BuckleTypeEdit/FormEditBuckleType/FormEditBuckleType';
import FormBuckleTypeCreate from '../../BuckleTypeEdit/FormCreateBuckleType/FormCreateBuckleType';
function TableContent() {
  const [buckleTypeList, setBuckleTypeList] = useState([]);
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
      title: 'Mã kiểu khóa',
      dataIndex: 'buckleTypeCode',
      width: 100,
      sorter: (a, b) => a.buckleTypeCode.localeCompare(b.buckleTypeCode),
    },
    {
      title: 'Tên kiểu khóa',
      dataIndex: 'buckleTypeName',
      width: 100,
      sorter: (a, b) => a.buckleTypeName.localeCompare(b.typeNbuckleTypeNameame),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'buckleTypeStatus',
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
          <FormEditBuckleType
            buckleType={record}
            reload={() => { setLoading(true); }}
          />
          <Popconfirm
            title="Xác Nhận"
            description="Bạn có chắc chắn muốn hủy?"
            okText="Đồng ý"
            cancelText="Không"
            onConfirm={() => {
              handleDeleteBuckleType(record, 0);
              setLoading(true);
            }}
            onCancel={onCancel}
          >
            <Button
              type="default"
              disabled={(record.buckleTypeStatus !== 1) ? true : false}
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
    getAllPhanTrangBuckleType(currentPage, pageSize);
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, [loading]);
  useEffect(() => {
    if (loading) {
      // Tải lại bảng khi biến trạng thái thay đổi
      getAllPhanTrangBuckleType(currentPage, pageSize);
      setLoading(false); // Reset lại trạng thái
    }
  }, [loading]);

  const getAllPhanTrangBuckleType = async (pageNum, pageSize) => {
    try {
      const response = await buckleTypeAPI.getAllPhanTrang(pageNum, pageSize);
      const data = response.data.content;
      setTotalItem(response.data.totalElements);
      setBuckleTypeList(data);
      setTimeout(() => { }, 500);
    } catch (error) {
      console.error('Đã xảy ra lỗi: ', error);
    }
  };

  const handleDeleteBuckleType = async (values, status) => {
    try {
      await buckleTypeAPI.updateStatus(values.buckleTypeId, status);
      notification.info({
        message: 'Hủy thành công',
        description: 'Kiểu khóa mã: ' + values.buckleTypeCode + ' đã được hủy thành công!!!',
        duration: 2,
      });
      getAllPhanTrangBuckleType(currentPage, pageSize);
    } catch (error) {
      console.error('Đã xảy ra lỗi khi hủy kiểu khóa: ', error);
    }
  };
  const onShowSizeChange = (current, pageSize) => {
    setPageSize(pageSize);
    setCurrentPage(current);
    getAllPhanTrangBuckleType(current, pageSize);
  };
  return (
    <div
      style={{
        padding: '10px',
      }}
    >
      <FormBuckleTypeCreate reload={() => { setLoading(true) }} />
      <Button style={{ marginLeft: '5px' }} icon={<ReloadOutlined />} onClick={() => { setLoading(true) }} loading={loading}></Button>
      <Table
        className="table table-striped"
        scroll={{
          x: 1000,
          y: 570,
        }}
        rowKey={(record) => record.typeId}
        columns={columns}
        dataSource={buckleTypeList}
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
