'use client';
import { useEffect, useState } from 'react';
import Container from '@/components/Container';
import OrderForm from '@/components/order/OrderForm';
import { orderDefault } from '@/constants/defaults';
import { useSearchParams, useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setNotification } from '@/store/notificationSlice';
import { fetchOrderById, updateOrder } from '@/lib/services/orderService';
import { fetchProduct } from '@/lib/services/productService';

const EditOrder = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const dispatch = useDispatch();

    const [submitting, setSubmitting] = useState(false);
    const [order, setOrder] = useState(orderDefault);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

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

    const normalizeItems = (items) =>
        items.map((item) =>
            item.productId
                ? item
                : { ...item, type: 'custom', productId: null }
        );

    useEffect(() => {
        const loadOrder = async () => {
            try {
                const data = await fetchOrderById(orderId);
                const normalized = {
                    ...data,
                    items: normalizeItems(data.items || []),
                };
                setOrder(normalized);
            } catch (err) {
                dispatch(setNotification({ type: 'error', message: 'Failed to load order!' }));
                router.push('/orders');
            } finally {
                setLoading(false);
            }
        };

        if (orderId && orderId !== 'undefined' && orderId !== 'null') {
            loadOrder();
        } else {
            setLoading(false);
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