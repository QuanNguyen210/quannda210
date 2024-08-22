import React, { useState, useEffect, Fragment, useRef } from 'react';
import customerAPI from '~/api/customerAPI';
import axios from 'axios';
import { Radio, notification } from 'antd';
import { faL } from '@fortawesome/free-solid-svg-icons';
import { getCustomer } from '~/api/auth/helper/UserCurrent';
import './InformationCustomer.scss';
import { EditOutlined, FontSizeOutlined, RollbackOutlined } from '@ant-design/icons';

function AddressCustomer() {
  const [customerInfo, setCustomerInfo] = useState(null);
  const host = 'https://provinces.open-api.vn/api/';
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedWard, setSelectedWard] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [gender, setGender] = useState('');
  const [birthDay, setBirthDay] = useState('');

  const [address, setAddress] = useState('');
  const [fullAddress, setFullAddress] = useState('');
  const [displayUpdateAddress, setDisplayUpdateAddress] = useState(false);
  const [displayInfoAddress, setDisplayInfoAddress] = useState(true);

  const customer = getCustomer();

  useEffect(() => {
    customerAPI
      .getOne(customer.customerId)
      .then((response) => {
        const data = response.data;
        console.log(data);

        setCustomerInfo(data);
        setFullName(data.users.fullName || '');
        setPhoneNumber(data.users.phoneNumber || '');
        setAddress(data.users.address || '');
        setBirthDay(data.users.birthDay || '');
        setGender(data.users.gender || '');
      })
      .catch((error) => {
        console.error('Error fetching customer data:', error);
      });
  }, []);

  const handleConfirmation = async () => {
    if (!fullName || !phoneNumber || !selectedProvince || !selectedDistrict || !selectedWard || !address) {
      notification.error({
        message: 'Lỗi',
        description: 'Vui lòng nhập đầy đủ thông tin',
        duration: 2,
      });

      return;
    }
    const getNameFromCode = (code, list) => {
      const selectedItem = list.find((item) => item.code === +code);
      return selectedItem ? selectedItem.name : '';
    };
    const selectedProvinceName = getNameFromCode(selectedProvince, provinces);
    const selectedDistrictName = getNameFromCode(selectedDistrict, districts);
    const selectedWardName = getNameFromCode(selectedWard, wards);

    const fullAddressText = `- ${selectedWardName} - ${selectedDistrictName} - ${selectedProvinceName}`;
    setFullAddress(fullAddress);

    const updateFunction = async () => {
      const user = customer?.users;
      const updatedFields = {
        fullName: fullName,
        address: address + selectedWardName + selectedDistrictName + selectedProvinceName,
        gender: gender,
        birthDay: birthDay,
        phoneNumber: phoneNumber,
      };
      const filteredFields = Object.keys(updatedFields).reduce((acc, key) => {
        if (updatedFields[key] !== user[key]) {
          acc[key] = updatedFields[key];
        }
        return acc;
      }, {});

      const update = {
        customerId: customer.customerId,
        customerCode: customer.customerCode,
        customerRanking: customer.customerRanking,
        rankingPoints: customer.rankingPoints,
        customerStatus: customer.customerStatus,
        consumePoints: 0,

        users: {
          userId: user.userId,
          fullName: user.fullName,
          password: user.password,
          email: user.email,
          ...filteredFields,
          phoneNumber: user.phoneNumber,
          account: user.account,
          gender: user.gender,
          address: address + fullAddressText,

          role: 'ROLE_CUSTOMER',
        },
      };

      try {
        console.log(update);
        await customerAPI.updateNotPassword(update);

        notification.success({
          message: 'Update thành công',
          description: 'Dữ liệu đã được cập nhật thành công',
          duration: 2,
        });
        const updatedCustomerInfo = await customerAPI.getOne(customer.customerId);
        setCustomerInfo(updatedCustomerInfo.data);
        setDisplayUpdateAddress(false);
        setDisplayInfoAddress(true); // Display information after successful update
      } catch (error) {
        notification.error({
          message: 'Lỗi',
          description: 'Vui lòng nhập lại thông tin địa chỉ cụ thể',
          duration: 2,
        });
        console.error(error);
        setDisplayInfoAddress(false);
        setDisplayInfoAddress(true);
      }
    };
    updateFunction();
  };

  useEffect(() => {
    axios
      .get(`${host}?depth=1`)
      .then((response) => {
        setProvinces(response.data);
      })
      .catch((error) => {
        console.error('Error fetching provinces:', error);
      });
  }, []);

  const handleProvinceChange = (event) => {
    const provinceName = event.target.value;
    console.log('tinh', provinceName);
    setSelectedProvince(provinceName);
    setSelectedDistrict('');
    setSelectedWard('');

    axios
      .get(`${host}p/${provinceName}?depth=2`)
      .then((response) => {
        setDistricts(response.data.districts);
      })
      .catch((error) => {
        console.error('Error fetching districts:', error);
      });
  };

  const handleDistrictChange = (event) => {
    const districtCode = event.target.value;
    console.log('huyen', districtCode);
    setSelectedDistrict(districtCode);
    setSelectedWard('');

    axios
      .get(`${host}d/${districtCode}?depth=2`)
      .then((response) => {
        setWards(response.data.wards);
      })
      .catch((error) => {
        console.error('Error fetching wards:', error);
      });
  };

  const handleWardChange = (event) => {
    const wardCode = event.target.value;
    console.log('xa', wardCode);

    setSelectedWard(wardCode);
  };

  return (
    <div>
      {customerInfo && displayInfoAddress && (
        <div>
          <div>
            <h5 style={{ textAlign: 'center' }}>THÔNG TIN CÁ NHÂN CỦA BẠN</h5>
          </div>
          <div className="thongTinKhachHang">
            <p style={{ fontSize: '15px' }}>
              <span style={{ fontSize: '17px', fontWeight: 'bold' }}>Họ và tên:</span> {customerInfo.users.fullName}
            </p>
            <p style={{ fontSize: '15px' }}>
              <span style={{ fontSize: '17px', fontWeight: 'bold' }}>Số điện thoại:</span>{' '}
              {customerInfo.users.phoneNumber}
            </p>
            <p style={{ fontSize: '15px' }}>
              <span style={{ fontSize: '17px', fontWeight: 'bold' }}>Email:</span> {customer.users.email}
            </p>
            {/* <p style={{ fontSize: '15px' }}>
              <span style={{ fontSize: '17px', fontWeight: 'bold' }}>Ngày sinh:</span> {customerInfo.users.birthDay}
            </p> */}
            <p style={{ fontSize: '15px' }}>
              <span style={{ fontSize: '17px', fontWeight: 'bold' }}>Địa chỉ:</span> {customerInfo.users.address}
            </p>

            <div
              onClick={() => {
                setDisplayUpdateAddress(true);
                setDisplayInfoAddress(false);
                setAddress(customerInfo.users.address);
                setFullName(customerInfo.users.fullName);
                setPhoneNumber(customerInfo.users.phoneNumber);
              }}
              className="changleAddress"
              style={{
                width: '100%',
                background: 'gold',
                padding: '20px 20px',
                margin: '30px 0 0 0',
                cursor: 'pointer',
                color: 'white',
                textAlign: 'center',
                transition: 'background 0.3s',
              }}
            >
              <EditOutlined /> Thay đổi
            </div>
          </div>
        </div>
      )}

      {displayUpdateAddress && (
        <div>
          <h5 style={{ textAlign: 'center' }}>CẬP NHẬT THÔNG TIN CÁ NHÂN CỦA BẠN</h5>
          <div className="infor-custom">
            <div className="infor-custom-container">
              <div className="infor-custom-lable-name">
                Họ tên<span style={{ color: '#ff0000', fontWeight: 'bold' }}> * </span>
              </div>
              <div className="infor-custom-input">
                <input
                  className="infor-custom-input-item"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)} // Handle changes to fullName
                  placeholder="Họ và tên"
                  required
                />
              </div>
            </div>

            <div className="infor-custom-container">
              <div className="infor-custom-lable-name">
                Số điện thoại<span style={{ color: '#ff0000', fontWeight: 'bold' }}> * </span>
              </div>
              <div className="infor-custom-input">
                <input
                  className="infor-custom-input-item"
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Số điện thoại"
                  pattern="(?:\+84|0)(?:\d){9,10}$"
                  title="vui lòng nhập số điện thoại hợp lệ"
                  required
                />
              </div>
            </div>

            {/* <div className="infor-custom-container">
              <div className="infor-custom-lable-name">
                Ngày sinh<span style={{ color: '#ff0000', fontWeight: 'bold' }}> * </span>
              </div>
              <div className="infor-custom-input">
                <input
                  className="infor-custom-input-item"
                  type="date"
                  value={birthDay}
                  onChange={(e) => setBirthDay(e.target.value)} // Handle changes to fullName
                  placeholder="Ngày Sinh"
                />
              </div>
            </div> */}

            <div className="infor-custom-container">
              <div className="infor-custom-lable-name">
                Tỉnh/ Thành phố<span style={{ color: '#ff0000', fontWeight: 'bold' }}> * </span>
              </div>
              <div className="infor-custom-input">
                <select
                  value={selectedProvince}
                  id="selectedProvince"
                  onChange={handleProvinceChange}
                  required
                  style={{ flex: 1 }}
                  onClick={() => {
                    setAddress('');
                  }}
                  className="infor-custom-input-item"
                >
                  <option disabled value="">
                    Tỉnh/ Thành phố
                  </option>
                  {provinces.map((province) => (
                    <option key={province.code} value={province.code}>
                      {province.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="infor-custom-container">
              <div className="infor-custom-lable-name">
                Quận/ Huyện<span style={{ color: '#ff0000', fontWeight: 'bold' }}> * </span>
              </div>
              <div className="infor-custom-input">
                <select
                  value={selectedDistrict}
                  id="selectedDistrict"
                  className="infor-custom-input-item"
                  onChange={handleDistrictChange}
                  required
                  onClick={() => {
                    setAddress('');
                  }}
                  style={{ flex: 1 }}
                >
                  <option disabled value="">
                    Quận/ Huyện
                  </option>
                  {districts.map((district) => (
                    <option key={district.code} value={district.code}>
                      {district.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="infor-custom-container">
              <div className="infor-custom-lable-name">
                Xã/ Phường<span style={{ color: '#ff0000', fontWeight: 'bold' }}> * </span>
              </div>
              <div className="infor-custom-input">
                <select
                  value={selectedWard}
                  id="selectedWard"
                  onChange={handleWardChange}
                  required
                  style={{ flex: 1 }}
                  className="infor-custom-input-item"
                >
                  <option disabled value="">
                    Phường/ Xã/ Thị trấn
                  </option>
                  {wards.map((ward) => (
                    <option key={ward.code} value={ward.code}>
                      {ward.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="infor-custom-container">
              <div className="infor-custom-lable-name">
                Địa chỉ <span style={{ color: '#ff0000', fontWeight: 'bold' }}> * </span>
              </div>
              <div className="infor-custom-input">
                <input
                  className="infor-custom-input-item"
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)} // Handle changes to fullName
                  placeholder="Địa chỉ cụ thểm tên nhà, số đường, ngõ, ..."
                />
              </div>
            </div>

            <div
              onClick={() => {
                setDisplayUpdateAddress(false); // Show the update section
                setDisplayInfoAddress(true);
              }}
            >
              <span>
                <div className="btn-container">
                  <button
                    className="btn-back"
                    onClick={() => {
                      setDisplayInfoAddress(true);
                      setDisplayUpdateAddress(false);
                      setAddress(fullAddress);
                    }}
                  >
                    <RollbackOutlined /> Quay lại
                  </button>

                  <button className="btn-update" onClick={handleConfirmation}>
                    <EditOutlined />
                    Cập nhật
                  </button>
                </div>
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddressCustomer;
