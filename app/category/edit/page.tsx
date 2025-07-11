'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch } from 'react-redux';

import Container from '@/components/Container';
import CategoryForm from '@/components/category/CategoryForm';
import { fetchCategoryById, updateCategory } from '@/lib/services/categoryService';
import { createDefaultCategory } from '@/lib/helpers/category';
import { setNotification } from '@/store/notificationSlice';

import type { AppDispatch } from '@/store';
import type { Category } from '@/types/category';

const EditCategory = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const dispatch = useDispatch<AppDispatch>();

    const [category, setCategory] = useState<Category>(createDefaultCategory());

    const categoryId = searchParams.get('id');

    useEffect( ()=> {
        if (!categoryId || categoryId === 'null' || categoryId === 'undefined') {
            dispatch(
                setNotification({
                    type: 'error',
                    message: 'Invalid category ID'
                })
            );
            router.push('/category');
            return;
        }

        const loadCategory = async () => {
            try {
                const data = await fetchCategoryById(categoryId);
                setCategory(data);
            } catch {
                dispatch(
                    setNotification({
                        type: 'error',
                        message: 'Failed to load category'
                    })
                );
                router.push('/category');
            }
        };

        loadCategory();
    }, [categoryId, dispatch, router]);

    const handleEditCategory = async (values: Category) => {
        try {
            await updateCategory(categoryId, values );
            dispatch(
                setNotification({
                    type: 'success',
                    message: 'Category edited successfully!'
                })
            );
            router.push('/category');
        } catch (error: any) {
            dispatch(
                setNotification({
                    type: 'error',
                    message: 'Error editing category!',
                    description: error?.message ||'',
                })
            );
        }
    };

    return (
        <Container>
            <CategoryForm
                type="Edit"
                category={category}
                handleSubmit={handleEditCategory}
                handleCancel={() => router.push('/category')}
            />
        </Container>
    );

};

export default EditCategory;