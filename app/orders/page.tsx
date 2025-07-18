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
import { notify } from '@/lib/helpers/notification';
import { useDispatch } from 'react-redux';
import { getStatusColor } from '@/constants/defaults';
import { useTranslation } from 'react-i18next';

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
    const { t } = useTranslation('common');


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
            notify(dispatch, t, 'success', 'order.form_delete.success');
            loadOrders();
        } catch {
            notify(dispatch, t, 'error', 'order.form_delete.failed');
        }
    };

    const handleRestoreOrder = async (id: string) => {
        try {
            await updateOrder(id, { status: 'processing' });
            notify(dispatch, t, 'success', 'order.form_restore.success');
            loadOrders();
        } catch {
            notify(dispatch, t, 'error', 'order.form_restore.failed');
        }
    };
    
    const columns = [
        {
            title: t('order.table.name'),
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: t('order.table.time'),
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (text: string) => formatTime(text),
        },
        {
            title: t('order.table.status'),
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => (
                <Tag
                    className="uppercase"
                    color={getStatusColor(status) || 'gray'}
                >
                    {t(`order.status.${status}`)}
                </Tag>
            ),
        },
        {
            title: t('order.table.total'),
            dataIndex: 'total',
            key: 'total',
            align: 'right' as 'left' | 'right' | 'center',
            render: (total: number) => formatCurrency(total),
        },
        {
            title: t('order.table.actions.title'),
            key: 'actions',
            render: (_: any, record: Order) => (
                <div className="flex gap-4">
                    { record.status !== 'trash' ? (
                        <>
                            <Link href={`/orders/edit/?id=${record._id!}`}>
                                <Button
                                    color="primary"
                                    variant="outlined"
                                    icon={<EditOutlined />}
                                >
                                    {t('order.table.actions.edit')}
                                </Button>
                            </Link>
                            <Popconfirm
                                title={t('order.form_delete.confirm.title')}
                                onConfirm={() => handleDeleteOrder(record._id!)}
                                okText={t('order.form_delete.confirm.ok')}
                                cancelText={t('order.form_delete.confirm.cancel')}
                            >
                                <Button danger icon={<DeleteOutlined/>}>
                                    {t('order.table.actions.delete')}
                                </Button>
                            </Popconfirm>
                        </>
                    ) : (
                        <Button
                            color="primary"
                            variant="outlined"
                            icon={<RollbackOutlined />}
                            onClick={() => handleRestoreOrder(record._id!)}
                        >
                            {t('order.table.actions.restore')}
                        </Button>
                    ) }
                </div>
            ),
        },
    ];

    return (
        <Container>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-3xl font-bold">{t('order.page_title')}</h1>

                <Link href="/orders/create">
                    <Button
                        type="primary"
                        icon={<BookOutlined />}
                    >
                        {t('order.page_add')}
                    </Button>
                </Link>
            </div>

            <OrderFilter
                params={params}
                setParams={setParams}
            />

            <Table<Order>
                bordered
                rowKey="_id"
                columns={columns}
                dataSource={orders}
                loading={loading}
                expandable={{
                    expandedRowRender: (record) => (
                        <Descriptions
                            size="small"
                            column={1}
                            bordered
                            title={t('order.table.item_details')}
                            className="bg-gray-50"
                        >
                            {record.description && (
                                <Descriptions.Item label={t('order.table.description')}>
                                    {record.description}
                                </Descriptions.Item>
                            )}
                            <Descriptions.Item label={t('order.table.items')}>
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