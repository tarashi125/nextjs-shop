'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';

import Container from '@/components/Container';
import ProductForm from '@/components/product/ProductForm';
import { fetchProductById, updateProduct } from '@/lib/services/productService';
import { createDefaultProduct } from '@/lib/helpers/product';
import { notify } from '@/lib/helpers/notification';
import { useTranslation } from 'react-i18next';

import type { AppDispatch } from '@/store';
import type { Product } from '@/types/product';

const EditProduct = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const dispatch = useDispatch<AppDispatch>();

    const [submitting, setSubmitting] = useState<boolean>(false);
    const [product, setProduct] = useState<Product>(createDefaultProduct());
    const productId = searchParams.get('id') as string;
    const { t } = useTranslation('common');

    useEffect( ()=> {
        const loadProduct = async () => {
            try {
                if (!productId) return;
                const data = await fetchProductById(productId);
                setProduct(data);
            } catch (err) {
                notify(dispatch, t, 'error', 'product.load_failed');
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
            notify(dispatch, t, 'success', 'product.form_edit.success');
            router.push('/products');
        } catch (error) {
            notify(dispatch, t, 'error', 'product.form_edit.failed');
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
                type={t('product.form_edit.title')}
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