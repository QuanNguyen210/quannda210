import styles from './LoginForm.module.scss';
import React, { useState } from 'react';
import { Link, useHistory, useNavigate } from 'react-router-dom';
import { Button, Col, Form, Row, notification } from 'antd';
import Checkbox from 'antd/es/checkbox/Checkbox';
import Input from 'antd/es/input/Input';
import axios from 'axios';
import AuthAPI from '~/api/auth/AuthAPI';
import customerAPI from '~/api/customerAPI';
import staffAPI from '~/api/staffAPI';
import Constants from '~/Utilities/Constants';
const CryptoJS = require('crypto-js');
function LoginForm(props) {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(email);
  };
  const onFinish = async (values) => {
    const userLogin = {
      email: values.email,
      password: values.password,
      role: 'ROLE_CUSTOMER',
    };
    try {
      console.log(userLogin);
      const response = await AuthAPI.login(userLogin);
      console.log(response.data.data.users.role);

      if (response.data.data.users.role === 'ROLE_CUSTOMER') {
        const customer = await customerAPI.findByUserId(response.data.data.users.userId);

        if (customer.data.customerStatus !== 1) {
          notification.error({
            message: 'Lỗi!!!',
            description: `Tài khoản có mã ${customer.data.customerCode} hiện tại không thể đăng nhập vui lòng liên hệ lại với cửa hàng!!!`,
            duration: 2,
          });
          return;
        }
        localStorage.setItem('customerToken', response.data.data.token);
        localStorage.setItem('customerId', customer.data.customerId);
        const userToken = await AuthAPI.getCustomerToken('ROLE_CUSTOMER');

        const userString = JSON.stringify(userToken.data);

        const customerTokenStringDecode = CryptoJS.AES.encrypt(userString, Constants.key).toString();
        localStorage.setItem('customerDecodeString', customerTokenStringDecode);
        console.log(customerTokenStringDecode);
        notification.success({
          message: 'Đăng nhập thành công!!!',
          description: `Welcome back to ${response.data.data.users.fullName}`,
          duration: 2,
        });
        navigate('/', {
          state: {
            fullName: response.data.data.users.fullName,
          },
        });
      }
      if (response.data.data.users.role === 'ROLE_STAFF' || response.data.data.users.role === 'ROLE_ADMIN') {
        const staff = await staffAPI.findByUserId(response.data.data.users.userId);

        localStorage.setItem('staffToken', response.data.data.token);
        localStorage.setItem('staffId', staff.data.staffId);
        const userToken = await AuthAPI.getStaffToken('ROLE_STAFF');
        const userString = JSON.stringify(userToken.data);

        const staffTokenStringDecode = CryptoJS.AES.encrypt(userString, Constants.key).toString();
        localStorage.setItem('staffDecodeString', staffTokenStringDecode);
        console.log(staffTokenStringDecode);

        notification.success({
          message: 'Đăng nhập thành công!!!',
          description: `Welcome back to ${response.data.data.users.fullName}`,
          duration: 2,
        });
        navigate('/admin');
      }
    } catch (error) {
      console.log(error);
      notification.error({
        message: 'Lỗi',
        description: 'Thông tin đăng nhập không chính xác',
        duration: 2,
      });
      localStorage.removeItem('usersTokenString');
      localStorage.removeItem('userId');
      localStorage.removeItem('token');
    }
  };
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  return (
    <div className={styles.formLoginne}>
      <div className={styles.authFormContainer}>
        <h2 className={styles.title}>Đăng nhập</h2>
        <Form
          name="basic"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập Email!',
                whitespace: true,
              },
              {
                pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: 'Vui lòng nhập địa chỉ Email hợp lệ!',
              },
            ]}
          >
            <Input size="large" style={{ width: '350px' }} />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: 'Vui lòng điền Password!',
                whitespace: true,
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (
                    value &&
                    value.length >= 12 &&
                    value.length <= 30 &&
                    /[\W_]/.test(value) &&
                    /[A-Z]/.test(value) &&
                    /\d/.test(value)
                  ) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error('Mật khẩu trong khoảng 12-30 kí tự, bao gồm ký tự đặc biệt, số và chữ in hoa!'),
                  );
                },
              }),
            ]}
          >
            <Input.Password style={{ width: '350px' }} size="large" />
          </Form.Item>

          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            <Button size="large" shape="round" type="primary" htmlType="submit">
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>
        <Row>
          <Col span={12}>
            <Button type="link" className={styles.linkBtn} onClick={() => navigate('/signup')}>
              Đăng kí tài khoản?
            </Button>
          </Col>
          <Col span={12}>
            <Button className={styles.linkBtn} onClick={() => navigate('/forget-password')}>
              Quên mật khẩu?
            </Button>
          </Col>
        </Row>
      </div>
    </div>
  );
}
export default LoginForm;
