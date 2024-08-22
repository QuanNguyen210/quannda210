import { Button, Pagination, Popconfirm, Space, Spin, Table, notification } from 'antd';
import { DeleteOutlined, ReloadOutlined, SyncOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import producerAPI from '~/api/propertitesBalo/producerAPI';
import styles from './index.module.scss';
import FormEditProducer from '../../ProducerEdit/FormEditProducer/FormEditProducer';
import FormProducerCreate from '../../ProducerEdit/FormCreateProducer/FormCreateProduer';
// import FormTypeEdit from '../../TypeEdit/FormEdit/FormEditType';

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
      title: 'Mã nhà sản xuất',
      dataIndex: 'producerCode',
      width: 100,
      sorter: (a, b) => a.producerCode.localeCompare(b.producerCode),
    },
    {
      title: 'Tên nhà sản xuất',
      dataIndex: 'producerName',
      width: 100,
      sorter: (a, b) => a.producerName.localeCompare(b.producerName),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'producerStatus',
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
          <FormEditProducer
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
              disabled={(record.producerStatus !== 1) ? true : false}
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
      const response = await producerAPI.getAllPhanTrang(pageNum, pageSize);
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
      await producerAPI.updateStatus(values.producerId, status);
      notification.info({
        message: 'Hủy thành công',
        description: 'Nhà sản xuất có mã: ' + values.producerCode + ' đã được hủy thành công!!!',
        duration: 2,
      });
      getAllPhanTrangType(currentPage, pageSize);
    } catch (error) {
      console.error('Đã xảy ra lỗi khi hủy nhà sản xuất: ', error);
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
      <FormProducerCreate reload={() => { setLoading(true) }} />
      <Button style={{ marginLeft: '5px' }} icon={<ReloadOutlined />} onClick={() => { setLoading(true) }} loading={loading}></Button>
      <Table
        className="table table-striped"
        scroll={{
          x: 1000,
          y: 570,
        }}
        rowKey={(record) => record.producerId}
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
