'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from 'react-redux';

import Container from "@/components/Container";
import ProductForm from "@/components/product/ProductForm";
import { setNotification } from '@/store/notificationSlice';
import { createProduct } from '@/lib/services/productService'
import { createDefaultProduct } from '@/lib/helpers/product';
import { useTranslation } from 'react-i18next';

import type { AppDispatch } from '@/store';
import type { Product } from '@/types/product';

const CreateProduct = () => {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const [product, setProduct] = useState<Product>(createDefaultProduct());
    const [submitting, setSubmitting] = useState(false);
    const { t } = useTranslation('common');

    const handleCreateProduct = async () => {
        setSubmitting(true);
        try {
            await createProduct(product);
            dispatch(
                setNotification({
                    type: 'success',
                    message: t('product.form_create.success'),
                    description: '',
                })
            );
            router.push('/products');
        } catch (error) {
            dispatch(
                setNotification({
                    type: 'error',
                    message: t('product.form_create.failed'),
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
                type={t('product.form_create.title')}
                product={product}
                setProduct={setProduct}
                submitting={submitting}
                handleSubmit={handleCreateProduct}
                handleCancel={() => router.push('/products')}
            />
        </Container>
    );

};

export default CreateProduct;