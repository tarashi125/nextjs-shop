'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from 'react-redux';

import Container from "@/components/Container";
import ProductForm from "@/components/product/ProductForm";
import { createProduct } from '@/lib/services/productService'
import { createDefaultProduct } from '@/lib/helpers/product';
import { notify } from '@/lib/helpers/notification';
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
            notify(dispatch, t, 'success', 'product.form_create.success');
            router.push('/products');
        } catch (error) {
            notify(dispatch, t, 'error', 'product.form_create.failed');
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