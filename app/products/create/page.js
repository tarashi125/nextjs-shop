'use client';

import Container from "@/components/Container";
import ProductForm from "@/components/ProductForm";
import { useRouter } from "next/navigation";
import { productDefault } from "@/constants/defaults";
import { useState } from "react";
import { useDispatch } from 'react-redux';
import { setNotification } from '@/store/notificationSlice';
import { createProduct } from '@/lib/services/productService'


const CreateProduct = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const [product, setProduct] = useState(productDefault);
    const [submitting, setSubmitting] = useState(false);

    const handleCreateProduct = async () => {
        setSubmitting(true);
        try {
            await createProduct(product);
            dispatch(
                setNotification({
                    type: 'success',
                    message: 'Product created success!',
                    description: '',
                })
            );
            router.push('/products');
        } catch (error) {
            dispatch(
                setNotification({
                    type: 'error',
                    message: 'Error on create product!',
                    description: '',
                })
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Container>
            <ProductForm
                type="Create"
                product={product}
                setProduct={setProduct}
                submitting={submitting}
                handleSubmit={handleCreateProduct}
                handleCancel={() => router.push('/products')}
            />
        </Container>
    )

}

export default CreateProduct