import React, { Fragment, useState, useEffect } from 'react';
import { EditOutlined } from '@ant-design/icons';
import { Button, Col, Drawer, Form, Input, InputNumber, Row, Select, Space, notification } from 'antd';
import sizeAPI from '~/api/propertitesBalo/sizeAPI';

function FormSizeEdit(props) {
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
  const validatesizeName = async (rule, value) => {
    return new Promise((resolve, reject) => {
      if (value && !/^[a-zA-ZÀ-ỹ]+(\s[a-zA-ZÀ-ỹ]+)*$/.test(value)) {
        reject('Tên size không hợp lệ!');
      } else {
        resolve();
      }
    });
  };

  const updateFunction = async (values) => {
    setError(false);
    let update = {
      sizeId: props.size.sizeId,
      sizeCode: props.size.sizeCode,
      sizeName: values.sizeName,
      sizeLength: values.sizeLength,
      sizeWidth: values.sizeWidth,
      sizeHeight: values.sizeHeight,
      sizeStatus: values.sizeStatus,
    };
    if (!error) {
      try {
        await sizeAPI.update(props.size.sizeId, update);
        notification.success({
          message: 'Cập nhật thành công',
          description: 'Dữ liệu đã được cập nhật thành công',
          duration: 2,
        });
        closeComponent();
        props.reload();
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
          size="default"
          style={{ border: '1px blue solid', color: 'blue' }}
          onClick={showComponent}
          icon={<EditOutlined />}
        >
          Sửa
        </Button>
        <Drawer
          title={'Chỉnh sửa size có mã: ' + props.size.sizeCode}
          width={400}
          onClose={closeComponent}
          open={open}
          style={{
            paddingBottom: 80,
          }}
          footer={null}
        >
          <Form layout="vertical" initialValues={props.size} onFinish={updateFunction} form={form}>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="sizeName"
                  label="Tên size"
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng điền tên size!',
                    },
                    {
                      validator: validatesizeName,
                    },
                  ]}
                >
                  <Input placeholder="Vui lòng điền tên size" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="sizeLength"
                  label="Chiều dài"
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng điền chiều dài size!',
                    },
                  ]}
                >
                  <InputNumber style={{ width: '300px' }} min={0} placeholder="Vui lòng điền chiều dài size" />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item
                  name="sizeWidth"
                  label="Chiều Rộng"
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng điền chiều rộng size!',
                    },
                  ]}
                >
                  <InputNumber min={0} style={{ width: '300px' }} placeholder="Vui lòng điền chiều rộng size" />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item
                  name="sizeHeight"
                  label="Chiều cao"
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng điền chiều cao size!',
                    },
                  ]}
                >
                  <InputNumber style={{ width: '300px' }} min={0} placeholder="Vui lòng điền chiều cao size" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  label="Trạng thái"
                  name="sizeStatus"
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng chọn trạng thái!',
                    },
                  ]}
                >
                  <Select name="sizeStatus" placeholder="Vui lòng chọn trạng thái">
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

export default FormSizeEdit;
