import { Table } from 'antd';

const { useEffect, useState } = require('react');

const PrintProduct = () => {
  window.print();
  const printList = JSON.parse(localStorage.getItem('printList'));
  const [printed, setPrinted] = useState(false);
  const columns = [
    {
      title: 'STT',
      dataIndex: 'index',
      key: 'index',
      width: 10,
      render: (text, record, index) => <span>{index + 1}</span>,
    },
    {
      title: 'Mã Balo',
      dataIndex: 'productCode',
      width: 50,
    },
    {
      title: 'Tên Balo',
      dataIndex: 'productName',
      width: 450,
    },
    {
      title: 'Thương Hiệu',
      dataIndex: ['brand', 'brandName'],
      width: 150,
    },
    {
      title: 'Trạng Thái',
      dataIndex: 'productStatus',
      width: 150,
      render: (status) => {
        switch (status) {
          case 1:
            return 'Hoạt động';
          case 0:
            return 'Không hoạt động';
          case -1:
            return 'Trạng thái khác';
          default:
            return 'Không xác định';
        }
      },
    },
  ];
  const handleAfterPrint = () => {
    window.close(); // Đóng trang sau khi in thành công
  };

  useEffect(() => {
    window.addEventListener('afterprint', handleAfterPrint);
    return () => {
      window.close();
      localStorage.removeItem('printList');
      window.removeEventListener('afterprint', handleAfterPrint);
    };
  }, []);
  return (
    <div>
      <h1>Danh Sách Balo</h1>
      <Table
        className="table table-striped"
        rowKey={(record) => record.productId}
        columns={columns}
        dataSource={printList}
        pagination={false}
      />
    </div>
  );
};
export default PrintProduct;
