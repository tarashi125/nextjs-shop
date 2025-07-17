'use client';

import { useEffect, useState } from 'react';
import {Form, Input, InputNumber, Select, Button, Typography} from 'antd';
import { fetchCategory } from '@/lib/services/categoryService';
import { useTranslation } from 'react-i18next';

import type { Product } from '@/types/product';
import type { Category, CategoryOption } from '@/types/category';

const { Title } = Typography;

interface IProps {
    type: string;
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
    const { t } = useTranslation('common');

    useEffect(() => {
        const loadOptions = async () => {
            const categories = await fetchCategory();
            const mapped: CategoryOption[] = categories.map((c: Category) => ({
                label: c.name,
                value: c._id!,
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
            <Title level={2}>{type} {t('product.form_title')}</Title>
            <Form
                form={form}
                layout="vertical"
                style={{ maxWidth: '600px' }}
                onFinish={handleSubmit}
                onValuesChange={(_, allValues) => setProduct(allValues)}
            >
                <Form.Item
                    name="name"
                    label={t('product.form_name.title')}
                    rules={[{ required: true, message: t('product.form_name.required') }]}
                >
                    <Input placeholder={t('product.form_name.title')} />
                </Form.Item>

                <Form.Item
                    name="price"
                    label={t('product.form_price.title')}
                    rules={[{ required: true, message: t('product.form_price.required') }]}
                >
                    <InputNumber
                        style={{ width: '100%' }}
                        min={0}
                        step={1000}
                        placeholder={t('product.form_price.title')}
                        addonAfter="đ"
                    />
                </Form.Item>

                <Form.Item
                    name="category"
                    label={t('product.form_category.title')}
                    rules={[{ required: true, message: t('product.form_category.required') }]}
                >
                    <Select
                        mode="multiple"
                        style={{ width: '100%' }}
                        placeholder={t('product.form_category.required')}
                        options={options}
                    />
                </Form.Item>

                <Form.Item>
                    <Button
                        onClick={handleCancel}
                        style={{ marginRight: '10px' }}
                    >
                        {t('product.form_cancel.title')}
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