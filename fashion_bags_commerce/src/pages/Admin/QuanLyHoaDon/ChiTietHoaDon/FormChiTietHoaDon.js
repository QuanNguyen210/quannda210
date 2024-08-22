import { Table, Image, Button, notification, Modal, Card, Row, Col, Popconfirm, Space, Input, InputNumber, Form } from 'antd';
import React, { useEffect, useState } from 'react';
import styles from './chiTietHoaDon.module.scss';
import vndFormaterFunc from '~/Utilities/VNDFormaterFunc';
import { CheckOutlined, DeleteOutlined, DoubleRightOutlined, ExclamationCircleOutlined, MenuFoldOutlined, MinusOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import VNDFormaterFunc from '~/Utilities/VNDFormaterFunc';
import billDetailsAPI from '~/api/BillDetailsAPI';
import FormStaffEdit from '../../Staff/StaffEdit/FormEdit/FormStaffEdit';
import productDetailsAPI from '~/api/productDetailsAPI';
import dayjs from 'dayjs';
import billsAPI from '~/api/BillApi';
const { useForm } = Form;


function FormChiTietHoaDon(props) {
    const [totalQuantity, setTotalQuantity] = useState(0);
    const [tongTienThanhToan, setTongTienThanhToan] = useState(0);
    const [visible, setVisible] = useState(false);
    const [reload, setReload] = useState(false);
    const [titleComponent, setTitleComponent] = useState();
    const [listBillDetails, setListBillDetais] = useState([]);
    const [maxAmountProductError, setMaxAmountProductError] = useState(0);
    const [billDetailIdLoi, setBillDetailIdLoi] = useState('');
    const [indexBilldetails, setIndexBilldetails] = useState(0);
    const [amountBill, setAmountBill] = useState(0);
    const [totalPriceBill, settotalPriceBill] = useState(0);
    const [open, setOpen] = useState(false);
    const [form] = useForm();
    const [updateBill, setUpdateBill] = useState(false);
    const [billDetailProductError, setBillDetailProductError] = useState([]);
    const [newAmountBillDetail, setNewAmountBillDetail] = useState(0);
    const [timeHangLoi, setTimeHangLoi] = useState(false);

    const showModal = () => {
        getAllByBillId();
        setTitleComponent(props.bills.billCode);
        const total = listBillDetails.reduce((totalQty, item) => {
            if (item.billDetailStatus === 1 || item.billDetailStatus === 0) {
                return totalQty + item.amount;
            } else {
                return totalQty;
            }
        }, 0);
        setTotalQuantity(total);
        setVisible(true);
        let ngayHomNay = dayjs().add(-7, 'd');
        let bayNgayTruoc = dayjs(props.bills.billCreateDate);
        let isNgayHomNayGreaterThanBayNgayTruoc = ngayHomNay.isAfter(bayNgayTruoc);
        if (isNgayHomNayGreaterThanBayNgayTruoc) {
            // hết thời gian hàng lỗi
            setTimeHangLoi(true);
        } else {
            // vẫn còn thời gian hàng lỗi
            setTimeHangLoi(false);
        }
    };

    useEffect(() => {
        setReload(false);
        getAllByBillId();
    }, [visible, reload, totalQuantity]);


    const getAllByBillId = async () => {
        const response = await billDetailsAPI.getAllByBillId(props.bills.billId, -1);
        const data = response.data;
        setListBillDetais(data);
        const total = data.reduce((totalQty, item) => {
            if (item.billDetailStatus === 1 || item.billDetailStatus === 0) {
                return totalQty + item.amount * item.price;
            } else {
                return totalQty;
            }
        }, 0);
        const productAmount = data.reduce((totalQty, item) => {
            if (item.billDetailStatus === 1 || item.billDetailStatus === 0) {
                return totalQty + item.amount;
            } else {
                return totalQty;
            }
        }, 0);
        if (total === 0) {
            setTongTienThanhToan(0);
        } else {
            setTongTienThanhToan(total - props.bills.billReducedPrice + props.bills.shipPrice);
        } setAmountBill(productAmount);
        settotalPriceBill(total);
        let TrangThaiKhiPriceBangKhong = props.bills.billStatus;
        if (total === 0) {
            TrangThaiKhiPriceBangKhong = -1;
        }
        let updateHoaDon = {
            billId: props.bills.billId,
            staff: props.bills.staff,
            customer: props.bills.customer,
            voucher: props.bills.voucher,
            billCode: props.bills.billCode,
            billCreateDate: props.bills.billCreateDate,
            billDatePayment: props.bills.billDatePayment,
            billShipDate: props.bills.billShipDate,
            billReceiverDate: props.bills.billReceiverDate,
            billTotalPrice: total,
            productAmount: productAmount,
            billPriceAfterVoucher: (total === 0 ? 0 : (total - props.bills.billReducedPrice + props.bills.shipPrice)),
            shippingAddress: props.bills.shippingAddress,
            billingAddress: props.bills.billingAddress,
            receiverName: props.bills.receiverName,
            shipPrice: props.bills.shipPrice,
            orderEmail: props.bills.orderEmail,
            orderPhone: props.bills.orderPhone,
            paymentMethod: props.bills.paymentMethod,
            billNote: props.bills.billNote,
            billStatus: TrangThaiKhiPriceBangKhong,
            billReducedPrice: props.bills.billReducedPrice
        };
        if (updateBill) {
            setUpdateBill(false);
            try {
                await billsAPI.add(updateHoaDon);
                props.reload();
            } catch (error) {
                notification.error({
                    message: 'Lỗi',
                    description: 'Lỗi cập nhật hóa đơn không thành công',
                    duration: 2,
                });
                console.log(error);
            }
        }
    };
    const setTenNhanVien = () => {
        if (props.bills.staff == null) {
            return '';
        } else {
            return props.bills.staff.users.fullName;
        }
    }
    const setSDTNhanVien = () => {
        if (props.bills.staff == null) {
            return '';
        } else {
            return props.bills.staff.users.phoneNumber;
        }
    }
    const setTenKhachHang = () => {
        if (props.bills.customer == null && props.bills.receiverName == null) {
            return '';
        } else {
            return props.bills.receiverName;
        }
    }
    const setSDTKhachHang = () => {
        if (props.bills.customer == null && props.bills.orderPhone == null) {
            return '';
        } else {
            return props.bills.orderPhone;
        }

    }
    const setDiaChiKhachHang = () => {
        if (props.bills.customer == null && props.bills.shippingAddress == null) {
            return '';
        } else {
            return props.bills.shippingAddress;
        }

    }
    const setRankKhachHang = () => {
        if (props.bills.customer == null) {
            return 'Khách hàng lẻ';
        } else if (props.bills.customer.customerRanking === 'KH_TIEMNANG') {
            return "Khách hàng tiềm năng";
        } else if (props.bills.customer.customerRanking === 'KH_THANTHIET') {
            return "Khách hàng thân thiết";
        } else if (props.bills.customer.customerRanking === 'KH_BAC') {
            return "Khách hàng bạc";
        } else if (props.bills.customer.customerRanking === 'KH_VANG') {
            return "Khách hàng vàng";
        } else if (props.bills.customer.customerRanking === 'KH_KIMCUONG') {
            return "Khách hàng kim cương";
        } else {
            return 'Chưa có hạng';
        }
    }

    const updateAmountProductDetail = async (billDetailId, amount) => {
        try {
            await billDetailsAPI.updateAmountProductDetail(billDetailId, amount);
            if (amount === 0) {
                notification.success({
                    message: 'Thành công',
                    description: 'Xóa thành công sản phẩm!!'
                });
                setReload(true);
            } else {
                notification.success({
                    message: 'Thành công',
                    description: 'Sửa thành công số lượng sản phẩm thành: ' + amount.toString(),
                });
                setReload(true);
            }
            setUpdateBill(true);

        } catch (error) {
            console.error('Đã xảy ra lỗi: ', error);
        }
    }

    const disableHangLoi = (amount, billStatus, billDetailStatus) => {
        if (timeHangLoi === true) {
            return true;
        } else {
            if (billStatus === 1 && billDetailStatus === 1) {
                return false;
            } else {
                return true;
            }
        }

    };


    // component Sản phẩm lỗi

    const validateWhitespace = (_, value) => {
        if (value && value.trim() === '') {
            return Promise.reject('Ghi chú sản phẩm lỗi không được để trống!');
        }
        return Promise.resolve();
    };

    const showComponentSPLoi = (values, index) => {
        setIndexBilldetails(index);
        setMaxAmountProductError(values.amount);
        setBillDetailIdLoi(values.billDetailId);
        setBillDetailProductError(values);
        setOpen(true);
    };
    const onClose = () => {
        form.resetFields();
        setOpen(false);
    };

    const updateAmountProductError = async (values) => {
        try {
            const response = await billDetailsAPI.updateAmountProductError(billDetailIdLoi, values.amountError);
            if (response.status === 200) {
                notification.success({
                    message: 'Thành công',
                    description: 'Sản phẩm đã được thêm vào hóa đơn hàng lỗi với số lượng là: ' + values.amountError.toString(),
                });
                setNewAmountBillDetail(newAmountBillDetail - values.amountError);
                // lỗi hết
                if (values.amountError === maxAmountProductError) {
                    let newBillDetailObject = {
                        billDetailId: billDetailProductError.billDetailId,
                        amount: values.amountError,
                        billDetailNote: values.billDetailNote,
                        billDetailStatus: -2,
                        bills: {
                            billId: billDetailProductError.bills.billId,
                        },
                        price: billDetailProductError.price,
                        productDetails: {
                            productDetailId: billDetailProductError.productDetails.productDetailId,
                        }
                    };
                    await billDetailsAPI.add(newBillDetailObject); // Use the created object in the API call
                    setUpdateBill(true);
                    setReload(true);
                } else {
                    let newBillDetailObject = {
                        amount: values.amountError,
                        billDetailNote: values.billDetailNote,
                        billDetailStatus: -2,
                        bills: {
                            billId: billDetailProductError.bills.billId,
                        },
                        price: billDetailProductError.price,
                        productDetails: {
                            productDetailId: billDetailProductError.productDetails.productDetailId,
                        }
                    };
                    await billDetailsAPI.add(newBillDetailObject); // Use the created object in the API call
                    setUpdateBill(true);
                    setReload(true);
                }

            }

            if (values.amountError > maxAmountProductError) {
                notification.error({
                    message: 'Không thành công',
                    description: 'Sản phẩm lỗi không thể nhiều hơn sản phẩm trong đơn hàng! ',
                });
            }

            setReload(true);
            setOpen(false);
        } catch (error) {
            console.error('Đã xảy ra lỗi: ', error);
        }
    };

    const columns = [
        {
            key: 'stt',
            dataIndex: 'index',
            title: 'STT',
            // width: 70,
            render: (text, record, index) => {
                return <span id={record.id}>{(index + 1)}</span>;
            },
            width: '57px'
        },
        {
            title: 'Ảnh',
            dataIndex: 'imgUrl',
            key: 'imgUrl',
            render: (text, record) => (
                <Image style={{ width: '100px', height: '100px' }} src={record.productDetails.product.images[0].imgUrl} />
            ),
            width: '125px'
        },
        {
            title: 'Sản phẩm',
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
            title: 'SL',
            dataIndex: 'amount',
            key: 'amount',
            width: '130px',
            render: (text, record, index) => {
                let newAmount = record.amount;
                let maxAmount = record.amount + record.productDetails.productDetailAmount;
                // setNewAmountBillDetail(record.amount);
                return (
                    <Space>
                        <InputNumber
                            min={0}
                            max={Math.floor(maxAmount)}
                            step={1}
                            disabled={
                                (timeHangLoi !== true &&
                                    (
                                        (record.bills.billStatus === 4 && record.billDetailStatus === 1)
                                        || (record.bills.billStatus === 3 && record.billDetailStatus === 1)
                                    )
                                ) ? false : true}
                            defaultValue={record.amount}
                            onChange={(newValue) => {

                                if (newValue === null) {
                                    newAmount = 0;
                                } else {
                                    newAmount = newValue;
                                }
                            }}
                            style={{ width: '55px' }}
                        />
                        <Popconfirm
                            title="Xác Nhận"
                            description=<span>Bạn có muốn thay đổi số lượng sản phẩm ??  </span>
                            okText="Đồng ý"
                            cancelText="Không"
                            onConfirm={() => {
                                updateAmountProductDetail(record.billDetailId, newAmount);
                                setReload(true);
                            }}
                        >
                            <Button
                                type="primary"
                                disabled={
                                    (timeHangLoi !== true &&
                                        (
                                            (record.bills.billStatus === 4 && record.billDetailStatus === 1)
                                            || (record.bills.billStatus === 3 && record.billDetailStatus === 1)
                                        )
                                    ) ? false : true} icon={<CheckOutlined />}
                                style={
                                    {
                                        backgroundColor:
                                            (timeHangLoi !== true &&
                                                (
                                                    (record.bills.billStatus === 4 && record.billDetailStatus === 1)
                                                    || (record.bills.billStatus === 3 && record.billDetailStatus === 1)
                                                )
                                            ) ? 'red' : 'grey', color: 'white'
                                    }
                                }
                            >
                            </Button>
                        </Popconfirm>

                    </Space>
                );

            },
        },
        {
            title: 'Giá',
            dataIndex: 'price',
            render: (text, record) => vndFormaterFunc(record.price),
            key: 'price',
            width: '120px'
        },
        {
            title: 'Thành tiền',
            render: (text, record) => vndFormaterFunc(record.amount * record.price),
            key: 'calculateTotal',
            width: '130px'
        },
        {
            title: 'Trạng thái',
            dataIndex: 'billDetailStatus',
            width: '200px',
            key: 'status',
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
            title: 'Action',
            key: 'action',
            render: (text, record, index) => {
                return (
                    <div>
                        <Space size="middle">
                            <Button type="default" danger
                                disabled={disableHangLoi(record.amount, record.bills.billStatus, record.billDetailStatus)}
                                onClick={() => {
                                    showComponentSPLoi(record, index);
                                }}
                                icon={<ExclamationCircleOutlined />}>
                                Hàng lỗi
                            </Button>
                            <Modal
                                title="Sản phẩm lỗi"
                                open={open}
                                onCancel={onClose}
                                footer={
                                    <span>

                                    </span>
                                }
                            >
                                <Form form={form} initialValues=
                                    {{
                                        billDetailId: record.billDetailId,
                                        amountError: record.amount,
                                        billDetailNote: record.billDetailNote,
                                    }
                                    }
                                    onFinish={updateAmountProductError} >
                                    <Row gutter={16}>
                                        <Col span={24}>
                                            <Form.Item
                                                name='amountError'
                                                label="Số lượng sản phẩm lỗi"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: 'Vui lòng điền số lượng sản phẩm lỗi!',
                                                    },
                                                ]}
                                            >
                                                <InputNumber
                                                    min={1}
                                                    max={Math.floor(maxAmountProductError)}
                                                    // defaultValue={1}
                                                    step={1}
                                                    style={{ width: '70px' }}
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row gutter={16}>
                                        <Col span={24}>
                                            <Form.Item
                                                name='billDetailNote'
                                                label="Ghi chú sản phẩm lỗi: "
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: 'Vui lòng nhập ghi chú của sản phẩm lỗi!',
                                                    },
                                                    {
                                                        validator: validateWhitespace,
                                                    },
                                                ]}
                                            >
                                                <Input.TextArea rows={4} placeholder='Vui lòng điền ghi chú!' />
                                            </Form.Item>

                                        </Col>
                                    </Row>

                                    <div>
                                        <Space>
                                            <Button htmlType="submit" type="primary" className="btn btn-warning">
                                                Lưu
                                            </Button>
                                            <Button onClick={onClose}>Thoát</Button>
                                        </Space>
                                    </div>
                                </Form>
                            </Modal>
                        </Space>
                    </div>
                )
            },

            width: '150px',
        },

    ];
    return (
        <>
            <Button type="primary" style={{ width: '120px' }} onClick={showModal} icon={<MenuFoldOutlined />}
            >
                Chi tiết
            </Button>
            <Modal
                title={<h2 style={{ fontSize: '28px', fontWeight: 'bold' }}>Chi tiết hóa đơn: {titleComponent}</h2>}
                centered
                open={visible}
                onCancel={() => { setVisible(false) }}
                width={'97%'}
                height={'90%'}
                footer={[
                    <Button key="cancel" onClick={() => { setVisible(false) }}>
                        Hủy
                    </Button>
                ]}
            >
                <div>
                    <Row>
                        <Col span={16} style={{ border: '1px solid #cccccc ', margin: '10px 20px 0 20px', borderRadius: '15px', height: '700px' }}>
                            <h4 style={{ margin: '10px', fontWeight: 'bold' }}>Danh sách sản phẩm đã mua:</h4>
                            <Table
                                bordered
                                style={{ textAlign: 'center', width: '100%', height: '650px' }}
                                scroll={{ y: 550 }}
                                className={styles.table_cart_item}
                                dataSource={listBillDetails}
                                columns={columns}
                                rowKey={(record) => record.billDetailId}
                                pagination={false}
                            />
                        </Col>
                        <Col span={7} style={{ border: '1px solid #cccccc ', margin: '10px 0 0 0', borderRadius: '15px', height: '700px' }}>
                            <h4 style={{ margin: '10px', fontWeight: 'bold' }}>Nhân viên: </h4>
                            <div >
                                <ul >
                                    <li >
                                        <span style={{ fontSize: '18px', fontWeight: 'bold' }}>Tên: </span>
                                        <span style={{ color: 'red', fontSize: '18px' }}>{setTenNhanVien()} </span>
                                    </li>
                                    <li >
                                        <span style={{ fontSize: '18px', fontWeight: 'bold' }}>SĐT: </span>
                                        <span style={{ color: 'red', fontSize: '18px' }}>{setSDTNhanVien()} </span>
                                    </li>
                                </ul>
                            </div>
                            <hr></hr>
                            <h4 style={{ margin: '10px', fontWeight: 'bold' }}>Khách hàng: </h4>
                            <div>
                                <ul >
                                    <li >
                                        <span style={{ fontSize: '18px', fontWeight: 'bold' }}>Tên: </span>
                                        <span style={{ color: 'red', fontSize: '18px' }}>{setTenKhachHang()} </span>
                                    </li>
                                    <li >
                                        <span style={{ fontSize: '18px', fontWeight: 'bold' }}>SĐT: </span>
                                        <span style={{ color: 'red', fontSize: '18px' }}>{setSDTKhachHang()} </span>
                                    </li>
                                    <li >
                                        <span style={{ fontSize: '18px', fontWeight: 'bold' }}>Địa chỉ: </span>
                                        <span style={{ color: 'red', fontSize: '18px' }}>{setDiaChiKhachHang()} </span>
                                    </li>
                                    <li >
                                        <span style={{ fontSize: '18px', fontWeight: 'bold' }}>Hạng khách hàng: </span>
                                        <span style={{ color: 'red', fontSize: '18px' }}>{setRankKhachHang()} </span>
                                    </li>
                                </ul>
                            </div>
                            <hr></hr>

                            <div className={styles.content_product_pc}>
                                <div className={styles.group_content_product}>
                                    <div className={styles.body}>
                                        <div className={styles.body_ct}>
                                            <ul className="list-oppr">
                                                <li className={styles.productDetailItem}>
                                                    <span className={styles.label}>Số lượng: </span>
                                                    <span className={styles.labelName}>
                                                        <span style={{ color: 'red', fontSize: '26px' }}>{amountBill} </span>Sản phẩm
                                                    </span>
                                                </li>
                                                <hr></hr>
                                                <li className={styles.productDetailItem}>
                                                    <span className={styles.label}>Giá trị hàng hóa: </span>
                                                    <span className={styles.labelName} >{vndFormaterFunc(totalPriceBill)}</span>
                                                </li>
                                                <hr></hr>
                                                <li className={styles.productDetailItem}>
                                                    <span className={styles.label}>Giảm giá: </span>
                                                    <span className={styles.labelName} >
                                                        {totalPriceBill === 0 ? 0 : vndFormaterFunc(props.bills.billReducedPrice)}
                                                    </span>
                                                </li>{' '}
                                                <hr></hr>
                                                <li className={styles.productDetailItem}>
                                                    <span className={styles.label}>Tiền ship: </span>
                                                    <span className={styles.labelName} >
                                                        {totalPriceBill === 0 ? 0 : vndFormaterFunc(props.bills.shipPrice)}
                                                    </span>
                                                </li>{' '}
                                                <hr></hr>
                                                <li className={styles.productDetailItem}>
                                                    <span className={styles.label}>Thành tiền: </span>
                                                    <span className={styles.labelName} style={{ color: 'red', fontWeight: 'bold', fontSize: '26px' }}>
                                                        {vndFormaterFunc(tongTienThanhToan)}
                                                    </span>
                                                </li>{' '}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>

                </div>
            </Modal>
        </>
    );
}

export default FormChiTietHoaDon;
