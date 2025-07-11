'use client';

import { useState, useEffect } from 'react';
import { formatTime, formatCurrency } from '@/lib/utils';
import Container from '@/components/Container';
import OrderFilter from '@/components/order/OrderFilter';
import Link from 'next/link';
import {
  Button,
  Popconfirm,
  Table,
  Tag,
  Descriptions,
} from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  BookOutlined,
  RollbackOutlined,
} from '@ant-design/icons';
import { fetchOrders, updateOrder } from '@/lib/services/orderService';
import { useDispatch } from 'react-redux';
import { setNotification } from '@/store/notificationSlice';
import { getStatusColor } from '@/constants/defaults';

import type { AppDispatch } from '@/store';
import type { Order, OrderFilterParams } from '@/types/order';

const OrdersPage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [params, setParams] = useState<OrderFilterParams>(() => {
        return {
            status: 'all',
            date: null,
            startDate: '',
            endDate: '',
        };
    });


    const loadOrders = async () => {
        setLoading(true);
        const data = await fetchOrders(params);
        setOrders(data);
        setLoading(false);
    };

    useEffect(()=> {
        loadOrders();
    }, [params] );

    const handleDeleteOrder = async (id: string) => {
        try {
            await updateOrder(id, { status: 'trash' });
            dispatch(
                setNotification({
                    type: 'success',
                    message: 'Order deleted successfully!',
                })
            );
            loadOrders();
        } catch {
            dispatch(
                setNotification({
                    type: 'error',
                    message: 'Order delete failed!',
                })
            );
        }
    };

    const handleRestoreOrder = async (id: string) => {
        try {
            await updateOrder(id, { status: 'processing' });
            dispatch(
                setNotification({
                    type: 'success',
                    message: 'Order restored successfully!',
                })
            );
            loadOrders();
        } catch {
            dispatch(
                setNotification({
                    type: 'error',
                    message: 'Order restore failed!',
                })
            );
        }
    };
    
    const columns = [
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Time',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (text: string) => formatTime(text),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => (
                <Tag color={getStatusColor(status) || 'gray'}>{status.toUpperCase()}</Tag>
            ),
        },
        {
            title: 'Total',
            dataIndex: 'total',
            key: 'total',
            align: 'right',
            render: (total: number) => formatCurrency(total),
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <div className="flex gap-4">
                    { record.status !== 'trash' ? (
                        <>
                            <Link href={`/orders/edit/?id=${record._id}`}>
                                <Button
                                    color="primary"
                                    variant="outlined"
                                    icon={<EditOutlined />}
                                >
                                    Edit
                                </Button>
                            </Link>
                            <Popconfirm
                                title="Are you sure to delete this order?"
                                onConfirm={() => handleDeleteOrder(record._id)}
                                okText="Delete"
                                cancelText="Cancel"
                            >
                                <Button danger icon={<DeleteOutlined/>}>Delete</Button>
                            </Popconfirm>
                        </>
                    ) : (
                        <Button
                            color="primary"
                            variant="outlined"
                            icon={<RollbackOutlined />}
                            onClick={() => handleRestoreOrder(record._id)}
                        >
                            Restore order
                        </Button>
                    ) }
                </div>
            ),
        },
    ];

    return (
        <Container>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-3xl font-bold">Orders</h1>

                <Link href="/orders/create">
                    <Button
                        type="primary"
                        icon={<BookOutlined />}
                    >
                        Add Order
                    </Button>
                </Link>
            </div>

            <OrderFilter
                params={params}
                setParams={setParams}
            />

            <Table
                bordered
                columns={columns}
                dataSource={orders}
                rowKey="_id"
                loading={loading}
                expandable={{
                    expandedRowRender: (record) => (
                        <Descriptions
                            size="small"
                            column={1}
                            bordered
                            title="Item details"
                            className="bg-gray-50"
                        >
                            {record.description && (
                                <Descriptions.Item label="Description">
                                    {record.description}
                                </Descriptions.Item>
                            )}
                            <Descriptions.Item label="Items">
                                {record.items?.map((item) => (
                                    <div key={item._id}>
                                    • {item.name} × {item.qty}
                                    </div>
                                ))}
                            </Descriptions.Item>
                        </Descriptions>
                    ),
                    rowExpandable: (record) => record.items?.length > 0,
                }}
            />

        </Container>
    );
};


export default OrdersPage;