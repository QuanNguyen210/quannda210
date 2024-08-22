import React, { Fragment, useState } from 'react';
import { EyeFilled, EyeInvisibleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Col, Drawer, Form, Input, Row, Select, Radio, notification } from 'antd';
import customerAPI from '~/api/customerAPI';
import { generateCustomCode } from '~/Utilities/GenerateCustomCode';

const { Option } = Select;
const FormCustomerCreate = (props) => {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(false);
  const [form] = Form.useForm();
  const [emailDaTonTai, setEmailDaTonTai] = useState('');



  const showDrawer = () => {
    setOpen(true);
    form.resetFields();
  };
  const onClose = () => {
    setOpen(false);
  };


  const addFunc = async (values) => {
    setError(false);
    const checkEmail = await customerAPI.findByEmail(values.users.email);
    const checkSDT = await customerAPI.findByPhoneNumber(values.users.phoneNumber);
    if (checkEmail.data !== '') {
      notification.error({
        message: 'Thêm thất bại',
        description: 'Email đã tồn tại!',
        duration: 2,
      });
    }
    if (checkSDT.data !== '') {
      notification.error({
        message: 'Thêm thất bại',
        description: 'Số điện thoại đã tồn tại!',
        duration: 2,
      });
    }
    if (checkEmail.data === '' && checkSDT.data === '') {
      let add = {
        ...values,
        customerCode: generateCustomCode("KH", 6),
        rankingPoints: 0,
        consumePoints: 0,
        users: {
          ...values.users,
          role: 'ROLE_CUSTOMER'
        }
      };
      try {
        const response = await customerAPI.add(add);
        notification.success({
          message: 'Thêm thành công',
          description: 'Khách hàng đã được thêm thành công',
          duration: 2,
        });
        props.reload();
        onClose();

        // Đóng Modal sau khi thêm thành công
      } catch (error) {
        setError(true);
        notification.error({
          message: 'Lỗi',
          description: 'Vui lòng xác nhận',
          duration: 2,
        });
        console.log(error);
      }
    }
  };

  return (
    <Fragment>
      <Button type="primary" onClick={showDrawer} icon={<PlusOutlined />}>
        {' '}
        Thêm khách hàng
      </Button>
      <Drawer
        title="Tạo mới khách hàng"
        width={720}
        onClose={onClose}
        open={open}
        styles={{
          body: {
            paddingBottom: 80,
          },
        }}
      >
        <Form layout="vertical" initialValues={{
          users: { gender: true },
          // users: {}
          // customerRanking: 0,
          rankingPoints: 0
        }} onFinish={addFunc}
          form={form}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name={['users', 'fullName']}
                label="Họ và tên"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng điền họ và tên!',
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
                <Input placeholder="Vui lòng điền họ và tên!" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="customerStatus"
                label="Trạng thái"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng chọn trạng thái!',
                  },
                ]}
              >
                <Select placeholder="Vui lòng chọn trạng thái!">
                  <Option value="1">Hoạt động</Option>
                  <Option value="-1">Ngừng Hoạt động</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name={['users', 'email']}
                label="Email"
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
                <Input placeholder="Vui lòng điền email!" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Password"
                name={['users', 'password']}
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
                <Input.Password iconRender={(visible) => (visible ? <EyeInvisibleOutlined /> : <EyeFilled />)} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name={['users', 'phoneNumber']}
                label="SĐT"
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
                <Input placeholder="Vui lòng điền số điện thoại!" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name={['users', 'address']}
                label="Địa chỉ"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng điền địa chỉ!',
                  },
                ]}
              >
                <Input placeholder="Vui lòng điền địa chỉ!" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>

            <Col span={12}>
              <Form.Item label="Giới tính" name={['users', 'gender']}
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng chọn giới tính!',
                  },
                ]}
              >
                <Radio.Group>
                  <Radio value={true}>Nam</Radio>
                  <Radio value={false}>Nữ</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name={['users', 'userNote']}
                label="Ghi chú"
                rules={[
                  {
                    required: false,
                    message: 'Vui lòng điền ghi chú!',
                  },
                ]}
              >
                <Input.TextArea rows={4} placeholder='Vui lòng điền ghi chú!' />
              </Form.Item>
            </Col>
          </Row>
          <div>
            <Button type="primary" onClick={() => { form.submit() }} icon={<PlusOutlined />}>
              Thêm mới
            </Button>
          </div>
        </Form>
      </Drawer>
    </Fragment>
  );
};
export default FormCustomerCreate;
