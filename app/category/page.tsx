'use client';
import { useEffect, useState } from 'react';
import { Table, Button, Popconfirm } from 'antd';
import { useDispatch } from 'react-redux';
import Link from 'next/link';

import Container from '@/components/Container';
import { fetchCategory, deleteCategory } from '@/lib/services/categoryService';
import { notify } from '@/lib/helpers/notification';
import { DeleteOutlined, EditOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

import type { Category } from '@/types/category';
import type { AppDispatch } from '@/store';


const CategoryPage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const { t } = useTranslation('common');

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
            notify(dispatch, t, 'success', 'category.form_delete.success');
            loadCategory();
        } catch {
            notify(dispatch, t, 'error', 'category.form_delete.failed');
        }
    };

    const columns = [
        {
            title: t('category.table.name'),
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: t('category.table.actions.title'),
            key: 'actions',
            render: (_: any, record: Category) => (
                <div className="flex gap-4">
                    <Link href={`/category/edit/?id=${record._id}`}>
                        <Button color="primary" variant="outlined" icon={<EditOutlined />}>
                            {t('category.table.actions.edit')}
                        </Button>
                    </Link>
                    <Popconfirm
                        title={t('category.form_delete.confirm.title')}
                        onConfirm={() => handleDeleteCategory(record._id!)}
                        okText={t('category.form_delete.confirm.ok')}
                        cancelText={t('category.form_delete.confirm.cancel')}
                    >
                        <Button danger icon={<DeleteOutlined />}>
                            {t('category.table.actions.delete')}
                        </Button>
                    </Popconfirm>
                </div>
            ),
        },
    ];

    return (
        <Container>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-3xl font-bold">{t('category.page_title')}</h1>

                <Link href="/category/create">
                    <Button
                        type="primary"
                        icon={<UnorderedListOutlined />}
                    >
                        {t('category.page_add')}
                    </Button>
                </Link>
            </div>

            <Table<Category>
                bordered
                rowKey="_id"
                columns={columns}
                dataSource={categories}
                loading={loading}
            />
        </Container>
    );
};

export default CategoryPage;
