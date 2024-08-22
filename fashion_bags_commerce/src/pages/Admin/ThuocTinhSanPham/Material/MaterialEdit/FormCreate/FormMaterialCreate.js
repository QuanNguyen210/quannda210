import { PlusOutlined } from '@ant-design/icons';
import { Button, Form, notification, Modal, Popconfirm, Input, Select } from 'antd';
import React, { Component, Fragment, useState } from 'react';
import { generateCustomCode } from '~/Utilities/GenerateCustomCode';
import materialAPI from '~/api/propertitesBalo/materialAPI';

function FormMaterialCreate(props) {
  const [modalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState(true);
  const [form] = Form.useForm();

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const validatematerialName = async (rule, value) => {
    return new Promise((resolve, reject) => {
      if (value && !/^[a-zA-ZÀ-ỹ]+(\s[a-zA-ZÀ-ỹ]+)*$/.test(value)) {
        reject('Tên chất liệu không hợp lệ!');
      } else {
        resolve();
      }
    });
  };
  const addFunc = async (values) => {
    setError(false);
    if (!error) {
      let add = { ...values, materialCode: generateCustomCode('mat', 3) };
      try {
        const response = await materialAPI.add(add);
        notification.success({
          message: 'Add thành công',
          description: 'Dữ liệu đã được thêm thành công',
          duration: 2,
        });

        handleCancel();
        props.reload();

        // Đóng Modal sau khi thêm thành công
      } catch (error) {
        setError(true);
        notification.error({
          message: 'Lỗi',
          description: 'Vui lòng xác nhận',
          duration: 2,
        });
      }
    }
  };

  return (
    <Fragment>
      <Button
        type="default"
        style={{ border: '1px white solid', color: 'white', background: 'green' }}
        onClick={showModal}
        icon={<PlusOutlined />}
      >
        {' '}
        Thêm
      </Button>
      <Modal title="Thêm chất liệu" open={modalOpen} onCancel={handleCancel} footer={null}>
        <div>
          <Form
            form={form}
            labelCol={{
              span: 8,
            }}
            style={{
              maxWidth: 600,
            }}
            wrapperCol={{
              span: 16,
            }}
            onFinish={addFunc} // Xử lý khi submit form
          >
            <Form.Item
              label="Tên"
              name="materialName"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng điền Tên chất liệu!',
                },
                    {
                      validator: validatematerialName,
                    },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item label="Trạng thái" name="materialStatus">
              <Select
                style={{ width: 300 }}
                placeholder="Vui lòng chọn trạng thái"
                options={[
                  {
                    value: '1',
                    label: 'Hoạt động',
                  },
                  {
                    value: '0',
                    label: 'Không Hoạt động',
                  },
                ]}
              />
            </Form.Item>

            <div style={{ textAlign: 'center' }}>
              <Button style={{ border: '1px white solid', color: 'white', background: 'green' }} htmlType="submit">
                Thêm
              </Button>
            </div>
          </Form>
        </div>
      </Modal>
    </Fragment>
  );
}

export default FormMaterialCreate;
