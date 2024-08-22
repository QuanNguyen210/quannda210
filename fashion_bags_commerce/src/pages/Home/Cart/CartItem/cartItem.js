import { DeleteOutlined, DoubleRightOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Form, Image, Table, message, notification } from 'antd';
import Search from 'antd/es/input/Search';
import moment from 'moment/moment';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { default as VNDFormaterFunc, default as vndFormaterFunc } from '~/Utilities/VNDFormaterFunc';
import voucherAPI from '~/api/voucherAPI';
import styles from './tableCart.module.scss';

function CartItem() {
  const [cartItems, setCartItems] = useState([]);
  const [totalQuantity, setTotalQuantity] = useState(0);

  const [messageApi, contextHolder] = message.useMessage();
  const [totalPrice, setTotalPrice] = useState(0);
  const [voucherPrice, setVoucherPrice] = useState(0);
  const [voucherCode, setVoucherCode] = useState('');
  const [voucher, setVoucher] = useState('');
  const [disCountPercent, setDiscountPercent] = useState(0);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const handleApplyVoucherCode = async () => {
    console.log(voucherCode);
    if (voucherCode === '') {
      messageApi.error('Mã code không hợp lệ!!!!');
      return;
    }
    try {
      const response = await voucherAPI.findByVoucherCode(voucherCode);
      const voucher = response.data;
      console.log('voucherss', voucher);
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
          console.log(currentTime.isBetween(startTime, endTime));
          console.log('gia toi thieu', voucher.totalPriceToReceive);
          console.log('tong gia bill', calculateTotal());

          if (voucher.totalPriceToReceive <= calculateTotal()) {
            setDiscountPercent(voucher.discountPercent);
            const calculatedVoucherPrice = calculateTotal() * (voucher.discountPercent / 100) || voucherPrice;
            setVoucherPrice(calculatedVoucherPrice);
            const discountedTotalPrice = calculateTotal() - calculatedVoucherPrice;
            setTotalPrice(discountedTotalPrice);
            console.log('tong bill khi ap dung voucher', discountedTotalPrice);

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

  useEffect(() => {
    const total = cartItems.reduce((totalQty, item) => {
      return totalQty + item.quantity;
    }, 0);
    setTotalQuantity(total);
  }, [cartItems]);

  useEffect(() => {
    const storedCart = localStorage.getItem('temporaryCart');
    if (storedCart) {
      const parsedCart = JSON.parse(storedCart);
      setCartItems(parsedCart);
    }
  }, []);

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + item.quantity * item.retailPrice;
    }, 0);
  };

  const calculateTotalAfterVoucher = () => {
    const totalBeforeVoucher = calculateTotal();
    return vndFormaterFunc(totalBeforeVoucher - voucherPrice);
  };

  const handleRemoveItem = (record) => {
    const updatedCart = cartItems.filter((item) => item !== record);
    setCartItems(updatedCart);
    localStorage.setItem('temporaryCart', JSON.stringify(updatedCart));

    if (updatedCart.length === 0) {
      // window.location.reload();
    }
  };

  const columns = [
    {
      title: 'Ảnh',
      dataIndex: 'image',
      key: 'image',
      render: (text, record) => (
        <Image style={{ width: '200px', height: '200px' }} src={record.image} alt={record.productName} />
      ),
    },
    {
      title: 'Sản phẩm',
      dataIndex: 'productName',
      render: (texe, record) => (
        <div className={styles.info_item}>
          <div className={styles.title_product}>
            {' '}
            {record.productName}-{record.productCode}
          </div>
          <ul className={styles.attr}>
            <li>
              {' '}
              <span className={styles.spanTitle}>Màu sắc: </span> {record.colorName}
            </li>

            <li>
              <span className={styles.spanTitle}>Chất liệu: </span>
              {record.materialName}
            </li>
          </ul>
        </div>
      ),
      key: 'productName',
    },
    {
      title: 'Thương hiệu',
      dataIndex: 'brandName',
      key: 'brandName',
    },
    // {
    //   title: 'id',
    //   dataIndex: 'productDetailId',
    //   key: 'productDetailId',
    // },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      render: (text, record) => (
        <div className={' title_attr'}>
          <div className={styles.book_number}>
            <div className={styles.item_change1} onClick={() => handleDecrement(record)}>
              <MinusOutlined />
            </div>
            <input
              className={styles.input_amount}
              type="text"
              value={record.quantity || ''}
              onChange={(e) => handleQuantityChange(e, record)}
              onBlur={(e) => handleBlur(e, record)}
            />
            <div className={styles.item_change2} onClick={() => handleIncrement(record)}>
              <PlusOutlined />
            </div>
          </div>
        </div>
      ),
      key: 'quantity',
    },
    {
      title: 'Giá sản phẩm',
      dataIndex: 'retailPrice',
      render: (text, record) => vndFormaterFunc(record.retailPrice),
      key: 'retailPrice',
    },
    {
      title: 'Thành tiền',
      render: (text, record) => vndFormaterFunc(record.quantity * record.retailPrice),
      key: 'calculateTotal',
    },
    {
      title: 'Xóa',
      dataIndex: 'operation',
      render: (text, record) => (
        <button
          className={styles.btnXoa}
          type="default"
          onClick={() => handleRemoveItem(record)}
          // icon={}
        >
          <DeleteOutlined /> Xóa
        </button>
      ),
      key: 'operation',
    },
  ];

  const handleQuantityChange = (e, record) => {
    const input = e.target.value;
    const newQuantity = input === '' ? '' : parseInt(input, 10);
    const updatedCart = cartItems.map((item) => {
      if (item === record) {
        // Limit quantity to a maximum of 20 or set to empty if the input is empty
        const quantity = input === '' ? '' : newQuantity > 20 ? 20 : newQuantity;
        return { ...item, quantity };
      }
      return item;
    });

    setCartItems(updatedCart);
    localStorage.setItem('temporaryCart', JSON.stringify(updatedCart));
  };

  const handleBlur = (e, record) => {
    const input = e.target.value;
    const updatedCart = cartItems.map((item) => {
      if (item === record) {
        // If the input is empty, revert to the initial value
        const quantity = input === '' ? 1 : item.quantity;
        return { ...item, quantity };
      }
      return item;
    });

    setCartItems(updatedCart);
    localStorage.setItem('temporaryCart', JSON.stringify(updatedCart));

  };

  const handleIncrement = (record) => {
    const amountInDatabase = record.amount;
    console.log('so luong sp trong kho', amountInDatabase); // Số lượng tồn kho của sản phẩm trong cơ sở dữ liệu

    if (record.quantity + 1 > amountInDatabase) {
      // Hiển thị thông báo khi số lượng vượt quá số lượng trong kho
      notification.error({
        message: 'Thất bại',
        description: 'Số lượng đã đạt giới hạn',
        duration: 1,
      });
    } else 
    if ( record.quantity + 1 > 20) {
      // Hiển thị thông báo khi số lượng vượt quá số lượng trong kho
      notification.error({
        message: 'Thất bại',
        description: 'Chỉ được đặt tối đa 20 sản phẩm',
        duration: 1,
      });
    }
    
    else {
      const updatedCart = cartItems.map((item) => {
        if (item === record) {
          return { ...item, quantity: item.quantity + 1 };
        }
        return item;
      });

      setCartItems(updatedCart);
      localStorage.setItem('temporaryCart', JSON.stringify(updatedCart));
    }
  };

  const handleDecrement = (record) => {
    if (record.quantity > 1) {
      const updatedCart = cartItems.map((item) => {
        if (item === record) {
          return { ...item, quantity: item.quantity - 1 };
        }
        return item;
      });
      setCartItems(updatedCart);
      localStorage.setItem('temporaryCart', JSON.stringify(updatedCart));
    }
  };
  return (
    <div className="" style={{ padding: '0 5% 0 5%' }}>
      {contextHolder}
      <div>
        <h2 style={{ color: 'gray', textAlign: 'center' }}>Giỏ hàng</h2>

        <div style={{ textAlign: 'center' }}>
          <Link to={'/shop'} className={styles.continue_cart}>
            Tiếp tục mua sắm <DoubleRightOutlined />
          </Link>
        </div>
        <div className="" style={{ padding: '0 5% 0 5%' }}>
          {contextHolder}
          {cartItems.length === 0 ? (
            // Kiểm tra nếu giỏ hàng trống
            <div style={{ textAlign: 'center', marginTop: '50px' }}>
              <h2 style={{ color: 'gray' }}>Bạn chưa có sản phẩm nào trong giỏ hàng..</h2>
              <img
                src="https://theme.hstatic.net/1000197303/1001046599/14/empty-cart-desktop.png?v=7097"
                style={{ width: '25%', height: '25%' }}
              ></img>
            </div>
          ) : (
            <div>
              <Table
                bordered
                style={{ textAlign: 'center' }}
                className={styles.table_cart_item}
                dataSource={cartItems}
                columns={columns}
                rowKey="productName"
                footer={() => (
                  <div>
                    <h3>
                      <span>
                        Tổng tiền: <span style={{ color: 'red' }}> {VNDFormaterFunc(calculateTotal())}</span>
                      </span>
                    </h3>
                  </div>
                )}
              />
              <div style={{ textAlign: 'center' }}>
                <button
                  className={styles.buttonThanhToan}
                  onClick={() => {
                    navigate('/cart/checkout', {
                      state: {
                        totalPrice: calculateTotal(),
                        voucherPrice: voucherPrice,
                        disCountPercent: voucher.discountPercent,
                        totalQuantity: totalQuantity,
                      },
                    });
                  }}
                >
                  Tiến hành thanh toán
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CartItem;
