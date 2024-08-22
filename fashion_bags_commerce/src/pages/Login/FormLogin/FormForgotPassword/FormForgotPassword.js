import React, { Fragment, useEffect, useState } from 'react';
import styles from './LoginForm.module.scss';
import { Button, Col, Form, Input, Modal, Popconfirm, Row, message } from 'antd';
import staffAPI from '~/api/staffAPI';
import { covertObjectToDecode, getStaff } from '~/api/auth/helper/UserCurrent';
import MaillingAPI from '~/api/MaillingAPI';
import { generateCustomCode } from '~/Utilities/GenerateCustomCode';
import customerAPI from '~/api/customerAPI';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

function ForgotPassword(props) {
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const [sdt] = Form.useForm();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);

  const [email, setEmail] = useState(null);
  const [code, setCode] = useState(null);
  const [codeReiver, setCodeReceiver] = useState(null);
  const [timer, setTimer] = useState(0);
  const [open, setOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const showModal = () => {
    setOpen(true);
  };
  const handleClickChangePassword = () => {
    if (code === null || codeReiver === null || email === null) {
      messageApi.error({
        type: 'error',
        content: 'Vui lòng điền các trường thông tin cần thiết!',
      });
      return;
    }

    showModal();
  };
  const hideModal = () => {
    setOpen(false);
  };
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else {
    }

    return () => clearInterval(interval);
  }, [timer]);

  const sendCodeToEmail = async () => {
    var statusMessage = 'loading';
    messageApi.open({
      type: statusMessage,
      content: 'Đang gửi mail!',
    });
    const generatedCode = generateCustomCode('', 6);
    const mail = {
      email: email,
      subject: 'Mã xác nhận đổi Mật khẩu',
      content: 'Mã code của bạn là: ' + generatedCode,
    };
    const response = await MaillingAPI.notificationCreateCustomer(mail);
    if (response.status === 200) {
      statusMessage = 'success';
      messageApi.open({
        type: statusMessage,
        content: 'Vui lòng check mail để lấy mã Code!',
      });
      setTimer(10);
    }
    setCode(generatedCode);
    setTimer(10);
  };
  const handleResetForm = () => {
    setOpen(false);
    form.resetFields();
    setEmail(null);
    setCode(null);
    setCustomer(null);
    setPhoneNumber(null);
    setCodeReceiver(null);

    setTimeout(() => {
      navigate('/login');
    }, 0);
  };
  const handleSendCode = () => {
    form
      .validateFields(['passwordEmail'])
      .then(async () => {
        const response = await customerAPI.findByEmail(email);
        if (response.data === '') {
          messageApi.open({
            type: 'error',
            content: 'Email trong hệ thống không tồn tại!',
          });
          return;
        } else {
          setCustomer(response.data);
          sendCodeToEmail();
        }
      })
      .catch((errorInfo) => {
        console.log(errorInfo);
        messageApi.open({
          type: 'error',
          content: 'Không gủi được mail!',
        });
      });
  };
  const handleOk = () => {
    sdt.submit();
    if (phoneNumber === null) {
      messageApi.open({
        type: 'error',
        content: 'Vui lòng điền tên account !!!',
      });
      return;
    }
    form.submit();
  };
  const handleChangPassword = async (values) => {
    const object = values;

    if (codeReiver !== code) {
      messageApi.open({
        type: 'error',
        content: 'Mã không đúng vui lòng kiểm tra lại!!!',
      });
      return;
    }
    if (codeReiver === null) {
      messageApi.open({
        type: 'error',
        content: 'VUi lòng điền mã xác nhận trước khi gửi!!!',
      });
      return;
    }

    if (customer.users.phoneNumber !== phoneNumber) {
      messageApi.open({
        type: 'error',
        content: 'SĐT không đúng! vui lòng nhớ lại!',
      });
      return;
    }
    if (object.rePassword !== object.password) {
      messageApi.open({
        type: 'error',
        content: 'Nhập lại mât khẩu không đúng, vui lòng kiểm tra lại!!!',
      });
      return;
    }
    if (code === object.code) {
      const customerChange = {
        customerId: customer.customerId,
        customerCode: customer.customerCode,
        customerStatus: customer.customerStatus,
        consumePoints: customer.customerStatus,
        rankingPoints: customer.customerStatus,
        customerRanking: customer.customerStatus,
        users: {
          userId: customer.users.userId,
          account: customer.users.account,
          fullName: customer.users.fullName,
          birthDay: customer.users.birthDay,
          password: object.password,
          email: customer.users.email,
          userStatus: customer.users.userStatus,
          gender: customer.users.gender,
          address: customer.users.address,
          phoneNumber: customer.users.phoneNumber,
          userNote: customer.users.userNote,
          role: customer.users.role,
        },
      };
      const response = await customerAPI.update(customerChange);
      if (response.status === 200) {
        const object = response.data;

        messageApi.open({
          type: 'success',
          content: 'Đã đổi mật khẩu thành thành công!!',
        });

        const formattedDateTimeMoment = moment().format('YYYY-MM-DD HH:mm:ss');

        const responseEmail = await MaillingAPI.notificationCreateCustomer({
          email: email,
          subject: 'Thông báo đổi mật khẩu thành công',
          content: `Tài khoản của bạn tại BagsGirl Shop đã được thay đổi mật khẩu vào lúc ${formattedDateTimeMoment}. Vui lòng truy cập lại: http://localhost:3000/login , để đăng nhập lại và nhận được nhiều ưu đãi từ Shop của chúng tôi`,
        });

        handleResetForm();
      }
    } else {
      messageApi.open({
        type: 'error',
        content: 'Mã sai!!',
      });
      return;
    }
  };
  return (
    <Fragment>
      {contextHolder}
      <div className={styles.formLoginne}>
        <div className={styles.authFormContainer}>
          <h2 className={styles.title}>Quên mật khẩu</h2>
          <div className={styles.registerForm}>
            <div>
              <Form layout="vertical" form={form} onFinish={(values) => handleChangPassword(values)} initialValues={{}}>
                <Row>
                  <Col span={24}>
                    <Form.Item
                      label="Email"
                      name="passwordEmail"
                      rules={[
                        {
                          required: true,
                          message: 'Vui lòng điền Email!',
                        },
                        {
                          pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                          message: 'Vui lòng nhập địa chỉ email hợp lệ!',
                        },
                      ]}
                    >
                      <Input
                        size="large"
                        width={200}
                        onChange={(e) => {
                          setEmail(e.target.value);
                        }}
                      ></Input>
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <Form.Item
                      label="Mã code"
                      name="code"
                      rules={[
                        {
                          required: true,
                          message: 'Vui lòng điền mã Code!',
                          whitespace: true,
                        },
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (value && value.trim() === value) {
                              return Promise.resolve();
                            }
                            return Promise.reject(new Error('Mã code không được có khoảng trắng ở đầu hoặc cuối!'));
                          },
                        }),
                      ]}
                    >
                      <Row>
                        {' '}
                        <Col span={20}>
                          <Input
                            size="large"
                            width={200}
                            onChange={(e) => {
                              setCodeReceiver(e.target.value);
                            }}
                          ></Input>
                        </Col>
                        <Col span={4}>
                          <Button size="large" disabled={timer} onClick={handleSendCode}>
                            {timer || 'Gửi mã'}
                          </Button>
                        </Col>
                      </Row>
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={8}>
                    <Form.Item
                      label="Mật Khẩu"
                      name="password"
                      rules={[
                        {
                          required: true,
                          message: 'Vui lòng điền mật khẩu!',
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
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (value && value.trim() === value) {
                              return Promise.resolve();
                            }
                            return Promise.reject(new Error('Mật khẩu không được có khoảng trắng ở đầu hoặc cuối!'));
                          },
                        }),
                      ]}
                    >
                      <Input.Password style={{ width: 400 }} size="large" />
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={8}>
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
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (value && value.trim() === value) {
                              return Promise.resolve();
                            }
                            return Promise.reject(new Error('Mật khẩu không được có khoảng trắng ở đầu hoặc cuối!'));
                          },
                        }),
                      ]}
                    >
                      <Input.Password style={{ width: 400 }} size="large" />
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={8}>
                    <Popconfirm
                      title="Xác Nhận"
                      description="Bạn chắc chắn muốn đổi ?"
                      onConfirm={handleClickChangePassword}
                      onCancel={() => {}}
                      okText="Có"
                      cancelText="Không"
                    >
                      <Button size="large" shape="round" type="primary">
                        Đổi mật khẩu
                      </Button>
                    </Popconfirm>

                    <Modal
                      title="Xác thực Số điện thoại tài khoản"
                      open={open}
                      onOk={handleOk}
                      onCancel={hideModal}
                      okText="Xác nhận"
                      cancelText="Hủy"
                    >
                      <Form form={sdt} onFinish={() => {}} onFinishFailed={() => {}}>
                        <Form.Item
                          label="Số điện thoại"
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
                          <Input
                            onChange={(e) => {
                              setPhoneNumber(e.target.value);
                            }}
                          />
                        </Form.Item>
                      </Form>
                    </Modal>
                  </Col>
                </Row>
              </Form>
            </div>
            <Button className={styles.linkBtn} type="link" onClick={() => navigate('/login')}>
              Đăng nhập ở đây!!!
            </Button>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
export default ForgotPassword;
