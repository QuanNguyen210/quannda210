import React, { Fragment, useState } from 'react';
import { EditOutlined } from '@ant-design/icons';
import { Button, Col, Drawer, Form, Input, Row, Select, Space, notification, DatePicker, InputNumber } from 'antd';
import voucherAPI from '~/api/voucherAPI';
import moment from 'moment';

function FormvoucherEdit(props) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(false);
  const [form] = Form.useForm();
  const { RangePicker } = DatePicker;

  const showComponent = () => {
    setOpen(true);
    form.getFieldsValue();
  };

  const closeComponent = () => {
    setOpen(false);
    form.resetFields();
  };
  const validatevoucherName = async (rule, value) => {
    return new Promise((resolve, reject) => {
      if (value && !/^[a-zA-ZÀ-ỹ]+(\s[a-zA-ZÀ-ỹ]+)*$/.test(value)) {
        reject('Tên màu sắc không hợp lệ!');
      } else {
        resolve();
      }
    });
  };
  const currentDate = new Date();

  const updateFunction = async (values) => {
    setError(false);
    const formValues = form.getFieldsValue();
    const voucherDateRange = formValues.voucherDateRange;

    try {
      if (voucherDateRange && Array.isArray(voucherDateRange) && voucherDateRange.length === 2) {
        const voucherStartTime = voucherDateRange[0].toDate(); // Convert moment object to Date
        const voucherEndTime = voucherDateRange[1].toDate(); // Convert moment object to Date

        let update = {
          voucherId: props.voucher.voucherId,
          voucherCode: props.voucher.voucherCode,
          voucherName: values.voucherName,
          discountPercent: values.discountPercent,
          voucherCreateDate: currentDate,
          voucherStartTime: voucherStartTime,
          voucherEndTime: voucherEndTime,
          voucherNote: values.voucherNote,
          totalPriceToReceive: values.totalPriceToReceive,
          voucherAmount: values.voucherAmount,
          voucherStatus: values.voucherStatus,
        };

        await voucherAPI.update(props.voucher.voucherId, update);

        notification.success({
          message: 'Cập nhật thành công',
          description: 'Dữ liệu đã được cập nhật thành công',
          duration: 2,
        });

        closeComponent();
        props.reload();
      } else {
        throw new Error('Invalid date range');
      }
    } catch (error) {
      console.error(error);
      setError(true);
      notification.error({
        message: 'Cập nhật thất bại',
        description: 'Dữ liệu không được cập nhật',
        duration: 2,
      });
    }
  };

  const initialValues = {
    ...props.voucher,
    voucherDateRange: [moment(props.voucher.voucherStartTime), moment(props.voucher.voucherEndTime)],
  };

  return (
    <Fragment>
      <div style={{ color: 'red' }}>
        <Button
          voucher="default"
          style={{ border: '1px blue solid', color: 'blue' }}
          onClick={showComponent}
          icon={<EditOutlined />}
        >
          Sửa
        </Button>
        <Drawer
          title={'Chỉnh sửa màu sắc có mã: ' + props.voucher.voucherCode}
          width={400}
          onClose={closeComponent}
          open={open}
          style={{ paddingBottom: 80 }}
          footer={null}
        >
          <Form layout="vertical" initialValues={props.voucher} onFinish={updateFunction} form={form}>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="voucherName"
                  label="Tên Khuyến Mại"
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng nhập tên',
                    },
                    {
                      validator: validatevoucherName,
                    },
                  ]}
                >
                  <Input name="voucherName" placeholder="" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Trạng Thái"
                  name="voucherStatus" // Corrected the typo here from 'vouherStatus' to 'voucherStatus'
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng chọn trạng thái',
                    },
                  ]}
                >
                  <Select placeholder="Vui lòng chọn Trạng Thái">
                    <Select.Option value={1}>Hoạt động</Select.Option>
                    <Select.Option value={0}>Ngừng hoạt động</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="discountPercent"
                  label="Giảm giá (%)"
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng nhập giá giảm',
                    },
                  ]}
                >
                  <InputNumber min={0} max={100} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="totalPriceToReceive"
                  label="Giá tối thiểu"
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng nhập giá tối thiểu',
                    },
                  ]}
                >
                  <InputNumber min={0} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Form.Item
                label="Thời gian áp dụng"
                name="voucherDateRange"
                rules={[{ type: 'array', required: true, message: 'VUi lòng nhập thông tin' }]}
              >
                <RangePicker showTime />
              </Form.Item>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="voucherAmount"
                  label="Số lượng"
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng nhập số lượng',
                    },
                  ]}
                >
                  <InputNumber min={1} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="voucherNote"
                  label="Note"
                  rules={[
                    {
                      message: 'Vui lòng nhập ghi chú',
                    },
                  ]}
                >
                  <Input.TextArea name="voucherNote" rows={4} />
                </Form.Item>
              </Col>
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

export default FormvoucherEdit;
