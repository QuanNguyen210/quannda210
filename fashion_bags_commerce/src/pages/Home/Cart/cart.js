import { DoubleRightOutlined, RightOutlined } from '@ant-design/icons';
import { Fragment, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../MainLayout';
import CartCustomer from './CartCustomer/CartCustomer';
import CartItem from './CartItem/cartItem';
import styles from './cart.module.scss';

function CartView() {
  const [cartItems, setCartItems] = useState([]);
  const [cartDb, setCartDb] = useState([]);
  const customerId = localStorage.getItem('customerId');

  useEffect(() => {
    const storedCart = localStorage.getItem('temporaryCart');
    if (storedCart) {
      const parsedCart = JSON.parse(storedCart);
      setCartItems(parsedCart);
    }
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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

  const steps = ['Trang chủ', 'Giỏ hàng'];
  return (
    <div>
      {customerId == null ? (
        <MainLayout>
          <CartItem />
        </MainLayout>
      ) : (
        <MainLayout>
          <CartCustomer />
        </MainLayout>
      )}
    </div>
  );
}

export default CartView;
