import { Button, Col, DatePicker, Form, Input, Popconfirm, Row, Select, Tabs, message } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import dayjs from 'dayjs';
import moment from 'moment';
import { Fragment, useEffect, useState } from 'react';
import { generateCustomCode } from '~/Utilities/GenerateCustomCode';
import MaillingAPI from '~/api/MaillingAPI';
import { covertObjectToDecode, getStaff } from '~/api/auth/helper/UserCurrent';
import customerAPI from '~/api/customerAPI';
import staffAPI from '~/api/staffAPI';

function ProfileComponent() {
  const [messageApi, contextHolder] = message.useMessage();
  const [activeTab, setActiveTab] = useState('1');

  const disabledDate = (current) => {
    return current && current > dayjs().endOf('day');
  };
  const handleTabChange = (key) => {
    setActiveTab(key);
  };
  function UserInfoManagerment() {
    const [form] = Form.useForm();
    const [staffInfo, setStaffInfo] = useState(getStaff());
    const users = staffInfo.users;

    const handleEditStaff = async (values) => {
      console.log(values);
      const birthDay = values.birthDay.format('YYYY-MM-DD');
      const staff = {
        staffId: staffInfo.staffId,
        staffCode: staffInfo.staffCode,
        staffStatus: staffInfo.staffStatus,
        users: {
          userId: users.userId,
          account: values.account,
          fullName: values.fullName,
          birthDay: birthDay,
          password: staffInfo.users.password,
          email: values.email,
          userStatus: staffInfo.users.userStatus,
          gender: values.gender,
          address: values.address,
          phoneNumber: values.phoneNumber,
          userNote: values.userNote,
          role: staffInfo.users.role,
        },
      };
      const response = await staffAPI.staffUpdate(staff);
      if (response.status === 200) {
        const object = response.data;
        console.log(object);
        localStorage.setItem('staffDecodeString', covertObjectToDecode(object));
        messageApi.open({
          type: 'success',
          content: 'Sửa thành công!!',
        });
      }
    };
    return (
      <div style={{ backgroundColor: 'whitesmoke' }}>
        <div>
          <Row>
            <Col span={22}>
              <h1>Thông tin Nhân Viên</h1>
            </Col>
            <Col span={2}>
              <Popconfirm
                title="Xác Nhận"
                description="Bạn chắc chắn muốn sửa ?"
                onConfirm={() => {
                  form.submit();
                }}
                onCancel={() => {}}
                okText="Có"
                cancelText="Không"
              >
                <Button size="large" shape="round" type="primary">
                  Sửa
                </Button>
              </Popconfirm>
            </Col>
          </Row>
          <hr></hr>
          <Form
            layout="vertical"
            form={form}
            onFinish={handleEditStaff}
            initialValues={{
              fullName: users.fullName,
              account: users.account,
              gender: users.gender,
              email: users.email,
              phoneNumber: users.phoneNumber,
              address: users.address,
              birthDay: moment(users.birthDay, 'YYYY-MM-DD'),
              userNote: users.userNote,
              role: users.role,
            }}
          >
            <Row>
              <Col span={12}>
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
                  <Input readOnly size="large" type="tel"></Input>
                </Form.Item>
              </Col>
              <Col span={12}>
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
                  <Input readOnly size="large" width={200}></Input>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item
                  label="Tên Khách Hàng"
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
                  ]}
                >
                  <Input size="large"></Input>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Account"
                  name="account"
                  rules={[
                    {
                      required: true,
                      message: 'Account không hợp lệ!',
                    },
                  ]}
                >
                  <Input size="large" maxLength={120} placeholder="Nhập tối đa 50 ký tự"></Input>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item
                  label="Địa chỉ"
                  name="address"
                  rules={[
                    {
                      required: true,
                      message: 'Tên không hợp lệ!',
                    },
                  ]}
                >
                  <TextArea size="large" maxLength={120} placeholder="Nhập tối đa 120 ký tự"></TextArea>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Ghi chú"
                  name="userNote"
                  rules={[
                    {
                      required: true,
                      message: 'Tên không hợp lệ!',
                    },
                  ]}
                >
                  <TextArea size="large" maxLength={120} placeholder="Nhập tối đa 120 ký tự"></TextArea>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={6}>
                <Form.Item
                  label="Giới tính"
                  name="gender"
                  rules={[
                    {
                      required: true,
                      message: 'Tên không hợp lệ!',
                    },
                  ]}
                >
                  <Select
                    size="large"
                    style={{
                      width: 120,
                    }}
                    options={[
                      {
                        value: false,
                        label: 'Nữ',
                      },
                      {
                        value: true,
                        label: 'Nam',
                      },
                      {
                        value: -1,
                        label: 'Không công khai',
                      },
                    ]}
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  label="Ngày sinh"
                  name="birthDay"
                  rules={[
                    {
                      required: true,
                      message: 'Tên không hợp lệ!',
                    },
                  ]}
                >
                  <DatePicker disabledDate={disabledDate} />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  label="Chức vụ"
                  name="role"
                  rules={[
                    {
                      required: true,
                      message: 'Tên không hợp lệ!',
                    },
                  ]}
                >
                  <Select
                    disabled
                    size="large"
                    style={{
                      width: 120,
                    }}
                    options={[
                      {
                        value: 'ROLE_ADMIN',
                        label: 'ADMIN',
                      },
                      {
                        value: 'ROLE_STAFF',
                        label: 'NHÂN VIÊN',
                      },
                    ]}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    );
  }
  function PasswordManagerment() {
    const [form] = Form.useForm();
    const [staffInfo, setStaffInfo] = useState(getStaff());
    const users = staffInfo.users;

    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [emailCode, setEmailCode] = useState('');
    const [timer, setTimer] = useState(0);

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

    const sendCodeToEmail = async () => {
      const generatedCode = generateCustomCode('', 6);
      const mail = {
        email: users.email,
        subject: 'Mã xác nhận đổi Mật khẩu',
        content: 'Mã code của bạn là: ' + generatedCode,
      };
      const response = await MaillingAPI.notificationCreateCustomer(mail); // Hàm tạo mã code ngẫu nhiên
      setCode(generatedCode);
      setTimer(10);
    };

    const handleSendCode = () => {
      sendCodeToEmail();
      // Các hành động khác khi nhấn nút gửi code
    };

    const handleChangPassword = async (values) => {
      const object = values;
      if (object.rePassword !== object.password) {
        messageApi.open({
          type: 'error',
          content: 'Nhập lại mât khẩu không đúng, vui lòng kiểm tra lại!!!',
        });
        return;
      }
      if (code === object.code) {
        const staff = {
          staffId: staffInfo.staffId,
          staffCode: staffInfo.staffCode,
          staffStatus: staffInfo.staffStatus,
          users: {
            userId: staffInfo.users.userId,
            account: staffInfo.users.account,
            fullName: staffInfo.users.fullName,
            birthDay: staffInfo.users.birthDay,
            password: object.password,
            email: staffInfo.users.email,
            userStatus: staffInfo.users.userStatus,
            gender: staffInfo.users.gender,
            address: staffInfo.users.address,
            phoneNumber: staffInfo.users.phoneNumber,
            userNote: staffInfo.users.userNote,
            role: staffInfo.users.role,
          },
        };
        const response = await staffAPI.signup(staff);
        if (response.status === 200) {
          const object = response.data;
          console.log(object);
          localStorage.setItem('staffDecodeString', covertObjectToDecode(object));
          messageApi.open({
            type: 'success',
            content: 'Sửa thành công!!',
          });
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
      <div style={{ backgroundColor: 'whitesmoke' }}>
        <div>
          <Row>
            <Col span={22}>
              <h1>Đổi mật khẩu</h1>
            </Col>
            <Col span={2}>
              <Popconfirm
                title="Xác Nhận"
                description="Bạn chắc chắn muốn sửa ?"
                onConfirm={() => {
                  form.submit();
                }}
                onCancel={() => {}}
                okText="Có"
                cancelText="Không"
              >
                <Button size="large" shape="round" type="primary">
                  Sửa
                </Button>
              </Popconfirm>
            </Col>
          </Row>
          <hr></hr>
          <Form
            layout="vertical"
            form={form}
            onFinish={handleChangPassword}
            initialValues={{
              passwordEmail: users.email,
            }}
          >
            <Row>
              <Col span={8}></Col>
              <Col span={8}>
                <Form.Item
                  label="Email"
                  name="passwordEmail"
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
                  <Input readOnly size="large" width={200}></Input>
                </Form.Item>
              </Col>
              <Col span={8}></Col>
            </Row>
            <Row>
              <Col span={8}></Col>
              <Col span={8}>
                <Form.Item
                  label="Mã code"
                  name="code"
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng điền mật khẩu!',
                    },
                  ]}
                >
                  <Row>
                    {' '}
                    <Col span={20}>
                      <Input size="large" width={200}></Input>
                    </Col>
                    <Col span={4}>
                      <Button size="large" disabled={timer} onClick={handleSendCode}>
                        {timer || 'Gửi mã'}
                      </Button>
                    </Col>
                  </Row>
                </Form.Item>
              </Col>
              <Col span={8}></Col>
            </Row>
            <Row>
              <Col span={8}></Col>
              <Col span={8}>
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
              </Col>
              <Col span={8}></Col>
            </Row>
            <Row>
              <Col span={8}></Col>
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
                  ]}
                >
                  <Input.Password style={{ width: 400 }} size="large" />
                </Form.Item>
              </Col>
              <Col span={8}></Col>
            </Row>
            <Row>
              <Col span={8}></Col>
              <Col span={8}>
                <Button size="large" shape="round" type="primary" htmlType="submit">
                  Đổi mật khẩu
                </Button>
              </Col>
              <Col span={8}></Col>
            </Row>
          </Form>
        </div>
      </div>
    );
  }
  const tabContent = [
    {
      key: '1',
      tab: 'Thông tin Cá nhân',
      content: <UserInfoManagerment />, // Đặt component của trang 1 ở đây
    },
    {
      key: '2',
      tab: 'Quản lí mật khẩu',
      content: <PasswordManagerment />, // Đặt component của trang 2 ở đây
    },
    {
      key: '3',
      tab: 'Công việc',
      content: <h2>Trang 3</h2>, // Đặt component của trang 3 ở đây
    },
  ];
  return (
    <Fragment>
      {contextHolder}

      <Tabs
        activeKey={activeTab}
        onChange={handleTabChange}
        tabPosition="left"
        items={tabContent.map((tab) => ({
          key: tab.key,
          label: tab.tab,
          children: tab.content,
        }))}
      />
    </Fragment>
  );
}

export default ProfileComponent;
