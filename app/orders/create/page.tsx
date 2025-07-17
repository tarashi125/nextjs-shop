'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { useSession } from 'next-auth/react';

import Container from '@/components/Container';
import OrderForm from '@/components/order/OrderForm';
import { setNotification } from '@/store/notificationSlice';
import { fetchProduct } from '@/lib/services/productService';
import { createOrder } from '@/lib/services/orderService';
import { createDefaultOrder } from '@/lib/helpers/order';
import { useTranslation } from 'react-i18next';

import type { AppDispatch } from '@/store';
import type { Order, OrderItem } from '@/types/order';
import type { Product } from '@/types/product';

const CreateOrder = () => {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const {data: session} = useSession();

    const [submitting, setSubmitting] = useState<boolean>(false);
    const [ order, setOrder ] = useState<Order>(createDefaultOrder());
    const [ products, setProducts ] = useState<Product[]>([]);
    const { t } = useTranslation();

    useEffect(() => {
        const loadProducts = async () => {
            const data = await fetchProduct();
            setProducts(data);
        };
        loadProducts();
    }, []);

    const handleCreateOrder = async () => {
        setSubmitting(true);
        if (!session?.user?.id) {
            dispatch(
                setNotification({
                    type: 'error',
                    message: t('order.form_create.login'),
                })
            );
            return;
        }

        const itemsWithName: OrderItem[] = order.items.map((item) =>
            item.productId ? {
                ...item,
                name: products.find((p) => p._id === item.productId)?.name || '',
            } : item
        );

        const orderData: Order = {
            ...order,
            userId: session?.user?.id,
            items: itemsWithName,
        };

        try {
            await createOrder(orderData);
            dispatch(
                setNotification({
                    type: 'success',
                    message: t('order.form_create.success'),
                })
            );
            router.push('/orders');
        } catch (error) {
            dispatch(
                setNotification({
                    type: 'error',
                    message: t('order.form_create.failed'),
                })
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Container>
            <OrderForm
                type={t('product.form_create.title')}
                order={order}
                setOrder={setOrder}
                submitting={submitting}
                handleSubmit={handleCreateOrder}
                handleCancel={() => router.push('/orders')}
                products={products}
            />
        </Container>
    );

};

export default CreateOrder;