import { useEffect, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import OrderCard from '@/components/order/OrderCard';
import OrderFilter from '@/components/order/OrderFilter';
import { fetchOrders } from '@/lib/services/orderService';
import { Button, Space } from 'antd';
import { BookOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

import type { Order, OrderFilterParams } from '@/types/order';

const Orders = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [params, setParams] = useState<OrderFilterParams>(() => {
        const today = dayjs();
        return {
            status: 'processing',
            date: today,
            startDate: today.startOf('day').toISOString(),
            endDate: today.endOf('day').toISOString(),
        };
    });
    const { t } = useTranslation('common');

    useEffect(() => {
        const loadOrders = async () => {
            try {
                const data = await fetchOrders(params);
                setOrders(data);
            } catch (err) {
                console.error('Failed to fetch orders:', err);
            }
        };

        loadOrders();
    }, [params]);

    return (
        <>
            <Space
                direction="vertical"
                align="start"
                size="small"
            >
                <Link href="/orders/create">
                    <Button
                        size="large"
                        type="primary"
                        icon={<BookOutlined />}
                    >
                        {t('order.page_add')}
                    </Button>
                </Link>

                <OrderFilter
                    params={params}
                    setParams={setParams}
                />
            </Space>

            <section className="columns-1 sm:columns-2 md:columns-3 gap-6">
                {orders.map((order) => (
                    <OrderCard
                        key={order._id}
                        order={order}
                    />
                ))}
            </section>
        </>
    );
};

export default Orders;