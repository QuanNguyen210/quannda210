import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import cartAPI from '~/api/cartAPI';
import MainLayout from '../../MainLayout';
import cartDetailAPI from '~/api/cartDetailAPI';
import { DeleteOutlined, DoubleRightOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import styles from './tableCart.module.scss';
import VNDFormaterFunc from '~/Utilities/VNDFormaterFunc';
import { message, notification } from 'antd';

function CartCustomer() {
  const [cartItems, setCartItems] = useState([]);
  const [cartId, setCartId] = useState('');
  const [cartId1, setCartId1] = useState('');
  const [cartDetailId, setCartDetailId] = useState('');
  const [amountProductDetail, setAmountProductDetail] = useState(0);

  const { cartId: routeCartId } = useParams();
  const navigate = useNavigate();
  const customerId = localStorage.getItem('customerId');

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await cartAPI.findByIdCustomer(customerId);
        const data = response.data;
        setCartItems(data);
        setCartId(customerId);
        setCartId1(data.cartId);
        setAmountProductDetail(data);
      } catch (error) {
        console.error('Error fetching product details:', error);
      }
    };

    fetchCart();
  }, [customerId]);
  console.log('cartDetail', cartItems);
  console.log('AmoutProduct', amountProductDetail);

  const handleDeleteCartItem = async (cartDetailId) => {
    console.log('cartDetalId', cartDetailId);
    try {
      await cartDetailAPI.delete(cartDetailId);
      // Sau khi xóa, cập nhật lại danh sách giỏ hàng bằng cách gọi lại API để lấy danh sách mới
      const response = await cartAPI.findByIdCustomer(customerId);
      const data = response.data;
      setCartItems(data);
    } catch (error) {
      console.error('Error deleting cart item:', error);
    }
  };

  const calculateTotalPrice = () => {
    let totalPrice = 0;

    if (cartItems?.cartDetailsList) {
      cartItems.cartDetailsList.forEach((item) => {
        totalPrice += item.amount * item.productDetails.retailPrice;
      });
    }

    return totalPrice;
  };

  const calculateTotalAmount = () => {
    let toltalAmount = 0;

    if (cartItems?.cartDetailsList) {
      cartItems.cartDetailsList.forEach((item) => {
        toltalAmount += item.amount;
      });
    }

    return toltalAmount;
  };
  console.log('calculateTotalAmount', calculateTotalAmount());
  const handleQuantityChange = async (e, cartItem) => {
    const newQuantity = parseInt(e.target.value, 10);
    const totalAmountProduct = amountProductDetail?.cartDetailsList[0]?.productDetails?.productDetailAmount;
    if (newQuantity > totalAmountProduct) {
      notification.error({
        message: 'Thất bại',
        description: 'Số lượng sản phẩm đã đạt giới hạn',
        duration: 3,
      });
      // Reset về số lượng ban đầu
      const updatedCartItems = cartItems.cartDetailsList.map((item) => {
        if (item.cartDetailId === cartItem.cartDetailId) {
          return { ...item, amount: cartItem.amount };
        }
        return item;
      });
      setCartItems({ ...cartItems, cartDetailsList: updatedCartItems });
      return;
    }
    const updatedCartItem = { ...cartItem, amount: newQuantity };
    try {
      await cartDetailAPI.update(cartItem.cartDetailId, { amount: newQuantity });
      const updatedCartItems = cartItems.cartDetailsList.map((item) => {
        if (item.cartDetailId === cartItem.cartDetailId) {
          return updatedCartItem;
        }
        return item;
      });
      setCartItems({ ...cartItems, cartDetailsList: updatedCartItems });
    } catch (error) {
      console.error('Error updating cart item:', error);
    }
  };

  const handleIncrement = async (cartItem) => {
    const newQuantity = cartItem.amount + 1;
    const toltalAmountProduct = amountProductDetail?.cartDetailsList[0]?.productDetails?.productDetailAmount;
    if (newQuantity > toltalAmountProduct) {
      notification.error({
        message: 'Thất bại',
        description: 'Số lượng sản phẩm đã đạt giới hạn',
        duration: 3,
      });
      return;
    }

    if (newQuantity > 20) {
      notification.error({
        message: 'Thất bại',
        description: 'Chỉ được mua tối đa 20 sản phẩm ',
        duration: 3,
      });
      return;
    }
    
    try {
      await updateCartItemQuantity(cartItem.cartDetailId, newQuantity);
    } catch (error) {
      console.error('Error updating cart item:', error);
    }
  };

  const handleDecrement = async (cartItem) => {
    if (cartItem.amount > 1) {
      const newQuantity = cartItem.amount - 1;

      try {
        await updateCartItemQuantity(cartItem.cartDetailId, newQuantity);
      } catch (error) {
        console.error('Error updating cart item:', error);
      }
    }
  };

  const updateCartItemQuantity = async (cartDetailId, newQuantity) => {
    try {
      await cartDetailAPI.updateAmount(cartDetailId, newQuantity);
      const response = await cartAPI.findByIdCustomer(customerId);
      const updatedCartItems = response.data;
      setCartItems(updatedCartItems);
    } catch (error) {
      console.error('Error updating cart item:', error);
    }
  };

  return (
    <MainLayout>
      {' '}
      <div className="" style={{ padding: '0 5% 0 5%', textAlign: 'center' }}>
        <h2 style={{ color: 'gray', textAlign: 'center' }}>Giỏ hàng của bạn</h2>
        <div style={{ textAlign: 'center' }}>
          <Link to={'/shop'} className={styles.continue_cart}>
            Tiếp tục mua sắm <DoubleRightOutlined />
          </Link>
        </div>

        {cartItems?.cartDetailsList?.length > 0 ? (
          <div>
            <table
              style={{ textAlign: 'center', width: '100%', borderCollapse: 'collapse', margin: 'auto', height: 'auto' }}
              className="table table-bordered"
            >
              <thead>
                <tr>
                  <th style={{ backgroundColor: 'white' }}>STT</th>
                  <th style={{ backgroundColor: 'white', width: '230px' }}>Ảnh</th>
                  <th style={{ backgroundColor: 'white', width: '530px' }}>Sản phẩm</th>
                  <th style={{ backgroundColor: 'white' }}>Số lượng</th>
                  <th style={{ backgroundColor: 'white' }}>Giá</th>
                  <th style={{ backgroundColor: 'white' }}>Thành tiền</th>
                  <th style={{ backgroundColor: 'white', width: '230px' }}>Chức năng</th>
                </tr>
              </thead>
              <tbody>
                {cartItems?.cartDetailsList?.map((item, index) => {
                  const totalPrice = item.amount * item.productDetails.retailPrice;
                  return (
                    <tr key={item.id} style={{ margin: 'auto', height: 'auto', backgroundColor: 'red' }}>
                      <td>
                        <div>{index + 1}</div>
                      </td>

                      <td>
                        <img
                          style={{ width: '200px', height: '200px' }}
                          src={item.productDetails.product.images[0]?.imgUrl}
                        />{' '}
                      </td>
                      <td style={{ textAlign: 'left', padding: '20px' }}>
                        <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
                          {item.productDetails.product.productName}-{item.productDetails.product.productCode}
                        </div>
                        <div style={{ fontSize: '20px' }}>
                          <span style={{ fontSize: '20px', fontWeight: 'bold' }}>Màu săc:</span>{' '}
                          {item.productDetails.color.colorName}
                        </div>{' '}
                        <div style={{ fontSize: '20px' }}>
                          <span style={{ fontSize: '20px', fontWeight: 'bold' }}>Chất liệu:</span>{' '}
                          {item.productDetails.material.materialName}
                        </div>{' '}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <div style={{ padding: '80px 0 0 90px' }}>
                          <div className={styles.book_number}>
                            <div className={styles.item_change1} onClick={() => handleDecrement(item)}>
                              <MinusOutlined />
                            </div>
                            <input
                              type="text"
                              disabled
                              className={styles.input_amount}
                              value={item.amount}
                              onChange={(e) => handleQuantityChange(e, item)}
                            />
                            <div className={styles.item_change2} onClick={() => handleIncrement(item)}>
                              <PlusOutlined />
                            </div>
                          </div>
                        </div>
                      </td>

                      <td>
                        <div style={{ margin: '80px 0 0 0' }}>{VNDFormaterFunc(item.productDetails.retailPrice)}</div>{' '}
                      </td>
                      <td>
                        <div style={{ margin: '80px 0 0 0' }}>{VNDFormaterFunc(totalPrice)}</div>{' '}
                      </td>
                      <td>
                        <button className={styles.buttonXoa} onClick={() => handleDeleteCartItem(item?.cartDetailId)}>
                          <DeleteOutlined /> Xóa
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div style={{ textAlign: 'center' }}>
              <h1
                style={{
                  border: 'black 1px dashed',
                  background: 'white',
                  color: 'red',
                  padding: '10px 0',
                }}
              >
                Tổng tiền: {VNDFormaterFunc(calculateTotalPrice())}
              </h1>
            </div>

            <div>
              <button
                className={styles.buttonThanhToan}
                onClick={() => {
                  navigate(`/cart/checkout/${customerId}`, {
                    state: {
                      totalPrice1: calculateTotalPrice(),
                      cartItems: cartItems.cartDetailsList,
                      totalAmount: calculateTotalAmount(),
                      infoCustomer: cartItems,
                      cartId: cartId1,
                    },
                  });
                }}
              >
                Tiến hành thanh toán
              </button>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h2 style={{ color: 'gray' }}>Bạn chưa có sản phẩm nào trong giỏ hàng..</h2>
            <img
              src="https://theme.hstatic.net/1000197303/1001046599/14/empty-cart-desktop.png?v=7097"
              style={{ width: '25%', height: '25%' }}
            ></img>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export default CartCustomer;
