'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { LockOutlined, UserOutlined, AndroidOutlined } from '@ant-design/icons';
import { Button, Form, Input } from 'antd';
import { useDispatch } from 'react-redux';
import { setNotification } from '@/store/notificationSlice';

import type { AppDispatch } from '@/store';

interface IProps {
    setFormShowing: (form: 'login' | 'register') => void;
}

interface RegisterFormFields {
    username: string;
    name: string;
    password: string;
    confirm_password: string;
}

export default function RegisterForm({ setFormShowing }: IProps) {
    const dispatch = useDispatch<AppDispatch>();
    const [form] = Form.useForm<RegisterFormFields>();
    const [submitting, setSubmitting] = useState<boolean>(false);

    const handleRegister = async (values: RegisterFormFields) => {
        setSubmitting(true);

        const { username, name, password } = values;

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, name, password }),
            });
            const data = await res.json();

            if (res.ok) {
                dispatch(
                    setNotification({
                        type: 'success',
                        message: 'Register success!',
                    })
                );
                form.resetFields();
                await signIn('credentials', {
                    redirect: false,
                    username,
                    password,
                });
            } else {
                dispatch(
                    setNotification({
                        type: 'error',
                        message: data.error || 'Registration failed',
                    })
                );
            }
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Unexpected error occurred!';
            dispatch(setNotification({ type: 'error', message }));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Form
            form={form}
            name="register"
            style={{ maxWidth: 360 }}
            onFinish={handleRegister}
            autoComplete="off"
        >
            <Form.Item
                name="username"
                rules={[{ required: true, message: 'Please input your Username!' }]}
            >
                <Input prefix={<UserOutlined />} placeholder="Username" />
            </Form.Item>

            <Form.Item name="name" rules={[{ required: true, message: 'Please enter Name!' }]}>
                <Input prefix={<AndroidOutlined />} placeholder="Your Name" />
            </Form.Item>

            <Form.Item
                name="password"
                rules={[
                    { required: true, message: 'Please input your Password!' },
                    { min: 6, message: 'Password must be at least 6 characters' },
                ]}
            >
                <Input.Password prefix={<LockOutlined />} placeholder="Password" />
            </Form.Item>

            <Form.Item
                name="confirm_password"
                dependencies={['password']}
                rules={[
                    { required: true, message: 'Please confirm your Password!' },
                    ({ getFieldValue }) => ({
                        validator(_, value) {
                            if (!value || getFieldValue('password') === value) {
                                return Promise.resolve();
                            }
                            return Promise.reject(new Error('Passwords do not match!'));
                        },
                    }),
                ]}
            >
                <Input.Password prefix={<LockOutlined />} placeholder="Confirm Password" />
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
                    Register
                </Button>
                <p className="text-center text-sm text-gray-500 mt-4">
                    Already have an account?{' '}
                    <button
                        onClick={() => setFormShowing('login')}
                        className="text-blue-600 hover:underline font-medium cursor-pointer"
                    >
                        Login now!
                    </button>
                </p>
            </Form.Item>
        </Form>
    );
}