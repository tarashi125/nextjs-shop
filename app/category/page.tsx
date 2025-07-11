'use client';
import { useEffect, useState } from 'react';
import { Table, Button, Popconfirm } from 'antd';
import { useDispatch } from 'react-redux';
import Link from 'next/link';

import Container from '@/components/Container';
import { setNotification } from '@/store/notificationSlice';
import { fetchCategory, deleteCategory } from '@/lib/services/categoryService';
import { DeleteOutlined, EditOutlined, UnorderedListOutlined } from '@ant-design/icons';

import type { Category } from '@/types/category';
import type { AppDispatch } from '@/store';
import type { TableColumnsType } from 'antd';


const CategoryPage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const loadCategory = async () => {
        setLoading(true);
        const data = await fetchCategory();
        setCategories(data);
        setLoading(false);
    };

    useEffect(() => {
        loadCategory();
    }, []);

    const handleDeleteCategory = async (id: string) => {
        try {
            await deleteCategory(id);
            dispatch(
                setNotification({
                    type: 'success',
                    message: 'Category deleted successfully!',
                })
            );
            loadCategory();
        } catch {
            dispatch(
                setNotification({
                    type: 'error',
                    message: 'Category delete failed!',
                })
            );
        }
    };

    const columns: TableColumnsType<Category> = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <div className="flex gap-4">
                    <Link href={`/category/edit/?id=${record._id}`}>
                        <Button color="primary" variant="outlined" icon={<EditOutlined />}>Edit</Button>
                    </Link>
                    <Popconfirm
                        title="Are you sure to delete this category?"
                        onConfirm={() => handleDeleteCategory(record._id!)}
                        okText="Delete"
                        cancelText="Cancel"
                    >
                        <Button danger icon={<DeleteOutlined />}>Delete</Button>
                    </Popconfirm>
                </div>
            ),
        },
    ];

    return (
        <Container>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-3xl font-bold">Categories</h1>

                <Link href="/category/create">
                    <Button
                        type="primary"
                        icon={<UnorderedListOutlined />}
                    >
                        Add Category
                    </Button>
                </Link>
            </div>

            <Table<Category>
                bordered
                rowKey="_id"
                dataSource={categories}
                columns={columns}
                loading={loading}
            />
        </Container>
    );
};

export default CategoryPage;
