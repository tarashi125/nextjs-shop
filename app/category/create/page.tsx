'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';

import Container from '@/components/Container';
import CategoryForm from '@/components/category/CategoryForm';
import { createCategory } from '@/lib/services/categoryService';
import { createDefaultCategory } from '@/lib/helpers/category';
import { setNotification } from '@/store/notificationSlice';
import { useTranslation } from 'react-i18next';

import type { AppDispatch } from '@/store';
import type { Category } from '@/types/category';

const CreateCategory = () => {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const [ category, setCategory ] = useState<Category>(createDefaultCategory());
    const [submitting, setSubmitting] = useState(false);
    const { t } = useTranslation();

    const handleCreateCategory = async () => {
        setSubmitting(true);
        try {
            await createCategory(category);
            dispatch(
                setNotification({
                    type: 'success',
                    message: t('category.form_create.success'),
                })
            );
            router.push('/category');
        } catch (error: any) {
            dispatch(
                setNotification({
                    type: 'error',
                    message: t('category.form_create.failed'),
                    description: error?.message ||'',
                })
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Container>
            <CategoryForm
                type={t('category.form_create.title')}
                category={category}
                setCategory={setCategory}
                submitting={submitting}
                handleSubmit={handleCreateCategory}
                handleCancel={() => router.push('/category')}
            />
        </Container>
    );

};

export default CreateCategory;