import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Form, notification, Modal, Popconfirm, Input, Select, DatePicker, Space, InputNumber } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { timers } from 'jquery';
import React, { Component, Fragment, useState } from 'react';
import { generateCustomCode } from '~/Utilities/GenerateCustomCode';
import voucherAPI from '~/api/voucherAPI';

function FormVoucherCreate(props) {
  const [modalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState(true);
  const [form] = Form.useForm();
  const { RangePicker } = DatePicker;

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.setFieldValue();
  };

  const validatematerialName = async (rule, value) => {
    return new Promise((resolve, reject) => {
      if (value && !/^[a-zA-ZÀ-ỹ]+(\s[a-zA-ZÀ-ỹ]+)*$/.test(value)) {
        reject('Tên voucher không hợp lệ!');
      } else {
        resolve();
      }
    });
  };

  const addFunc = async (values) => {
    try {
      const isValid = await form.validateFields();
      if (!isValid) {
        setError(true);
        return;
      }

      setError(false);
      const currentDate = new Date();

      const formValues = form.getFieldsValue();
      const { voucherDateRange } = formValues;

      let add = {
        ...values,
        voucherCode: generateCustomCode('NOEL', 6),
        voucherCreateDate: currentDate,
        voucherStartTime: voucherDateRange ? voucherDateRange[0].toDate() : null,
        voucherEndTime: voucherDateRange ? voucherDateRange[1].toDate() : null,
      };

      const response = await voucherAPI.add(add);
      console.log(response);
      notification.success({
        message: 'Add thành công',
        description: 'Dữ liệu đã được thêm thành công',
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
      console.log(error);
    }
  };
  return (
    <Fragment>
      <Button type="primary" onClick={showModal} style={{ width: '100px' }} icon={<PlusOutlined />}></Button>
      <Modal title="Thêm voucher" open={modalOpen} onCancel={handleCancel} footer={null}>
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
              label="Voucher Name"
              name="voucherName"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng điền thông tin!',
                },
                {
                  validator: validatematerialName,
                },
              ]}
            >
              <Input placeholder="Vui lòng nhập tên voucher" />
            </Form.Item>

            <Form.Item
              label="Giảm giá (%) "
              name="discountPercent"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng điền thông tin!',
                },
              ]}
            >
              <InputNumber min={0} max={100} style={{ width: '300px' }} placeholder="Tối đa 100%" />
            </Form.Item>

            {/* <Form.Item label="Ngày tạo" name="voucherCreateDate">
              <DatePicker format="YYYY-MM-DD" />
            </Form.Item> */}

            <Form.Item
              label="Thời gian áp dụng"
              name="voucherDateRange"
              rules={[{ type: 'array', required: true, message: 'VUi lòng nhập thông tin' }]}
            >
              <RangePicker showTime />
            </Form.Item>

            <Form.Item
              label="Giá tối thiểu"
              name="totalPriceToReceive"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng điền thông tin!',
                },
              ]}
            >
              <InputNumber min={0} style={{ width: '300px' }} placeholder="Gia tối thiểu để sử dụng voucher" />
            </Form.Item>

            <Form.Item
              label="Số lượng"
              name="voucherAmount"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng điền thông tin!',
                },
              ]}
            >
              <InputNumber min={1} style={{ width: '300px' }} placeholder="vui lòng nhập số lượng" />
            </Form.Item>

            <Form.Item label="Status" name="voucherStatus">
              <Select
                style={{ width: 300 }}
                placeholder="Vui lòng chọn trạng thái"
                options={[
                  {
                    value: 1,
                    label: 'Hoạt động',
                  },
                  {
                    value: 0,
                    label: 'Không Hoạt động',
                  },
                ]}
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng điền thông tin!',
                  },
                ]}
              />
            </Form.Item>

            <Form.Item
              label="Voucher Note"
              name="voucherNote"
              rules={[
                {
                  // required: true,
                  message: 'Vui lòng điền thông tin!',
                },
              ]}
            >
              <TextArea placeholder="ghi chú" />
            </Form.Item>

            <div style={{ textAlign: 'center' }}>
              <Button type="primary" htmlType="submit">
                Tạo Voucher
              </Button>
            </div>
          </Form>
        </div>
      </Modal>
    </Fragment>
  );
}

export default FormVoucherCreate;
