import React, { Fragment, useState, useEffect } from 'react';
import { EditOutlined } from '@ant-design/icons';
import { Button, Col, Drawer, Form, Input, Row, Select, Space, notification } from 'antd';
import colorAPI from '~/api/propertitesBalo/colorAPI';

function FormcolorEdit(props) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(false);
  const [form] = Form.useForm();

  const showComponent = () => {
    setOpen(true);
    form.resetFields();
  };

  const closeComponent = () => {
    setOpen(false);
  };
  const validatecolorName = async (rule, value) => {
    return new Promise((resolve, reject) => {
      if (value && !/^[a-zA-ZÀ-ỹ]+(\s[a-zA-ZÀ-ỹ]+)*$/.test(value)) {
        reject('Tên màu sắc không hợp lệ!');
      } else {
        resolve();
      }
    });
  };

  const updateFunction = async (values) => {
    setError(false);
    let update = {
      colorId: props.color.colorId,
      colorCode: props.color.colorCode,
      colorName: values.colorName,
      colorStatus: values.colorStatus,
    };
    if (!error) {
      try {
        await colorAPI.update(props.color.colorId, update);
        notification.success({
          message: 'Cập nhật thành công',
          description: 'Dữ liệu đã được cập nhật thành công',
          duration: 2,
        });
        props.reload();
        closeComponent();
      } catch (error) {
        console.log(error);
        setError(true);
        notification.error({
          message: 'Cập nhật thất bại',
          description: 'Dữ liệu không được cập nhật',
          duration: 2,
        });
      }
    }
  };

  return (
    <Fragment>
      <div style={{ color: 'red' }}>
        <Button
          color="default"
          style={{ border: '1px blue solid', color: 'blue' }}
          onClick={showComponent}
          icon={<EditOutlined />}
        >
          Sửa
        </Button>
        <Drawer
          title={'Chỉnh sửa màu sắc có mã: ' + props.color.colorCode}
          width={400}
          onClose={closeComponent}
          open={open}
          style={{
            paddingBottom: 80,
          }}
          footer={null}
        >
          <Form layout="vertical" initialValues={props.color} onFinish={updateFunction} form={form}>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="colorName"
                  label="Tên màu sắc"
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng điền tên màu sắc!',
                    },
                    {
                      validator: validatecolorName,
                    },
                  ]}
                >
                  <Input placeholder="Vui lòng điền tên màu sắc" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  label="Trạng thái"
                  name="colorStatus"
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng chọn trạng thái!',
                    },
                  ]}
                >
                  <Select name="colorStatus" placeholder="Vui lòng chọn trạng thái">
                    <Select.Option value={1}>Hoạt động</Select.Option>
                    <Select.Option value={0}>Ngừng hoạt động</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Space style={{ textAlign: 'right' }}>
                <Button onClick={closeComponent}>Thoát</Button>
                <Button type="primary" htmlType="submit">
                  Lưu
                </Button>
              </Space>
            </Row>
          </Form>
        </Drawer>
      </div>
    </Fragment>
  );
}

export default FormcolorEdit;
