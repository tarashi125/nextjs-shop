'use client';
import Container from "@/components/Container";
import OrderForm from "@/components/order/OrderForm";
import { useRouter } from "next/navigation";
import { orderDefault } from "@/constants/defaults";
import { useState, useEffect } from "react";
import { useDispatch } from 'react-redux';
import { setNotification } from '@/store/notificationSlice';
import {fetchProduct} from "@/lib/services/productService";
import {createOrder} from "@/lib/services/orderService";
import {useSession} from "next-auth/react";

const CreateOrder = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const [ order, setOrder ] = useState(orderDefault);
    const [ products, setProducts ] = useState([]);
    const {data: session} = useSession();

    const loadProducts = async () => {
        const data = await fetchProduct();
        setProducts(data);
    }

    useEffect(() => {
        loadProducts();
    }, []);

    const handleCreateOrder = async () => {
        if (!session?.user?.id) {
            dispatch(
                setNotification({
                    type: 'error',
                    message: 'Please login!',
                })
            );
            return;
        }

        const itemsWithName = order.items.map((item) => {
            return item.productId ? {
                ...item,
                name: products.find(p => p._id === item.productId)?.name || '',
            } : item;
        });

        const orderData = {
            ...order,
            userId: session?.user?.id,
            items: itemsWithName,
        };

        try {
            await createOrder(orderData)
            dispatch(
                setNotification({
                    type: 'success',
                    message: 'Order created success!',
                    description: '',
                })
            );
            router.push('/orders');
        } catch (error) {
            dispatch(
                setNotification({
                    type: 'error',
                    message: 'Error on create order!',
                    description: '',
                })
            );
        }
    };

    return (
        <Container>
            <OrderForm
                type={`Create`}
                order={order}
                setOrder={setOrder}
                handleSubmit={handleCreateOrder}
                handleCancel={() => router.push('/orders')}
                products={products}
            />
        </Container>
    )

}

export default CreateOrder