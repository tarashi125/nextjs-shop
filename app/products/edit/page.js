'use client';
import Container from "@components/Container";
import ProductForm from "@components/ProductForm";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { productDefault } from "@constants/defaults";
import { useDispatch } from 'react-redux';
import { setNotification } from '@/store/notificationSlice';
import { fetchProductById, updateProduct } from '@lib/services/productService';

const EditProduct = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const dispatch = useDispatch();

    const [submitting, setSubmitting] = useState(false);
    const [product, setProduct] = useState(productDefault);
    const productId = searchParams.get('id');

    useEffect( ()=> {
        const loadProduct = async () => {
            try {
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

        if (productId) loadProduct();
    }, [productId] );

    const handleEditProduct = async () => {
        setSubmitting(true);
        try {
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

    if (!product || !productId) return <Container><p>Loading...</p></Container>;

    return (
        <Container>
            <ProductForm
                type={`Edit`}
                product={product}
                setProduct={setProduct}
                submitting={submitting}
                handleSubmit={handleEditProduct}
                handleCancel={() => router.push('/products')}
            />
        </Container>
    )

}

export default EditProduct