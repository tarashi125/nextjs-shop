'use client';
import { useEffect } from 'react';
import {
    Button,
    Form,
    Input,
    Typography,
} from 'antd';
import { useForm } from 'antd/es/form/Form';

const { Title } = Typography;

const CategoryForm = ({type, category, handleCancel, handleSubmit}) => {
    const [form] = useForm();

    useEffect(() => {
        form.setFieldsValue(category);
    }, [ category ]);

    return (
        <Form
            form={form}
            name="category_form"
            onFinish={handleSubmit}
            autoComplete="off"
            layout="vertical"
            style={{'maxWidth': '600px'}}
        >
            <Title level={2}>{type} category</Title>

            <Form.Item name="name" label="Title" rules={[{ required: true, message: 'Please enter name!' }]}>
                <Input placeholder="Category name" />
            </Form.Item>

            <Form.Item label=" ">
                <Button
                    color="default"
                    variant="outlined"
                    style={{'marginRight': '10px'}}
                    onClick={handleCancel}
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