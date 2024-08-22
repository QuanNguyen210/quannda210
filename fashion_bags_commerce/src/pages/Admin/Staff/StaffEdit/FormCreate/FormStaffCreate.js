import React, { Fragment, useState } from 'react';
import { EyeFilled, EyeInvisibleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Col, Drawer, Form, Input, Row, Select, Radio, notification } from 'antd';
import staffAPI from '~/api/staffAPI';
import { generateCustomCode } from '~/Utilities/GenerateCustomCode';
const { useForm } = Form;


const { Option } = Select;
const FormStaffCreate = (props) => {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(false);
  
  const [form] = useForm();


  const showDrawer = () => {
    form.resetFields();
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  const addFunc = async (values) => {
    setError(false);
    const checkEmail = await staffAPI.findByEmail(values.usersEmail);
    const checkSDT = await staffAPI.findByPhoneNumber(values.usersPhoneNumber);
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
      let add = { ...values, staffCode: generateCustomCode("NV", 6) };
      console.log(add);
      try {
        const response = await staffAPI.add(add);
        notification.success({
          message: 'Thêm thành công',
          description: 'Dữ liệu đã được thêm thành công',
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
      {' '}
      {/* <Tooltip title="Thêm mới nhân viên"> */}
      <Button style={{ width: '120px', marginLeft: '10px' }} type="primary" onClick={showDrawer} icon={<PlusOutlined />}>Thêm mới</Button>
      {/* </Tooltip> */}
      <Drawer
        title="Thêm mới nhân viên"
        width={720}
        onClose={onClose}
        open={open}
        styles={{
          body: {
            paddingBottom: 80,
          },
        }}
      >
        <Form layout="vertical" initialValues={{ 'usersGender': true }} onFinish={addFunc} form={form}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="usersFullName"
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
                name="staffStatus"
                label="Trạng thái"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng chọn trạng thái!',
                  },
                ]}
              >
                <Select placeholder="Vui lòng chọn trạng thái!">
                  <Option value={1}>Hoạt động</Option>
                  <Option value={0}>Tạm dừng</Option>
                  <Option value={-1}>Không hoạt động</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="usersEmail"
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
                name="usersPassword"
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
                name="usersPhoneNumber"
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
                name="usersAddress"
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
              <Form.Item
                name="usersRolesRoleName"
                label="Chức vụ"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng chọn chức vụ!',
                  },
                ]}
              >
                <Select placeholder="Vui lòng chọn chức vụ!">
                  <Option value="ROLE_ADMIN">Admin</Option>
                  <Option value="ROLE_STAFF">Nhân viên</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Giới tính"
                name="usersGender"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng chọn giới tính!',
                  },
                ]}>
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
                name="usersUserNote"
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
            <Button type="primary" htmlType="submit" icon={<PlusOutlined />}>
              Thêm mới
            </Button>
          </div>
        </Form>
      </Drawer>
    </Fragment>
  );
};
export default FormStaffCreate;
