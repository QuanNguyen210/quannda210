import dayjs from 'dayjs';
import 'react-icons/md';
import React, { useEffect, useRef, useState } from 'react';
import {
  AutoComplete,
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Popover,
  Row,
  Select,
  Table,
  Tabs,
  Typography,
  message,
  notification,
} from 'antd';
import TableContent from '../../ProductManager/ProductViewer/Table/Table';
import styles from './index.module.scss';
import Title from 'antd/es/skeleton/Title';
import { generateCustomCode } from '~/Utilities/GenerateCustomCode';
import TextArea from 'antd/es/input/TextArea';
import baloDetailsAPI from '~/api/productDetailsAPI';
import { MinusOutlined, PlusOutlined, SaveTwoTone, ScanOutlined } from '@ant-design/icons';
import userinfoAPI from '~/api/userInfoAPI';
import userInfoAPI from '~/api/userInfoAPI';
import VNDFormaterFunc from '~/Utilities/VNDFormaterFunc';
import customerAPI from '~/api/customerAPI';
import billsAPI from '~/api/BillApi';
import billDetailsAPI from '~/api/BillDetailsAPI';
import { Html5Qrcode } from 'html5-qrcode';
import productDetailsAPI from '~/api/productDetailsAPI';
import { useForm } from 'antd/es/form/Form';
import AuthAPI from '~/api/auth/AuthAPI';
import MaillingAPI from '~/api/MaillingAPI';
import voucherAPI from '~/api/voucherAPI';
import moment from 'moment/moment';
import Search from 'antd/es/input/Search';
import { MdRestore } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { getStaff } from '~/api/auth/helper/UserCurrent';
const { Option } = AutoComplete;

const SalesCounterForm = () => {
  const defaultPanes = new Array(2).fill(null).map((_, index) => {
    const id = String(index + 1);
    return {
      label: `Hóa Đơn ${id}`,
      children: <Content tabNum={id} />,
      key: id,
    };
  });
  const [activeKey, setActiveKey] = useState(defaultPanes[0].key);
  const [items, setItems] = useState(defaultPanes);
  const newTabIndex = useRef(3);
  const [messageApi, contextHolder] = message.useMessage();
  const onChange = (key) => {
    setActiveKey(key);
  };

  const add = () => {
    const newActiveKey = `${newTabIndex.current++}`;
    console.log(newActiveKey);
    if (items.length > 10) {
      messageApi.warning('Chỉ được tối đa 10 Tab! Vui lòng tắt bớt tab rồi thêm lại');
    } else {
      setItems([
        ...items,
        {
          label: 'Hóa Đơn ' + newActiveKey,
          children: <Content tabNum={newActiveKey} />,
          key: newActiveKey,
        },
      ]);
      setActiveKey(newActiveKey);
    }
  };
  const remove = (targetKey) => {
    const targetIndex = items.findIndex((pane) => pane.key === targetKey);
    const newPanes = items.filter((pane) => pane.key !== targetKey);
    if (newPanes.length && targetKey === activeKey) {
      const { key } = newPanes[targetIndex === newPanes.length ? targetIndex - 1 : targetIndex];
      setActiveKey(key);
    }
    setItems(newPanes);
  };
  const onEdit = (targetKey, action) => {
    if (action === 'add') {
      add();
    } else {
      remove(targetKey);
    }
  };

  function Content(props) {
    const [customer, setCustomer] = useState(null);
    const [customerId, setCustomerId] = useState(null);
    const [inputValue, setInputValue] = useState('');
    const [inputUserInfo, setInputUserInfo] = useState('');
    const [options, setOptions] = useState([]);
    const [infoList, setInfoList] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [visible, setVisible] = useState(true);
    const [visiblePopover, setVisiblePopover] = useState(false);
    const [totalPrice, setTotalPrice] = useState(0);
    const [voucherPrice, setVoucherPrice] = useState(0);
    const [VAT, setVAT] = useState(0);
    const [disCountPercent, setDiscountPercent] = useState(0);
    const [totalPayment, setTotalPayment] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);
    const [staffId, setStaffId] = useState('');
    const [staff, setStaff] = useState(getStaff());
    const [billInfo, setBillInfo] = useState({});
    const [form] = Form.useForm();
    const searchInputRef = useRef(null);
    const [showScanner, setShowScanner] = useState(false);
    const [scannerActive, setScannerActive] = useState(true);
    const [isModalQROpen, setIsModalQROpen] = useState(false);
    const [prevCode, setPrevCode] = useState('');
    const [productCode, setProductCode] = useState(generateCustomCode('HD', 9));
    const [voucherCode, setVoucherCode] = useState('');
    const [consumePoints, setConsumePoints] = useState(0);
    const [consumePointsReicer, setConsumePointsReceiver] = useState(0);
    const [voucher, setVoucher] = useState('');
    const [rankingName, setRankingName] = useState('');
    const [discountPercentByRankingName, setDiscountPercentByRankingName] = useState();
    const navigate = useNavigate();
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const onSelectChange = (selectedKeys) => {
      setSelectedRowKeys(selectedKeys);
      console.log(selectedKeys);
    };
    const rowSelection = {
      selectedRowKeys,
      onChange: onSelectChange,
    };
    let html5QrCode;
    const soundEffect = new Audio(`/audio/beep.mp3`);

    const [messageApi, contextHolder] = message.useMessage();

    const handleCacuTotalAmount = () => {
      const total = selectedItems.reduce((total, product) => total + product.cartAmount, 0);

      setTotalAmount(total);
      return total;
    };
    useEffect(() => {
      if (!staff) {
        navigate('/admin/login');
      }
    }, []);
    const handleSelect = (value, option) => {
      const item = options.find((item) => item.productDetailId === value);

      setInputValue(item.product.productName);
      if (item.productDetailAmount <= 0) {
        notification.error({
          message: 'Lỗi',
          description: `Hiện tại Sản Phẩm đang hết hàng!!!!`,
        });
        return;
      } else {
        if (isItemAlreadyAdded(item)) {
          const updatedItems = selectedItems.map((o) => {
            if (o.productDetailId === item.productDetailId) {
              const newCartAmount = o.cartAmount + 1;
              if (newCartAmount <= item.productDetailAmount) {
                return { ...o, cartAmount: newCartAmount };
              } else {
                notification.error({
                  message: 'Lỗi',
                  description: `Số lượng vượt quá giới hạn. Số lượng tối đa: ${item.productDetailAmount}`,
                });
                return o;
              }
            }
            return o;
          });
          setSelectedItems(updatedItems);

          setTotalPrice(calculateTotalPrice(updatedItems));
          messageApi.success('Số lượng đã được Update!');
        } else {
          const newItem = { ...item, cartAmount: 1 };
          setSelectedItems(selectedItems.concat(newItem));
          setTotalPrice(calculateTotalPrice(selectedItems.concat(newItem)));
          messageApi.success('Sản Phẩm đã được thêm!');
        }
      }
    };
    const handleSelectInfo = (value, option) => {
      setVisible(true);
      const item = infoList.find((item) => item.customerId === value);

      const customerRanking = item.customerRanking;
      setCustomer(item);
      setCustomerId(item.customerId);
      setInputUserInfo(item.users.fullName);
      setRankingName(customerRanking);
      console.log('====================================');
      console.log(item);
      console.log('====================================');
      setConsumePointsReceiver(item.consumePoints);
      form.setFieldsValue({
        fullName: item.users.fullName,
        phoneNumber: item.users.phoneNumber,
        address: item.users.address,
        rankingName: item.customerRanking,
        email: item.users.email,
        consumePoints: item.consumePoints,
      });
    };

    useEffect(() => {
      if (rankingName === 'KH_KIMCUONG' && totalPrice >= 4000000) {
        setDiscountPercentByRankingName(15);
      } else if (rankingName === 'KH_KIMCUONG') {
        setDiscountPercentByRankingName(12);
      } else if (rankingName === 'KH_VANG') {
        setDiscountPercentByRankingName(10);
      } else if (rankingName === 'KH_BAC') {
        setDiscountPercentByRankingName(8);
      } else if (rankingName === 'KH_THANTHIET') {
        setDiscountPercentByRankingName(5);
      } else if (rankingName === 'KH_TIEMNANG') {
        // if (totalPrice >= 500000) {
        setDiscountPercentByRankingName(2);
      } else {
        setDiscountPercentByRankingName(0);
      }
    }, [rankingName, totalPrice]);
    const isItemAlreadyAdded = (item) => {
      return selectedItems.some((selectedItem) => selectedItem.productDetailId === item.productDetailId);
    };
    const onSearch = async (value) => {
      setInputValue(value);
      try {
        const response = await baloDetailsAPI.findByKeywork(value);
        const data = response.data;

        setOptions(data);
      } catch (error) {
        console.error('Đã xảy ra lỗi: ', error);
      }
    };
    const onSearchInfo = async (value) => {
      setInputUserInfo(value);
      try {
        const response = await customerAPI.findByKeywork(value);
        const data = response.data;
        setInfoList(data);
      } catch (error) {
        console.error('Đã xảy ra lỗi: ', error);
      }
    };
    const columns = [
      {
        title: 'STT',
        dataIndex: 'index',
        key: 'index',
        width: 40,
        render: (text, record, index) => <span>{index + 1}</span>,
      },
      {
        title: 'Mã Balo',
        dataIndex: ['product', 'productCode'],

        width: 200,
        sorter: (a, b) => a.product.productCode.localeCompare(b.product.productCode),
      },
      {
        title: 'Tên Balo',
        dataIndex: ['product', 'productName'],
        width: 500,

        sorter: (a, b) => a.product.productName.localeCompare(b.product.productName),
      },
      {
        title: 'Màu Sắc',
        dataIndex: ['color', 'colorName'],
        width: 100,
        sorter: (a, b) => a.color.colorName.localeCompare(b.color.colorName),
      },
      {
        title: 'Size Balo',
        dataIndex: ['size', 'sizeName'],
        width: 100,
        sorter: (a, b) => a.size.sizeName.localeCompare(b.size.sizeName),
      },
      {
        title: 'Giá Bán',
        dataIndex: 'retailPrice',

        width: 100,
        sorter: (a, b) => a.retailPrice - b.retailPrice,
        render: (text, record) => <span>{VNDFormaterFunc(text)}</span>,
      },
      {
        title: 'Số Lượng',
        dataIndex: 'cartAmount',
        width: 100,
        sorter: (a, b) => a.cartAmount - b.cartAmount,
        render: (text, record) => (
          <div>
            <Button onClick={() => handleIncrease(record)} size="small" icon={<PlusOutlined />}></Button>
            <span style={{ margin: '0 10px' }}>{text}</span>
            <Button onClick={() => handleDecrease(record)} size="small" icon={<MinusOutlined />}></Button>
          </div>
        ),
        render: (text, record) => (
          <div>
            <Button onClick={() => handleIncrease(record)} size="small" icon={<PlusOutlined />}></Button>
            <span style={{ margin: '0 10px' }}>{text}</span>
            <Button onClick={() => handleDecrease(record)} size="small" icon={<MinusOutlined />}></Button>
          </div>
        ),
      },
      {
        title: 'Action',
        key: 'action',
        width: 200,
        render: (text, record) => (
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa?"
            onConfirm={() => handleDelete(record)} // handleDelete là hàm để xử lý xóa
            okText="Có"
            cancelText="Không"
          >
            <Button>Xóa</Button>
          </Popconfirm>
        ),
      },
    ];
    const handleDelete = (key) => {
      const newSelectedItems = selectedItems.filter((item) => item !== key);
      setSelectedItems(newSelectedItems);
      setTotalPrice(calculateTotalPrice(newSelectedItems));
    };
    const handleIncrease = (key) => {
      const updatedItems = selectedItems.map((item) => {
        if (item === key) {
          if (item.cartAmount >= item.productDetailAmount) {
            notification.error({
              message: 'Lỗi',
              description: `Chỉ còn lại ${item.productDetailAmount} Sản phẩm trong Cửa hàng`,
            });
          } else {
            return { ...item, cartAmount: item.cartAmount + 1 };
          }
        }
        return item;
      });
      setSelectedItems(updatedItems);
      setTotalPrice(calculateTotalPrice(updatedItems));
    };

    const handleDecrease = (key) => {
      const updatedItems = selectedItems.map((item) => {
        if (item === key) {
          if (item.cartAmount === 1) {
            notification.error({
              message: 'Lỗi',
              description: 'Số lượng không thể nhỏ hơn 0',
            });
          } else {
            return { ...item, cartAmount: item.cartAmount - 1 };
          }
        }
        return item;
      });
      setSelectedItems(updatedItems);
      setTotalPrice(calculateTotalPrice(updatedItems));
    };
    const handleTonggleSelectChange = (value) => {
      if (value === 0) {
        setVisible(true);
      }
      if (value === 1) {
        setCustomer(null);
        setCustomerId(null);
        setConsumePoints(0);
        form.resetFields();
        setVisible(false);
      }
    };
    const calculateTotalPrice = (items) => {
      let total = 0;
      items.forEach((item) => {
        total += item.retailPrice * item.cartAmount;
      });
      const calculatedTotalPrice = total + total * 0.1 - voucherPrice;
      setTotalPayment(calculatedTotalPrice);
      return total;
    };

    const finnishPayment = () => {
      form.submit();
    };
    const onHandleAddBill = async (values) => {
      messageApi.open({
        type: 'loading',
        content: 'Đang check hóa đơn',
        duration: 0,
      });
      var currentDate = new Date();
      var formattedDate = dayjs(currentDate).format('YYYY-MM-DD HH:mm:ss');
      if (customer == null && visible === true) {
        messageApi.error('');
        messageApi.open({
          type: 'error',
          content: 'Vui lòng Chọn Khách lẻ hoặc Điền KH Thân Thiết!!!',
          duration: 0,
        });
        setTimeout(messageApi.destroy, 1);
      } else if (selectedItems.length === 0) {
        messageApi.error('Vui lòng thêm sản phẩm!!!');
      } else if (
        totalPrice +
          totalPrice * VAT -
          voucherPrice -
          totalPrice * (discountPercentByRankingName / 100) -
          consumePoints * 500 <
        0
      ) {
        messageApi.error('Không thể hoàn thành do áp dụng giảm giá quá mức!!!!');
        setTimeout(messageApi.destroy, 1);
      } else {
        ///check sl sản phẩm detail trước khi hoàn thành đơn hàng
        var conflict = false;

        var promises = selectedItems.map(async (o, index) => {
          const productDetailId = o.productDetailId;
          const response = await productDetailsAPI.findById(o.productDetailId);
          console.log(o.cartAmount > response.data.productDetailAmount);
          console.log(o.cartAmount);
          console.log(response.data.productDetailAmount);
          if (o.cartAmount > response.data.productDetailAmount || response.data.productDetailAmount === 0) {
            conflict = true;
            messageApi.open({
              type: 'error',
              content: `Sản phẩm thứ ${index + 1} đang tạm thời hết hàng (chỉ còn ${
                response.data.productDetailAmount
              } cái) vui lòng cập nhật lại số lượng sản phẩm!!!!`,
              duration: 0,
            });
            return;
          }
        });
        console.log(conflict);
        setTimeout(messageApi.destroy, 1);
        Promise.all(promises)
          .then(async () => {
            console.log(conflict);
            if (conflict === false) {
              ///check sl sản phẩm detail trước khi hoàn thành đơn hàng

              let addBill = {
                staff: {
                  staffId: staff.staffId,
                },
                customer: {
                  customerId: customerId,
                },
                voucher: {
                  voucherId: voucher.voucherId,
                },
                billCode: values.billCode,
                billCreateDate: formattedDate,
                billDatePayment: formattedDate,
                billShipDate: formattedDate,
                billReceiverDate: formattedDate,
                billTotalPrice: totalPrice,
                productAmount: handleCacuTotalAmount(),
                billPriceAfterVoucher:
                  totalPrice +
                  totalPrice * VAT -
                  voucherPrice -
                  totalPrice * (discountPercentByRankingName / 100) -
                  consumePoints * 500,
                shippingAddress: null,
                billingAddress: null,
                receiverName: customer ? customer.users.fullName : null,
                shipPrice: 0,
                billReducedPrice:
                  totalPrice -
                  (totalPrice +
                    totalPrice * VAT -
                    voucherPrice -
                    totalPrice * (discountPercentByRankingName / 100) -
                    consumePoints * 500),
                orderEmail: customer ? customer.users.email : null,
                orderPhone: customer ? customer.users.phoneNumber : null,
                paymentMethod: values.paymentMethod,
                billNote: values.billNote,
                billStatus: 1,
              };

              if (customer === null) {
                addBill.customer = null;
              }
              if (voucher === '') {
                addBill.voucher = null;
              }

              const addedBill = await handleAddBills(addBill);
              if (visible) {
                const updatePoint = await customerAPI.updatePoint(customerId, totalPrice);
                const updateConsumePoint = await customerAPI.updateConsumePoint(customerId, consumePoints);
              }

              var isErr = false;
              await Promise.all(
                selectedItems.map(async (o) => {
                  let billDetail = {
                    bills: {
                      billId: addedBill.billId,
                    },
                    productDetails: {
                      productDetailId: o.productDetailId,
                    },
                    amount: o.cartAmount,
                    price: o.retailPrice,
                    billDetailStatus: 1,
                  };

                  const billDetails = await handleAddBillDetails(billDetail);
                  const produtcAmount = await productDetailsAPI.updateAmount(o.productDetailId, o.cartAmount);
                  let isuUpdateAmountSucess = false;
                  if (voucher !== '') {
                    const voucherBeforeAplied = await voucherAPI.updateAmountBeforeAplied(voucher.voucherId, 1);
                    if (voucherBeforeAplied.status === 200) {
                      isuUpdateAmountSucess = true;
                    }
                  }
                  if (billDetails.status === 200 && produtcAmount.status === 200 && isuUpdateAmountSucess === true) {
                    isErr = true;
                  }
                }),
              );

              if (isErr !== true) {
                if (customer !== null) {
                  const emailContent = `
        <html>
          <head>
            <title>Thông tin đơn hàng</title>
          </head>
          <style>
      
        
        </style>
          <body>
            <h1>Thông tin đơn hàng</h1>
            <h4>Mã Bill: ${values.billCode} - ${formattedDate}</h4>
            <table border="1" style="border-collapse: collapse; width: 100%; padding: 10px;">
            <thead>
              <tr>
                <th style="padding: 8px; text-align: center;">Mã Sản phẩm</th>
                <th style="padding: 8px; text-align: center;">Tên Balo</th>
                <th style="padding: 8px; text-align: center;">Màu Sắc</th>
                <th style="padding: 8px; text-align: center;">Size Balo</th>
                <th style="padding: 8px; text-align: center;">Giá Bán</th>
                <th style="padding: 8px; text-align: center;">Số Lượng</th>
                <th style="padding: 8px; text-align: center;">Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              ${selectedItems
                .map(
                  (record) => `
                <tr key=${record.product.productId}>
                  <td style="padding: 8px; text-align: center;">${record.productDetailId}</td>
                  <td style="padding: 8px; text-align: center;">${record.product.productName}</td>
                  <td style="padding: 8px; text-align: center;">${record.color.colorName}</td>
                  <td style="padding: 8px; text-align: center;">${record.size.sizeName}</td>
                  <td style="padding: 8px; text-align: center;">${VNDFormaterFunc(record.retailPrice)} / cái</td>
                  <td style="padding: 8px; text-align: center;">${record.cartAmount} cái</td>
                  <td style="padding: 8px; text-align: center;">${VNDFormaterFunc(
                    record.cartAmount * record.retailPrice,
                  )}</td>
                </tr>
              `,
                )
                .join('')}
            </tbody>
          </table>
          <div>
              <div>
              <h3>* Tổng tiền Sản Phẩm (1): + ${VNDFormaterFunc(totalPrice)}</h3>
              </div>
              <div>
              <h3>
              * Thuế VAT ${VAT * 100}% (2): + ${VNDFormaterFunc(totalPrice * VAT)}
              </h3>
              <h3>
              * Voucher (${voucher.voucherCode || 'nếu có'}) (giảm ${
                    voucher.discountPercent || 0
                  } %) (3): - ${VNDFormaterFunc(voucherPrice)}
            </h3>
            </div>
              <div>
      
              </div>
                  <div>
                    <h3>
                      * Hạng Khách Hàng (${rankingName || 'nếu có'}) (- ${discountPercentByRankingName || ''} %) (4): 
                    - ${VNDFormaterFunc(totalPrice * (discountPercentByRankingName / 100))}</h3>
                  </div>
                  
                  <div>
                            <h3>
                              Điểm tiêu dùng (${consumePointsReicer || 'nếu có'}) (- ${
                    consumePoints + 'Điểm' || ''
                  } ) (4):
                              - ${VNDFormaterFunc(consumePoints * 500)}
                            </h3>
                          </div>
              <div >
               <h2>Tổng Tiền (1 - 2 + 3 - 4) = 
                ${VNDFormaterFunc(
                  totalPrice +
                    totalPrice * VAT -
                    voucherPrice -
                    totalPrice * (discountPercentByRankingName / 100) -
                    consumePoints * 500,
                )}
            </h2>
              </div>
        </div>
          </body>
        </html>
      `;

                  const mail = {
                    email: customer.users.email,
                    subject: 'Cảm ơn đã mua hàng',
                    content: emailContent,
                  };
                  const mailResponse = MaillingAPI.notificationHtml(mail);
                }
                setTimeout(messageApi.destroy, 1);
                notification.success({
                  message: 'Thành Công',
                  description: `Đã hoàn thành đơn hàng`,
                  duration: 2,
                });
              }
              handleResetScreen();
            }
          })
          .catch((error) => {
            console.error(error);
          });
      }

      setBillInfo(values);
    };
    async function handleAddBills(bill) {
      const response = await billsAPI.add(bill);
      return response.data;
    }
    async function handleAddBillDetails(billDetails) {
      const response = await billDetailsAPI.add(billDetails);
      return response;
    }
    const onFocusInput = () => {
      console.log(searchInputRef.current);
      if (searchInputRef.current) {
        // searchInputRef.
      }
    };

    const QRCodeScanner = ({ showScanner }) => {
      const [data, setData] = useState('');

      const qrcodeId = props.tabNum;

      const handleFindbyId = async () => {
        if (data !== '') {
          try {
            const response = await productDetailsAPI.findById(data);
            if (response.status === 200) {
              messageApi.success(`Mã hợp lệ`);

              const item = response.data;
              if (item.productDetailAmount <= 0) {
                notification.error({
                  message: 'Lỗi',
                  description: `Hiện tại Sản Phẩm đang hết hàng!!!!`,
                });
                setData('');
                setIsModalQROpen(false);
                return;
              } else {
                if (isItemAlreadyAdded(item)) {
                  const updatedItems = selectedItems.map((o) => {
                    if (o.productDetailId === item.productDetailId) {
                      const newCartAmount = o.cartAmount + 1;
                      if (newCartAmount <= item.productDetailAmount) {
                        return { ...o, cartAmount: newCartAmount };
                      } else {
                        notification.error({
                          message: 'Lỗi',
                          description: `Số lượng vượt quá giới hạn. Số lượng tối đa: ${item.productDetailAmount}`,
                        });
                        return o;
                      }
                    }
                    return o;
                  });
                  setSelectedItems(updatedItems);
                  setInputValue(item.product.productCode);
                  setTotalPrice(calculateTotalPrice(updatedItems));
                  soundEffect.play();
                  notification.success({
                    message: 'Thành Công',
                    description: 'Số lượng đã được Update!!!!',
                    duration: 2,
                  });
                } else {
                  const newItem = { ...item, cartAmount: 1 };
                  setSelectedItems(selectedItems.concat(newItem));
                  setTotalPrice(calculateTotalPrice(selectedItems.concat(newItem)));
                  setInputValue(item.productCode);
                  soundEffect.play();
                  notification.success({
                    message: 'Thành Công',
                    description: 'Sản Phẩm đã được thêm!!!!',
                    duration: 2,
                  });
                }
              }
            }
            setTimeout(() => {
              setData('');
            }, 1000);
          } catch (error) {
            messageApi.error(`Mã không hợp lệ, vui lòng quét lại!!!`);
            setData('');
            setIsModalQROpen(false);
          }
        }
      };
      useEffect(() => {
        handleFindbyId();
      }, [data]);
      useEffect(() => {
        const config = { fps: 10, qrbox: { width: 200, height: 200 }, aspectRatio: 1 };
        if (!html5QrCode?.getState()) {
          html5QrCode = new Html5Qrcode(qrcodeId);
          const qrCodeSuccessCallback = (decodedText) => {
            setData(decodedText);
            html5QrCode.pause(true);
            html5QrCode.stop();
          };

          setTimeout(() => {
            html5QrCode.start({ facingMode: 'environment' }, config, qrCodeSuccessCallback);
          }, 500);
        }
      }, [qrcodeId, data]);
      const divStyle = {
        width: '200px',
        height: '200px',
        backgroundColor: 'lightblue',
        border: '1px solid black',
        borderRadius: '5px',
      };

      return (
        <div>
          {isModalQROpen ? (
            <div>
              <div id={qrcodeId} style={divStyle}></div>
              <div>
                <Typography.Text>Mã: {data}</Typography.Text>
              </div>
              <Button onClick={handleClearQR}>Clear</Button>
            </div>
          ) : (
            ''
          )}
        </div>
      );
    };

    const showModal = () => {
      setIsModalQROpen(true);
    };
    const handleOk = () => {
      setIsModalQROpen(false);
      html5QrCode.stop();
    };
    const handleCancel = () => {
      setIsModalQROpen(false);
      if (html5QrCode?.getState()) {
        html5QrCode.stop();
      }
    };
    const handleClearQR = () => {};
    const AddCustomerComponent = () => {
      const [addCusomter] = Form.useForm();

      const onFinish = async (values) => {
        const password = generateCustomCode('CamOnQuyKh@ch', 4);
        messageApi.open({
          type: 'loading',
          content: 'Đang tạo Khách Hàng..',
          duration: 1,
        });
        try {
          const isExistPhoneNumberRespone = await customerAPI.findByPhoneNumber(values.phoneNumber);
          const isExistEmailRespone = await customerAPI.findByEmail(values.email);

          if (isExistPhoneNumberRespone.data !== '') {
            notification.warning({
              message: 'Thông Báo',
              description: 'Số Điện thoại này đã được đăng kí!!',
              duration: 2,
            });
            messageApi.destroy();
          } else if (isExistEmailRespone.data !== '') {
            notification.warning({
              message: 'Thông Báo',
              description: 'Email này đã được đăng kí!!',
              duration: 2,
            });
            messageApi.destroy();
          } else {
            const useradd = {
              customerCode: generateCustomCode('KH', 6),
              customerStatus: 1,
              consumePoints: 0,
              rankingPoints: 0,
              users: {
                account: values.fullName,
                fullName: values.fullName,
                email: values.email,
                phoneNumber: values.phoneNumber,
                password: password,
                role: 'ROLE_CUSTOMER',
              },
            };
            try {
              const response = await customerAPI.add(useradd);
              const mail = {
                email: values.email,
                subject: 'Đăng kí tạo tài khoản Thành Công',
                content: `Chúc mừng ${values.fullName} đã đăng kí thành công trở thành Khách hàng Thân Thiết của BagsGirl, Bạn có thể truy cậy Website: http://localhost:3000 của chúng tôi theo dõi cũng như nhận vô vàn khuyến mãi hấp dẫn nhất, Bạn có thể đăng nhập tài khoản bằng Email: ${values.email} - Password: ${password}. Cảm ơn quý khách!!! `,
              };
              const mailResponse = MaillingAPI.notificationCreateCustomer(mail);

              if (response.status === 200) {
                notification.success({
                  message: 'Thành Công',
                  description: 'Tạo taì khoản thành công!!!',
                  duration: 2,
                });
                messageApi.destroy();

                const customer = await (await customerAPI.findByEmail(response.data.users.email)).data;

                form.setFieldsValue({
                  fullName: customer.users.fullName,
                  phoneNumber: customer.users.phoneNumber,
                  address: customer.users.address,
                });
                setCustomer(customer);
                setCustomerId(customer.customerId);
                setVisible(true);
                setVisiblePopover(false);
              }
              if (mailResponse.status === 200) {
                notification.success({
                  message: 'Gửi Mail',
                  description: 'Gửi Mail thành công!!!',
                  duration: 2,
                });
              }
            } catch (error) {
              console.log(error);
              if (error.response.status === 400) {
                messageApi.open({
                  type: 'error',
                  content: 'Email này đã tồn tại!!!',
                });
                messageApi.destroy();
              }
            }
          }
        } catch (error) {
          console.log(error);
        }
      };
      return (
        <div>
          <hr />
          <Form layout="vertical" form={addCusomter} onFinish={onFinish}>
            <Form.Item
              label="Tên Khách Hàng"
              name="fullName"
              rules={[
                {
                  required: true,
                  message: 'Tên không hợp lệ!',
                  pattern: /^[\p{L}\d\s]+$/u,
                  whitespace: true,
                  validator: (rule, value) => {
                    if (value && value.trim() !== value) {
                      return Promise.reject('Tên không được chứa khoảng trắng ở hai đầu!');
                    }
                    // if (value.length === 0) {
                    //   return Promise.reject('Tên không hợp lệ!');
                    // }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <Input></Input>
            </Form.Item>
            <Form.Item
              label="SĐT Khách Hàng"
              name="phoneNumber"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng điền SĐT!',
                  whitespace: true,
                },
                {
                  pattern: /^((\+|00)84|0)(3[2-9]|5[6|8|9]|7[0|6-9]|8[1-6|8-9]|9\d)\d{7}$/,
                  message: 'Vui lòng nhập số điện thoại hợp lệ!',
                },
              ]}
            >
              <Input></Input>
            </Form.Item>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng điền Email!',
                  whitespace: true,
                },
                {
                  pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: 'Vui lòng nhập địa chỉ email hợp lệ!',
                },
              ]}
            >
              <Input width={200}></Input>
            </Form.Item>
          </Form>
          <Row>
            <Col span={4}>
              <Popconfirm
                title="Xác Nhận"
                description="Bạn chắc chắn muốn tạo mới Khách Hàng?"
                onConfirm={() => {
                  addCusomter.submit();
                }}
                onCancel={() => {}}
                okText="Có"
                cancelText="Không"
              >
                <Button>Tạo</Button>
              </Popconfirm>
            </Col>
            <Col span={4}>
              <Button
                onClick={() => {
                  addCusomter.resetFields();
                }}
              >
                Làm mới
              </Button>
            </Col>
          </Row>
        </div>
      );
    };
    const handleResetScreen = () => {
      setTotalPrice(0);
      setVoucherPrice(0);
      setVAT(0);
      setTotalAmount(0);
      setSelectedItems([]);
      form.resetFields();
      setCustomer(null);
      setProductCode(generateCustomCode('HD', 9));
      setConsumePoints(0);
      setConsumePointsReceiver(0);
      messageApi.open({
        type: 'success',
        content: 'Đã làm mới Hóa Đơn!!!',
        duration: 2,
      });
    };
    const handleSelectedItem = () => {
      setSelectedItems([]);
      setProductCode(generateCustomCode('HD', 9));
      setTotalPrice(0);
      setVoucherPrice(0);
      setVAT(0);
      setTotalAmount(0);
      messageApi.open({
        type: 'success',
        content: 'Đã làm mới giỏ hàng!!!',
        duration: 2,
      });
    };
    const handleChangeVAT = (values) => {
      setVAT(values / 100);
    };
    const handleDeleteVoucher = () => {
      setDiscountPercent(0);
      setVoucher('');
      setVoucherPrice(0);
    };
    const handleCancelConsumePoints = () => {
      setConsumePoints(0);
    };
    const handleApplyVoucherCode = async () => {
      if (voucherCode === '') {
        messageApi.error('Mã code không hợp lệ!!!!');
        return;
      }
      try {
        const response = await voucherAPI.findByVoucherCode(voucherCode);
        const voucher = response.data;

        if (voucher.voucherAmount <= 0) {
          messageApi.open({
            type: 'error',
            content: 'Voucher đã được áp dụng hết!!!!',
          });
        } else {
          const currentTime = moment();
          const startTime = moment(voucher.voucherStartTime);
          const endTime = moment(voucher.voucherEndTime);

          if (voucher.voucherStatus !== 1) {
            messageApi.open({
              type: 'success',
              content: `Voucher này tạm thời không được hoạt động!!!!`,
            });
            return;
          }
          if (currentTime.isBetween(startTime, endTime)) {
            if (voucher.totalPriceToReceive <= totalPrice) {
              setDiscountPercent(voucher.discountPercent);
              setVoucher(voucher);
              console.log(voucher);
              setVoucherPrice(totalPrice * (voucher.discountPercent / 100) || voucherPrice);
              messageApi.open({
                type: 'success',
                content: `Voucher áp dụng thành công!!!!`,
              });
            } else {
              if (totalPrice < voucher.totalPriceToReceive) {
                messageApi.open({
                  type: 'error',
                  content: `Voucher này chỉ áp dụng với Hóa đơn trên ${VNDFormaterFunc(voucher.totalPriceToReceive)}!`,
                });
              } else {
                setDiscountPercent(voucher.discountPercent);
                setVoucher(voucher);
                setVoucherPrice(totalPrice * (voucher.discountPercent / 100) || voucherPrice);
                messageApi.open({
                  type: 'success',
                  content: `Voucher áp dụng thành công!!!!`,
                });
              }
            }
          } else {
            messageApi.open({
              type: 'error',
              content: 'Voucher đã hết hạn!',
            });
          }
        }
      } catch (error) {
        console.log(error);
        if (error.response.status === 500) {
          messageApi.open({
            type: 'error',
            content: 'Mã Voucher này không tồn tại!!!',
          });
        }
      }
    };
    const handleKeyPress = (event) => {
      // if (event.key === 'F8') {
      //   finnishPayment();
      // }
      // if (event.key === 'F2') {
      //   if (isModalQROpen) handleCancel();
      // } else {
      //   showModal();
      // }
    };
    useEffect(() => {
      window.addEventListener('keydown', handleKeyPress);

      return () => {
        window.removeEventListener('keydown', handleKeyPress);
      };
    }, []);
    return (
      <div className={styles.content}>
        {contextHolder}
        <div>
          <Row>
            <Col span={6}></Col>
            <Col span={8}>
              <h1 className={styles.title}>Hóa Đơn {props.tabNum}</h1>
            </Col>
          </Row>
          <hr />
        </div>
        <div>
          <Row>
            <Col span={10} className={styles.form}>
              <div>
                <h3>Thông tin khách hàng</h3>
              </div>
              <div>
                <Form
                  layout="vertical"
                  initialValues={{
                    customerType: 0,
                  }}
                >
                  <Row>
                    <Col span={24}>
                      <Form.Item
                        label="Tìm kiếm Khách Hàng"
                        className={styles.item}
                        name="searchUserInfo"
                        rules={[
                          {
                            required: false,
                            message: 'Please input your username!',
                          },
                        ]}
                      >
                        <Row>
                          <Col span={16}>
                            <div className={styles.item}>
                              <AutoComplete
                                value={inputUserInfo}
                                style={{
                                  width: 400,
                                }}
                                size="large"
                                onSelect={handleSelectInfo}
                                onChange={onSearchInfo}
                                placeholder="Nhập từ khóa tìm kiếm"
                                disabled={!visible}
                              >
                                {infoList.map((o) => (
                                  <Option key={o.customerId} value={o.customerId}>
                                    {o.users.fullName +
                                      ' - ' +
                                      o.users.phoneNumber +
                                      ' - ' +
                                      o.users.email +
                                      ' - ' +
                                      o.users.account +
                                      ' - ' +
                                      o.users.address}
                                  </Option>
                                ))}
                              </AutoComplete>
                            </div>
                          </Col>
                          <Col span={8}>
                            <Popover
                              content={<AddCustomerComponent />}
                              title={<h3>Tạo Khách Hàng</h3>}
                              trigger="click"
                              overlayStyle={{
                                width: '400px',
                                height: '200px',
                              }}
                              placement="right"
                            >
                              <Button
                                disabled={!visible}
                                type="primary"
                                shape="round"
                                size="large"
                                icon={<PlusOutlined />}
                              >
                                Thêm Khách Hàng
                              </Button>
                            </Popover>
                          </Col>
                        </Row>
                      </Form.Item>
                      <hr />
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        label="Loại Khách Hàng"
                        className={styles.item}
                        name="customerType"
                        rules={[
                          {
                            required: false,
                            message: 'Please input your username!',
                          },
                        ]}
                      >
                        <Select
                          style={{
                            width: 240,
                          }}
                          options={[
                            {
                              value: 1,
                              label: 'Khách Lẻ',
                            },
                            {
                              value: 0,
                              label: 'KH Thân Thiết',
                            },
                          ]}
                          onChange={handleTonggleSelectChange}
                        ></Select>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        label="Nhân Viên"
                        name="staffName"
                        initialValue={staff !== null ? staff.users.fullName : ''}
                        className={styles.item}
                        rules={[
                          {
                            required: true,
                            message: 'Please input your username!',
                          },
                        ]}
                      >
                        <Input readOnly />
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
                <Form
                  layout="vertical"
                  form={form}
                  onFinish={onHandleAddBill}
                  initialValues={{
                    staffName: staff !== null ? staff.users.fullName : '',
                    paymentMethod: 1,
                    billNote: '',
                  }}
                >
                  <Row>
                    <Col span={12}>
                      <Form.Item
                        label="MÃ HĐ"
                        initialValue={productCode}
                        className={styles.item}
                        name="billCode"
                        rules={[
                          {
                            required: true,
                            message: 'Please input your username!',
                          },
                        ]}
                      >
                        <Input readOnly />
                      </Form.Item>
                    </Col>
                    {visible && (
                      <Col span={12}>
                        <Form.Item
                          label="Hạng Khách Hàng"
                          name="rankingName"
                          className={styles.item}
                          rules={[
                            {
                              required: false,
                              message: 'Please input your username!',
                            },
                          ]}
                        >
                          <Input readOnly />
                        </Form.Item>
                      </Col>
                    )}
                  </Row>

                  <div>
                    {visible && (
                      <div>
                        <Row>
                          <Col span={12}>
                            <Form.Item label="Tên Khách Hàng" name="fullName" className={styles.item}>
                              <Input readOnly />
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item label="SĐT Khách Hàng" name="phoneNumber">
                              <Input readOnly />
                            </Form.Item>
                          </Col>
                        </Row>
                        <Row>
                          <Col span={12}>
                            <Form.Item className={styles.item} label="Địa chỉ" name="address">
                              <TextArea readOnly rows={3} placeholder="Địa Chỉ Chi tiết" maxLength={1000} showCount />
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item className={styles.item} label="Email" name="email">
                              <Input readOnly rows={3} placeholder="Email" />
                            </Form.Item>
                            <Form.Item className={styles.item} label="Điểm tiêu dùng" name="consumePoints">
                              <Input readOnly rows={3} placeholder="Điểm tiêu dùng" />
                            </Form.Item>
                          </Col>
                        </Row>
                      </div>
                    )}
                    <Row>
                      <Col span={12}>
                        <Form.Item
                          label="Mã Giảm Giá (nếu có)"
                          name="disCountCode"
                          className={styles.item}
                          rules={[
                            {
                              required: false,
                              message: 'Mã giảm giá không hợp lệ!',
                              whitespace: true,
                            },
                          ]}
                        >
                          <Row>
                            <Col span={18}>
                              <Search
                                onChange={(e) => {
                                  setVoucherCode(e.target.value);
                                }}
                                enterButton="Search"
                                onSearch={handleApplyVoucherCode}
                                value={voucherCode}
                              />
                            </Col>
                            <Col span={6}>
                              <Button onClick={handleDeleteVoucher}>Hủy</Button>
                            </Col>
                          </Row>
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          label="Kiểu Thanh Toán"
                          className={styles.item}
                          name="paymentMethod"
                          rules={[
                            {
                              required: false,
                              message: 'Please input your username!',
                            },
                          ]}
                        >
                          <Select
                            style={{
                              width: 240,
                            }}
                            options={[
                              {
                                value: 1,
                                label: 'Tiền Mặt',
                              },
                              {
                                value: 0,
                                label: 'Chuyển Khoản',
                              },
                            ]}
                          ></Select>
                        </Form.Item>
                      </Col>
                    </Row>
                  </div>
                  {visible && (
                    <div>
                      <Row>
                        <Col span={12}>
                          <Form.Item
                            label="Đổi điểm"
                            name="consumePointChange"
                            className={styles.item}
                            rules={[
                              {
                                required: false,
                                message: 'Điểm không hợp lệ!',
                                whitespace: true,
                              },
                            ]}
                          >
                            <Row>
                              <Col span={18}>
                                <InputNumber
                                  style={{ width: '215px' }}
                                  onChange={(e) => {
                                    if (totalPrice === 0) {
                                      messageApi.error('Vui lòng Chọn chọn sản phẩm!!!');
                                      return;
                                    }
                                    setConsumePoints(e);
                                  }}
                                  min={0}
                                  max={consumePointsReicer}
                                />
                              </Col>

                              <Col span={6}>
                                <Button onClick={handleCancelConsumePoints}>Hủy</Button>
                              </Col>
                            </Row>
                          </Form.Item>
                        </Col>
                      </Row>
                    </div>
                  )}
                  <Row>
                    <Col span={24}>
                      <Form.Item
                        label=""
                        name="billNote"
                        rules={[
                          {
                            required: false,
                            message: 'Please input your username!',
                          },
                        ]}
                      >
                        <TextArea rows={3} placeholder="Ghi chú" maxLength={1000} showCount />
                      </Form.Item>
                    </Col>
                  </Row>
                  <div>
                    <Row>
                      <Col span={18}>
                        <div className={styles.item}>
                          <h6>Tổng tiền Sản Phẩm (1)</h6>
                        </div>
                      </Col>
                      <Col span={6}>
                        <div>
                          <h6>+ {VNDFormaterFunc(totalPrice)}</h6>
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={18}>
                        <div className={styles.item}>
                          <h6>
                            Thuế VAT{' '}
                            <span>
                              <InputNumber width={300} size="small" min={0} onChange={handleChangeVAT}></InputNumber>
                            </span>
                            {' % (2)'}
                          </h6>
                        </div>
                      </Col>
                      <Col span={6}>
                        <div>
                          <h6>+ {VNDFormaterFunc(totalPrice * VAT)}</h6>
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={18}>
                        <div className={styles.item}>
                          <h6>
                            Voucher ({voucher.voucherCode || 'nếu có'}) (giảm {voucher.discountPercent || 0} %) (3)
                          </h6>
                        </div>
                      </Col>
                      <Col span={6}>
                        <div>
                          <h6>- {VNDFormaterFunc(voucherPrice)}</h6>
                        </div>
                      </Col>
                    </Row>

                    {visible && (
                      <div>
                        <Row>
                          <Col span={18}>
                            <div className={styles.item}>
                              <h6>
                                Hạng Khách Hàng ({rankingName || 'nếu có'}) (- {discountPercentByRankingName || ''} %)
                                (4)
                              </h6>
                            </div>
                          </Col>
                          <Col span={6}>
                            <div>
                              <h6>- {VNDFormaterFunc(totalPrice * (discountPercentByRankingName / 100))}</h6>
                            </div>
                          </Col>
                        </Row>
                        <Row>
                          <Col span={18}>
                            <div className={styles.item}>
                              <h6>
                                Đổi Điểm ({consumePointsReicer || 'nếu có'}) (- {consumePoints + ' Điểm' || ''} ) ( tối
                                đa:{' '}
                                {(totalPrice +
                                  totalPrice * VAT -
                                  voucherPrice -
                                  totalPrice * (discountPercentByRankingName / 100) -
                                  consumePoints * 500) /
                                  500}{' '}
                                Points) (4)
                              </h6>
                            </div>
                          </Col>
                          <Col span={6}>
                            <div>
                              <h6>- {VNDFormaterFunc(consumePoints * 500)}</h6>
                            </div>
                          </Col>
                        </Row>
                      </div>
                    )}

                    <Row>
                      <Col span={15}>
                        <div className={styles.item}>
                          <h3>Tổng Tiền (1 - 2 + 3)</h3>
                        </div>
                      </Col>
                      <Col span={9}>
                        <div>
                          <h3>
                            {'= '}
                            {VNDFormaterFunc(
                              totalPrice +
                                totalPrice * VAT -
                                voucherPrice -
                                totalPrice * (discountPercentByRankingName / 100) -
                                consumePoints * 500,
                            )}
                          </h3>
                        </div>
                      </Col>
                    </Row>
                  </div>
                  <Row>
                    <Col span={10}>
                      <Popconfirm
                        title="Xác Nhận"
                        description="Bạn chắc chắn có muốn thêm??"
                        onConfirm={finnishPayment}
                        onCancel={() => {}}
                        okText="Yes"
                        cancelText="No"
                      >
                        <Button shape="round" icon={<SaveTwoTone size={10} />} size={'large'} type="primary">
                          Thanh Toán
                        </Button>
                      </Popconfirm>
                    </Col>
                    <Col span={12}>
                      <Button onClick={handleResetScreen} type="dashed" shape="round" size="large" icon={<MdRestore />}>
                        Reset
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </div>
            </Col>
            <Col span={14} style={{ borderLeft: '1px solid', minHeight: '1000px' }} className={styles.form}>
              <div>
                <h3>Sản Phẩm</h3>
              </div>
              <div>
                <div style={{ width: 'auto' }}>
                  <Form layout="vertical">
                    <Form.Item
                      label="Tìm kiếm Sản Phẩm"
                      name="searchUserInfo"
                      rules={[
                        {
                          required: false,
                          message: 'Please input your username!',
                        },
                      ]}
                    >
                      <Row>
                        <Col span={16}>
                          <AutoComplete
                            style={{ width: 600 }}
                            size="large"
                            onSelect={handleSelect}
                            onChange={onSearch}
                            value={inputValue}
                            placeholder="Nhập từ khóa tìm kiếm"
                            onFocus={onFocusInput}
                            ref={searchInputRef}
                            allowClear
                          >
                            {options.map((option) => (
                              <Option key={option.productDetailId} value={option.productDetailId}>
                                {option.product.productName +
                                  ' - ' +
                                  VNDFormaterFunc(option.retailPrice) +
                                  ' - ' +
                                  option.productDetailAmount +
                                  ' cái' +
                                  ' - ' +
                                  option.size.sizeName +
                                  ' - ' +
                                  option.color.colorName +
                                  ' - ' +
                                  option.product.brand.brandName +
                                  ' - ' +
                                  option.compartment.compartmentName}
                              </Option>
                            ))}
                          </AutoComplete>
                        </Col>
                        <Col span={5}>
                          <div>
                            <Row>
                              <Col span={5}>
                                <Modal
                                  title="Quét Mã"
                                  width={240}
                                  open={isModalQROpen}
                                  onOk={handleOk}
                                  onCancel={handleCancel}
                                  closable={false}
                                  maskClosable={false}
                                  okButtonProps={{ hidden: true }}
                                >
                                  {isModalQROpen ? <QRCodeScanner showScanner={showScanner}></QRCodeScanner> : ''}
                                </Modal>
                              </Col>
                              <Col span={4}>
                                <Button
                                  onClick={showModal}
                                  shape="round"
                                  size="large"
                                  type="primary"
                                  icon={<ScanOutlined size={100} />}
                                >
                                  Mở Scan
                                </Button>
                              </Col>
                            </Row>
                          </div>
                        </Col>
                        <Col span={3}>
                          <Button
                            onClick={handleSelectedItem}
                            shape="round"
                            icon={<MdRestore />}
                            size="large"
                            type="dashed"
                          >
                            Reset
                          </Button>
                        </Col>
                      </Row>
                    </Form.Item>
                  </Form>

                  <hr />
                  <Table
                    rowKey={(record) =>
                      record &&
                      record.retailPrice &&
                      record.color.colorName &&
                      record.product.productName &&
                      record.productDetailId
                    }
                    rowSelection={rowSelection}
                    dataSource={selectedItems}
                    columns={columns}
                    style={{ marginTop: '20px' }}
                  />
                </div>
              </div>
            </Col>
          </Row>
        </div>
        <hr />
      </div>
    );
  }
  return (
    <div>
      {contextHolder}
      <div
        style={{
          marginBottom: 16,
          padding: '10px',
        }}
      >
        <Button onClick={add} type="primary" icon={<PlusOutlined />} shape="default" size="large">
          Thêm Tab
        </Button>
      </div>
      <Tabs hideAdd onChange={onChange} activeKey={activeKey} type="editable-card" onEdit={onEdit} items={items} />
    </div>
  );
};

export default SalesCounterForm;
