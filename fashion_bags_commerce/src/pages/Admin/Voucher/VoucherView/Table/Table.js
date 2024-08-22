import React, { useState, useEffect, Fragment } from 'react';
import { Button, Pagination, Popconfirm, Space, Spin, Table, notification } from 'antd';
import voucherAPI from '~/api/voucherAPI';
import { DeleteOutlined, ReloadOutlined, SyncOutlined } from '@ant-design/icons';
import styles from './index.module.scss';
import FormvoucherEdit from '../../VoucherEdit/FormVoucherEdit';
import FormVoucherCreate from '../../VoucherEdit/FormrCreate/FormVoucherCreate';
import moment from 'moment';
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
    reload();
  }, []);

  useEffect(() => {
    getAll(currentPage, pagesSize);
  }, []);

  const onChange = (current, pageSize) => {
    console.log(current);
    console.log(pageSize);
    setCurrentPage(current);
    setPagesSize(pageSize);
    getAll(current, pageSize);
  };

  const getAll = async (current, pageSize) => {
    try {
      const response = await voucherAPI.getAll(current, pageSize);
      const data = response.data.content;
      console.log(data);
      setTotalItem(response.data.totalElements);
      setData(data);
      setTimeout(() => {}, 300);
    } catch (error) {}
  };

  // Define your table columns
  const columns = [
    {
      title: 'STT',
      width: 80,
      fixed: 'left',
      render: (text, record, index) => <span>{(currentPage - 1) * pagesSize + index + 1}</span>,
    },
    {
      title: 'Mã',
      dataIndex: 'voucherCode',
      width: 200,
      fixed: 'left',
    },
    {
      title: 'Tên khuyến mãi',
      dataIndex: 'voucherName',
      width: 200,
      fixed: 'left',
    },

    {
      title: 'Thời gian bắt đầu',
      dataIndex: 'voucherStartTime',
      render: (endTime) => moment(endTime).format('YYYY-MM-DD HH:mm:ss'),
      width: 200,
    },
    {
      title: 'Thời gian kết thúc',
      dataIndex: 'voucherEndTime',
      render: (endTime) => moment(endTime).format('YYYY-MM-DD HH:mm:ss'),
      width: 200,
    },
    {
      title: 'Số lượng',
      dataIndex: 'voucherAmount',
      width: 100,
    },
    {
      title: 'Giảm giá(%)',
      dataIndex: 'discountPercent',
      width: 120,
    },
    {
      title: 'Giá tối thiểu',
      dataIndex: 'totalPriceToReceive',
      width: 200,
    },
    {
      title: 'Voucher note',
      dataIndex: 'voucherNote',
      width: 200,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'voucherStatus',
      fixed: 'right',

      width: 200,
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
      fixed: 'right',
      render: (_, record) => (
        <Space size="middle">
          <FormvoucherEdit
            voucher={record}
            reload={() => {
              setLoading(true);
            }}
          />
          <Popconfirm
            title="Xác Nhận"
            description="Bạn Có chắc chắn muốn hủy trạng thái?"
            okText="Đồng ý"
            cancelText="Không"
            onConfirm={() => {
              deleteHandle(record.voucherId, 0);
              reload();
            }}
            onCancel={onCancel}
          >
            <Button
              type="default"
              disabled={record.voucherStatus !== 1 ? true : false}
              danger
              icon={<DeleteOutlined />}
            >
              Hủy
            </Button>
          </Popconfirm>
        </Space>
      ),

      width: 200,
    },
  ];
  useEffect(() => {
    if (loading) {
      // Tải lại bảng khi biến trạng thái thay đổi
      getAll(currentPage, pagesSize);
      setLoading(false); // Reset lại trạng thái
    }
  }, [loading]);

  const deleteHandle = async (id, status) => {
    const xoa = await voucherAPI.updateStatus(id, status);
    notification.info({
      message: 'Thông báo',
      description: 'Đã hủy thành công trạng thái của voucher có code là là :' + id.voucherCode,
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
      <FormVoucherCreate reload={() => setLoading(true)} />
      <Button icon={<ReloadOutlined />} onClick={reload} loading={loading}></Button>
      <Table
        className="table table-striped"
        scroll={{
          x: 700,
          y: 550,
        }}
        rowKey={(record) => record.voucherId}
        columns={columns}
        dataSource={data}
        pagination={false}
        // onChange={handlePageChange} // Handle page changes
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
