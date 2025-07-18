'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch } from 'react-redux';

import Container from '@/components/Container';
import CategoryForm from '@/components/category/CategoryForm';
import { fetchCategoryById, updateCategory } from '@/lib/services/categoryService';
import { createDefaultCategory } from '@/lib/helpers/category';
import { notify } from '@/lib/helpers/notification';
import { useTranslation } from 'react-i18next';

import type { AppDispatch } from '@/store';
import type { Category } from '@/types/category';

const EditCategory = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const dispatch = useDispatch<AppDispatch>();

    const [submitting, setSubmitting] = useState(false);
    const [category, setCategory] = useState<Category>(createDefaultCategory());
    const categoryId = searchParams.get('id') as string;
    const { t } = useTranslation('common');

    useEffect(() => {
        setSubmitting(true);
        const loadCategory = async () => {
            try {
                if (!categoryId) return;
                const data = await fetchCategoryById(categoryId);
                setCategory(data);
            } catch {
                notify(dispatch, t, 'error', 'category.load_failed');
                router.push('/category');
            } finally {
                setSubmitting(false);
            }
        };

        loadCategory();
    }, [categoryId, dispatch, router]);

    const handleEditCategory = async () => {
        try {
            await updateCategory(categoryId, category);
            notify(dispatch, t, 'success', 'category.form_edit.success');
            router.push('/category');
        } catch (error: any) {
            notify(dispatch, t, 'error', 'category.form_edit.failed');
        }
    };

    return (
        <Container>
            <CategoryForm
                type={t('category.form_edit.title')}
                category={category}
                setCategory={setCategory}
                submitting={submitting}
                handleSubmit={handleEditCategory}
                handleCancel={() => router.push('/category')}
            />
        </Container>
    );

};

export default EditCategory;