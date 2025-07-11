'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';

import Container from '@/components/Container';
import ProductForm from '@/components/ProductForm';
import { fetchProductById, updateProduct } from '@/lib/services/productService';
import { createDefaultProduct } from '@/lib/helpers/product';
import { setNotification } from '@/store/notificationSlice';

import type { AppDispatch } from '@/store';
import type { Product } from '@/types/product';

const EditProduct = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const dispatch = useDispatch<AppDispatch>();

    const [submitting, setSubmitting] = useState<boolean>(false);
    const [product, setProduct] = useState<Product>(createDefaultProduct());
    const productId = searchParams.get('id');

    useEffect( ()=> {
        const loadProduct = async () => {
            try {
                if (!productId) return;
                const data = await fetchProductById(productId);
                setProduct(data);
            } catch (err) {
                dispatch(
                    setNotification({
                        type: 'error',
                        message: 'Failed to load product!',
                    })
                );
                router.push('/products');
            }
        };

        loadProduct();
    }, [productId, dispatch, router] );

    const handleEditProduct = async () => {
        setSubmitting(true);
        try {
            if (!productId) return;
            await updateProduct(productId, product);
            dispatch(
                setNotification({
                    type: 'success',
                    message: 'Product updated successfully!',
                })
            );
            router.push('/products');
        } catch (error) {
            dispatch(
                setNotification({
                    type: 'error',
                    message: 'Failed to update product!',
                })
            );
        } finally {
            setSubmitting(false);
        }
    };

    if (!product || !productId) {
        return (
            <Container>
                <p>Loading...</p>
            </Container>
        );
    }

    return (
        <Container>
            <ProductForm
                type="Edit"
                product={product}
                setProduct={setProduct}
                submitting={submitting}
                handleSubmit={handleEditProduct}
                handleCancel={() => router.push('/products')}
            />
        </Container>
    );

};

export default EditProduct;