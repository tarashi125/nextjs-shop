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
                    message: 'Please login!',
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
                    message: 'Order created success!',
                })
            );
            router.push('/orders');
        } catch (error) {
            dispatch(
                setNotification({
                    type: 'error',
                    message: 'Error on create order!',
                })
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Container>
            <OrderForm
                type="Create"
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