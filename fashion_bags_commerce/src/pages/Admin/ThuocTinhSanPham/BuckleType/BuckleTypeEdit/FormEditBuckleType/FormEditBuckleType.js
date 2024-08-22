import React, { Fragment, useState } from 'react';
import { EditOutlined } from '@ant-design/icons';
import { Button, Col, Drawer, Form, Input, Row, Select, Space, notification } from 'antd';
import buckleTypeAPI from '~/api/propertitesBalo/buckleTypeAPI';

function FormEditBuckleType(props) {
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
    const validateTypeName = async (rule, value) => {
        return new Promise((resolve, reject) => {
            if (value && !/^[a-zA-ZÀ-ỹ]+(\s[a-zA-ZÀ-ỹ]+)*$/.test(value)) {
                reject('Tên kiểu không hợp lệ!');
            } else {
                resolve();
            }
        });
    };

    const updateFunction = async (values) => {

        setError(false);
        let update = {
            buckleTypeId: props.buckleType.buckleTypeId,
            buckleTypeCode: props.buckleType.buckleTypeCode,
            buckleTypeName: values.buckleTypeName,
            buckleTypeStatus: values.buckleTypeStatus,
        };
        console.log(update);
        if (!error) {
            try {
                await buckleTypeAPI.update(props.buckleType.buckleTypeId, update);
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
                    title={'Chỉnh sửa kiểu khóa có mã: ' + props.buckleType.buckleTypeCode}
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
                        initialValues={props.buckleType}
                        onFinish={updateFunction}
                        form={form}>

                        <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item
                                    name="buckleTypeName"
                                    label="Tên kiểu khóa"
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
                                    <Input
                                        placeholder="Vui lòng điền tên kiểu khóa"
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={24}>
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
                                        name="typeStatus"
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

export default FormEditBuckleType;
