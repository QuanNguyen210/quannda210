import React, { Fragment, useEffect, useState } from 'react';
import { EyeFilled, EyeInvisibleOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Col, Drawer, Form, Input, Radio, Row, Select, Space, Tabs, notification } from 'antd';

import customerAPI from '~/api/customerAPI';
const { useForm } = Form;
const { TabPane } = Tabs;


function FormCustomerEdit(props) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(false);
  const [getEmail, setEmail] = useState('');
  const [getSDT, setSDT] = useState('');
  const [password, setPassword] = useState(props.customerData.users.password);

  const [form] = useForm();


  const showDrawer = () => {
    setOpen(true);
    setEmail(props.customerData.users.email);
    setSDT(props.customerData.users.phoneNumber);
    setPassword(props.customerData.users.password);
    form.resetFields();
  };
  const onClose = () => {
    setOpen(false);

  };
  const updateData = (event) => {
    const { name, value } = event.target;
    setPassword(value);
  };

  const updateFunction = async (values) => {
    setError(false);
    let returnEmail = true;
    let returnSDT = true;
    if (getEmail !== values.email) {
      const checkEmail = await customerAPI.findByEmail(values.email);
      if (checkEmail.data !== '') {
        notification.error({
          message: 'Cập nhật thất bại',
          description: 'Email đã tồn tại!',
          duration: 2,
        });
        returnEmail = false;
      }
    }
    if (getSDT !== values.phoneNumber) {
      const checkSDT = await customerAPI.findByPhoneNumber(values.phoneNumber);
      if (checkSDT.data !== '') {
        notification.error({
          message: 'Cập nhật thất bại',
          description: 'Số điện thoại đã tồn tại!',
          duration: 2,
        });
        returnSDT = false;
      }
    }
    if (returnEmail === true && returnSDT === true) {
      let update = {
        customerId: props.customerData.customerId,
        customerCode: props.customerData.customerCode,
        customerStatus: values.customerStatus,
        consumePoints: props.customerData.consumePoints,
        rankingPoints: values.rankingPoints,
        customerRanking: props.customerData.customerRanking,
        users: {
          userId: props.customerData.users.userId,
          account: values.fullName,
          fullName: values.fullName,
          birthDay: props.customerData.users.birthDay,
          password: props.customerData.users.password,
          email: values.email,
          userStatus: props.customerData.users.userStatus,
          gender: values.gender,
          address: values.address,
          phoneNumber: values.phoneNumber,
          userNote: values.userNote,
          role: "ROLE_CUSTOMER"
        }
      }
      try {
        console.log(props.customerData);
        console.log(update);
        await customerAPI.updateNotPassword(update);
        notification.success({
          message: 'Update thành công',
          description: 'Dữ liệu đã được thay đổi thành công',
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

  const updatePassword = async (customerId, password) => {
    setError(false);
    try {
      await customerAPI.updatePassword(customerId, password);
      notification.success({
        message: 'Cập nhật thành công',
        description: 'Dữ liệu đã được thay đổi thành công',
        duration: 2,
      });
      // setData(...data,);
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
  };


  const capNhatThongTin = (data) => {
    return (
      <Form layout="vertical" form={form} initialValues=
        {{
          fullName: props.customerData.users.fullName,
          customerStatus: props.customerData.customerStatus,
          email: props.customerData.users.email,
          phoneNumber: props.customerData.users.phoneNumber,
          address: props.customerData.users.address,
          gender: props.customerData.users.gender,
          rankingPoints: props.customerData.rankingPoints,
          userNote: props.customerData.users.userNote,
          consumePoints: props.customerData.consumePoints,
          customerRanking: props.customerData.customerRanking,
        }}
        onFinish={updateFunction} >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name='fullName'
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
              <Input
                placeholder="Vui lòng điền họ và tên!"
              />
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
              <Select placeholder="Vui lòng chọn trạng thái">
                <Select.Option value={1}>Hoạt động</Select.Option>
                <Select.Option value={-1}>Không hoạt động</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name='email'
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
              <Input
                placeholder="Vui lòng điền email!"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name='phoneNumber'
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
              <Input
                placeholder="Vui lòng điền SĐT!"
              />
            </Form.Item>
          </Col>

        </Row>
        <Row gutter={16}>

          <Col span={12}>
            <Form.Item
              name='address'
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
          <Col span={12}>
            <Form.Item label="Giới tính" name='gender'
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
          <Col span={12}>
            <Form.Item
              name="consumePoints"
              label="Điểm tiêu dùng"
            >
              <Input
                placeholder="Điểm tiêu dùng"
                type="number"
                disabled={true}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="rankingPoints"
              label="Điểm hạng"
            >
              <Input
                placeholder="Điểm hạng"
                type="number"
                disabled={true}
              />
            </Form.Item>
          </Col>

        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="customerRanking"
              label="Hạng khách hàng"
            >
              <Select placeholder="Vui lòng chọn hạng khách hàng!" disabled={true}>
                <Select.Option value={"KH_TIEMNANG"}>Tiềm năng</Select.Option>
                <Select.Option value={"KH_THANTHIET"}>Thân thiết</Select.Option>
                <Select.Option value={"KH_BAC"}>Bạc</Select.Option>
                <Select.Option value={"KH_VANG"}>Vàng</Select.Option>
                <Select.Option value={"KH_KIMCUONG"}>Kim cương</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name='userNote'
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
          <Space>
            <Button htmlType="submit" type="primary" className="btn btn-warning">
              Lưu
            </Button>
            <Button onClick={() => { form.resetFields(); }}>Tải lại</Button>
            <Button onClick={onClose}>Thoát</Button>
          </Space>
        </div>
      </Form>)
  }


  const items = [
    {
      key: '1',
      label: 'Cập nhật thông tin',
      children: capNhatThongTin(props.customerData),
    }
  ];
  return (
    <Fragment>
      <Button style={{ borderColor: 'blue', color: 'blue' }} onClick={showDrawer} icon={<EditOutlined />}>
        Sửa
      </Button>
      <Drawer
        title={'Cập nhật khách hàng có mã: ' + props.customerData.customerCode}
        width={720}
        onClose={onClose}
        open={open}
        styles={{
          body: {
            paddingBottom: 80,
          },
        }}
      >
        <Tabs defaultActiveKey="1" items={items} />


      </Drawer>
    </Fragment>
  );
}
export default FormCustomerEdit;
