'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';

import Container from '@/components/Container';
import CategoryForm from '@/components/category/CategoryForm';
import { createCategory } from '@/lib/services/categoryService';
import { createDefaultCategory } from '@/lib/helpers/category';
import { notify } from '@/lib/helpers/notification';
import { useTranslation } from 'react-i18next';

import type { AppDispatch } from '@/store';
import type { Category } from '@/types/category';

const CreateCategory = () => {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const [ category, setCategory ] = useState<Category>(createDefaultCategory());
    const [submitting, setSubmitting] = useState(false);
    const { t } = useTranslation('common');

    const handleCreateCategory = async () => {
        setSubmitting(true);
        try {
            await createCategory(category);
            notify(dispatch, t, 'success', 'category.form_create.success');
            router.push('/category');
        } catch (error: any) {
            notify(dispatch, t, 'error', 'category.form_create.failed');
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