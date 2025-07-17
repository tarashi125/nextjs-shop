'use client';
import React, { useMemo, useEffect } from 'react';
import {
    Form,
    Input,
    Select,
    InputNumber,
    Button,
    Typography,
    Table,
    Popconfirm,
    Space,
    Tag,
} from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useForm, useWatch } from 'antd/es/form/Form';
import { formatCurrency } from '@/lib/utils';
import { createDefaultOrderItem } from '@/lib/helpers/order';
import { orderStatus, getStatusColor } from '@/constants/defaults';
import { useTranslation } from 'react-i18next';

import type { OrderItem } from '@/types/order';
import { Product } from '@/types/product';
import { Order } from '@/types/order';

const { Option } = Select;
const { Title } = Typography;
const { TextArea } = Input;

interface OrderFormValues {
    title: string;
    description?: string;
    status: string;
    items: OrderItem[];
}

interface IProps {
    type: string;
    order: Order;
    setOrder: (p: (pre) => any) => void;
    submitting: boolean;
    handleCancel: () => void;
    handleSubmit: () => void;
    products: Product[];
}

const OrderForm= ({
     type,
     order,
     setOrder,
     submitting,
     handleCancel,
     handleSubmit,
     products,
} : IProps ) => {
    const { t } = useTranslation();
    const [form] = useForm<Order>();

    const title = useWatch('title', form);
    const description = useWatch('description', form);
    const status = useWatch('status', form);
    const items: OrderItem[] = useWatch('items', form) || [];

    useEffect(() => {
        if (order?._id) {
            form.setFieldsValue(order);
        }
    }, [order?._id, form]);

    const itemDetails = useMemo(() => {
        return items.map((item) => {
            const price = Number(item?.price || 0);
            const qty = Number(item?.qty || 0);
            const discount = Number(item?.discount || 0);
            const tax = Number(item?.tax || 0);

            const unitPrice = Math.max(price - discount, 0);
            const subtotal = unitPrice * qty;
            const taxAmount = (subtotal * tax) / 100;
            const total = subtotal + taxAmount;

            return { subtotal, taxAmount, total, discountTotal: discount * qty };
        });
    }, [items]);

    const totalDiscount = itemDetails.reduce((sum, d) => sum + d.discountTotal, 0);
    const totalTax = itemDetails.reduce((sum, d) => sum + d.taxAmount, 0);
    const total = itemDetails.reduce((sum, d) => sum + d.total, 0);

    useEffect(() => {
        setOrder((prev) => {
            const next = {
                ...prev,
                title,
                description,
                status,
                items,
                total,
                totalDiscount,
                totalTax,
            };
            if (JSON.stringify(prev) !== JSON.stringify(next)) {
                return next;
            }
            return prev;
        });
    }, [title, description, status, items, total, totalDiscount, totalTax]);

    const handleSelectProduct = (productId: string, index: number) => {
        const product = products.find((p) => p._id === productId);
        if (product) {
            const currentItems: OrderItem[] = form.getFieldValue('items') || [];
            const updatedItems = [...currentItems];
            updatedItems[index] = {
                ...updatedItems[index],
                productId,
                price: product.price,
            };
            form.setFieldsValue({ items: updatedItems });
        }
    };

    return (
        <Form
            form={form}
            name="order_form"
            onFinish={handleSubmit}
            autoComplete="off"
            layout="vertical"
            style={{ maxWidth: '1000px' }}
        >
            <Title level={2}>{type} order</Title>

            <Form.Item
                name="title"
                label={t('order.form_name.title')}
                rules={[{ required: true, message: t('order.form_name.required') }]}
            >
                <Input placeholder={t('order.form_name.placeholder')} />
            </Form.Item>

            <Form.Item
                name="description"
                label={t('order.form_description.title')}
            >
                <TextArea
                    rows={3}
                    placeholder={t('order.form_description.placeholder')}
                />
            </Form.Item>

            <Form.Item
                name="status"
                label={t('order.form_status.title')}
                rules={[{ required: true, message: t('order.form_status.required') }]}
                style={{maxWidth: '200px'}}
            >
                <Select placeholder={t('order.form_status.required')}>
                    {orderStatus.map((key) => (
                        <Option key={key} value={key}>
                            <Tag color={getStatusColor(key)}>{t(`order.status.${key}`)}</Tag>
                        </Option>
                    ))}
                </Select>
            </Form.Item>

            <Form.List name="items">
                {(fields, { add, remove }) => {
                    const columns = [
                        {
                            title: t('order.form_items.name.title'),
                            dataIndex: 'name',
                            width: '25%',
                            render: (_, __, index: number) => {
                                const currentType = form.getFieldValue(['items', index, 'type']) ?? 'select';
                                return (
                                    <Form.Item style={{ margin: 0 }}
                                        name={[index, currentType === 'custom' ? 'name' : 'productId']}
                                        rules={[{ required: true, message: t('order.form_items.name.required') }]}
                                    >
                                        {currentType === 'custom' ? (
                                            <Input placeholder={t('order.form_items.name.input')} />
                                        ) : (
                                            <Select
                                                placeholder={t('order.form_items.name.select')}
                                                onChange={(value) => handleSelectProduct(value, index)}
                                                showSearch
                                                optionFilterProp="children"
                                                filterOption={(input, option) => {
                                                    const normalize = (str) =>
                                                        str.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
                                                    return normalize(option?.children ?? '').includes(normalize(input));
                                                }}
                                            >
                                                {products.map((product) => (
                                                    <Option key={product._id} value={product._id}>
                                                        {product.name}
                                                    </Option>
                                                ))}
                                            </Select>
                                        )}
                                    </Form.Item>
                                );
                            },
                        },
                        {
                            title: t('order.form_items.qty.title'),
                            dataIndex: 'qty',
                            width: '12.5%',
                            render: (_, __, index) => (
                                <Form.Item
                                    style={{ margin: 0 }}
                                    name={[index, 'qty']}
                                    initialValue={1}
                                    rules={[{ required: true, message: t('order.form_items.qty.required') }]}
                                >
                                    <InputNumber min={0.1} step={1} style={{ width: '100%' }} />
                                </Form.Item>
                            ),
                        },
                        {
                            title: t('order.form_items.price.title'),
                            dataIndex: 'price',
                            width: '16,67%',
                            render: (_, __, index) => (
                                <Form.Item
                                    style={{ margin: 0 }}
                                    name={[index, 'price']}
                                    rules={[{ required: true, message: t('order.form_items.price.required') }]}
                                >
                                    <InputNumber min={0} step={1000} style={{ width: '100%' }} addonAfter="đ" />
                                </Form.Item>
                            ),
                        },
                        {
                            title: t('order.form_items.discount.title'),
                            dataIndex: 'discount',
                            width: '16,67%',
                            render: (_, __, index) => (
                                <Form.Item
                                    style={{ margin: 0 }}
                                    name={[index, 'discount']}
                                    initialValue={0}
                                    rules={[{ required: true, message: t('order.form_items.discount.required') }]}
                                >
                                    <InputNumber min={0} step={1000} style={{ width: '100%' }} addonAfter="đ" />
                                </Form.Item>
                            ),
                        },
                        {
                            title: t('order.form_items.tax.title'),
                            dataIndex: 'tax',
                            width: '12.5%',
                            render: (_, __, index) => (
                                <Form.Item
                                    style={{ margin: 0 }}
                                    name={[index, 'tax']}
                                    initialValue={0}
                                    rules={[{ required: true, message: t('order.form_items.tax.required') }]}
                                >
                                    <InputNumber min={0} max={100} step={1} style={{ width: '100%' }} addonAfter="%" />
                                </Form.Item>
                            ),
                        },
                        {
                            title: t('order.form_items.actions.title'),
                            dataIndex: 'actions',
                            width: '16,67%',
                            render: (_, __, index) => (
                                <Popconfirm
                                    title={t('order.form_items.actions.confirm.title')}
                                    okText={t('order.form_items.actions.confirm.ok')}
                                    cancelText={t('order.form_items.actions.confirm.cancel')}
                                    onConfirm={() => remove(index)}
                                >
                                    <Button danger icon={<DeleteOutlined />}>
                                        {t('order.form_items.actions.delete')}
                                    </Button>
                                </Popconfirm>
                            ),
                        },
                    ];

                    return (
                        <>
                            <Table
                                bordered
                                title={() => t('order.form_items.items')}
                                dataSource={fields.map((field, index) => ({ key: field.key, index }))}
                                columns={columns}
                                pagination={false}
                                expandable={{
                                    expandedRowRender: (record) => {
                                        const index = record.index;
                                        const detail = itemDetails[index] || {};
                                        return (
                                            <div style={{ paddingLeft: 16 }}>
                                                <p className={'p-0 text-right'}><strong>{t('order.form_items.total')}:</strong> {formatCurrency(detail.total)}</p>
                                            </div>
                                        );
                                    },
                                    expandedRowKeys: fields.map((f) => f.key),
                                    expandIcon: () => null,
                                    showExpandColumn: false,
                                }}
                            />

                            <Form.Item style={{ marginTop: '15px' }}>
                                <Space>
                                    <Button
                                        onClick={() => add(createDefaultOrderItem())}
                                        icon={<PlusOutlined />}
                                    >
                                        {t('order.form_items.add_p')}
                                    </Button>
                                    <Button
                                        onClick={() => add({
                                            ...createDefaultOrderItem(),
                                            type: 'custom',
                                            name: ''
                                        })}
                                        icon={<PlusOutlined />}
                                    >
                                        {t('order.form_items.add_c')}
                                    </Button>
                                </Space>
                            </Form.Item>
                        </>
                    );
                }}
            </Form.List>

            <Form.Item>
                <Title level={5}>{t('order.form_details.discount')}: {formatCurrency(totalDiscount)}</Title>
                <Title level={5}>{t('order.form_details.tax')}: {formatCurrency(totalTax)}</Title>
                <Title level={5}>{t('order.form_details.total')}: {formatCurrency(total)}</Title>
            </Form.Item>

            <Form.Item>
                <Space>
                    <Button onClick={handleCancel}>
                        {t('order.form_cancel.title')}
                    </Button>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={submitting}
                        disabled={submitting}
                    >
                        {submitting ? `${type}...` : type}
                    </Button>
                </Space>
            </Form.Item>
        </Form>
    );
};

export default OrderForm;