'use client';
import { useEffect, useState } from 'react';
import { Table, Button, Popconfirm, Modal, Form, Input } from 'antd';
import Container from "@components/Container";
import { useDispatch } from 'react-redux';
import { setNotification } from '@/store/notificationSlice';
import Link from "next/link";
import { fetchCategory, deleteCategory } from "@lib/categoryService";
import { DeleteOutlined, EditOutlined, UnorderedListOutlined } from '@ant-design/icons';

const CategoryPage = () => {
    const dispatch = useDispatch();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadCategory = async () => {
        setLoading(true);
        const data = await fetchCategory();
        setCategories(data);
        setLoading(false);
    }

    useEffect(() => {
        loadCategory();
    }, []);

    const handleDeleteCategory = async (id) => {
        try {
            const res = await deleteCategory(id);
            dispatch(
                setNotification({
                    type: 'success',
                    message: 'Category deleted success!',
                    description: '',
                })
            );
            loadCategory();
        } catch {
            dispatch(
                setNotification({
                    type: 'success',
                    message: 'Category deleted failed!',
                    description: '',
                })
            );
        }
    };

    const columns = [
        { title: 'Name', dataIndex: 'name', key: 'name' },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <div className={`flex gap-4`}>
                    <Link href={`/category/edit/?id=${record._id}`}>
                        <Button color="primary" variant="outlined" icon={<EditOutlined />}>Edit</Button>
                    </Link>
                    <Popconfirm
                        title="Are you sure to delete this category?"
                        onConfirm={() => handleDeleteCategory(record._id)}
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

                <Link href={'/category/create'}>
                    <Button
                        type="primary"
                        icon={<UnorderedListOutlined />}
                    >
                        Add Category
                    </Button>
                </Link>
            </div>

            <Table
                bordered
                dataSource={categories}
                columns={columns}
                rowKey="_id"
                loading={loading}
            />
        </Container>
    );
}

export default CategoryPage
