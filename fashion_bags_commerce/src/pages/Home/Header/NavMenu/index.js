import { Avatar, Badge, Button, Card, Input, Menu, message } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styles from './index.module.scss';
import { useEffect, useState } from 'react';
import { SearchOutlined, ShoppingCartOutlined, UserOutlined } from '@ant-design/icons';
import cartAPI from '~/api/cartAPI';
import fullProductAPI from '~/api/client/fullProductAPI';
import UserProfile from '../MainHeader/UserProfile';
import { getCustomer } from '~/api/auth/helper/UserCurrent';
import Meta from 'antd/es/card/Meta';

function NavMenu() {
  const location = useLocation();
  const [selectedKeys, setSelectedKeys] = useState([]);

  const [cartCount, setCartCount] = useState(0); // Mặc định là 0
  const [cartCountInDb, setCartCountInDb] = useState(0); // Mặc định là 0
  const [searchKeyword, setSearchKeyword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Đặt mặc định là false khi chưa đăng nhập
  const [customerId, setCustomerId] = useState(null);
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const customer = localStorage.getItem('customerId');

  const [cartItems, setCartItems] = useState([]);

  const calculateTotalAmountInCart = () => {
    let totalCountInCart = 0;

    if (cartItems?.cartDetailsList) {
      totalCountInCart = cartItems?.cartDetailsList.reduce((acc, item) => {
        console.log('item:', item);
        if (item.amount !== undefined) {
          console.log('item.quantity:', item.amount);
          return acc + item.amount;
        } else {
          console.log('Item quantity is undefined or null');
          return acc;
        }
      }, 0);
    }

    return totalCountInCart;
  };
  // Fetch dữ liệu giỏ hàng khi customer thay đổi
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await cartAPI.findByIdCustomer(customer);
        const data = response.data;
        setCartItems(data);
        console.log('dataa', data);
      } catch (error) {
        console.error('Error fetching product details:', error);
      }
    };

    if (customer !== null) {
      fetchCart();
    }
  }, [customer]);

  // Cập nhật cartCountInDb khi cartItems thay đổi
  useEffect(() => {
    console.log('cartItems:', cartItems); // Log để kiểm tra dữ liệu trong cartItems
    const totalCountInDb = calculateTotalAmountInCart();
    console.log('totalCountInDb:', totalCountInDb); // Log để kiểm tra tổng số lượng tính được
    setCartCountInDb(totalCountInDb);
  }, [cartItems]);

  useEffect(() => {
    // Lấy số lượng sản phẩm trong giỏ hàng từ local storage hoặc API
    const storedCart = localStorage.getItem('temporaryCart');
    const parsedCart = storedCart ? JSON.parse(storedCart) : [];
    const totalCount = parsedCart.reduce((acc, item) => acc + item.quantity, 0);
    setCartCount(totalCount);

    const customerTokenString = localStorage.getItem('customerDecodeString');
    if (customerTokenString) {
      setIsLoggedIn(true);
    }
  }, []);

  const changeLoggedIn = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('customerDecodeString');
    localStorage.removeItem('customerId');
    localStorage.removeItem('customerToken');
    localStorage.removeItem('temporaryCart');
    navigate('/');
    messageApi.open({
      type: 'success',
      content: 'Đăng xuất thành công',
    });
  };

  const handleSearch = () => {
    fullProductAPI
      .searchByKeyword(searchKeyword)
      .then((response) => {
        console.log('Data from API:', response.data);
        // Xử lý dữ liệu và cập nhật state hoặc hiển thị dữ liệu ở đây
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  };

  const handleInputChange = (event) => {
    setSearchKeyword(event.target.value);
  };

  const handleEnterKeyPress = (event) => {
    if (event.key === 'Enter') {
      // event.preventDefault();
      handleSearch();
      if (location?.pathname !== '/search') {
        console.log('111111111111111');
        navigate('/search', {
          state: {
            keyword: searchKeyword,
          },
        });
      }
    }
  };
  const createCartForCustomer = async (customerId) => {
    try {
      const response = await cartAPI.save({ customerId });
      console.log('Created cart for the customer:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating cart:', error);
      throw new Error('Failed to create cart');
    }
  };

  const handleLogin = async () => {
    try {
      const loggedInCustomerId = localStorage.getItem('customerId');

      if (loggedInCustomerId) {
        setCustomerId(loggedInCustomerId);
        await createCartForCustomer(loggedInCustomerId);
        setIsLoggedIn(true);
      } else {
        // Handle the case when customerId is not available
      }
    } catch (error) {
      console.error('Error during login:', error);
      // Handle the error as needed
    }
  };

  useEffect(() => {
    setSelectedKeys([location.pathname]);
  }, [location.pathname]);
  const handleMenuClick = ({ key }) => {
    setSelectedKeys([key]);
  };

  ///////////////////////

  const [showMenu, setShowMenu] = useState(true);

  useEffect(() => {
    let lastScrollTop = 0;

    const handleScroll = () => {
      let currentScroll = window.pageYOffset || document.documentElement.scrollTop;

      if (currentScroll > lastScrollTop) {
        // Cuộn chuột xuống
        setShowMenu(false);
      } else {
        // Cuộn chuột lên
        setShowMenu(true);
      }
      lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className={styles.navContent} style={{ display: showMenu ? 'block' : 'none' }}>
      <div className={styles.centeredMenu}>
        <Menu className={styles.menu} mode="horizontal" selectedKeys={selectedKeys} onClick={handleMenuClick}>
          <div style={{ float: 'left' }}>
            <Link to={'/'}>
              <img
                style={{ width: '200px', height: '75px' }}
                src="https://firebasestorage.googleapis.com/v0/b/bagsgirl-datn.appspot.com/o/Image%2Flogo.png?alt=media&token=5eac10cf-5998-459a-90ab-9ae86c0c631e"
              ></img>
            </Link>
          </div>
          <div style={{ justifyContent: 'center' }}>
            <Menu.Item key="/" style={{ color: 'black' }} className={styles.menuItem}>
              <Link to="/" className={styles.submenu}>
                Trang chủ
              </Link>
            </Menu.Item>
            <Menu.Item key="/gioi-thieu" style={{ color: 'black' }} className={styles.menuItem}>
              <Link to="/gioi-thieu" className={styles.submenu}>
                Giới thiệu
              </Link>
            </Menu.Item>
            <Menu.Item key="/shop" style={{ color: 'black' }} className={styles.menuItem}>
              <Link to="/shop" className={styles.submenu}>
                Sản phẩm
              </Link>
            </Menu.Item>
            <Menu.Item key="/blog" style={{ color: 'black' }} className={styles.menuItem}>
              <Link to="/blog" className={styles.submenu}>
                Blog
              </Link>
            </Menu.Item>
            <Menu.Item key="" style={{ color: 'black' }} className={styles.menuItem}>
              <Link to="" className={styles.submenu}>
                Liên hệ
              </Link>
            </Menu.Item>
          </div>

          <div style={{ width: '470px', display: 'flex', float: 'left' }}>
            {/* <Input
              style={{
                width: '440px',
                height: '40px',
                padding: '0 0 0 10px',
                borderRadius: '32px',
                border: '1px solid gray',
                background: 'white',
              }}
              onChange={handleSearch}
              placeholde
              r="Tìm kiếm sản phẩm..."
            /> */}
  <Link className={styles.iconSearch}  to='/search'>
  <SearchOutlined  />
  </Link>
          </div>

          <div style={{ float: 'right' }}>
            <div className={styles.toolRight}>
              <div style={{ marginTop: '5px' }}>{/* <SearchOutlined className={styles.icon} /> */}</div>
              <div className={styles.profile}>
                {customer !== null ? (
                  <div class={styles.userProfileScss}>
                    <div style={{ marginTop: '20px', float: 'left' }}>
                      {/* <SearchOutlined className={styles.iconSearch} /> */}
                    </div>
                    <div style={{ marginTop: '12px', float: 'left' }}>
                      <UserProfile changeLoggedIn={changeLoggedIn} className={styles.iconUser} />
                    </div>
                    <div style={{ marginTop: '20px', float: 'left' }}>
                      <Link to={`/cart/${customer}`}>
                        <Badge className="cartBadge" count={cartCountInDb}>
                          <ShoppingCartOutlined className={styles.iconCartUser} />
                        </Badge>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className={styles.login}>
                    {/* <SearchOutlined className={styles.icon} /> */}
                    <div style={{ marginTop: '7px', float: 'left' }}>
                      <ul className={styles.horizontalLogin}>
                        <li>
                          <Link to={'/login'} onClick={() => handleLogin(customerId)}>
                            ĐĂNG NHẬP
                          </Link>
                        </li>
                        <span> / </span>
                        <li>
                          <Link to={'/signup'}>ĐĂNG KÝ</Link>
                        </li>
                      </ul>
                    </div>
                    <div className={styles.cart}>
                      <Link to="/cart">
                        <Badge className={styles.cartBadge} count={cartCount}>
                          <ShoppingCartOutlined className={styles.cartIcon} />
                        </Badge>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Menu>
      </div>
    </div>
  );
}

export default NavMenu;
