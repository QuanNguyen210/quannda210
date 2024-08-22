import { useLocation, Navigate, Outlet, Route, useNavigate } from 'react-router-dom';
import { getStaff, getStaffToken, getUserToken } from '../helper/UserCurrent';
import { useEffect, useState } from 'react';
import AuthAPI from '../AuthAPI';
import { notification } from 'antd';

const clearAuthToken = () => {
  localStorage.removeItem('staffTokenString');
  localStorage.removeItem('staffId');
  localStorage.removeItem('token');
};
const validateToken = async (token) => {
  const response = await AuthAPI.validateToken(token);
  return JSON.stringify(response.data);
};
const StaffAuth = ({ children }) => {
  const [accessChecked, setAccessChecked] = useState(false);
  const token = getStaffToken();
  const userInfo = getStaff();
  const staffId = localStorage.getItem('staffId');
  const staffToken = localStorage.getItem('staffToken');

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
    const ischecked = async () => {
      validateToken(token);
      if (token === null || userInfo === null || staffId === null || staffToken === null) {
        navigate('/admin/login');
        return;
      }
      if (userInfo === null || userInfo === null || staffId === null || staffToken === null) {
        navigate('/admin/login');
        return;
      } else {
        if (userInfo.users.role !== 'ROLE_STAFF' && userInfo.users.role !== 'ROLE_ADMIN') {
          navigate('/unauthorized');
          return;
        }
      }
      setAccessChecked(true);
    };

    ischecked();
  }, [userInfo, token, staffId, staffToken]);
  if (!accessChecked) {
    return null; // Hoặc có thể return một loading indicator
  }
  return children;
};

export default StaffAuth;
