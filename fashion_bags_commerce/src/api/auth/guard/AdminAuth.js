import { useEffect, useState } from 'react';
import { redirect, useNavigate } from 'react-router-dom';
import { getStaff, getStaffToken } from '../helper/UserCurrent';
import AuthAPI from '../AuthAPI';
import { notification } from 'antd';

const clearAuthToken = () => {
  localStorage.removeItem('staffTokenString');
  localStorage.removeItem('staffId');
  localStorage.removeItem('token');
};

const AdminAuth = ({ children }) => {
  const [accessChecked, setAccessChecked] = useState(false);
  const token = getStaffToken();

  const staffId = localStorage.getItem('staffId');
  const staffToken = getStaffToken();

  const navigate = useNavigate();
  const validateToken = async (token) => {
    const response = await AuthAPI.validateToken(token);
    if (JSON.stringify(response.data) === 'false') {
      notification.info({
        message: 'Lỗi',
        description: 'Phiên đăng nhập đã hết hạn!!!!',
        duration: 2,
      });
      clearAuthToken();
      navigate('/admin/login');
    }
  };
  useEffect(() => {
    validateToken(token);
    const userInfo = getStaff();
    const ischecked = async () => {
      if (token === null) {
        navigate('/admin/login');
      }
      if (userInfo === null) {
        navigate('/admin/login');
      } else {
        if (userInfo.users.role !== 'ROLE_ADMIN') {
          navigate('/unauthorized');
        }
      }
      setAccessChecked(true);
    };
    ischecked();
  }, [token, staffId, staffToken]);
  if (!accessChecked) {
    return null; // Hoặc có thể return một loading indicator
  }
  return children;
};

export default AdminAuth;
