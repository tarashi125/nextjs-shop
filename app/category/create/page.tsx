'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';

import Container from '@/components/Container';
import CategoryForm from '@/components/category/CategoryForm';
import { createCategory } from '@/lib/services/categoryService';
import { createDefaultCategory } from '@/lib/helpers/category';
import { setNotification } from '@/store/notificationSlice';

import type { AppDispatch } from '@/store';
import type { Category } from '@/types/category';

const CreateCategory = () => {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const [ category, setCategory ] = useState<Category>(createDefaultCategory());

    const handleCreateCategory = async (values: Category) => {
        try {
            await createCategory(values);
            dispatch(
                setNotification({
                    type: 'success',
                    message: 'Category created successfully!',
                })
            );
            router.push('/category');
        } catch (error: any) {
            dispatch(
                setNotification({
                    type: 'error',
                    message: 'Error creating category!',
                    description: error?.message ||'',
                })
            );
        }
    };

    return (
        <Container>
            <CategoryForm
                type="Create"
                category={category}
                handleSubmit={handleCreateCategory}
                handleCancel={() => router.push('/category')}
            />
        </Container>
    );

};

export default CreateCategory;