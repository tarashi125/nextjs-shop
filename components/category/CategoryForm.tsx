'use client';
import { useEffect } from 'react';
import {
    Button,
    Form,
    Input,
    Typography,
} from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useTranslation } from 'react-i18next';

import type { Category } from '@/types/category';

const { Title } = Typography;

interface IProps {
    type: string;
    category: Category;
    setCategory: (category: Category) => void;
    submitting: boolean;
    handleSubmit: () => void;
    handleCancel: () => void;
}

const CategoryForm = ({
    type,
    category,
    setCategory,
    submitting,
    handleCancel,
    handleSubmit,
}: IProps) => {
    const [form] = useForm<Category>();
    const { t } = useTranslation();

    useEffect(() => {
        form.setFieldsValue(category);
    }, [ category, form ]);

    return (
        <Form
            form={form}
            name="category_form"
            onFinish={handleSubmit}
            autoComplete="off"
            layout="vertical"
            style={{ maxWidth: 600 }}
            onValuesChange={(_, allValues) => setCategory(allValues)}
        >
            <Title level={2}>{type} {t('category.form_title')}</Title>

            <Form.Item
                name="name"
                label={t('category.form_name.title')}
                rules={[{ required: true, message: t('category.form_name.required') }]}
            >
                <Input placeholder={t('category.form_name.title')} />
            </Form.Item>

            <Form.Item label=" ">
                <Button
                    onClick={handleCancel}
                    color="default"
                    variant="outlined"
                    style={{marginRight: '10px'}}
                >
                    {t('category.form_cancel.title')}
                </Button>
                <Button
                    color="primary"
                    variant="solid"
                    htmlType="submit"
                >
                    {submitting ? `${type}...` : type}
                </Button>
            </Form.Item>
        </Form>
    );
};

export default CategoryForm;