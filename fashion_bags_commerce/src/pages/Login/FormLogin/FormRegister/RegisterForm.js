import React, { Fragment, useEffect, useState } from 'react';
import styles from './indexLogin.module.scss';
import { useNavigate } from 'react-router-dom';
import { Button, Checkbox, Col, Form, Input, Row, Select, message, notification } from 'antd';
import { useForm } from 'antd/es/form/Form';
import AuthAPI from '~/api/auth/AuthAPI';
import customerAPI from '~/api/customerAPI';
import MaillingAPI from '~/api/MaillingAPI';
import { generateCustomCode } from '~/Utilities/GenerateCustomCode';

function RegisterForm(props) {
  const [pass, setPass] = useState('');
  const [name, setName] = useState('');
  const [sdt, setSdt] = useState('');
  const [email, setEmail] = useState('');
  const [emailCode, setEmailCode] = useState('');
  const [code, setCode] = useState('');
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const [timer, setTimer] = useState(0);
  function validateEmail(email) {
    return emailRegex.test(email);
  }
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else {
      // Nếu hết thời gian, xử lý tại đây (ví dụ: reset mã code)
    }

    return () => clearInterval(interval);
  }, [timer]);
  const handleSendCode = async () => {
    if (!validateEmail(email)) {
      messageApi.open({
        type: 'error',
        content: 'Email không đúng định dạng!!!',
      });
      return;
    }
    const isExistEmailRespone = await customerAPI.findByEmail(email);
    if (isExistEmailRespone.data !== '') {
      notification.warning({
        message: 'Thông Báo',
        description: 'Email này đã được đăng kí!!',
        duration: 2,
      });
      messageApi.destroy();
      return;
    }
    const generatedCode = generateCustomCode('', 6);
    const mail = {
      email: email,
      subject: 'Mã xác nhận đổi Mật khẩu',
      content: 'Mã code của bạn là: ' + generatedCode,
    };
    setCode(generatedCode);
    setTimer(10);
    const response = await MaillingAPI.notificationCreateCustomer(mail); // Hàm tạo mã code ngẫu nhiên
  };
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  const onFinish = async (values) => {
    const userSignUp = {
      fullName: values.fullName,
      email: values.email,
      phoneNumber: values.phoneNumber,
      password: values.password,
      rePassword: values.rePassword,
    };
    if (userSignUp.password !== userSignUp.rePassword) {
      messageApi.open({
        type: 'error',
        content: '2 Mật Khẩu không khớp!!!',
      });
    } else {
      if (emailCode !== code) {
        messageApi.open({
          type: 'error',
          content: 'Mã xác nhận Email không đúng, Vui lòng kiểm tra lại!!!',
        });
        return;
      }
      const cutomer = {
        customerStatus: 1,
        consumePoints: 1,
        rankingPoints: 1,
        users: {
          account: values.fullName,
          fullName: values.fullName,
          email: values.email,
          phoneNumber: values.phoneNumber,
          password: values.password,
          role: 'ROLE_CUSTOMER',
        },
      };
      try {
        const isExistPhoneNumberRespone = await customerAPI.findByPhoneNumber(values.phoneNumber);
        const isExistEmailRespone = await customerAPI.findByEmail(values.email);

        if (isExistPhoneNumberRespone.data !== '') {
          notification.warning({
            message: 'Thông Báo',
            description: 'Số Điện thoại này đã được đăng kí!!',
            duration: 2,
          });
          messageApi.destroy();
          return;
        } else if (isExistEmailRespone.data !== '') {
          notification.warning({
            message: 'Thông Báo',
            description: 'Email này đã được đăng kí!!',
            duration: 2,
          });
          messageApi.destroy();
          return;
        } else {
          const response = await customerAPI.add(cutomer);

          if (response.status === 200) {
            notification.success({
              message: 'Thành Công',
              description: 'Tạo taì khoản thành công!!!',
              duration: 2,
            });
            setTimeout(() => {
              navigate('/login');
            }, 1000);
          }
        }
      } catch (error) {
        if (error.response.status === 400) {
          messageApi.open({
            type: 'error',
            content: 'Email này đã tồn tại!!!',
          });
        }
      }
    }
  };
  const handleSignUp = () => {
    form.submit();
  };
  return (
    <Fragment>
      {contextHolder}
      <div className={styles.formLoginne}>
        <div className={styles.authFormContainer}>
          <h2 className={styles.title}>Đăng ký</h2>
          <div className={styles.registerForm}>
            <div>
              <Form
                layout="vertical"
                form={form}
                name="basic"
                labelCol={{
                  span: 8,
                }}
                wrapperCol={{
                  span: 16,
                }}
                style={{
                  maxWidth: 600,
                }}
                initialValues={{
                  remember: true,
                }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
              >
                <Form.Item
                  label="Họ và Tên"
                  name="fullName"
                  rules={[
                    {
                      required: true,
                      message: 'Tên không hợp lệ!',
                      pattern: /^[\p{L}\d\s]+$/u,
                      whitespace: true,
                      validator: (rule, value) => {
                        if (value && value.trim() !== value) {
                          return Promise.reject('Tên không được chứa khoảng trắng ở hai đầu!');
                        }
                        return Promise.resolve();
                      },
                    },
                    {
                      pattern: /^[a-zA-ZÀ-ỹà-ỹẠ-Ỹạ-ỹĂăÂâĐđÊêÔôƠơƯư\s]+$/,
                      message: 'Tên không được phép chứa kí tự đặc biệt và số!',
                    },
                  ]}
                >
                  <Input style={{ width: 400 }} size="large" />
                </Form.Item>
                <Form.Item
                  label="Giới Tính"
                  name="gender"
                  rules={[
                    {
                      required: true,
                      message: 'Vui chọn giới tính!',
                    },
                  ]}
                >
                  <Select
                    allowClear
                    size="large"
                    placeholder="Giới Tính"
                    options={[
                      {
                        value: true,
                        label: 'Nam',
                      },
                      {
                        value: false,
                        label: 'Nữ',
                      },
                    ]}
                  />
                </Form.Item>
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng điền Email!',
                      whitespace: true,
                    },
                    {
                      pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message: 'Vui lòng nhập địa chỉ email hợp lệ!',
                    },
                  ]}
                >
                  <Input
                    style={{ width: 400 }}
                    size="large"
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                  />
                </Form.Item>
                <Form.Item
                  label="Mã Code"
                  name="emailCode"
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng điền mã Code được gửi trong Email!',
                      whitespace: true,
                    },
                  ]}
                >
                  <Row>
                    <Col span={23}>
                      <Input
                        style={{ width: 250 }}
                        size="large"
                        onChange={(e) => {
                          setEmailCode(e.target.value);
                        }}
                      />
                    </Col>
                    <Col span={1}>
                      <Button size="large" shape="round" type="primary" disabled={timer} onClick={handleSendCode}>
                        {timer || 'Gửi mã'}
                      </Button>
                    </Col>
                  </Row>
                </Form.Item>
                <Form.Item
                  label="Số Điện Thoại"
                  name="phoneNumber"
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng điền SĐT!',
                      whitespace: true,
                    },
                    {
                      pattern: /^((\+|00)84|0)(3[2-9]|5[6|8|9]|7[0|6-9]|8[1-6|8-9]|9\d)\d{7}$/,
                      message: 'Vui lòng nhập số điện thoại hợp lệ!',
                    },
                  ]}
                >
                  <Input style={{ width: 400 }} size="large" />
                </Form.Item>
                <Form.Item
                  label="Mật Khẩu"
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng điền mật khẩu!',
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
                  <Input.Password style={{ width: 400 }} size="large" />
                </Form.Item>
                <Form.Item
                  label="Nhập lại Mật Khẩu"
                  name="rePassword"
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng nhập lại mật khẩu!',
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (
                          value &&
                          value.length >= 12 &&
                          /[\W_]/.test(value) &&
                          /[A-Z]/.test(value) &&
                          /\d/.test(value)
                        ) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error('Mật khẩu cần ít nhất 12 ký tự, bao gồm ký tự đặc biệt, số và chữ in hoa!'),
                        );
                      },
                    }),
                  ]}
                >
                  <Input.Password style={{ width: 400 }} size="large" />
                </Form.Item>
                <Form.Item>
                  <Button size="large" shape="round" type="primary" htmlType="submit">
                    Đăng kí
                  </Button>
                </Form.Item>
              </Form>
            </div>
            <Button type="link" className={styles.linkBtn} onClick={() => navigate('/login')}>
              Đăng nhập ở đây!!!
            </Button>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
export default RegisterForm;
