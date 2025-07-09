"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input } from 'antd';
import { useDispatch } from 'react-redux';
import { setNotification } from '@/store/notificationSlice';

export default function LoginForm({ setFormShowing, setIsModalOpen }) {
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const [submitting, setSubmitting] = useState(false);

    const handleRegister = async (values) => {
        setSubmitting(true);
        try {
            const { username, password } = values;
            const res = await signIn("credentials", {
                redirect: false,
                username,
                password,
            });

            if (!res?.error) {
                dispatch(setNotification({
                    type: 'success',
                    message: 'Login success!',
                }));
                form.resetFields();
            } else {
                dispatch(setNotification({
                    type: 'error',
                    message: 'Login failed!',
                }));
            }
        } catch (err) {
            dispatch(setNotification({
                type: 'error',
                message: err.message || 'Unexpected error occurred!',
            }));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Form
            form={form}
            name="login"
            style={{ maxWidth: 360 }}
            initialValues={{ remember: true }}
            onFinish={handleRegister}
            autoComplete="off"
        >
            <Form.Item
                name="username"
                rules={[{ required: true, message: 'Please input your Username!' }]}
            >
                <Input prefix={<UserOutlined />} placeholder="Username" autoFocus />
            </Form.Item>
            <Form.Item
                name="password"
                rules={[{ required: true, message: 'Please input your Password!' }]}
            >
                <Input.Password prefix={<LockOutlined />} placeholder="Password" />
            </Form.Item>

            <Form.Item style={{ marginBottom: 0, textAlign: 'center' }}>
                <Button
                    type="primary"
                    htmlType="submit"
                    loading={submitting}
                    disabled={submitting}
                    style={{ marginBottom: 5 }}
                    block
                >
                    Log in
                </Button>
                <p className="text-center text-sm text-gray-500 mt-4">
                    or{' '}
                    <button
                        onClick={() => setFormShowing('register')}
                        className="text-blue-600 hover:underline font-medium cursor-pointer"
                    >
                        Register now!
                    </button>
                </p>
            </Form.Item>
        </Form>
    );
}