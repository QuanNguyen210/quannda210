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
import staffAPI from '~/api/staffAPI';
import styles from './tableHoaDonLoi.module.scss';
import SearchForm from '~/Utilities/FormSearch/SearchForm';
import dayjs from 'dayjs';
import VNDFormaterFunc from '~/Utilities/VNDFormaterFunc';
import productDetailsAPI from '~/api/productDetailsAPI';
import billDetailsAPI from '~/api/BillDetailsAPI';
import FormChiTietHoaDon from '../../ChiTietHoaDon/FormChiTietHoaDon';
import FormCapNhatTrangThai from '../../CapNhatHoaDon/CapNhatTrangThai';
import customerAPI from '~/api/customerAPI';
const { RangePicker } = DatePicker;

function TableHoaDonLoi() {
    const [data, setData] = useState([]);
    const [listStaff, setListStaff] = useState([]);
    const [listCustomer, setListCustomer] = useState([]);
    const [totalItem, setTotalItem] = useState();
    const [loading, setLoading] = useState(true);
    const [pageNum, setPageNum] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [status, setStatus] = useState('');
    const [search, setSearch] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [filterStaffCode, setFilterStaffCode] = useState('');
    const [sortList, setSortList] = useState('billCreateDate');
    const [sortOrder, setSortOrder] = useState('DESC');
    const [sortListPlaceHolder, setSortListPlaceHolder] = useState('timeDESC');
    const typingTimeoutRef = useRef(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [customerPhoneNumber, setCustomerPhoneNumber] = useState('');
    const [loaiHoaDon, setLoaiHoaDon] = useState('');
    const [updateBill, setUpdateBill] = useState(false);


    const thongTinNhanVien = (values) => {
        return (
            <div >
                <h5 style={{ margin: '10px', fontWeight: 'bold' }}>Nhân viên: {values.staffCode} </h5>
                <ul >
                    <li >
                        <span style={{ fontSize: '16px', fontWeight: 'bold' }}>Tên: </span>
                        <span style={{ color: 'red', fontSize: '16px' }}>{values.users.fullName} </span>
                    </li>
                    <li >
                        <span style={{ fontSize: '16px', fontWeight: 'bold' }}>SĐT: </span>
                        <span style={{ color: 'red', fontSize: '16px' }}>{values.users.phoneNumber} </span>
                    </li>
                </ul>
            </div>
        );
    }
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
            width: '50px',
            render: (text, record, index) => {
                return <span id={record.id}>{(pageNum - 1) * pageSize + (index + 1)}</span>;
            },
        },
        {
            title: 'Mã hóa đơn',
            dataIndex: ['bills', 'billCode'],
            sorter: (a, b) => a.bills.billCode.localeCompare(b.bills.billCode),
            key: 'billCode',
            width: '70px',
        },
        {
            title: 'Loại hóa đơn',
            dataIndex: ['bills', 'staff'],
            key: 'staffCode',
            width: '70px',
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
            dataIndex: ['bills', 'billCreateDate'],
            width: '140px',
            sorter: (a, b) => a.bills.billCreateDate.localeCompare(b.bills.billCreateDate),
            render: (date) => {
                const formattedDate = dayjs(date).format('HH:mm:ss DD-MM-YYYY');
                return <span>{formattedDate}</span>;
            },
        },
        {
            title: 'Mã nhân viên',
            dataIndex: ['bills', 'staff'],
            key: 'staffCode',
            width: '80px',
            render: (staff) => {
                if (staff && staff.users) {
                    return (
                        <Popover placement="top" content={thongTinNhanVien(staff)} >
                            <Typography.Text>{staff.staffCode}</Typography.Text>
                        </Popover>
                    );
                } else {
                    return '';
                }

            },
        },
        {
            title: 'SĐT khách hàng',
            dataIndex: ['productDetails', 'billCreateDate'],
            key: 'orderPhone',
            width: '100px',
            render: (text, record) => {
                // console.log(record);
                if (record.bills.customer == null) {
                    if (record.bills.orderPhone == null) {
                        return "";
                    }
                    return record.bills.orderPhone;

                } else {
                    return (
                        <Popover placement="top" content={thongTinKhachHang(record.bills)} >
                            <Typography.Text>{record.bills.orderPhone}</Typography.Text>
                        </Popover>
                    );
                }
            },
        },
        {
            title: 'Sản phẩm lỗi',
            dataIndex: 'productName',
            width: '250px',
            render: (texe, record) => (
                <div className={styles.info_item}>
                    <div className={styles.title_product}>
                        {record.productDetails.product.productName}-{record.productDetails.product.productCode}
                    </div>
                    <ul className={styles.attr}>
                        <li>
                            <span className={styles.spanTitle}>Màu sắc: </span> {record.productDetails.color.colorName}
                        </li>
                        <li>
                            <span className={styles.spanTitle}>Chất liệu: </span>
                            {record.productDetails.material.materialName}
                        </li>
                    </ul>
                </div>
            ),
            key: 'productName',
        },

        {
            title: 'Số lượng lỗi',
            dataIndex: 'amount',
            key: 'amount',
            width: '60px',
        },
        {
            title: 'Tiền hoàn',
            dataIndex: 'price',
            key: 'price',
            width: '100px',
            render: (text, record) => {
                return <span>{VNDFormaterFunc(record.price * record.amount)}</span>;
            },
        },

        {
            title: 'Trạng thái',
            dataIndex: 'billDetailStatus',
            key: 'billDetailStatus',
            width: '180px',
            render: (text, record) => {
                let statusText;
                let statusClass;
                let backgroundColor; // Define a variable for text color

                switch (record.billDetailStatus) {
                    case 1:
                        statusText = 'Không lỗi';
                        statusClass = 'inactiveStatus';
                        backgroundColor = '#3399ff';
                        break;
                    case 0:
                        statusText = 'Chờ xác nhận lỗi';
                        statusClass = 'active-status';
                        backgroundColor = '#ffcc00';
                        break;
                    case -1:
                        statusText = 'Đã hủy';
                        statusClass = 'other-status';
                        backgroundColor = '#ff3333';
                        break;
                    case -2:
                        statusText = 'Hàng lỗi chưa hoàn';
                        statusClass = 'other-status';
                        backgroundColor = '#ff3333';
                        break;
                    case -3:
                        statusText = 'Hàng lỗi đã hoàn';
                        statusClass = 'other-status';
                        backgroundColor = '#ff3333';
                        break;
                    default:
                        statusText = 'Không xác định';
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
                    <div>
                        <span className={statusClass} style={textStyles}>
                            {statusText}
                            <br></br>

                        </span>
                        <div style={{ marginTop: '15px' }}>Ghi chú: {record.billDetailNote}</div>
                    </div>

                );
            },
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (text, record) => {
                if (record.billDetailStatus === 0) {
                    return (
                        <Space size="middle" >

                            <Popconfirm
                                title="Xác Nhận"
                                description="Bạn có chắc chắn muốn xác nhận lỗi?"
                                okText="Đồng ý"
                                cancelText="Không"
                                onConfirm={() => {
                                    xacNhanLoi(record);
                                    setUpdateBill(record);
                                }}
                                onCancel={onCancel}
                            >
                                <Button disabled={(record.billStatus === -1) ? true : false} type="primary" icon={<CheckCircleOutlined />}>Xác nhận</Button>
                            </Popconfirm>
                            <Popconfirm
                                title="Xác Nhận"
                                description="Bạn có chắc chắn muốn hủy xác nhận lỗi?"
                                okText="Đồng ý"
                                cancelText="Không"
                                onConfirm={() => {
                                    huyXacNhan(record);
                                }}
                                onCancel={onCancel}
                            >
                                <Button disabled={(record.billStatus === -1) ? true : false} type="primary" danger icon={<CloseCircleOutlined />}>Hủy</Button>
                            </Popconfirm>
                        </Space>
                    )
                } else if (record.billDetailStatus === -2) {
                    return (
                        <Space size="middle" >
                            <Popconfirm
                                title="Xác Nhận"
                                description="Bạn đã nhận hàng và muốn hoàn tiền cho khách hàng?"
                                okText="Đồng ý"
                                cancelText="Không"
                                onConfirm={() => {
                                    xacNhanHoanTienLoi(record);
                                }}
                                onCancel={onCancel}
                            >
                                <Button disabled={(record.billStatus === -2) ? true : false} type="primary" icon={<CheckCircleOutlined />}>Hoàn tiền</Button>
                            </Popconfirm>
                        </Space>
                    )
                }
            },

            width: '150px',
        },
    ];




    // const updateAmount = async (billId) => {
    //     const list = await billDetailsAPI.getBillDetailsByBillIdUpdateAmount(billId);
    //     if (Array.isArray(list.data)) {
    //         await Promise.all(
    //             list.data.map(async (o) => {
    //                 await productDetailsAPI.updateAmount(o.productDetails.productDetailId, -o.amount);
    //             }),
    //         );
    //     }
    // };

    const huyXacNhan = async (values) => {
        // updateAmount(billId);
        let updateStatus = {
            ...values,
            billDetailStatus: 1,
            billDetailNote: "Yêu cầu hàng lỗi của bạn đã bị hủy!",
        }
        await billDetailsAPI.add(updateStatus);
        notification.success({
            message: 'Xác nhận',
            description: 'Sản phẩm "' + values.productDetails.product.productCode + '" Không bị lỗi!',
        });
        setLoading(true);
    };
    const xacNhanHoanTienLoi = async (values) => {
        let updateStatus = {
            ...values,
            billDetailStatus: -3,
        }
        await billDetailsAPI.add(updateStatus);
        notification.success({
            message: 'Xác nhận',
            description: 'Sản phẩm "' + values.productDetails.product.productCode + '" đã nhận lại và hoàn tiền thành công!',
        });
        setLoading(true);

    }
    const xacNhanLoi = async (values) => {
        // updateAmount(billId);
        let updateStatus = {
            ...values,
            billDetailStatus: -2,
        }
        // console.log(updateStatus);
        await billDetailsAPI.add(updateStatus);
        notification.success({
            message: 'Xác nhận',
            description: 'Sản phẩm "' + values.productDetails.product.productCode + '" đã được xác nhận lỗi!',
        });
        // update hoa don
        let TrangThaiKhiPriceBangKhong = values.bills.billStatus;
        let priceAfterVoucher = values.bills.billPriceAfterVoucher - values.price * values.amount;
        let totalPrice = values.bills.billTotalPrice - values.price * values.amount;
        let billReducedPrice = values.bills.billReducedPrice;
        let shipPrice = values.bills.shipPrice;
        if (values.bills.productAmount - values.amount === 0) {
            TrangThaiKhiPriceBangKhong = -1;
            priceAfterVoucher = 0;
            totalPrice = 0;
            billReducedPrice = 0;
            shipPrice = 0;
        }
        let updateHoaDon = {
            billId: values.bills.billId,
            staff: values.bills.staff,
            customer: values.bills.customer,
            voucher: values.bills.voucher,
            billCode: values.bills.billCode,
            billCreateDate: values.bills.billCreateDate,
            billDatePayment: values.bills.billDatePayment,
            billShipDate: values.bills.billShipDate,
            billReceiverDate: values.bills.billReceiverDate,
            billTotalPrice: totalPrice,
            productAmount: values.bills.productAmount - values.amount,
            billPriceAfterVoucher: priceAfterVoucher,
            shippingAddress: values.bills.shippingAddress,
            billingAddress: values.bills.billingAddress,
            receiverName: values.bills.receiverName,
            shipPrice: shipPrice,
            orderEmail: values.bills.orderEmail,
            orderPhone: values.bills.orderPhone,
            paymentMethod: values.bills.paymentMethod,
            billNote: values.bills.billNote,
            billStatus: TrangThaiKhiPriceBangKhong,
            billReducedPrice: billReducedPrice
        };
        // console.log(updateHoaDon);
        try {
            await billsAPI.add(updateHoaDon);
        } catch (error) {
            notification.error({
                message: 'Lỗi',
                description: 'Lỗi cập nhật hóa đơn không thành công',
                duration: 2,
            });
            console.log(error);
        }
        setLoading(true);

    };


    const onCancel = () => { };

    const onRangeChange = (dates, dateStrings) => {
        if (dates) {
            setStartDate(dateStrings[0]);
            setEndDate(dateStrings[1]);
            setPageNum(1);
        } else {
            setStartDate('0001-01-01');
            setEndDate('9999-02-02');
            setPageNum(1);
        }
    };

    const rangePresets = [
        {
            label: 'Hôm nay',
            value: [dayjs(), dayjs().add(1, 'd')],
        },
        {
            label: '7 ngày qua',
            value: [dayjs().add(-7, 'd'), dayjs().add(1, 'd')],
        },
        {
            label: '14 ngày qua',
            value: [dayjs().add(-14, 'd'), dayjs().add(1, 'd')],
        },
        {
            label: '30 ngày qua',
            value: [dayjs().add(-30, 'd'), dayjs().add(1, 'd')],
        },
        {
            label: '90 ngày qua',
            value: [dayjs().add(-90, 'd'), dayjs().add(1, 'd')],
        },
    ];

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
    const setRankKhachHang = (values) => {
        if (values.customer == null) {
            return (<span>
                <StarOutlined /><StarOutlined /><StarOutlined /><StarOutlined /><StarOutlined /><br></br>
                Khách hàng lẻ
            </span>);
        } else if (values.customer.customerRanking === 'KH_TIEMNANG') {
            return (<span>
                <StarFilled /><StarOutlined /><StarOutlined /><StarOutlined /><StarOutlined /> <br></br> Tiềm năng
            </span>);
        } else if (values.customer.customerRanking === 'KH_THANTHIET') {
            return (<span>
                <StarFilled /><StarFilled /><StarOutlined /><StarOutlined /><StarOutlined /><br></br> Thân thiết
            </span>);
        } else if (values.customer.customerRanking === 'KH_BAC') {
            return (<span>
                <StarFilled /><StarFilled /><StarFilled /><StarOutlined /><StarOutlined /><br></br> Bạc
            </span>);
        } else if (values.customer.customerRanking === 'KH_VANG') {
            return (<span>
                <StarFilled /><StarFilled /><StarFilled /><StarFilled /><StarOutlined /><br></br> Vàng
            </span>);
        } else if (values.customer.customerRanking === 'KH_KIMCUONG') {
            return (<span>
                <StarFilled /><StarFilled /><StarFilled /><StarFilled /><StarFilled /><br></br> Kim cương
            </span>);
        } else {
            return 'Chưa có hạng';
        }
    }

    const handleSearchChange = (value) => {
        setSearchTerm(value.target.value.toString());
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }
        typingTimeoutRef.current = setTimeout(() => {
            setSearch(value.target.value.trim().toString());
        }, 500);
        setLoading(true);
        setPageNum(1);
    };

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
        try {
            const response = await billDetailsAPI.getAllBillDetailsError(
                loaiHoaDon,
                filterStaffCode,
                startDate,
                endDate,
                status,
                search,
                pageNum,
                pageSize,
                customerPhoneNumber,
                sortList,
                sortOrder,
                sortListPlaceHolder
            );
            const data = response.data.content;
            setTotalItem(response.data.totalElements);
            setData(data);

        } catch (error) {
            console.error('Đã xảy ra lỗi: ', error);
        }
    };
    const getAllStaff = async () => {
        try {
            const response = await staffAPI.getAllStaffs();
            const list = response.data;
            setListStaff(list);
            const responseCustomer = await customerAPI.getAllNotPagination();
            setListCustomer(responseCustomer.data);
            // console.log(list);
        } catch (error) {
            console.error('Error fetching staff data:', error);
        }
    };

    const renderCustomerOptions = () => {
        return (
            <>
                <Select.Option value=''>Tất cả</Select.Option>
                {(listCustomer ?? []).map((item, index) => {
                    return (
                        <Select.Option key={index} value={item.customerId}>
                            {item.customerCode + ' - ' + item.users.phoneNumber + ' - ' + item.users.fullName}
                        </Select.Option>
                    );
                })}
            </>
        );
    };



    useEffect(() => {
        getAllStaff();
        getAllPhanTrangCompartment(pageNum, pageSize);
        setTimeout(() => {
            setLoading(false);
        }, 500);

    }, [loading, search, status, startDate, endDate, filterStaffCode, customerPhoneNumber, loaiHoaDon, sortList, sortOrder, sortListPlaceHolder]);

    // lọc theo khách hàng
    const onChangeKhachHang = (value) => {
        setCustomerPhoneNumber(value);
    };
    const onSearchKhachHang = (value) => {
    };
    const filterOption = (input, option) =>
        (option?.children ?? '').toLowerCase().includes(input.trim().toLowerCase());

    const onChangeNhanVien = (value) => {
        setFilterStaffCode(value);
    };
    const onSearchNhanVien = (value) => {
    };
    const filterOptionNhanVien = (input, option) =>
        (option?.children ?? '').toLowerCase().includes(input.trim().toLowerCase());
    return (
        <div>
            <Card>
                <section>
                    <Row>
                        <h2 style={{ marginBottom: '30px' }}>
                            <FilterFilled /> Bộ lọc
                        </h2>
                    </Row>
                    <Row>
                        <Col span={9}>
                            <div style={{ paddingTop: '10px', fontSize: '18px' }}>
                                <span style={{ fontWeight: 500 }}>Ngày tạo</span>
                                <RangePicker placeholder={['Ngày bắt đầu', 'Ngày kết thúc']} className={styles.filter_inputSearch} style={{ marginLeft: '10px' }} presets={rangePresets} onChange={onRangeChange} />
                            </div>
                        </Col>
                        <Col span={7}>
                            <div style={{ paddingTop: '10px', fontSize: '18px' }}>
                                <span style={{ paddingTop: '20px', fontSize: '18px', fontWeight: 500 }}>
                                    Loại hóa đơn
                                    <Select
                                        placeholder="Lọc theo loại hóa đơn"
                                        style={{ width: '40%', marginLeft: '10px' }}
                                        onChange={(value) => {
                                            setLoaiHoaDon(value);
                                            setFilterStaffCode('');
                                        }}
                                    >
                                        <Select.Option value="">Tất cả</Select.Option>
                                        <Select.Option value="offline">Tại quầy</Select.Option>
                                        <Select.Option value="online">Online</Select.Option>

                                    </Select>
                                </span>
                            </div>
                        </Col>


                    </Row>
                    <Row>
                        <Col span={9}>
                            <div style={{ paddingTop: '10px', fontSize: '18px' }}>
                                <span style={{ paddingTop: '20px', fontSize: '18px', fontWeight: 500 }}>
                                    Nhân viên
                                    <Select
                                        showSearch
                                        placeholder="Tìm và lọc hóa đơn theo nhân viên"
                                        optionFilterProp="children"
                                        onChange={onChangeNhanVien}
                                        onSearch={onSearchNhanVien}
                                        filterOption={filterOptionNhanVien}
                                        disabled={(loaiHoaDon === 'online') ? true : false}
                                        style={{ marginLeft: '10px', width: '65%' }}
                                    >
                                        <Select.Option value="">Tất cả</Select.Option>
                                        {(listStaff ?? []).map((item, index) => (
                                            <Select.Option key={index} value={item.staffId}>
                                                {item.staffCode + ' - ' + item.usersPhoneNumber + ' - ' + item.usersFullName}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </span>
                            </div>
                        </Col>
                        <Col span={14}>
                            <div style={{ paddingTop: '10px', fontSize: '18px' }}>
                                <span style={{ paddingTop: '20px', fontSize: '18px', fontWeight: 500 }}>
                                    Khách hàng
                                    <Select
                                        showSearch
                                        placeholder="Tìm và lọc hóa đơn theo khách hàng"
                                        optionFilterProp="children"
                                        onChange={onChangeKhachHang}
                                        onSearch={onSearchKhachHang}
                                        filterOption={filterOption}
                                        value={customerPhoneNumber}
                                        style={{ marginLeft: '10px', width: '40%' }}
                                    >
                                        {renderCustomerOptions()}
                                    </Select>
                                </span>
                            </div>
                        </Col>
                    </Row>
                </section>
            </Card>
            <Card>
                <section>
                    <Row style={{ margin: '10px' }}>
                        <Col span={5.5}>
                            <h2 >
                                <TableOutlined /> Danh sách sản phẩm lỗi của hóa đơn
                            </h2>
                        </Col>
                        <Col span={6}>
                            <Button icon={<ReloadOutlined />} onClick={() => { setLoading(true) }} style={{ marginTop: '7px', marginLeft: '15px' }} loading={loading}></Button>
                        </Col>
                        <Col span={7}>
                            <Input
                                className={styles.searchIinput}
                                type="text"
                                placeholder="Tìm kiếm thông tin trên hóa đơn"
                                value={searchTerm}
                                onChange={handleSearchChange}
                            ></Input>
                            {/* </div> */}
                        </Col>
                    </Row>

                    <Tabs
                        defaultActiveKey={status}
                        onChange={(e) => onChangeBill(e)}
                        items={[
                            SyncOutlined,
                            ClockCircleOutlined,
                            ClockCircleOutlined,
                            CheckCircleOutlined,
                        ].map((Icon, i) => {
                            const id = String(i + 1);
                            return {
                                label: (
                                    <span>
                                        {React.createElement(Icon)} {/* Use React.createElement to create the icon */}
                                        {id === '1'
                                            ? 'Tất cả'
                                            : id === '2'
                                                ? 'Chờ xác nhận lỗi'
                                                : id === '3'
                                                    ? 'Hàng lỗi chưa hoàn'
                                                    : id === '4'
                                                        ? 'Hàng lỗi đã hoàn'
                                                        : ''}
                                    </span>
                                ),
                                key: id === '1' ? '' : id === '2' ? '0' : id === '3' ? '-2' : id === '4' ? '-3' : '',
                                children: (
                                    <div style={{ padding: '8px' }}>
                                        <span style={{ fontWeight: 500 }}>{/* <TableOutlined /> Danh sách yêu cầu */}</span>
                                        <Table
                                            style={{ marginTop: '10px' }}
                                            dataSource={data}
                                            columns={columns}
                                            loading={loading}
                                            rowKey={(record) => record.billDetailId}
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
export default TableHoaDonLoi;
