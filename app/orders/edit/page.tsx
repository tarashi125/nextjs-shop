'use client';
import { useEffect, useState } from 'react';
import Container from '@/components/Container';
import OrderForm from '@/components/order/OrderForm';
import { useSearchParams, useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setNotification } from '@/store/notificationSlice';
import { fetchOrderById, updateOrder } from '@/lib/services/orderService';
import { fetchProduct } from '@/lib/services/productService';
import { createDefaultOrder } from '@/lib/helpers/order';

import type { AppDispatch } from '@/store';
import type { Order, OrderItem } from '@/types/order';
import type { Product } from '@/types/product';

const EditOrder = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const dispatch = useDispatch<AppDispatch>();

    const [submitting, setSubmitting] = useState<boolean>(false);
    const [order, setOrder] = useState<Order>(createDefaultOrder());
    const [products, setProducts] = useState<Product[]>([]);

    const orderId = searchParams.get('id');

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const data = await fetchProduct();
                setProducts(data);
            } catch {
                dispatch(setNotification({ type: 'error', message: 'Failed to load products!' }));
            }
        };
        loadProducts();
    }, [dispatch]);

    const normalizeItems = (items: OrderItem[]): OrderItem[] =>
        items.map((item) =>
            item.productId ? item : { ...item, type: 'custom', productId: undefined }
        );

    useEffect(() => {
        const loadOrder = async () => {
            try {
                const data = await fetchOrderById(orderId);
                const normalized: Order = {
                    ...data,
                    items: normalizeItems(data.items || []),
                };
                setOrder(normalized);
            } catch (err) {
                dispatch(setNotification({ type: 'error', message: 'Failed to load order!' }));
                router.push('/orders');
            }
        };

        if (orderId && orderId !== 'undefined' && orderId !== 'null') {
            loadOrder();
        } else {
            dispatch(setNotification({ type: 'error', message: 'Invalid order ID' }));
            router.push('/orders');
        }
    }, [orderId, dispatch, router]);

    const handleEditOrder = async () => {
        setSubmitting(true);
        try {
            const itemsWithName = order.items.map((item) =>
                item.productId ? {
                    ...item,
                    name: products.find((p) => p._id === item.productId)?.name || '',
                } : item
            );

            await updateOrder(orderId, {
                ...order,
                items: itemsWithName,
            });

            dispatch(
                setNotification({
                    type: 'success',
                    message: 'Order updated successfully!',
                })
            );
            router.push('/orders');
        } catch {
            dispatch(
                setNotification({
                    type: 'error',
                    message: 'Failed to update order!',
                })
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Container>
            <OrderForm
                type="Edit"
                order={order}
                setOrder={setOrder}
                submitting={submitting}
                handleSubmit={handleEditOrder}
                handleCancel={() => router.push('/orders')}
                products={products}
            />
        </Container>
    );
};

export default EditOrder;