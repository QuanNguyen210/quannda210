import React, { Fragment, useState } from 'react';
import { EditOutlined } from '@ant-design/icons';
import { Button, Col, Drawer, Form, Input, Row, Select, Space, notification } from 'antd';
import compartmentAPI from '~/api/propertitesBalo/compartmentAPI';

function FormEditCompartment(props) {
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
    const validatecompartmentName = async (rule, value) => {
        return new Promise((resolve, reject) => {
            if (value && !/^[a-zA-ZÀ-ỹ]+(\s[a-zA-ZÀ-ỹ]+)*$/.test(value)) {
                reject('Tên kiểu ngăn không hợp lệ!');
            } else {
                resolve();
            }
        });
    };

    const updateFunction = async (values) => {

        setError(false);
        let update = {
            compartmentId: props.type.compartmentId,
            compartmentCode: props.type.compartmentCode,
            compartmentName: values.compartmentName,
            compartmentStatus: values.compartmentStatus,
        };
        if (!error) {
            try {
                await compartmentAPI.update(props.type.compartmentId, update);
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
    }

    return (
        <Fragment>
            <div style={{ color: 'red' }}>
                <Button
                    type="default"
                    style={{ border: '1px blue solid', color: 'blue' }}
                    onClick={showComponent}
                    icon={<EditOutlined />}
                >
                    Sửa
                </Button>
                <Drawer
                    title={'Chỉnh sửa kiểu ngăn có mã: ' + props.type.compartmentCode}
                    width={400}
                    onClose={closeComponent}
                    open={open}
                    style={{
                        paddingBottom: 80,
                    }}
                    footer={
                        null
                    }
                >
                    <Form layout="vertical"
                        initialValues={props.type}
                        onFinish={updateFunction}
                        form={form}>

                        <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item
                                    name="compartmentName"
                                    label="Tên kiểu ngăn"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng điền tên kiểu ngăn!',
                                        },
                                        {
                                            validator: validatecompartmentName,
                                        },
                                    ]}
                                >
                                    <Input
                                        placeholder="Vui lòng điền tên kiểu ngăn"
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item
                                    label="Trạng thái"
                                    name="compartmentStatus"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng chọn trạng thái!',
                                        },
                                    ]}
                                >
                                    <Select
                                        name="compartmentStatus"
                                        placeholder="Vui lòng chọn trạng thái"
                                    >
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
export default FormEditCompartment;
