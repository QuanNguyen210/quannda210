import {
    Button,
    Card,
    Col,
    DatePicker,
    Input,
    Modal,
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
import styles from './formIndex.module.scss';
import dayjs from 'dayjs';
import VNDFormaterFunc from '~/Utilities/VNDFormaterFunc';
import productDetailsAPI from '~/api/productDetailsAPI';
import billDetailsAPI from '~/api/BillDetailsAPI';
import ComponentChiTietHoaDon from './ChiTietHoaDon/ComponentChiTietHoaDon';

function FormBillOfCustomer() {
    const [data, setData] = useState([]);
    const [totalItem, setTotalItem] = useState();
    const [loading, setLoading] = useState(true);
    const [pageNum, setPageNum] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [status, setStatus] = useState('');
    const [customerId, setCustomerId] = useState('');


    const customerIdLocalStorage = localStorage.getItem('customerId');
    // const thongTinNhanVien = (values) => {
    //     return (
    //         <div >
    //             <h5 style={{ margin: '10px', fontWeight: 'bold' }}>Nhân viên: {values.staffCode} </h5>
    //             <ul >
    //                 <li >
    //                     <span style={{ fontSize: '16px', fontWeight: 'bold' }}>Tên: </span>
    //                     <span style={{ color: 'red', fontSize: '16px' }}>{values.users.fullName} </span>
    //                 </li>
    //                 <li >
    //                     <span style={{ fontSize: '16px', fontWeight: 'bold' }}>SĐT: </span>
    //                     <span style={{ color: 'red', fontSize: '16px' }}>{values.users.phoneNumber} </span>
    //                 </li>
    //             </ul>
    //         </div>
    //     );
    // }
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
    const columns = [
        {
            key: 'stt',
            dataIndex: 'index',
            title: 'STT',
            width: '40px',
            render: (text, record, index) => {
                return <span id={record.id}>{(pageNum - 1) * pageSize + (index + 1)}</span>;
            },
        },
        {
            title: 'Mã hóa đơn',
            dataIndex: 'billCode',
            key: 'code',
            width: '100px',
        },
        {
            title: 'Loại hóa đơn',
            dataIndex: 'staff',
            key: 'staffCode',
            width: '100px',
            render: (staff) => {
                if (staff && staff.users) {
                    return "Tại quầy";
                } else {
                    return "Online";
                }
            },
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'billCreateDate',
            width: '180px',
            sorter: (a, b) => a.billCreateDate.localeCompare(b.billCreateDate),
            render: (date) => {
                const formattedDate = dayjs(date).format('HH:mm:ss DD-MM-YYYY');
                return <span>{formattedDate}</span>;
            },
        },
        {
            title: 'Mã nhân viên',
            dataIndex: 'staff',
            key: 'staffCode',
            width: '100px',
            render: (staff) => {
                if (staff && staff.users) {
                    return (
                        // <Popover placement="top" content={thongTinNhanVien(staff)} >
                        <Typography.Text>{staff.staffCode}</Typography.Text>
                        // </Popover>
                    );
                } else {
                    return '';
                }

            },
        },

        {
            title: 'SĐT khách hàng',
            dataIndex: 'orderPhone',
            key: 'orderPhone',
            width: '140px',
            render: (text, record) => {
                if (record.customer == null) {
                    if (record.orderPhone == null) {
                        return "";
                    }
                    return record.orderPhone;

                } else {
                    return (
                        <Popover placement="top" content={thongTinKhachHang(record)} >
                            <Typography.Text>{record.orderPhone}</Typography.Text>
                        </Popover>
                    );
                }
            },
        },

        {
            title: 'Tổng thanh toán',
            dataIndex: 'billPriceAfterVoucher',
            key: 'billPriceAfterVoucher',
            width: '150px',
            render: (price) => {
                return <span>{VNDFormaterFunc(price)}</span>;
            },
        },

        {
            title: 'Trạng thái',
            dataIndex: 'billStatus',
            key: 'status',
            width: '200px',
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
                        statusText = 'Đã hủy';
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
                if (record.staff !== null) {
                    return (
                        <div>
                            <Space size="middle" style={{ marginTop: '10px' }}>
                                {hanhDong(record, false, false, false)}
                                <br></br>
                            </Space>
                        </div>
                    );
                } else {
                    if (record.billStatus === 1) {
                        return (
                            <div>
                                <Space size="middle" style={{ marginTop: '10px' }}>
                                    {hanhDong(record, true, true, true)}
                                </Space>
                            </div>
                        );
                    } else if (record.billStatus === -1) {
                        return (
                            <div>
                                <Space size="middle" style={{ marginTop: '10px' }}>
                                    {hanhDong(record, true, true, true)}
                                </Space>
                            </div>
                        );
                    } else if (record.billStatus === 4) {
                        return (
                            <div>
                                <Space size="middle" style={{ marginTop: '10px' }}>
                                    {hanhDong(record, true, false, false)}
                                </Space>
                            </div>
                        );
                    } else {
                        return (
                            <div>
                                <Space size="middle" style={{ marginTop: '10px' }}>
                                    {hanhDong(record, true, false, true)}
                                </Space>
                            </div>
                        );
                    }
                }
            },
            width: 100,
        },
    ];
    const hanhDong = (record, online, capNhat, xoa) => {
        if (online === false) {
            return (
                <Space size="middle" >
                    <ComponentChiTietHoaDon bills={record} reload={() => setLoading(true)} />
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
                    </Popconfirm>
                </Space>
            )
        } else { //staff === null (là đơn hàng online)
            return (
                <div>
                    <Space size="middle" >
                        <ComponentChiTietHoaDon bills={record} reload={() => setLoading(true)} />
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
        }
    };

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
        setCustomerId(customerIdLocalStorage);
        try {
            const response = await billsAPI.getAllBillOfCustomer(
                status,
                pageNum,
                pageSize,
                localStorage.getItem('customerId')
            );
            const data = response.data.content;
            setTotalItem(response.data.totalElements);
            setData(data);
        } catch (error) {
            console.error('Đã xảy ra lỗi: ', error);
        }
    };

    useEffect(() => {
        getAllPhanTrangCompartment(pageNum, pageSize);
        setTimeout(() => {
            setLoading(false);
        }, 500);

    }, [loading, status, customerId]);

    return (
        <div>

            <Card>
                <section>
                    <Row style={{ margin: '10px' }}>
                        <Col span={5.5}>
                            <h2 >
                                <TableOutlined /> Danh sách đơn hàng của tôi
                            </h2>
                        </Col>
                        <Col span={10}>
                            <Button icon={<ReloadOutlined />} onClick={() => { setLoading(true) }} style={{ marginTop: '7px', marginLeft: '15px' }} loading={loading}></Button>
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
                                            rowKey={(record) => record.billCode}
                                            loadingIndicator={<div>Loading...</div>}
                                            pagination={false}
                                        />
                                        <Pagination
                                            className={styles.pagination}
                                            showSizeChanger
                                            total={totalItem}
                                            onChange={onChangePage}
                                            defaultCurrent={1}
                                            current={pageNum}
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
export default FormBillOfCustomer;
