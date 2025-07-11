'use client';

import { useEffect, useState } from 'react';
import {Form, Input, InputNumber, Select, Button, Typography} from 'antd';
import { fetchCategory } from '@/lib/services/categoryService';

import type { Product } from '@/types/product';
import type { Category, CategoryOption } from '@/types/category';

const { Title } = Typography;

interface IProps {
    type: 'Create' | 'Edit';
    product: Product;
    setProduct: (product: Product) => void;
    submitting: boolean;
    handleSubmit: () => void;
    handleCancel: () => void;
}

const ProductForm = ({
   type,
   product,
   setProduct,
   submitting,
   handleSubmit,
   handleCancel,
}: IProps) => {
    const [form]  = Form.useForm<Product>();
    const [options, setOptions] = useState<CategoryOption[]>([]);

    useEffect(() => {
        const loadOptions = async () => {
            const categories = await fetchCategory();
            const mapped: CategoryOption[] = categories.map((c: Category) => ({
                label: c.name,
                value: c._id,
            }));
            setOptions(mapped);
        };
        loadOptions();
    }, []);

    useEffect(() => {
        form.setFieldsValue(product);
    }, [product, form]);

    return (
        <>
            <Title level={2}>{type} Product</Title>
            <Form
                form={form}
                layout="vertical"
                style={{ maxWidth: '600px' }}
                onFinish={handleSubmit}
                onValuesChange={(_, allValues) => setProduct(allValues)}
            >
                <Form.Item
                    name="name"
                    label="Name"
                    rules={[{ required: true, message: 'Please enter product name!' }]}
                >
                    <Input placeholder="Product name" />
                </Form.Item>

                <Form.Item
                    name="price"
                    label="Price"
                    rules={[{ required: true, message: 'Please enter product price!' }]}
                >
                    <InputNumber
                        style={{ width: '100%' }}
                        min={0}
                        step={1000}
                        placeholder="Price"
                        addonAfter="đ"
                    />
                </Form.Item>

                <Form.Item
                    name="category"
                    label="Category"
                    rules={[{ required: true, message: 'Please select product category!' }]}
                >
                    <Select
                        mode="multiple"
                        style={{ width: '100%' }}
                        placeholder="Please select product category!"
                        options={options}
                    />
                </Form.Item>

                <Form.Item>
                    <Button
                        onClick={handleCancel}
                        style={{ marginRight: '10px' }}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="primary"
                        htmlType="submit"
                        disabled={submitting}
                    >
                        {submitting ? `${type}...` : type}
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
};

export default ProductForm;