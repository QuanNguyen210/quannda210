import React, { Fragment, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Form, Modal, Select, notification } from 'antd';
import Input from 'antd/es/input/Input';
import buckleTypeAPI from '~/api/propertitesBalo/buckleTypeAPI';
import { generateCustomCode } from '~/Utilities/GenerateCustomCode';
function FormBuckleTypeCreate(props) {
  const [openComponent, setOpenComponent] = useState(false);
  const [error, setError] = useState(true);
  const [form] = Form.useForm();

  const showComponent = function () {
    setOpenComponent(true);
    form.resetFields();
  };

  const handleCancel = function () {
    setOpenComponent(false);
  };

  const validateTypeName = async (rule, value) => {
    return new Promise((resolve, reject) => {
      if (value && !/^[a-zA-ZÀ-ỹ]+(\s[a-zA-ZÀ-ỹ]+)*$/.test(value)) {
        reject('Tên kiểu khóa không hợp lệ!');
      } else {
        resolve();
      }
    });
  };

  const addFuncion = async (values) => {
    setError(false);
    let add = { ...values, buckleTypeCode: generateCustomCode('BuckleType', 6) };
    try {
      await buckleTypeAPI.add(add);
      notification.success({
        message: 'Thêm thành công',
        description: 'Dữ liệu được thêm thành công',
        duration: 2,
      });
      handleCancel();
      props.reload();
    } catch (error) {
      setError(true);
      notification.error({
        message: 'Lỗi',
        description: 'Vui lòng xác nhận',
        duration: 2,
      });
    }

  };

  return (
    <Fragment>
      <Button
        type="default"
        style={{ border: '1px white solid', color: 'white', background: 'green' }}
        onClick={showComponent}
        icon={<PlusOutlined />}
      >
        Thêm
      </Button>
      <Modal title="Thêm kiểu khóa" open={openComponent} onCancel={handleCancel} footer={null}>
        <div>
          <Form
            form={form}
            labelCol={{ span: 8 }}
            style={{ maxWidth: 600 }}
            wrapperCol={{ span: 16 }}
            autoComplete="on"
            onFinish={addFuncion} // xử lí khi submit form
          >
            <Form.Item
              label="Tên kiểu khóa"
              name="buckleTypeName"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng điền tên kiểu khóa!',
                },
                {
                  validator: validateTypeName,
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Trạng thái"
              name="buckleTypeStatus"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng chọn trạng thái!',
                },
              ]}
            >
              <Select
                placeholder="Vui lòng chọn trạng thái"
                style={{ width: 250 }}
                options={[
                  {
                    value: '1',
                    label: 'Hoạt động',
                  },
                  {
                    value: '0',
                    label: 'Ngừng Hoạt động',
                  },
                ]}
              ></Select>
            </Form.Item>

            <div style={{ textAlign: 'right' }}>
              <Button type="primary" htmlType="submit">
                Thêm
              </Button>
            </div>
          </Form>
        </div>
      </Modal>
    </Fragment>
  );
}
export default FormBuckleTypeCreate;
