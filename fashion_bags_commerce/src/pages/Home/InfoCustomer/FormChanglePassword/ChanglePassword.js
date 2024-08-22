import React, { useState } from 'react';
import customerAPI from '~/api/customerAPI';
import { notification } from 'antd';
import { getCustomer } from '~/api/auth/helper/UserCurrent';
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
function ChangePassword() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const customerId = getCustomer().customerId;

  const [showPassword, setShowPassword] = useState(false);
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const togglePasswordVisibility1 = () => {
    setShowPassword1(!showPassword1);
  };
  const togglePasswordVisibility2 = () => {
    setShowPassword2(!showPassword2);
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,30}$/;
    return passwordRegex.test(password);
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmNewPassword) {
      notification.error({
        message: 'Lỗi',
        description: 'Mật khẩu mới và xác nhận mật khẩu mới không khớp',
        duration: 2,
      });
      return;
    }

    if (!validatePassword(newPassword)) {
      notification.error({
        message: 'Lỗi',
        description:
          'Mật khẩu mới phải có ít nhất 12 kí tự, bao gồm ít nhất 1 kí tự viết hoa, 1 kí tự đặc biệt và dưới 30 kí tự',
        duration: 2,
      });
      return;
    }
    if (!oldPassword || !newPassword || !confirmNewPassword) {
      notification.error({
        message: 'Lỗi',
        description: 'Vui lòng điền đầy đủ thông tin',
        duration: 2,
      });
      return;
    }

    try {
      await customerAPI.changePassword(customerId, oldPassword, newPassword);
      handleSuccessfulPasswordChange(); // Xử lý khi thay đổi mật khẩu thành công
    } catch (error) {
      handleFailedPasswordChange(); // Xử lý khi thay đổi mật khẩu thất bại
    }
  };

  const handleSuccessfulPasswordChange = () => {
    notification.success({
      message: 'Thay đổi mật khẩu thành công',
      description: 'Mật khẩu đã được cập nhật thành công',
      duration: 2,
    });
    setOldPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
  };

  const handleFailedPasswordChange = () => {
    notification.error({
      message: 'Lỗi',
      description: 'Xảy ra lỗi, vui lòng nhập đúng mật khẩu',
      duration: 2,
    });
  };
  const DEFAULT_OLD_PASSWORD = ''; 
  return (
    <div>
      <h5 style={{ textAlign: 'center' }}>THAY ĐỔI MẬT KHẨU ĐĂNG NHẬP CỦA BẠN</h5>
      <div className="infor-custom">
        <div className="infor-custom-container">
          <div className="infor-custom-lable-name">
            Mật khẩu cũ<span style={{ color: '#ff0000', fontWeight: 'bold' }}> * </span>
          </div>
          <div className="infor-custom-input" style={{ display: 'flex' }}>
            <input
              className="infor-custom-input-item"
              type={showPassword ? 'text' : 'password'}
              value={oldPassword || DEFAULT_OLD_PASSWORD}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="Mật khẩu cũ"
              required
              
              style={{ border: '1px gray solid' }}
            />
            {/* {showPassword ? (
              <EyeInvisibleOutlined onClick={togglePasswordVisibility} />
            ) : (
              <EyeOutlined onClick={togglePasswordVisibility} />
            )} */}
          </div>
        </div>

        <div className="infor-custom-container">
          <div className="infor-custom-lable-name">
            Mật khẩu mới<span style={{ color: '#ff0000', fontWeight: 'bold' }}> * </span>
          </div>
          <div className="infor-custom-input" style={{ display: 'flex' }}>
            <input
              className="infor-custom-input-item"
              type={showPassword1 ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Mật khẩu mới"
              style={{ border: '1px gray solid' }}
              required
            />
            {/* {showPassword1 ? (
              <EyeInvisibleOutlined onClick={togglePasswordVisibility1} />
            ) : (
              <EyeOutlined onClick={togglePasswordVisibility1} />
            )} */}
          </div>
        </div>

        <div className="infor-custom-container">
          <div className="infor-custom-lable-name">
            Nhập lại:<span style={{ color: '#ff0000', fontWeight: 'bold' }}> * </span>
          </div>
          <div className="infor-custom-input" style={{ display: 'flex' }}>
            <input
              className="infor-custom-input-item"
              type={showPassword2 ? 'text' : 'password'}
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              placeholder="Xác nhận mật khẩu mới"
              required
              style={{ border: '1px gray solid' }}
            />
            {/* {showPassword2 ? (
              <EyeInvisibleOutlined onClick={togglePasswordVisibility2} />
            ) : (
              <EyeOutlined onClick={togglePasswordVisibility2} />
            )} */}
          </div>
        </div>
        <div style={{ textAlign: 'center', marginLeft: '170px' }}>
          <button
            style={{
              background: 'gold',
              color: 'white ',
              width: '80%',
              padding: '5px 0',
              borderRadius: '32px',
              fontSize: '18px',
              border: 'none',
            }}
            onClick={handleChangePassword}
          >
            Thay đổi mật khẩu
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChangePassword;
