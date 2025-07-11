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

            <Form.Item name="title" label="Title" rules={[{ required: true, message: 'Please enter name!' }]}>
                <Input placeholder="Order name" />
            </Form.Item>

            <Form.Item name="description" label="Description">
                <TextArea rows={3} placeholder="Order description..." />
            </Form.Item>

            <Form.Item
                name="status"
                label="Status"
                rules={[{ required: true, message: 'Please select a status!' }]}
                style={{maxWidth: '200px'}}
            >
                <Select placeholder="Select status">
                    {Object.entries(orderStatus).map(([key, label]) => (
                        <Option key={key} value={key}>
                            <Tag color={getStatusColor(key)}>{label}</Tag>
                        </Option>
                    ))}
                </Select>
            </Form.Item>

            <Form.List name="items">
                {(fields, { add, remove }) => {
                    const columns = [
                        {
                            title: 'Name',
                            dataIndex: 'name',
                            width: '25%',
                            render: (_, __, index: number) => {
                                const currentType = form.getFieldValue(['items', index, 'type']) ?? 'select';
                                return (
                                    <Form.Item style={{ margin: 0 }}
                                        name={[index, currentType === 'custom' ? 'name' : 'productId']}
                                        rules={[{ required: true, message: 'Required!' }]}
                                    >
                                        {currentType === 'custom' ? (
                                            <Input placeholder="Enter product name" />
                                        ) : (
                                            <Select
                                                placeholder="Select product"
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
                            title: 'Qty',
                            dataIndex: 'qty',
                            width: '12.5%',
                            render: (_, __, index) => (
                                <Form.Item style={{ margin: 0 }} name={[index, 'qty']} initialValue={1}>
                                    <InputNumber min={0.1} step={1} style={{ width: '100%' }} />
                                </Form.Item>
                            ),
                        },
                        {
                            title: 'Price',
                            dataIndex: 'price',
                            width: '16,67%',
                            render: (_, __, index) => (
                                <Form.Item
                                    style={{ margin: 0 }}
                                    name={[index, 'price']}
                                    rules={[{ required: true, message: 'Required!' }]}
                                >
                                    <InputNumber min={0} step={1000} style={{ width: '100%' }} addonAfter="đ" />
                                </Form.Item>
                            ),
                        },
                        {
                            title: 'Discount',
                            dataIndex: 'discount',
                            width: '16,67%',
                            render: (_, __, index) => (
                                <Form.Item style={{ margin: 0 }} name={[index, 'discount']} initialValue={0}>
                                    <InputNumber min={0} step={1000} style={{ width: '100%' }} addonAfter="đ" />
                                </Form.Item>
                            ),
                        },
                        {
                            title: 'Tax (%)',
                            dataIndex: 'tax',
                            width: '12.5%',
                            render: (_, __, index) => (
                                <Form.Item style={{ margin: 0 }} name={[index, 'tax']} initialValue={0}>
                                    <InputNumber min={0} max={100} step={1} style={{ width: '100%' }} addonAfter="%" />
                                </Form.Item>
                            ),
                        },
                        {
                            title: 'Action',
                            dataIndex: 'action',
                            width: '16,67%',
                            render: (_, __, index) => (
                                <Popconfirm title="Delete this item?" onConfirm={() => remove(index)}>
                                    <Button danger icon={<DeleteOutlined />}>
                                        Remove
                                    </Button>
                                </Popconfirm>
                            ),
                        },
                    ];

                    return (
                        <>
                            <Table
                                bordered
                                title={() => 'Items'}
                                dataSource={fields.map((field, index) => ({ key: field.key, index }))}
                                columns={columns}
                                pagination={false}
                                expandable={{
                                    expandedRowRender: (record) => {
                                        const index = record.index;
                                        const detail = itemDetails[index] || {};
                                        return (
                                            <div style={{ paddingLeft: 16 }}>
                                                <p className={'p-0 text-right'}><strong>Total:</strong> {formatCurrency(detail.total)}</p>
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
                                        Add product
                                    </Button>
                                    <Button
                                        onClick={() => add({
                                            ...createDefaultOrderItem(),
                                            type: 'custom',
                                            name: ''
                                        })}
                                        icon={<PlusOutlined />}
                                    >
                                        Add custom product
                                    </Button>
                                </Space>
                            </Form.Item>
                        </>
                    );
                }}
            </Form.List>

            <Form.Item>
                <Title level={5}>Discount: {formatCurrency(totalDiscount)}</Title>
                <Title level={5}>Tax: {formatCurrency(totalTax)}</Title>
                <Title level={5}>Total: {formatCurrency(total)}</Title>
            </Form.Item>

            <Form.Item>
                <Space>
                    <Button onClick={handleCancel}>Cancel</Button>
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