import React, { Fragment, useState } from 'react';
import { EyeFilled, EyeInvisibleOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Col, Drawer, Form, Input, Radio, Row, Select, Space, Tabs, Tooltip, notification } from 'antd';
import staffAPI from '~/api/staffAPI';
import { Option } from 'antd/es/mentions';


const { useForm } = Form;
const { TabPane } = Tabs;


function FormStaffEdit(props) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(false);
  const [getEmail, setEmail] = useState('');
  const [getSDT, setSDT] = useState('');
  const [data, setData] = useState({
    usersId: props.staffData.users.userId,
    staffId: props.staffData.staffId,
    staffCode: props.staffData.staffCode,
    staffStatus: props.staffData.staffStatus,
    usersFullName: props.staffData.users.fullName,
    usersAccount: props.staffData.users.account,
    usersPassword: props.staffData.users.password,
    usersEmail: props.staffData.users.email,
    usersGender: props.staffData.users.gender,
    usersPhoneNumber: props.staffData.users.phoneNumber,
    usersAddress: props.staffData.users.address,
    usersUserNote: props.staffData.users.userNote,
    usersRolesRoleName: props.staffData.users.role
  });
  const [password, setPassword] = useState(props.staffData.users.password);
  const [form] = useForm();

  const showDrawer = () => {
    setData({
      usersId: props.staffData.users.userId,
      staffId: props.staffData.staffId,
      staffCode: props.staffData.staffCode,
      staffStatus: props.staffData.staffStatus,
      usersFullName: props.staffData.users.fullName,
      usersAccount: props.staffData.users.account,
      usersPassword: props.staffData.users.password,
      usersEmail: props.staffData.users.email,
      usersGender: props.staffData.users.gender,
      usersPhoneNumber: props.staffData.users.phoneNumber,
      usersAddress: props.staffData.users.address,
      usersUserNote: props.staffData.users.userNote,
      usersRolesRoleName: props.staffData.users.role
    });
    setOpen(true);
    setEmail(props.staffData.users.email);
    setSDT(props.staffData.users.phoneNumber);
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
    if (getEmail !== values.usersEmail) {
      const checkEmail = await staffAPI.findByEmail(values.usersEmail);
      if (checkEmail.data !== '') {
        notification.error({
          message: 'Cập nhật thất bại',
          description: 'Email đã tồn tại!',
          duration: 2,
        });
        returnEmail = false;
      }
    }
    if (getSDT !== values.usersPhoneNumber) {
      const checkSDT = await staffAPI.findByPhoneNumber(values.usersPhoneNumber);
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
        usersId: data.usersId,
        staffId: data.staffId,
        staffCode: data.staffCode,
        staffStatus: values.staffStatus,
        usersFullName: values.usersFullName,
        usersAccount: data.usersAccount,
        usersPassword: data.usersPassword,
        usersEmail: values.usersEmail,
        usersGender: values.usersGender,
        usersPhoneNumber: values.usersPhoneNumber,
        usersAddress: values.usersAddress,
        usersUserNote: values.usersUserNote,
        usersRolesRoleName: values.usersRolesRoleName
      };
      try {
        await staffAPI.update(data.staffId, update);
        notification.success({
          message: 'Cập nhật thành công',
          description: 'Dữ liệu đã được thêm thành công',
          duration: 2,
        });
        setData(update);
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
  const capNhatMatKhau = (values) => {
    return (
      <div>
        <Form layout="vertical">
          <Row gutter={16}>
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
                <Input.Password iconRender={(visible) => (visible ? <EyeInvisibleOutlined /> : <EyeFilled />)} onChange={updateData} name="usersPassword" />
              </Form.Item>
            </Col>
          </Row>
          <div>
            <Space>
              <Button onClick={() => updatePasswordFunction(values.staffId, password)} type="primary" className="btn btn-warning">
                Lưu
              </Button>
              <Button onClick={onClose}>Thoát</Button>

            </Space>
          </div>

        </Form>
      </div>
    )
  }
  const updatePasswordFunction = async (staffId, password) => {
    setError(false);
    try {
      await staffAPI.updatePassword(staffId, password);
      notification.success({
        message: 'Cập nhật thành công',
        description: 'Dữ liệu đã được thay đổi thành công',
        duration: 2,
      });
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

  const capNhatThongTin = (data) => {
    return (
      <Form layout="vertical" form={form} initialValues={{
        staffId: data.staffId,
        staffCode: data.staffCode,
        staffStatus: data.staffStatus,
        usersFullName: data.usersFullName,
        usersAccount: data.usersAccount,
        usersEmail: data.usersEmail,
        usersGender: data.usersGender,
        usersPhoneNumber: data.usersPhoneNumber,
        usersAddress: data.usersAddress,
        usersUserNote: data.usersUserNote,
        usersRolesRoleName: data.usersRolesRoleName
      }}
        onFinish={updateFunction}>
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
              <Input placeholder="Vui lòng điền họ và tên!"
                name="usersFullName"
              />
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
              <Select placeholder="Vui lòng chọn trạng thái!" name="staffStatus" >
                <Select.Option value={1}>Đang làm</Select.Option>
                <Select.Option value={0}>Tạm dừng</Select.Option>
                <Select.Option value={-1}>Nghỉ làm</Select.Option>
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
              <Input placeholder="Vui lòng điền email!" name="usersEmail" />
            </Form.Item>
          </Col>
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
              <Input placeholder="Vui lòng điền số điện thoại!" name="usersPhoneNumber" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>


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
              <Input placeholder="Vui lòng điền địa chỉ!" name="usersAddress" />
            </Form.Item>
          </Col>
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
              <Select
                placeholder="Vui lòng chọn chức vụ!"
                name="usersRolesRoleName"
              >
                <Select.Option value="ROLE_ADMIN">Admin</Select.Option>
                <Select.Option value="ROLE_STAFF">Nhân viên</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>

          <Col span={12}>
            <Form.Item label="Giới tính" name="usersGender"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng chọn giới tính!',
                },
              ]} >
              <Radio.Group name="usersGender" >
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
              <Input.TextArea rows={4} placeholder="Vui lòng điền ghi chú!" name="usersUserNote" />
            </Form.Item>
          </Col>
        </Row>
        <div>
          <Space>

            <Button htmlType="submit" type="primary" className="btn btn-warning">
              Lưu
            </Button>
            <Button onClick={onClose}>Thoát</Button>
          </Space>
        </div>
      </Form>
    )
  }

  const items = [
    {
      key: '1',
      label: 'Cập nhật thông tin',
      children: capNhatThongTin(data),
    },
    {
      key: '2',
      label: 'Cập nhật mật khẩu',
      children: capNhatMatKhau(data),
    },
  ];
  return (
    <Fragment>
      {' '}
      <Button
        type="default"
        style={{ border: '1px blue solid', color: 'blue' }}
        onClick={showDrawer}
        icon={<EditOutlined />}
      >
        Sửa
      </Button>
      <Drawer
        title="Cập nhật nhân viên"
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
};
export default FormStaffEdit;
