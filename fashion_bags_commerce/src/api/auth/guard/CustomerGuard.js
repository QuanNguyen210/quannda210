import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCustomerToken, getStaffToken } from '../helper/UserCurrent';
import { jwtDecode } from 'jwt-decode';

const CustomerGuard = ({ children }) => {
  const customerToken = getCustomerToken();
  const navigate = useNavigate();

  useEffect(() => {
    if (customerToken === 'undefined' || customerToken === null) {
      navigate('/login');
      return; // Redirect if no token is present
    }

    const decodedToken = jwtDecode(customerToken);
    console.log(decodedToken);
    const currentTime = Date.now();
    if (decodedToken.exp * 1000 <= currentTime) {
      navigate('/login'); // Redirect if token is expired
    }
  }, [customerToken, navigate]);

  return children;
};

export default CustomerGuard;
