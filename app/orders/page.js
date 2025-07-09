'use client'
import { useState, useEffect } from "react";
import { formatTime, formatCurrency } from '@/lib/utils';
import Container from "@components/Container";
import OrderFilter from "@components/order/OrderFilter";
import Link from "next/link";
import {Button, Popconfirm, Table, Tag} from "antd";
import { DeleteOutlined, EditOutlined, BookOutlined ,EyeOutlined, RollbackOutlined } from '@ant-design/icons';
import { fetchOrders, updateOrder } from '@lib/orderService';
import { useDispatch } from 'react-redux';
import { setNotification } from '@/store/notificationSlice';
import dayjs from "dayjs";
import {getStatusColor} from "@constants/defaults";


const OrdersPage = () => {
    const dispatch = useDispatch();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [params, setParams] = useState(() => {
        const today = dayjs();
        return {
            status: 'all',
            date: today,
            startDate: today.startOf('day').toISOString(),
            endDate: today.endOf('day').toISOString(),
        };
    });


    const loadOrders = async () => {
        setLoading(true);
        const data = await fetchOrders(params);
        setOrders(data);
        setLoading(false);
    }

    useEffect(()=> {
        loadOrders();
    }, [params] );

    const handleDeleteOrder = async (id) => {
        try {
            await updateOrder(id, { status: 'trash' });
            dispatch(
                setNotification({
                    type: 'success',
                    message: 'Order deleted success!',
                    description: '',
                })
            );
            loadOrders();
        } catch {
            dispatch(
                setNotification({
                    type: 'error',
                    message: 'Order deleted failed!',
                    description: '',
                })
            );
        }
    };

    const handleRestoreOrder = async (id) => {
        try {
            await updateOrder(id, { status: 'processing' });
            dispatch(
                setNotification({
                    type: 'success',
                    message: 'Order restore success!',
                    description: '',
                })
            );
            loadOrders();
        } catch {
            dispatch(
                setNotification({
                    type: 'error',
                    message: 'Order restore failed!',
                    description: '',
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
            render: (text) => formatTime(text),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                return <Tag color={`${getStatusColor(status) || 'gray'}`}>{status.toUpperCase()}</Tag>;
            },
        },
        {
            title: 'Total',
            dataIndex: 'total',
            key: 'total',
            align: 'right',
            render: (total) => formatCurrency(total),
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <div className={`flex gap-4`}>
                    { record.status !== 'trash' ? (
                        <>
                            <Link href={`/orders/${record._id}`}>
                                <Button type="primary" icon={<EyeOutlined />}>
                                    View
                                </Button>
                            </Link>
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
                                title="Are you sure to delete this product?"
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

                <Link href={'/orders/create'}>
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
            />

        </Container>
    );
}


export default OrdersPage