'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { LockOutlined, UserOutlined, AndroidOutlined } from '@ant-design/icons';
import { Button, Form, Input } from 'antd';
import { useDispatch } from 'react-redux';
import { setNotification } from '@/store/notificationSlice';
import { useTranslation } from 'react-i18next';

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
    const { t } = useTranslation('common');

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
                        message: t('register_form.message.success'),
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
                        message: data.error || t('register_form.message.failed'),
                    })
                );
            }
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : t('register_form.message.error');
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
                rules={[{ required: true, message: t('register_form.username.required') }]}
            >
                <Input prefix={<UserOutlined />} placeholder={t('register_form.username.title')} />
            </Form.Item>

            <Form.Item name="name" rules={[{ required: true, message: t('register_form.name.required') }]}>
                <Input prefix={<AndroidOutlined />} placeholder={t('register_form.name.title')} />
            </Form.Item>

            <Form.Item
                name="password"
                rules={[
                    { required: true, message: t('register_form.password.required') },
                    { min: 6, message: t('register_form.password.min') },
                ]}
            >
                <Input.Password prefix={<LockOutlined />} placeholder={t('register_form.password.title')} />
            </Form.Item>

            <Form.Item
                name="confirm_password"
                dependencies={['password']}
                rules={[
                    { required: true, message: t('register_form.confirm_password.required') },
                    ({ getFieldValue }) => ({
                        validator(_, value) {
                            if (!value || getFieldValue('password') === value) {
                                return Promise.resolve();
                            }
                            return Promise.reject(new Error(t('register_form.confirm_password.validate')));
                        },
                    }),
                ]}
            >
                <Input.Password prefix={<LockOutlined />} placeholder={t('register_form.confirm_password.title')} />
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
                    {t('register_form.register')}
                </Button>
                <p className="text-center text-sm text-gray-500 mt-4">
                    {t('register_form.note')}{' '}
                    <button
                        onClick={() => setFormShowing('login')}
                        className="text-blue-600 hover:underline font-medium cursor-pointer"
                    >
                        {t('register_form.dk')}
                    </button>
                </p>
            </Form.Item>
        </Form>
    );
}