'use client';
import { useEffect } from 'react';
import {
    Button,
    Form,
    Input,
    Typography,
} from 'antd';
import { useForm } from 'antd/es/form/Form';

import type { Category } from '@/types/category';

const { Title } = Typography;

interface IProps {
    type: string;
    category: Category;
    handleSubmit: (values: Category) => void;
    handleCancel: () => void;
}

const CategoryForm = ({
    type,
    category,
    handleCancel,
    handleSubmit,
}: IProps) => {
    const [form] = useForm<Category>();

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
        >
            <Title level={2}>{type} Category</Title>

            <Form.Item
                name="name"
                label="Name"
                rules={[{ required: true, message: 'Please enter category name!' }]}
            >
                <Input placeholder="Category name" />
            </Form.Item>

            <Form.Item label=" ">
                <Button
                    onClick={handleCancel}
                    color="default"
                    variant="outlined"
                    style={{marginRight: '10px'}}
                >
                    Cancel
                </Button>
                <Button
                    color="primary"
                    variant="solid"
                    htmlType="submit"
                >
                    {type}
                </Button>
            </Form.Item>
        </Form>
    );
};

export default CategoryForm;