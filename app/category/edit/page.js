'use client';

import Container from "@components/Container";
import CategoryForm from "@components/category/CategoryForm";
import { message } from "antd";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { productDefault } from "@constants/defaults";
import { redirect } from "next/navigation";
import { fetchCategoryById, updateCategory } from "@lib/services/categoryService";

const EditCategory = () => {
    const [ category, setCategory ] = useState(productDefault);
    const router = useRouter();
    const searchParams = useSearchParams();

    const categoryId = searchParams.get('id');

    if ( !categoryId ) {
        redirect('/')
    }

    useEffect( ()=> {
        const loadCategory = async () => {
            const data = await fetchCategoryById(categoryId)
            setCategory(data);
        }
        loadCategory();

    }, [categoryId] );

    const handleEditCategory = async (values) => {
        try {
            await updateCategory(categoryId, values );
            router.push('/category');
        } catch (error) {
            message.error('Error on edit product!');
        }
    };

    return (
        <Container>
            <CategoryForm
                type={`Edit`}
                category={category}
                setCategory={setCategory}
                handleSubmit={handleEditCategory}
                handleCancel={() => router.push('/category')}
            />
        </Container>
    )

}

export default EditCategory