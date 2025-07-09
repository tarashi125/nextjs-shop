'use client';
import Container from "@components/Container";
import CategoryForm from "@components/category/CategoryForm";
import { useRouter } from "next/navigation";
import { categoryDefault } from "@constants/defaults";
import { useState } from "react";
import { useDispatch } from 'react-redux';
import { setNotification } from '@/store/notificationSlice';
import { createCategory } from "@lib/categoryService";


const CreateCategory = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const [ category, setCategory ] = useState(categoryDefault);

    const handleCreateCategory = async (values) => {
        try {
            await createCategory(values);
            dispatch(
                setNotification({
                    type: 'success',
                    message: 'Category created success!',
                    description: '',
                })
            );
            router.push('/category');
        } catch (error) {
            dispatch(
                setNotification({
                    type: 'error',
                    message: 'Error on create category!',
                    description: error.message ||'',
                })
            );
        }
    };

    return (
        <Container>
            <CategoryForm
                type={`Create`}
                category={category}
                handleSubmit={handleCreateCategory}
                handleCancel={() => router.push('/category')}
            />
        </Container>
    )

}

export default CreateCategory