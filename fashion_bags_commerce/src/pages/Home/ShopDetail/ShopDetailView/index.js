import { MinusOutlined, PlusOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { Carousel, Checkbox, notification } from 'antd';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import BeatLoader from 'react-spinners/ClipLoader';
import VNDFormaterFunc from '~/Utilities/VNDFormaterFunc';
import cartAPI from '~/api/cartAPI';
import cartDetailAPI from '~/api/cartDetailAPI';
import fullProductAPI from '~/api/client/fullProductAPI';
import styles from './shopDetail.module.scss';

function ShopDetailView() {
  const [quantity, setQuantity] = useState(1);
  const [totalQuantity, setTotalQuantity] = useState(0);

  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [dataDetail, setDataDetail] = useState(null);
  const [temporaryCart, setTemporaryCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isProductInCart1, setIsProductInCart] = useState(false);

  const [materialOptions, setMaterialOptions] = useState([]);
  const [defaultMaterial, setDefaultMaterial] = useState(null);

  const customerId = localStorage.getItem('customerId');
  const [customeId, setCustomerId] = useState('');
  const [cartId1, setCartId] = useState('');
  const [cartItems, setCartItems] = useState([]);
  const [cartDetailId, setCartDetailId] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await cartAPI.findByIdCustomer(customerId);
        const data = response.data;
        setCustomerId(customerId);
        setCartId(data.cartId);
        setCartItems(data);

        setCartDetailId(data?.cartDetailsList?.productDetails?.productDetailId);
      } catch (error) {
        console.error('Error fetching product details:', error);
      }
    };

    fetchCart();
  }, [customerId]);
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

  // const calculateTotal = () => {
  //   return cartItems.reduce((total, item) => {
  //     return total + item.quantity * item.retailPrice;
  //   }, 0);
  // };

  // useEffect(() => {
  //   const total = cartItems.reduce((totalQty, item) => {
  //     return totalQty + item.quantity;
  //   }, 0);
  //   setTotalQuantity(total);
  // }, [cartItems]);

  const fetchProductDetail = async () => {
    try {
      const response = await fullProductAPI.findById(productId);
      const data = response.data;
      setProduct(data);
      setDataDetail(data?.productDetails[0]);
      setLoading(false); // Set loading to false after updating details
    } catch (error) {
      setLoading(false); // Handle errors and set loading to false
      console.error('Error fetching product details:', error);
    }
  };

  useEffect(() => {
    fetchProductDetail();
  }, [productId]);

  useEffect(() => {
    setLoading(false);
    setTimeout(() => {
      setLoading(false);
    }, 5000);
  }, []);

  const addToCart = async (updateQuantityCallback) => {
    const amountInDatabase = dataDetail.amount;

    const productToAdd = {
      productDetails: {
        productDetailId: dataDetail.productDetailId,
      },
      carts: {
        cartId: cartId1,
      },
      amount: quantity,
    };

    try {
      if (!productToAdd.carts?.cartId) {
        console.error('CartId không tồn tại');
        return;
      }

      if (quantity > amountInDatabase) {
        notification.error({
          message: 'Thất bại',
          description: 'Số lượng sản phẩm trong kho không đủ',
          duration: 3,
        });
        return;
      }

      const response = await cartDetailAPI.save(productToAdd);
      setQuantity(1);
      setIsProductInCart(true);
      if (updateQuantityCallback) {
        updateQuantityCallback(quantity);
      }

      notification.success({
        message: 'Thành công',
        description: 'Sản phẩm đã được thêm vào giỏ hàng',
        duration: 3,
      });
      // window.location.reload();
    } catch (error) {
      console.error('Error adding product to cart:', error);
      notification.error({
        message: 'Lỗi',
        description: 'Đã xảy ra lỗi khi thêm sản phẩm vào giỏ hàng',
        duration: 3,
      });
      setLoading(false);
    }
  };

  const renderAddToCartButtonDB = () => {
    if (!dataDetail || !cartItems || !cartItems.cartDetailsList) {
      return null;
    }

    const isProductInCart = cartItems.cartDetailsList.some(
      (item) => item.productDetails.productDetailId === dataDetail.productDetailId,
    );

    if (!dataDetail || dataDetail.amount === 0) {
      return (
        <div
          className={styles.button_buy_now_disabled}
          style={{
            color: 'gray',
            fontSize: '25px',
            background: 'lightgray',
            padding: '5px 10px',
            textAlign: 'center',
          }}
          onChange={() => setLoading(true)}
        >
          Hết hàng
        </div>
      );
    } else if (isProductInCart) {
      return (
        <div
          className={styles.button_buy_now_disabled}
          style={{
            color: 'gray',
            fontSize: '25px',
            background: 'lightgray',
            padding: '5px 10px',
            textAlign: 'center',
          }}
          onChange={() => setLoading(true)}
        >
          <ShoppingCartOutlined />
          Sản phẩm đã có trong giỏ hàng
        </div>
      );
    } else {
      return (
        <div>
          <Link to={`/cart/${cartId1}`}>
            <div
              className={styles.button_buy_now}
              onClick={() => {
                addToCart();
              }}
            >
              <ShoppingCartOutlined />
              Thêm vào giỏ hàng
            </div>
          </Link>

          {/* <Link to={`/cart/checkout/${customeId}`}>
            <div
              className={styles.button_buy_now1}
              onClick={() => {
                addToCart();
              }}
              onChange={() => setLoading(true)}
            >
              Mua ngay
            </div>
          </Link> */}

          {/* <div
            className={styles.button_buy_now1}
            onClick={() => {
              addToCart();
              navigate(`/cart/checkout/${customerId}`, {
                state: {
                  totalPrice1: calculateTotalPrice(),
                  cartItems: cartItems.cartDetailsList,
                  totalAmount: calculateTotalAmount(),
                  infoCustomer: cartItems,
                },
              });
            }}
          >
            Mua ngay
          </div> */}
        </div>
      );
    }
  };

  const renderAddToCartButton = () => {
    if (!dataDetail) {
      return null;
    }

    const storedCart = localStorage.getItem('temporaryCart');
    const parsedCart = storedCart ? JSON.parse(storedCart) : [];
    const productDetailIdToAdd = dataDetail ? dataDetail.productDetailId : null;

    const isProductInCart = parsedCart.some((item) => item.productDetailId === productDetailIdToAdd);

    if (!dataDetail || dataDetail.amount === 0) {
      return (
        <div
          className={styles.button_buy_now_disabled}
          style={{
            color: 'gray',
            fontSize: '25px',
            background: 'lightgray',
            padding: '5px 10px',
            textAlign: 'center',
          }}
        >
          Hết hàng
        </div>
      );
    } else {
      if (isProductInCart) {
        return (
          <div
            className={styles.button_buy_now_disabled}
            style={{
              color: 'gray',
              fontSize: '25px',
              background: 'lightgray',
              padding: '5px 10px',
              textAlign: 'center',
            }}
          >
            <ShoppingCartOutlined />
            Sản phẩm đã có trong giỏ hàng
          </div>
        );
      } else {
        return (
          <div>
            <Link to="/cart">
              <div className={styles.button_buy_now} onClick={() => addToTemporaryCart(product)}>
                <ShoppingCartOutlined />
                Thêm vào giỏ hàng
              </div>
            </Link>

            {/* <div
                   className={styles.button_buy_now}
                  onClick={() => {
                    navigate('/cart/checkout', {
                      state: {
                        // totalPrice: calculateTotal(),
                        // voucherPrice: voucherPrice,
                        // disCountPercent: voucher.discountPercent,
                        totalQuantity: totalQuantity,
                      },
                    });
                  }}
                >
                  Mua ngay
                </div> */}
          </div>
        );
      }
    }
  };

  const addToTemporaryCart = async (product) => {
    try {
      const amountInDatabase = dataDetail.amount;

      if (quantity <= amountInDatabase) {
        const productToAdd = {
          productId: product.productId,
          productDetailId: dataDetail.productDetailId,
          image: product.img.imgUrl,
          productName: product.productName,
          productCode: product.productCode,
          colorName: selectedColor,
          materialName: selectedMaterial,
          brandName: product.brandName,
          quantity: quantity,
          retailPrice: dataDetail.retailPrice,
          amount: dataDetail.amount,
        };

        const storedCart = localStorage.getItem('temporaryCart');
        let updatedTemporaryCart = storedCart ? JSON.parse(storedCart) : [];

        console.log('San pham trong gio hang', storedCart);
        console.log('San pham trong gio hang', updatedTemporaryCart);
        // if (storedCart) {
        const existingProductIndex = updatedTemporaryCart.findIndex(
          (item) =>
            item.productName === productToAdd.productName &&
            item.colorName === productToAdd.colorName &&
            item.materialName === productToAdd.materialName, // Thêm các điều kiện cần thiết để xác định sản phẩm (có thể sửa lại tùy theo cấu trúc dữ liệu của bạn)
        );

        if (existingProductIndex !== -1) {
          // Nếu sản phẩm đã tồn tại, cập nhật số lượng
          updatedTemporaryCart[existingProductIndex].quantity += quantity;
        } else {
          updatedTemporaryCart.push(productToAdd);
        }
        localStorage.setItem('temporaryCart', JSON.stringify(updatedTemporaryCart));
        setTemporaryCart(updatedTemporaryCart);
        notification.success({
          message: 'Thành công',
          description: 'Bạn đã thêm sản phẩm vào giỏ hàng',
          duration: 1,
        });
        // }
      } else {
        notification.error({
          message: 'Thất bại',
          description: 'Số lượng sản phẩm không hợp lệ',
          duration: 1,
        });
      }
    } catch (error) {
      console.error('Error adding product to cart:', error);
    }
  };

  const handleInputChange = (event) => {
    let newValue = event.target.value.replace(/\D/g, ''); // Only allowing digits

    if (newValue === '') {
      setQuantity(''); // Set the state to an empty string if the input is cleared
    } else {
      newValue = newValue > 20 ? '20' : newValue; // Limiting input to 20
      setQuantity(parseInt(newValue, 10)); // Setting the parsed integer value
    }
  };

  const handleInputBlur = () => {
    if (quantity === '' || quantity === 0) {
      setQuantity(1); // If the input is empty on blur, set it to '1'
    }
  };

  const handleIncrement = () => {
    // Tăng giá trị quantity khi nhấn nút '+'
    const amountInDatabase = dataDetail.amount; // Số lượng tồn kho trong cơ sở dữ liệu
    if (quantity + 1 > amountInDatabase) {
      // Hiển thị thông báo khi số lượng vượt quá số lượng trong kho
      notification.error({
        message: 'Thất bại',
        description: 'Sản phẩm đã đạt giới hạn tối đa',
        duration: 1,
      });
    } else if (quantity + 1 > 20) {
      notification.error({
        message: 'Thất bại',
        description: 'Chỉ được mua tối đa 20 sản phẩm',
        duration: 1,
      });
    } else {
      // Tăng giá trị quantity khi số lượng không vượt quá số lượng trong kho
      setQuantity(quantity + 1);
    }
  };

  const handleDecrement = () => {
    // Giảm giá trị quantity khi nhấn nút '-'
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  useEffect(() => {
    // Thiết lập mặc định cho màu sắc và chất liệu
    if (product && product.productDetails) {
      const uniqueColors = [...new Set(product.productDetails.map((detail) => detail.colorName))];
      const defaultColor = uniqueColors[0]; // Lấy màu sắc đầu tiên

      setSelectedColor(defaultColor);
      setMaterialOptions(getMaterialOptionsForColor(defaultColor));

      // Thiết lập mặc định cho chất liệu
      const defaultMaterialOptions = getMaterialOptionsForColor(defaultColor);
      if (defaultMaterialOptions.length > 0) {
        setSelectedMaterial(defaultMaterialOptions[0]); // Chọn chất liệu đầu tiên nếu có
      }
    }
  }, [product]);

  const getMaterialOptionsForColor = (color) => {
    if (product && product.productDetails) {
      return product.productDetails.filter((detail) => detail.colorName === color).map((detail) => detail.materialName);
    }
    return [];
  };

  const handleColorChange = (color) => {
    setSelectedColor(color);
    setSelectedMaterial(null);
    setMaterialOptions(getMaterialOptionsForColor(color));
    const selectedColorDetail = product.productDetails.find((detail) => detail.colorName === color);
    setDataDetail(selectedColorDetail);
  };

  const renderColor = () => {
    if (!product || !product.productDetails) {
      return null;
    }

    const uniqueColors = [...new Set(product.productDetails.map((variant) => variant.colorName))];

    return uniqueColors.map((color, index) => (
      <div key={index} className={styles.colorVariant}>
        <Checkbox
          checked={selectedColor === color}
          onChange={() => handleColorChange(color)}
          style={{ border: 'green 1px solid', padding: '10px', margin: '0 10px' }}
        >
          {color}
        </Checkbox>
      </div>
    ));
  };

  const handleMaterialChange = (material) => {
    setSelectedMaterial(material);

    // Update dataDetail to reflect the details of the selected material and color
    const selectedMaterialDetail = product.productDetails.find(
      (detail) => detail.colorName === selectedColor && detail.materialName === material,
    );
    setDataDetail(selectedMaterialDetail);
  };

  const renderMaterial = () => {
    if (!selectedColor || !materialOptions.length) {
      return null;
    }

    // Render danh sách chất liệu và tick vào checkbox chất liệu đầu tiên nếu có
    return materialOptions.map((material, index) => (
      <div key={index} className={styles.variant}>
        <Checkbox
          checked={selectedMaterial === material}
          onChange={() => handleMaterialChange(material)}
          style={{ border: 'green 1px solid', padding: '10px', margin: '0 10px' }}
        >
          {material}
        </Checkbox>
      </div>
    ));
  };
  useEffect(() => {
    if (selectedColor && materialOptions.length > 0) {
      const defaultMaterialForColor = getMaterialOptionsForColor(selectedColor)[0];
      setDefaultMaterial(defaultMaterialForColor);
      setSelectedMaterial(defaultMaterialForColor);
    }
  }, [selectedColor, materialOptions]);

  if (!product) {
    return (
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <BeatLoader color="#d64336" loading={true} size={50} />
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="detail-product" style={{ margin: '0% 5% 0px 5%' }}>
      <div className="container">
        <div className="row custom-row">
          <div className="col-xl-7 col-lg-7 col-md-12 col-sm-12 col-xs-12">
            <div className={styles.group_images}>
              {/* <div className={styles.image_main}>
                <Image src={product.img ? product.img.imgUrl : ''} style={{ width: '700px', height: '450px' }}></Image>
              </div> */}
              <Carousel autoplay={true} autoplaySpeed={1200} draggable={true}>
                {product.imgs &&
                  product.imgs.length > 0 &&
                  product.imgs.map((image, index) => (
                    <img key={index} src={image.imgUrl} className={styles.image_main} />
                  ))}
              </Carousel>

              <br></br>
              <div className={styles.content_product_pc}>
                <div className={styles.group_content_product}>
                  <ul className={styles.head}>
                    <li className={styles.active}>
                      <h2>Thông tin chi tiết</h2>
                    </li>
                  </ul>
                  <div className={styles.body}>
                    <div className={styles.body_ct}>
                      <ul className="list-oppr">
                        <li className={styles.productDetailItem}>
                          <span className={styles.label}>Thương hiệu: </span>
                          <span className={styles.labelName}>{product.brandName}</span>
                        </li>
                        <hr></hr>
                        <li className={styles.productDetailItem}>
                          <span className={styles.label}>Mã sản phẩm: </span>
                          <span className={styles.labelName}>{product.productCode}</span>
                        </li>
                        <hr></hr>
                        <li className={styles.productDetailItem}>
                          <span className={styles.label}>Loại sản phẩm: </span>
                          <span className={styles.labelName}>{dataDetail ? dataDetail.typeName : 'NUll'}</span>
                        </li>
                        <hr></hr>
                        <li className={styles.productDetailItem}>
                          <span className={styles.label}>Màu sắc: </span>
                          <span className={styles.labelName}>{dataDetail ? dataDetail.colorName : 'NULL'}</span>
                        </li>
                        <hr></hr>
                        <li className={styles.productDetailItem}>
                          <span className={styles.label}>Chất liệu: </span>
                          <span className={styles.labelName}>{dataDetail ? dataDetail.materialName : 'NULL'}</span>
                        </li>
                        <hr></hr>
                        <li className={styles.productDetailItem}>
                          <span className={styles.label}>Kích thước (dài x rộng x cao): </span>

                          <span className={styles.labelName}>
                            {product.productDetails &&
                              product.productDetails.length > 0 &&
                              `${dataDetail.sizeLength}cm x ${dataDetail.sizeWidth}cm x${dataDetail.sizeHeight}cm`}
                          </span>
                        </li>
                        <hr></hr>

                        <li className={styles.productDetailItem}>
                          <span className={styles.label}>Kiểu khóa: </span>
                          <span className={styles.labelName}>{dataDetail ? dataDetail.buckleTypeName : 'NULL'}</span>
                        </li>
                        <hr></hr>
                        <li className={styles.productDetailItem}>
                          <span className={styles.label}>Số ngăn: </span>
                          <span className={styles.labelName}>{dataDetail ? dataDetail.compartmentName : 'NULL'}</span>
                        </li>

                        <hr></hr>
                        <li className={styles.productDetailItem}>
                          <span className={styles.label}>Phù hợp sử dụng: </span>
                          <span className={styles.labelName}>{dataDetail ? dataDetail.describe : 'NULL'}</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-5 col-lg-5 col-md-12 col-sm-12 col-xs-12 fix-product">
            <div className="product-info">
              <h1 className={styles.title_product}>
                {product.productName}-{product.productCode}-{product.brandName}
              </h1>
              <span>
                <h4 className={styles.price}>{dataDetail ? VNDFormaterFunc(dataDetail.retailPrice) : 'NULL'}</h4>
              </span>
              <div className={styles.group_color}>
                <div className={styles.variant}>
                  <p style={{ fontSize: '14pt', float: 'left', padding: '5px 15px 0 0' }}>Màu sắc: </p>
                  {renderColor()}
                </div>
                <br></br>
                <div className={styles.variant}>
                  <p style={{ fontSize: '14pt', float: 'left', padding: '5px 15px 0 0' }}>Chất liệu: </p>
                  {renderMaterial()}
                </div>
              </div>
              <div className={styles.amount}>
                <h3 style={{ fontStyle: 'italic', fontSize: '16pt' }}>
                  Có sẵn: <span style={{ color: 'red' }}>{dataDetail ? dataDetail.amount : 'NULL'}</span> sản phẩm
                </h3>

                <div className={styles.title_attr}>
                  <div className={styles.book_number}>
                    <div className={styles.item_change1} onClick={handleDecrement}>
                      <MinusOutlined />
                    </div>
                    <input
                      className={styles.input_amount}
                      type="text"
                      value={quantity === '' ? '' : parseInt(quantity, 10)} // Ensure empty string or parse as an integer
                      onChange={handleInputChange}
                      onBlur={handleInputBlur}
                      min={1}
                    />

                    <div className={styles.item_change2} onClick={handleIncrement}>
                      <PlusOutlined />
                    </div>
                  </div>
                </div>
              </div>

              <br></br>

              {customerId == null ? <div>{renderAddToCartButton()}</div> : <div>{renderAddToCartButtonDB()}</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShopDetailView;
