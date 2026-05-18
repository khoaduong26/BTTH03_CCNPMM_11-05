import React from 'react';
import { Button, Col, Divider, Form, Input, notification, Row } from 'antd';
import { loginApi } from '../util/api';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';

const LoginPage = () => {
    const navigate = useNavigate();

    const onFinish = async (values) => {
        const { email, password } = values;

        const res = await loginApi(email, password);

        if (res && res.access_token) {
            localStorage.setItem("access_token", res.access_token);
            notification.success({
                message: "LOGIN USER",
                description: "Success"
            });
            navigate("/");
        } else {
            notification.error({
                message: "LOGIN USER",
                description: res?.message ?? "error"
            });
        }
    };
    
    return (
        <Row justify={"center"} style={{ marginTop: "50px" }}>
            <Col xs={24} md={16} lg={8}>
                <fieldset style={{
                    padding: '20px',
                    margin: '20px',
                    border: '1px solid #d9d9d9',
                    borderRadius: '8px'
                }}>
                    <legend>Đăng Nhập</legend>
                    <Form
                        name="login"
                        onFinish={onFinish}
                        layout="vertical"
                        autoComplete="off"
                    >
                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[{ required: true, type: 'email', message: 'Please input a valid email!' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Password"
                            name="password"
                            rules={[{ required: true, message: 'Please input your password!' }]}
                        >
                            <Input.Password />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" block>
                                Login
                            </Button>
                        </Form.Item>
                    </Form>
                    <Link to={"/"}><ArrowLeftOutlined /> Quay lại trang chủ</Link>
                    <Divider />
                    <div style={{ textAlign: "center" }}>
                        Chưa có tài khoản? <Link to={"/register"}>Đăng ký tại đây</Link>
                    </div>
                </fieldset>
            </Col>
        </Row>
    );
};

export default LoginPage;