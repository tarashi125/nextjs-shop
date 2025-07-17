'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input } from 'antd';
import { useDispatch } from 'react-redux';
import { setNotification } from '@/store/notificationSlice';
import { useTranslation } from 'react-i18next';

import type { AppDispatch } from '@/store';

interface IProps {
    setFormShowing: (form: 'login' | 'register' ) => void;
}

interface LoginFormFields {
    username: string;
    password: string;
}

export default function LoginForm({ setFormShowing }: IProps) {
    const dispatch = useDispatch<AppDispatch>();
    const [form] = Form.useForm<LoginFormFields>();
    const [submitting, setSubmitting] = useState<boolean>(false);
    const { t } = useTranslation('common');

    const handleRegister = async (values: LoginFormFields) => {
        setSubmitting(true);
        try {
            const { username, password } = values;
            const res = await signIn('credentials', {
                redirect: false,
                username,
                password,
            });

            if (!res?.error) {
                dispatch(setNotification({
                    type: 'success',
                    message: t('login_form.message.success'),
                }));
                form.resetFields();
            } else {
                dispatch(setNotification({
                    type: 'error',
                    message: t('login_form.message.failed'),
                }));
            }
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : t('login_form.message.error');
            dispatch(setNotification({
                type: 'error',
                message,
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
                rules={[{ required: true, message: t('login_form.username.required') }]}
            >
                <Input prefix={<UserOutlined />} placeholder={t('login_form.username.title')} autoFocus />
            </Form.Item>
            <Form.Item
                name="password"
                rules={[{ required: true, message: t('login_form.password.required') }]}
            >
                <Input.Password prefix={<LockOutlined />} placeholder={t('login_form.password.title')} />
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
                    {t('login_form.login')}
                </Button>
                <p className="text-center text-sm text-gray-500 mt-4">
                    {t('login_form.note')}{' '}
                    <button
                        onClick={() => setFormShowing('register')}
                        className="text-blue-600 hover:underline font-medium cursor-pointer"
                        type="button"
                    >
                        {t('login_form.dk')}
                    </button>
                </p>
            </Form.Item>
        </Form>
    );
}