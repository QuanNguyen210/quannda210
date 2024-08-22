import { DownOutlined, RightOutlined, UpOutlined } from '@ant-design/icons';
import { Form, Result, message, notification } from 'antd';
import Search from 'antd/es/input/Search';
import axios from 'axios';
import dayjs from 'dayjs';
import moment from 'moment/moment';
import { Fragment, useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import BeatLoader from 'react-spinners/ClipLoader';
import { generateCustomCode } from '~/Utilities/GenerateCustomCode';
import VNDFormaterFunc from '~/Utilities/VNDFormaterFunc';
import billsAPI from '~/api/BillApi';
import billDetailAPI from '~/api/BillDetailsAPI';
import customerAPI from '~/api/customerAPI';
import productDetailsAPI from '~/api/productDetailsAPI';
import voucherAPI from '~/api/voucherAPI';
import './styles.scss';
import { faL } from '@fortawesome/free-solid-svg-icons';
import cartDetailAPI from '~/api/cartDetailAPI';

const CheckoutDetail = () => {
  const [cartItems, setCartItems] = useState([]);
  const [cart, setCart] = useState([]);
  const customerId = localStorage.getItem('customerId');
  const [address1, setAddress1] = useState(null);
  const [thongTinKH, setThongTinKH] = useState(null);

  const [anThongTinDiaChi, setAnThongTinDiaChi] = useState(true);
  const [anThongTinDiaChi1, setAnThongTinDiaChi1] = useState(false);
  const [cartId, setCartId] = useState('');
  const [amountShip, setAmountShip] = useState('');
  const [amountShip1, setAmountShip1] = useState('');

  const navigate = useNavigate();

  // const addressFromLocalStorage = { address };
  const displayInformationSection = address1 === null;
  const [totalPrice, setTotalPrice] = useState(0);

  const [loadingPayment, setLoadingPayment] = useState(false); // State for payment loading
  const [messageApi, contextHolder] = message.useMessage();
  const location = useLocation();
  const [cartDetailss, setCartetailss] = useState([]);

  const [displayInformation, setDisplayInformation] = useState(true);
  const [displayAddress, setDisplayAddress] = useState(false);
  const [displayOrder, setDisplayOrder] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [donhang, setDonHang] = useState(false);
  const [discountPercentByRankingName, setDiscountPercentByRankingName] = useState();

  const [voucherPrice, setVoucherPrice] = useState(0);
  const [voucherCode, setVoucherCode] = useState('');
  const [voucher, setVoucher] = useState('');
  const [disCountPercent, setDiscountPercent] = useState(0);
  const [ranhkingDiscount, setRanhkingDiscount] = useState(0);
  const [form] = Form.useForm();

  const [customerData, setCustomerData] = useState([]);

  const getOneCustomer = async () => {
    try {
      const response = await customerAPI.getOne(customerId);
      const data = response.data;
      // console.log(data);
      setCustomerData(data);
      setAddress1(data.users.address || '');
    } catch (error) {
      console.error('Error fetching customer data:', error);
    }
  };

  useEffect(() => {
    getOneCustomer(customerId);
  }, []);

  useEffect(() => {
    const customer = customerData;
    const rankingName = customer.customerRanking;
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
  }, [thongTinKH, totalPrice, customerData]);
  const handleApplyVoucherCode = async () => {
    // console.log(voucherCode);
    if (voucherCode === '') {
      messageApi.error('Mã code không hợp lệ!!!!');
      return;
    }
    try {
      const response = await voucherAPI.findByVoucherCode(voucherCode);
      const voucher = response.data;
      // console.log('voucherss', voucher);
      setVoucher(voucher);
      if (voucher.voucherAmount <= 0) {
        messageApi.open({
          type: 'error',
          content: 'Voucher đã được áp dụng hết!!!!',
        });
      } else {
        const currentTime = moment();
        const startTime = moment(voucher.voucherStartTime);
        const endTime = moment(voucher.voucherEndTime);

        if (currentTime.isBetween(startTime, endTime)) {
          // console.log(currentTime.isBetween(startTime, endTime));
          // console.log('gia toi thieu', voucher.totalPriceToReceive);
          // console.log('tong gia bill', calculateTotal());

          if (voucher.totalPriceToReceive <= calculateTotal()) {
            setDiscountPercent(voucher.discountPercent);
            const calculatedVoucherPrice = calculateTotal() * (voucher.discountPercent / 100) || voucherPrice;
            setVoucherPrice(calculatedVoucherPrice);
            const discountedTotalPrice = calculateTotal() - calculatedVoucherPrice + shippingFee;
            setTotalPrice(discountedTotalPrice);
            // console.log('tong bill khi ap dung voucher', discountedTotalPrice);

            messageApi.open({
              type: 'success',
              content: `Voucher áp dụng thành công!!!!`,
            });
          } else {
            messageApi.open({
              type: 'error',
              content: 'Đơn hàng không đủ điều kiên để áp dụng voucher',
            });
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
  const handleApplyVoucherCode1 = async () => {
    // console.log(voucherCode);
    if (voucherCode === '') {
      messageApi.error('Mã code không hợp lệ!!!!');
      return;
    }
    try {
      const response = await voucherAPI.findByVoucherCode(voucherCode);
      const voucher = response.data;
      // console.log('voucherss', voucher);
      setVoucher(voucher);
      if (voucher.voucherAmount <= 0) {
        messageApi.open({
          type: 'error',
          content: 'Voucher đã được áp dụng hết!!!!',
        });
      } else {
        const currentTime = moment();
        const startTime = moment(voucher.voucherStartTime);
        const endTime = moment(voucher.voucherEndTime);

        if (currentTime.isBetween(startTime, endTime)) {
          // console.log(currentTime.isBetween(startTime, endTime));
          // console.log('gia toi thieu', voucher.totalPriceToReceive);
          // console.log('tong gia bill', calculateTotalCustomer());

          if (voucher.totalPriceToReceive <= calculateTotalCustomer()) {
            setDiscountPercent(voucher.discountPercent);
            const calculatedVoucherPrice = calculateTotalCustomer() * (voucher.discountPercent / 100) || voucherPrice;
            setVoucherPrice(calculatedVoucherPrice);
            const discountedTotalPrice =
              calculateTotalCustomer() -
              calculatedVoucherPrice +
              shippingFee -
              (discountPercentByRankingName / 100) * calculateTotalCustomer();
            setTotalPrice(discountedTotalPrice);
            // console.log('tong bill khi ap dung voucher', discountedTotalPrice);

            messageApi.open({
              type: 'success',
              content: `Voucher áp dụng thành công!!!!`,
            });
          } else {
            messageApi.open({
              type: 'error',
              content: 'Đơn hàng không đủ điều kiên để áp dụng voucher',
            });
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

  const Breadcrumb = ({ steps }) => {
    return (
      <div className="breadcrumb">
        {steps.map((step, index) => (
          <Fragment key={index}>
            <span>{step}</span>
            {index !== steps.length - 1 && (
              <span>
                {' '}
                <RightOutlined style={{ fontSize: '14px' }} />{' '}
              </span>
            )}
          </Fragment>
        ))}
      </div>
    );
  };

  useEffect(() => {
    // console.log('dia chi', cartDetailss);
    // console.log('hinh anh', cartDetailss);
  }, [location]);

  const bottomRef = useRef(null);
  const scrollToBottom = () => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  };

  const formRef = useRef(null);
  const scrollToForm = () => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + item.quantity * item.retailPrice;
    }, 0);
  };
  const calculateTotalCustomer = () => {
    return location?.state?.totalPrice1;
  };

  useEffect(() => {
    const storedCart = localStorage.getItem('temporaryCart');
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
    // console.log('storedCart', storedCart);
    // console.log('tongBill', calculateTotal());
    // console.log('tongBill', calculateTotalCustomer());
  }, []);

  useEffect(() => {
    const storeCartDetail = location?.state?.cartItems;
    if (storeCartDetail) {
      setCartetailss(storeCartDetail);
    }
    // console.log('storeCartDetail', storeCartDetail);
    // console.log('totalPrice', totalPrice);
  }, []);
  const handleFullNameChange = (e) => {
    const inputValue = e.target.value;
    const trimmedValue = inputValue.replace(/^\s/, ''); // Loại bỏ dấu cách đầu tiên

    // Kiểm tra nếu có ký tự đặc biệt
    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
    const containsSpecialChar = specialCharRegex.test(trimmedValue);

    if (!containsSpecialChar) {
      setFullName(trimmedValue); // Cập nhật giá trị vào state nếu không chứa ký tự đặc biệt
    }
  };

  const handleAddressChange = (e) => {
    const inputValue = e.target.value;
    const trimmedValue = inputValue.replace(/^\s/, ''); // Loại bỏ dấu cách đầu tiên

    // Kiểm tra nếu có ký tự đặc biệt
    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
    const containsSpecialChar = specialCharRegex.test(trimmedValue);

    if (!containsSpecialChar) {
      setAddress(trimmedValue);
    }
  };
  const handleAddressChangeOld = (e) => {
    const inputValue = e.target.value;
    const trimmedValue = inputValue.replace(/^\s/, ''); // Loại bỏ dấu cách đầu tiên

    // Kiểm tra nếu có ký tự đặc biệt

    setAddress1(location.state.infoCustomer.customers.users.address);
  };
  const [submittedData, setSubmittedData] = useState(null);

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedWard, setSelectedWard] = useState('');
  const [shippingFee, setShippingFee] = useState(0);
  const [shipPrice, setShipPrice] = useState(0);
  const token = '96b259e7-9ca7-11ee-b394-8ac29577e80e';
  const shopId = '4773374';

  const handleResetDropdowns = () => {
    setSelectedProvince('');
    setSelectedDistrict('');
    setSelectedWard('');
  };

  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [fullAddress, setFullAddres] = useState('');
  const [addressFinal, setAddressFinal] = useState('');
  const [email, setEmail] = useState('');
  const [billNote, setBillNote] = useState('');
  const [billCreateDate, setBillCreateDate] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      let selectedProvinceName = '';
      let selectedDistrictName = '';
      let selectedWardName = '';

      if (selectedProvince && provinces.length > 0) {
        selectedProvinceName =
          provinces.find((province) => province.ProvinceID === +selectedProvince)?.ProvinceName || '';
      }
      if (selectedDistrict && districts.length > 0) {
        selectedDistrictName =
          districts.find((district) => district.DistrictID === +selectedDistrict)?.DistrictName || '';
      }
      if (selectedWard && wards.length > 0) {
        selectedWardName = wards.find((ward) => ward.WardCode === selectedWard)?.WardName || '';
      }

      const fullAddressText = `- ${selectedProvinceName} - ${selectedDistrictName} - ${selectedWardName}`;
      const tongAddress = address + fullAddressText;
      const data = {
        fullName,
        phoneNumber,
        address: tongAddress,
        email,
        billNote,
        selectedProvince,
        selectedDistrict,
        selectedWard,
        fullAddress: tongAddress,
      };

      setAddress(tongAddress);
      setDisplayAddress(true);
      setDisplayInformation(false);
      setSubmittedData(data);
    } catch (error) {
      console.error('Error submitting information:', error);
    }
  };

  const handleSubmit1 = async (event) => {
    event.preventDefault();

    try {
      let selectedProvinceName = '';
      let selectedDistrictName = '';
      let selectedWardName = '';

      if (selectedProvince && provinces.length > 0) {
        selectedProvinceName =
          provinces.find((province) => province.ProvinceID === +selectedProvince)?.ProvinceName || '';
      }
      if (selectedDistrict && districts.length > 0) {
        selectedDistrictName =
          districts.find((district) => district.DistrictID === +selectedDistrict)?.DistrictName || '';
      }
      if (selectedWard && wards.length > 0) {
        selectedWardName = wards.find((ward) => ward.WardCode === selectedWard)?.WardName || '';
      }

      const fullAddressText = ` -  ${selectedWardName} - ${selectedDistrictName} -${selectedProvinceName}`;
      const combinedAddress = address + fullAddressText;

      const data = {
        fullName,
        phoneNumber,
        address: combinedAddress,
        email,
        billNote,
        selectedProvince,
        selectedDistrict,
        selectedWard,
        fullAddress: fullAddressText,
      };
      // setFullName(customerData.users.fullName);
      // setPhoneNumber(customerData.users.phoneNumber);
      // setEmail(customerData.users.email);
      setFullAddres(fullAddressText);
      setAddress(combinedAddress);
      setDisplayAddress(true);
      setDisplayInformation(false);
      setSubmittedData(data);
      // console.log('Thông tin địa chỉ:', data);
      // console.log('Tỉnh:', selectedProvinceName);
      // console.log('Quận:', selectedDistrictName);
      // console.log('Xã:', selectedWardName);
      // console.log('Họ và tên:', fullName);
      // console.log('Địa chỉ hoàn chỉnh:', combinedAddress);
    } catch (error) {
      console.error('Error submitting information:', error);
    }
  };

  const updateProductDetailAmount = async (productDetailId, amountToUpdate) => {
    try {
      const response = await productDetailsAPI.updateAmount(productDetailId, amountToUpdate);

      if (response.status === 200) {
        console.log('Product detail amount updated successfully!');
      } else {
        console.error('Failed to update product detail amount:', response.data);
        // Handle failure scenario here
      }
    } catch (error) {
      console.error('Error updating product detail amount:', error);
    }
  };

  const handleConfirmation = async () => {
    const confirmed = window.confirm('Bạn chắc chắn muốn đặt hàng?');

    setLoadingPayment(true);
    setTimeout(async () => {
      const currentTime = new Date();
      const currentDateTime = dayjs(currentTime).format('YYYY-MM-DD HH:mm:ss');
      setBillCreateDate(currentDateTime);
      if (!fullName || !phoneNumber || !selectedProvince || !selectedDistrict || !selectedWard || !address) {
        console.log('Vui lòng điền đầy đủ thông tin');
        setLoadingPayment(false);
        return messageApi.open({
          type: 'error',
          content: 'Vui lòng nhập đầy đủ thông tin địa chỉ',
        });
      } else {
        setLoadingPayment(true);
      }

      let selectedProvinceName = '';
      let selectedDistrictName = '';
      let selectedWardName = '';

      if (selectedProvince && provinces.length > 0) {
        selectedProvinceName =
          provinces.find((province) => province.ProvinceID === +selectedProvince)?.ProvinceName || '';
      }
      if (selectedDistrict && districts.length > 0) {
        selectedDistrictName =
          districts.find((district) => district.DistrictID === +selectedDistrict)?.DistrictName || '';
      }
      if (selectedWard && wards.length > 0) {
        selectedWardName = wards.find((ward) => ward.WardCode === selectedWard)?.WardName || '';
      }

      const fullAddress = `${address} - ${selectedProvinceName} - ${selectedDistrictName} - ${selectedWardName}`;

      const cartItemsTotal = cartItems.reduce(
        (acc, item) => {
          acc.billTotalPrice += item.retailPrice * item.quantity;
          acc.productAmount += item.quantity;
          return acc;
        },
        { billTotalPrice: 0, productAmount: 0 },
      );
      try {
        if (confirmed) {
          const billData = {
            receiverName: fullName,
            orderPhone: phoneNumber,
            orderEmail: email,
            shippingAddress: fullAddress,
            billCreateDate: currentDateTime,
            billNote: billNote,
            billStatus: 4,
            shipPrice: shippingFee,
            billCode: generateCustomCode('HĐ', 9),
            billTotalPrice: location?.state?.totalPrice,
            productAmount: location?.state?.totalQuantity,
            billPriceAfterVoucher: totalPrice || location?.state?.totalPrice + shippingFee,
            billReducedPrice: voucherPrice,
          };
          //
          // console.log('BilLData', billData);
          const response = await billsAPI.add(billData);
          // console.log('Billsssss', response.data);

          const billId = response.data.billId;
          // console.log('BillIDdđ', billId);

          // Tạo mảng dữ liệu cho billDetails
          const billDetailsData = cartItems.map((item) => ({
            bills: {
              billId: billId,
            },
            productDetails: {
              productDetailId: item.productDetailId,
            },
            amount: item.quantity,
            billDetailStatus: 1,
            billDetailNote: null,

            price: item.retailPrice,
          }));
          // console.log('Cartssss', cartItems);

          const responseBillDetails = await Promise.all(
            billDetailsData.map((billDetail) => billDetailAPI.add(billDetail)),
          );

          setSubmittedData(responseBillDetails);

          await Promise.all(
            cartItems.map(async (item) => {
              // Subtract the quantity from the product detail amount
              await updateProductDetailAmount(item.productDetailId, item.quantity);
            }),
          );
          setShipPrice(shippingFee);

          // console.log('bilsssssss:', response.data);
          // console.log('BilLDetails:', responseBillDetails);
          setOrderSuccess(true);
          localStorage.removeItem('temporaryCart');
          messageApi.open({
            type: 'success',
            content: 'Thanh toán thành công',
          });
        } else {
          console.log('ban da huy dat hang');
        }
      } catch (error) {
        setLoadingPayment(false);
        setTimeout(() => setLoadingPayment(true), 200);
        console.error('Error submitting information:', error);
      }
      setLoadingPayment(false);
    }, 500);
  };

  const handleConfirmation1 = async () => {
    const confirmed = window.confirm('Bạn chắc chắn muốn đặt hàng?');

    await customerAPI
      .getOne(customerId)
      .then((response) => {
        const data = response.data;
        // console.log(data);
        setCustomerData(data);

        setAddress1(data.users.address || '');
        setThongTinKH(data.users || '');
      })
      .catch((error) => {
        console.error('Error fetching customer data:', error);
      });

    setLoadingPayment(true);
    setTimeout(async () => {
      const currentTime = new Date();
      const currentDateTime = dayjs(currentTime).format('YYYY-MM-DD HH:mm:ss');
      setBillCreateDate(currentDateTime);
      if (!address) {
        console.log('Vui lòng điền đầy đủ thông tin');
        setLoadingPayment(false);
        return messageApi.open({
          type: 'error',
          content: 'Vui lòng nhập đầy đủ thông tin địa chỉ',
        });
      } else {
        setLoadingPayment(true);
      }

      try {
        if (confirmed) {
          let selectedProvinceName = '';
          let selectedDistrictName = '';
          let selectedWardName = '';

          if (selectedProvince && provinces.length > 0) {
            selectedProvinceName =
              provinces.find((province) => province.ProvinceID === +selectedProvince)?.ProvinceName || '';
          }
          if (selectedDistrict && districts.length > 0) {
            selectedDistrictName =
              districts.find((district) => district.DistrictID === +selectedDistrict)?.DistrictName || '';
          }
          if (selectedWard && wards.length > 0) {
            selectedWardName = wards.find((ward) => ward.WardCode === selectedWard)?.WardName || '';
          }

          const fullAddressText = `- ${selectedWardName}- ${selectedDistrictName} -  ${selectedProvinceName}`;
          const combinedAddress = address + fullAddressText;

          const billData = {
            receiverName: location.state?.infoCustomer?.customers?.users?.fullName || fullName,
            orderPhone: location.state?.infoCustomer?.customers?.users?.phoneNumber || phoneNumber,
            orderEmail: location.state?.infoCustomer?.customers?.users?.email || email,
            shippingAddress: address ? combinedAddress : address1,
            // billingAddress:

            billCreateDate: currentDateTime,
            billNote: billNote,
            billStatus: 4,
            billReducedPrice: voucherPrice + (discountPercentByRankingName / 100) * calculateTotalCustomer(),
            shipPrice: shippingFee,
            billCode: generateCustomCode('HĐ', 9),
            billTotalPrice: location?.state?.totalPrice1,
            productAmount: location?.state?.totalAmount,
            billPriceAfterVoucher:
              totalPrice ||
              location?.state?.totalPrice1 +
                shippingFee -
                (discountPercentByRankingName / 100) * calculateTotalCustomer(),
            customer: {
              customerId: customerId,
              users: {
                fullName: thongTinKH?.fullName,
                phoneNumber: thongTinKH?.phoneNumber,
                email: thongTinKH?.email,
                address: address1,
              },
            },
          };
          setAddressFinal(combinedAddress);
          setFullAddres(fullAddressText);
          setShipPrice(shippingFee);
          // console.log('11111111111111111', billData);
          const response = await billsAPI.add(billData);
          // console.log('Billsssss', response.data);

          // const customerData = {
          //   customerStatus:

          // };
          // const response1 = await customerAPI.add(customerData);

          const billId = response.data.billId;
          // console.log('BillIDdđ', billId);

          // Tạo mảng dữ liệu cho billDetails
          const billDetailsData = cartDetailss.map((item) => ({
            bills: {
              billId: billId,
            },
            productDetails: {
              productDetailId: item.productDetails.productDetailId,
            },
            amount: item.amount,
            billDetailStatus: 1,
            billDetailNote: null,

            price: item.productDetails.retailPrice,
          }));

          const responseBillDetails = await Promise.all(
            billDetailsData.map((billDetail) => billDetailAPI.add(billDetail)),
          );

          setSubmittedData(responseBillDetails);

          await Promise.all(
            cartDetailss.map(async (item) => {
              // Subtract the quantity from the product detail amount
              await updateProductDetailAmount(item.productDetails.productDetailId, item.amount);
            }),
          );
          const cartIdne = location?.state?.cartId;
          setCartId(cartIdne);
          // console.log('bilsssssss:', response.data);
          // console.log('BilLDetails:', responseBillDetails);
          setOrderSuccess(true);
          localStorage.removeItem('temporaryCart');
          messageApi.open({
            type: 'success',
            content: 'Thanh toán thành công',
          });
          clearAllCartDetail(cartIdne);
        } else {
          setLoadingPayment(false);
          console.log('Hủy đặt hàng');
        }
      } catch (error) {
        setLoadingPayment(false);
        setTimeout(() => setLoadingPayment(true), 200);
        console.error('Error submitting information:', error);
      }
      setLoadingPayment(false);
    }, 500);
  };
  const clearAllCartDetail = async (cartId) => {
    // console.log('cartId', cartId);
    try {
      await cartDetailAPI.clearCartDetail(cartId);
    } catch (error) {
      console.error('Error deleting cart item:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://online-gateway.ghn.vn/shiip/public-api/master-data/province', {
          headers: {
            token: `${token}`,
            'Content-Type': 'application/json; charset=utf-8',
          },
        });
        if (response.ok) {
          const data = await response.json();
          setProvinces(data.data);
        } else {
          console.error('Failed to fetch data');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleProvinceChange = async (e) => {
    const selectedProvinceId = e.target.value;
    setSelectedProvince(selectedProvinceId);
    setDistricts([]);
    setWards([]);
    // setShippingFee(0);

    try {
      const response = await fetch(
        `https://online-gateway.ghn.vn/shiip/public-api/master-data/district?province_id=${selectedProvinceId}`,
        {
          headers: {
            token: `${token}`,
            'Content-Type': 'application/json; charset=utf-8',
          },
        },
      );

      if (response.ok) {
        const data = await response.json();
        setDistricts(data.data);
      } else {
        console.error('Failed to fetch districts');
      }
    } catch (error) {
      console.error('Error fetching districts:', error);
    }
  };

  const handleDistrictChange = async (e) => {
    const selectedDistrictId = e.target.value;
    setSelectedDistrict(selectedDistrictId);

    try {
      const response = await fetch(
        `https://online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id=${selectedDistrictId}`,
        {
          headers: {
            token: `${token}`,
            'Content-Type': 'application/json; charset=utf-8',
          },
        },
      );
      if (response.ok) {
        const data = await response.json();
        setWards(data.data);
      } else {
        console.error('Failed to fetch wards');
      }
    } catch (error) {
      console.error('Error fetching wards:', error);
    }
  };

  const handleWardChange = async (e) => {
    try {
      const selectedWardCode = e.target.value;
      setSelectedWard(selectedWardCode);

      if (selectedDistrict && selectedWardCode) {
        const response = await fetch(
          `https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee?service_id=53321&insurance_value=1000000&coupon&to_district_id=${selectedDistrict}&from_district_id=1482&weight=${
            1000 * location?.state?.totalQuantity
          }&from_ward_code=11008&to_ward_code=${selectedWardCode}&length=30&width=15&height=40`,
          {
            headers: {
              token: `${token}`,
              'Content-Type': 'application/json; charset=utf-8',
              shop_id: `${shopId}`,
            },
          },
        );
        if (response.ok) {
          const data = await response.json();
          setShippingFee(data.data.total);
        } else {
          console.error('Failed to fetch shipping fee');
        }
        console.log('selectedDistrict:', selectedDistrict);
        console.log('selectedWardCode:', selectedWardCode);
        console.log('amountShip1:', amountShip1);
        console.log('token:', token);
        console.log('shopId:', shopId);
        console.log('Fetch response:', response);
      }
    } catch (error) {
      console.error('Error fetching shipping fee:', error);
    }
  };

  const handleWardChange1 = async (e) => {
    const selectedWardCode = e.target.value;
    setSelectedWard(selectedWardCode);
    try {
      if (selectedDistrict && selectedWardCode) {
        const response = await fetch(
          `https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee?service_id=53321&insurance_value=1000000&coupon&to_district_id=${selectedDistrict}&from_district_id=1482&weight=${
            location?.state?.totalAmount * 500
          }&from_ward_code=11008&to_ward_code=${selectedWardCode}&length=30&width=15&height=40`,
          {
            headers: {
              token: `${token}`,
              'Content-Type': 'application/json; charset=utf-8',
              shop_id: `${shopId}`,
            },
          },
        );
        if (response.ok) {
          const data = await response.json();
          setShippingFee(data.data.total);
        } else {
          console.error('Failed to fetch shipping fee');
        }
      }
    } catch (error) {
      console.error('Error fetching shipping fee:', error);
    }
  };

  // console.log(customerData);
  // console.log(discountPercentByRankingName);
  return (
    <div className="form-container">
      {/* <Breadcrumb steps={steps} /> */}

      {!orderSuccess && (
        <form onSubmit={customerId == null ? handleSubmit : handleSubmit1}>
          {contextHolder}
          <div
            className="titleNhanHang"
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              color: displayInformation ? 'black' : 'gray',
            }}
          >
            <div style={{ width: '100%' }}>
              <Fragment>
                <div>
                  <h1 style={{ color: 'gold' }}>Thông tin người đặt && nhận hàng</h1>
                  {!displayInformation && (
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'end' }}>
                      <div
                        onClick={() => {
                          setDisplayInformation(true);
                          setDisplayAddress(false);
                          setDisplayOrder(false);
                          setAddress('');
                        }}
                        className="changleAddress"
                      >
                        Thay đổi
                      </div>
                    </div>
                  )}
                </div>

                {displayInformation && (
                  <div>
                    {customerId == null ? (
                      <div>
                        <br></br>
                        <div style={{ display: 'flex', flexDirection: 'row', gap: '15px' }}>
                          <div className="customInput">
                            <label>
                              Họ và tên<span style={{ color: '#ff0000', fontWeight: 'bold' }}> * </span>
                            </label>
                            <input
                              className="inputLabel"
                              type="text"
                              value={fullName}
                              onChange={handleFullNameChange}
                              placeholder="Họ và tên"
                              style={{ flex: 1 }}
                              title="Tên phải chứa ít nhất một ký tự chữ và không chứa kí tự đặc biệt"
                              required
                            />
                          </div>
                          <div className="customInput">
                            <label>
                              Số điện thoại<span style={{ color: '#ff0000', fontWeight: 'bold' }}> * </span>
                            </label>
                            <input
                              className="inputLabel"
                              type="text"
                              value={phoneNumber}
                              onChange={(e) => setPhoneNumber(e.target.value)}
                              placeholder="Số điện thoại"
                              pattern="(?:\+84|0)(?:\d){9,10}$"
                              title="vui lòng nhập số điện thoại hợp lệ và tối đa là 10 số"
                              required
                              style={{ flex: 1 }}
                            />
                          </div>
                          <div className="customInput">
                            <label>
                              Email<span style={{ color: '#ff0000', fontWeight: 'bold' }}> * </span>
                            </label>
                            <input
                              className="inputLabel"
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="Nhập email"
                              pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
                              title="vui lòng nhập email hợp lệ"
                              required
                              style={{ flex: 1 }}
                            />
                          </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'row', gap: '15px' }}>
                          <div className="customInput">
                            <label>
                              Tỉnh/ Thành phố<span style={{ color: '#ff0000', fontWeight: 'bold' }}> * </span>
                            </label>
                            <select
                              value={selectedProvince}
                              id="selectedProvince"
                              onChange={handleProvinceChange}
                              className="inputLabel"
                              required
                            >
                              <option value="">Chọn tỉnh/thành phố</option>
                              {provinces.map((province) => (
                                <option key={province.ProvinceID} value={province.ProvinceID}>
                                  {province.ProvinceName}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="customInput">
                            <label>
                              Quận/ Huyện<span style={{ color: '#ff0000', fontWeight: 'bold' }}> * </span>
                            </label>
                            <select
                              onChange={handleDistrictChange}
                              value={selectedDistrict}
                              id="selectedDistrict"
                              disabled={!selectedProvince}
                              className="inputLabel"
                              required
                            >
                              <option value="">Chọn quận/huyện</option>
                              {districts.map((district) => (
                                <option key={district.DistrictID} value={district.DistrictID}>
                                  {district.DistrictName}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="customInput">
                            <label>
                              Phường/ Xã<span style={{ color: '#ff0000', fontWeight: 'bold' }}> * </span>
                            </label>
                            <select
                              onChange={handleWardChange}
                              value={selectedWard}
                              id="selectedWard"
                              disabled={!selectedDistrict}
                              className="inputLabel"
                              required
                            >
                              <option value="">Chọn phường/xã</option>
                              {wards.map((ward) => (
                                <option key={ward.WardCode} value={ward.WardCode}>
                                  {ward.WardName}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div>Phí vận chuyển: {shippingFee}</div>
                        <div className="customInput">
                          <label>
                            Địa chỉ<span style={{ color: '#ff0000', fontWeight: 'bold' }}> * </span>
                          </label>
                          <input
                            className="inputLabel"
                            type="text"
                            value={address}
                            onChange={handleAddressChange}
                            placeholder="Điền rõ thông tin số nhà, tên đường"
                            required
                            title="Địa chỉ không được chứa kí tự đặc biệt"
                          />
                        </div>
                        <div className="customInput">
                          <label>Ghi chú</label>
                          <textarea
                            className="textarea"
                            rows={3}
                            value={billNote}
                            onChange={(e) => setBillNote(e.target.value)}
                            placeholder="Ghi chú của khách hàng"
                          />
                        </div>

                        <br></br>
                        <button className="buttonXacNhan">Xác nhận địa chỉ</button>
                      </div>
                    ) : (
                      <div>
                        <br></br>
                        <div style={{ display: 'flex', flexDirection: 'row', gap: '15px' }}>
                          <div className="customInput">
                            <label>
                              Họ và tên<span style={{ color: '#ff0000', fontWeight: 'bold' }}> * </span>
                            </label>
                            <input
                              className="inputLabel"
                              type="text"
                              // disabled
                              value={fullName || location.state.infoCustomer.customers.users.fullName}
                              onChange={handleFullNameChange}
                              placeholder="Họ và tên"
                              style={{ flex: 1 }}
                              title="Tên phải chứa ít nhất một ký tự chữ và không chứa kí tự đặc biệt"
                              required
                            />
                          </div>
                          <div className="customInput">
                            <label>
                              Số điện thoại<span style={{ color: '#ff0000', fontWeight: 'bold' }}> * </span>
                            </label>
                            <input
                              // disabled
                              className="inputLabel"
                              type="text"
                              value={phoneNumber || location.state.infoCustomer.customers.users.phoneNumber}
                              onChange={(e) => setPhoneNumber(e.target.value)}
                              placeholder="Số điện thoại"
                              pattern="(?:\+84|0)(?:\d){9,10}$"
                              title="vui lòng nhập số điện thoại hợp lệ và tối đa là 10 số"
                              required
                              style={{ flex: 1 }}
                            />
                          </div>
                          <div className="customInput">
                            <label>
                              Email<span style={{ color: '#ff0000', fontWeight: 'bold' }}> * </span>
                            </label>
                            <input
                              disabled
                              className="inputLabel"
                              type="email"
                              value={email || location.state.infoCustomer.customers.users.email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="Nhập email"
                              pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
                              title="vui lòng nhập email hợp lệ"
                              required
                              style={{ flex: 1 }}
                            />
                          </div>
                        </div>

                        {/* {location.state?.infoCustomer?.customers?.users.address == '' ? ():() } */}

                        <div>
                          {anThongTinDiaChi && (
                            <div>
                              <div style={{ display: 'flex', flexDirection: 'row', gap: '15px' }}>
                                <div className="customInput">
                                  <label>
                                    Tỉnh/ Thành phố<span style={{ color: '#ff0000', fontWeight: 'bold' }}> * </span>
                                  </label>
                                  <select
                                    value={selectedProvince}
                                    id="selectedProvince"
                                    onChange={handleProvinceChange}
                                    className="inputLabel"
                                    required
                                  >
                                    <option value="">Chọn tỉnh/thành phố</option>
                                    {provinces.map((province) => (
                                      <option key={province.ProvinceID} value={province.ProvinceID}>
                                        {province.ProvinceName}
                                      </option>
                                    ))}
                                  </select>
                                </div>

                                <div className="customInput">
                                  <label>
                                    Quận/ Huyện<span style={{ color: '#ff0000', fontWeight: 'bold' }}> * </span>
                                  </label>
                                  <select
                                    onChange={handleDistrictChange}
                                    value={selectedDistrict}
                                    id="selectedDistrict"
                                    disabled={!selectedProvince}
                                    className="inputLabel"
                                    required
                                  >
                                    <option value="">Chọn quận/huyện</option>
                                    {districts.map((district) => (
                                      <option key={district.DistrictID} value={district.DistrictID}>
                                        {district.DistrictName}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                                <div className="customInput">
                                  <label>
                                    Phường/ Xã<span style={{ color: '#ff0000', fontWeight: 'bold' }}> * </span>
                                  </label>
                                  <select
                                    onChange={handleWardChange1}
                                    value={selectedWard}
                                    id="selectedWard"
                                    disabled={!selectedDistrict}
                                    className="inputLabel"
                                    required
                                  >
                                    <option value="">Chọn phường/xã</option>
                                    {wards.map((ward) => (
                                      <option key={ward.WardCode} value={ward.WardCode}>
                                        {ward.WardName}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              </div>
                              <div>Phí vận chuyển: {shippingFee}</div>
                              <div className="customInput">
                                <label>
                                  Địa chỉ người nhận:
                                  <span style={{ color: '#ff0000', fontWeight: 'bold' }}>
                                    {' '}
                                    *
                                    <p
                                      className="thayDoiDiaChiNhanHang"
                                      style={{
                                        float: 'right',
                                        fontSize: '17px',
                                        textDecoration: 'underline',
                                      }}
                                      onClick={() => {
                                        setAnThongTinDiaChi(false);
                                        setAnThongTinDiaChi1(true);
                                        setAddress('');
                                        handleResetDropdowns();
                                        setShippingFee(56520 + 1000 * location?.state?.totalAmount);
                                      }}
                                    >
                                      Lấy địa chỉ của bạn:
                                      <span style={{ color: 'black', padding: ' 0 0 0 10px', textDecoration: 'none' }}>
                                        {location.state.infoCustomer?.customers?.users?.address}
                                      </span>
                                    </p>
                                  </span>
                                </label>
                                <input
                                  className="inputLabel"
                                  type="text"
                                  value={address}
                                  onChange={handleAddressChange}
                                  placeholder="Điền rõ thông tin số nhà, tên đường"
                                  required
                                  title="Địa chỉ không được chứa kí tự đặc biệt"
                                />
                              </div>
                              <div className="customInput">
                                <label>Ghi chú</label>
                                <textarea
                                  className="textarea"
                                  rows={3}
                                  value={billNote}
                                  onChange={(e) => setBillNote(e.target.value)}
                                  placeholder="Ghi chú của khách hàng"
                                />
                              </div>

                              <br></br>
                              <button
                                onClick={() => {
                                  setAddress1(address);
                                  setAddress1(location.state.infoCustomer?.customers?.users?.address);
                                }}
                                className="buttonXacNhan"
                              >
                                Xác nhận địa chỉ
                              </button>
                            </div>
                          )}

                          {anThongTinDiaChi1 && (
                            <div>
                              <div className="customInput">
                                <label>
                                  Địa chỉ của bạn:
                                  <span style={{ color: '#ff0000', fontWeight: 'bold' }}>
                                    {' '}
                                    *{' '}
                                    <p
                                      className="thayDoiDiaChiNhanHang"
                                      style={{ float: 'right' }}
                                      onClick={() => {
                                        setAnThongTinDiaChi(true);
                                        setAnThongTinDiaChi1(false);
                                        setAddress('');
                                      }}
                                    >
                                      Thay đổi địa chỉ người nhận
                                    </p>{' '}
                                  </span>
                                </label>

                                <div style={{ width: '100%' }}>
                                  <input
                                    className="inputLabel"
                                    style={{ width: '85%' }}
                                    type="text"
                                    disabled
                                    value={location.state.infoCustomer.customers.users.address}
                                    onChange={handleAddressChangeOld}
                                    placeholder="Bạn chưa có địa chỉ"
                                    required
                                    title="Địa chỉ không được chứa kí tự đặc biệt"
                                  />
                                  <span
                                    style={{
                                      // position: 'absolute',
                                      top: '50%',
                                      transform: 'translateY(-50%)',
                                      left: '10px',
                                      color: 'blue',
                                      textDecoration: 'underline',
                                      cursor: 'pointer',
                                      padding: '0 0 0 30px',
                                    }}
                                    onClick={() => {
                                      navigate('/profile');
                                    }}
                                  >
                                    Cập nhật thông tin
                                  </span>
                                </div>
                              </div>
                              <div className="customInput">
                                <label>Ghi chú</label>
                                <textarea
                                  className="textarea"
                                  rows={3}
                                  value={billNote}
                                  onChange={(e) => setBillNote(e.target.value)}
                                  placeholder="Ghi chú của khách hàng"
                                />
                              </div>

                              <br></br>
                              <button
                                onClick={() => {
                                  setAddress1(location.state.infoCustomer.customers.users.address);
                                  setAddress(location.state.infoCustomer.customers.users.address);
                                }}
                                className="buttonXacNhan"
                              >
                                Xác nhận địa chỉ
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </Fragment>
            </div>
          </div>

          <br></br>
          <hr />

          <div>
            <div
              className="titleNhanHang"
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                color: displayAddress ? 'black' : 'gray',
              }}
            >
              <h1 style={{ color: 'gold' }}>Địa chỉ</h1>
            </div>
            {displayAddress && (
              <div>
                <div className="voucher">
                  <h4>Thông tin nhận hàng:</h4>
                  <p>
                    <span style={{ fontSize: '16px', fontWeight: 'bold' }}>Người nhận:</span>{' '}
                    {fullName || location.state.infoCustomer.customers.users.fullName}
                  </p>
                  <p>
                    <span style={{ fontSize: '16px', fontWeight: 'bold' }}>Số điện thoại:</span>{' '}
                    {phoneNumber || location.state.infoCustomer.customers.users.phoneNumber}
                  </p>
                  {/* <p>
                    <span style={{ fontSize: '16px', fontWeight: 'bold' }}>Địa chỉ Người Đặt:</span> {address1}{' '}
                    {fullAddress}
                  </p> */}
                  <p>
                    <span style={{ fontSize: '16px', fontWeight: 'bold' }}>Địa chỉ Người Nhận:</span> {address}
                  </p>
                  <p>
                    <span style={{ fontSize: '16px', fontWeight: 'bold' }}>Email:</span>{' '}
                    {email || location.state.infoCustomer.customers.users.email}
                  </p>
                  <p>
                    <span style={{ fontSize: '16px', fontWeight: 'bold' }}>Ghi Chú:</span> {billNote}
                  </p>
                </div>

                <br></br>
                <button
                  onClick={() => {
                    setDisplayAddress(false);
                    setDisplayOrder(true);
                  }}
                  className="buttonXacNhan"
                >
                  Tiếp tục
                </button>
              </div>
            )}
          </div>
          <hr></hr>

          <br></br>
          {true && (
            <div>
              <div
                className="titleNhanHang"
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  color: displayOrder ? 'black' : 'gray',
                }}
              >
                <h1 style={{ color: 'gold' }}>Thanh toán</h1>
              </div>
              <br />
              {displayOrder && (
                <div>
                  {customerId != null ? (
                    <div className="voucher">
                      <h3 style={{ color: 'gray' }}>
                        Đơn hàng{' '}
                        <span style={{ cursor: 'pointer', color: 'gray' }} onClick={() => setDonHang(!donhang)}>
                          {donhang ? <DownOutlined /> : <UpOutlined />}
                        </span>
                      </h3>
                      {!donhang && (
                        <div>
                          {Array.isArray(cartDetailss) &&
                            cartDetailss.map((cartDetailss, index) => (
                              <div className="avatar" key={index}>
                                <img src={cartDetailss.productDetails.product.images[0].imgUrl} className="image" />
                                <div className="info">
                                  <div className="productTitle">{cartDetailss.productDetails.product.productName}</div>
                                  <div className="titleChild">
                                    <a>{`Màu: ${cartDetailss.productDetails.color.colorName}`}</a>
                                    <br />
                                    <a>{`Chất liệu: ${cartDetailss.productDetails.material.materialName}`}</a>
                                  </div>
                                  <div className="number">{`Số lượng: ${cartDetailss.amount}`}</div>
                                  {/* Add your price calculations here */}
                                  <span className="price_sale">
                                    Giá:{' '}
                                    <a>
                                      <span className="price">
                                        {VNDFormaterFunc(cartDetailss.productDetails.retailPrice)}
                                      </span>
                                    </a>
                                  </span>
                                  <span className="price_sale">
                                    Tổng:{' '}
                                    <a>
                                      <span className="price">
                                        {VNDFormaterFunc(cartDetailss.amount * cartDetailss.productDetails.retailPrice)}
                                      </span>
                                    </a>
                                  </span>
                                </div>
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="voucher">
                      <h3 style={{ color: 'gray' }}>
                        Đơn hàng{' '}
                        <span style={{ cursor: 'pointer', color: 'gray' }} onClick={() => setDonHang(!donhang)}>
                          {donhang ? <DownOutlined /> : <UpOutlined />}
                        </span>
                      </h3>
                      {!donhang && (
                        <div>
                          {cartItems.map((item, index) => (
                            <div className={item} key={index}>
                              <div className="avatar">
                                <img src={item.image} className="image" alt={item.productName} />
                                <div className="info">
                                  <div className="productTitle">{item.productName}</div>
                                  <div className="titleChild">
                                    <a>{`Màu: ${item.colorName}`}</a>
                                    <br />
                                    <a> {`Chất liệu: ${item.materialName}`}</a>
                                  </div>
                                  <div className="number">{`Quantity: ${item.quantity}`}</div>
                                  <span className="price_sale">
                                    Giá:{' '}
                                    <a>
                                      <span className="price">{VNDFormaterFunc(item.retailPrice)}</span>
                                    </a>
                                  </span>
                                  <span className="price_sale">
                                    Tổng:{' '}
                                    <a>
                                      <span className="price">{VNDFormaterFunc(item.retailPrice * item.quantity)}</span>
                                    </a>
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {customerId == null ? (
                    <div className="voucher">
                      <h3 style={{ color: 'gray' }}>Voucher:</h3>

                      <div
                        style={{
                          height: '100px',
                          border: '1px solid black',
                        }}
                      >
                        <Form>
                          <Form.Item>
                            <Search
                              onChange={(e) => {
                                setVoucherCode(e.target.value);
                              }}
                              enterButton="Áp dụng"
                              onSearch={handleApplyVoucherCode}
                              value={voucherCode}
                              placeholder="(Nếu có)"
                            />
                          </Form.Item>
                        </Form>
                      </div>
                    </div>
                  ) : (
                    <div className="voucher">
                      <h3 style={{ color: 'gray' }}>Voucher:</h3>

                      <div
                        style={{
                          height: '100px',
                          border: '1px solid black',
                        }}
                      >
                        <Form>
                          <Form.Item>
                            <Search
                              onChange={(e) => {
                                setVoucherCode(e.target.value);
                              }}
                              enterButton="Áp dụng"
                              onSearch={handleApplyVoucherCode1}
                              value={voucherCode}
                              placeholder="(Nếu có)"
                            />
                          </Form.Item>
                        </Form>
                      </div>
                    </div>
                  )}
                  {/* <div className="pay">
                    <h3>Phương thức thanh toán:</h3>
                    <br></br>
                    <label className="labelCK">
                      <input className="inputCk" name="radioPay" checked type="radio" value={''} />
                      Thanh toán khi nhận hàng
                    </label>
                    <br></br>
                    <label className="labelCK">
                      <input className="inputCk" name="radioPay" type="radio" value={''} />
                      Chuyển khoản ngân hàng
                    </label>
                    <br></br>

                    <label className="labelCK">
                      <input className="inputCk" name="radioPay" type="radio" value={''} />
                      Ví điện tử
                    </label>
                  </div> */}
                  <br></br>
                  {customerId != null ? (
                    <div className="totalCheckout" style={{ fontSize: '20px' }}>
                      (1) Tổng số lượng:{' '}
                      <span style={{ color: 'darkred', fontSize: '20px' }}> {location?.state?.totalAmount || 0}</span>
                      <br></br>
                      (2) Tạm tính:{' '}
                      <span style={{ color: 'red', fontWeight: 'bold', fontSize: '20px' }}>
                        {' '}
                        {VNDFormaterFunc(location?.state?.totalPrice1 || 0)}
                      </span>
                      <br></br>
                      (3) Voucher (%):{' '}
                      <span style={{ color: 'darkred', fontSize: '20px' }}> {disCountPercent || 0} %</span>
                      <br></br>
                      (4) Giảm tiền theo voucher:{' '}
                      <span style={{ color: 'darkred', fontSize: '20px' }}>
                        {' '}
                        - {VNDFormaterFunc(voucherPrice || 0)}
                      </span>
                      <br></br>
                      (5) Phí ship:{' '}
                      <span style={{ color: 'darkred', fontSize: '20px' }}> {VNDFormaterFunc(shippingFee)}</span>
                      <br></br>
                      (6) Hạng khách hàng ( {discountPercentByRankingName}%):{' '}
                      <span style={{ color: 'darkred', fontSize: '20px' }}>
                        {' - '}
                        {VNDFormaterFunc((discountPercentByRankingName / 100) * calculateTotalCustomer())}
                      </span>
                      <br></br>
                      Tổng thanh toán (2) + (4) + (5) + (6):{' '}
                      <span style={{ color: 'red', fontWeight: 'bold', fontSize: '25px' }}>
                        {' '}
                        {VNDFormaterFunc(
                          totalPrice ||
                            location?.state?.totalPrice1 +
                              shippingFee -
                              (discountPercentByRankingName / 100) * calculateTotalCustomer(),
                        )}
                      </span>
                      <br />
                    </div>
                  ) : (
                    <div className="totalCheckout" style={{ fontSize: '20px' }}>
                      (1) Tổng số lượng:{' '}
                      <span style={{ color: 'darkred', fontSize: '20px' }}> {location?.state?.totalQuantity || 0}</span>
                      <br></br>
                      (2) Tạm tính:{' '}
                      <span style={{ color: 'red', fontWeight: 'bold', fontSize: '20px' }}>
                        {' '}
                        {VNDFormaterFunc(location?.state?.totalPrice || 0)}
                      </span>
                      <br></br>
                      (3) Voucher giảm (%):{' '}
                      <span style={{ color: 'darkred', fontSize: '20px' }}> {disCountPercent || 0} %</span>
                      <br></br>
                      (4) Giảm tiền theo voucher:{' '}
                      <span style={{ color: 'darkred', fontSize: '20px' }}>
                        {' '}
                        - {VNDFormaterFunc(voucherPrice || 0)}
                      </span>
                      <br></br>
                      (5) Phí ship:{' '}
                      <span style={{ color: 'darkred', fontSize: '20px' }}> {VNDFormaterFunc(shippingFee)}</span>
                      <br />
                      Tổng thanh toán (2) + (4) + (5):{' '}
                      <span style={{ color: 'red', fontWeight: 'bold', fontSize: '25px' }}>
                        {' '}
                        {VNDFormaterFunc(totalPrice || location?.state?.totalPrice + shippingFee)}
                      </span>
                      <br />
                    </div>
                  )}
                  <br />

                  <br></br>
                  {customerId == null ? (
                    <div>
                      {loadingPayment ? (
                        <div style={{ textAlign: 'center', marginTop: '20px' }}>
                          <BeatLoader color="#d64336" loading={true} size={50} />
                          <p>Vui lòng chờ...</p>
                        </div>
                      ) : (
                        <button className="checkOut" onClick={handleConfirmation}>
                          Đặt Hàng
                        </button>
                      )}
                    </div>
                  ) : (
                    <div>
                      {loadingPayment ? (
                        <div style={{ textAlign: 'center', marginTop: '20px' }}>
                          <BeatLoader color="#d64336" loading={true} size={50} />
                          <p>Vui lòng chờ...</p>
                        </div>
                      ) : (
                        <button className="checkOut" onClick={handleConfirmation1}>
                          Đặt Hàng
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </form>
      )}

      {orderSuccess && (
        <Result
          status="success"
          title="Bạn đã đặt hàng thành công. Chúc bạn 1 ngày tốt lành"
          subTitle={submittedData?.fullAddress} // Giả sử submittedData chứa thông tin fullAddress
          extra={[
            <h3 key="continuePayment">
              <Link className="btn btn-primary" to={'/'}>
                Quay về trang chủ
              </Link>
            </h3>,
          ]}
        />
      )}
    </div>
  );
};

export default CheckoutDetail;
