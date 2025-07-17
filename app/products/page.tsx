'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { Table, Button, Select, Popconfirm } from 'antd';
import { DeleteOutlined, EditOutlined, AppstoreAddOutlined } from '@ant-design/icons';

import Container from '@/components/Container';
import { setNotification } from '@/store/notificationSlice';
import { fetchProduct } from '@/lib/services/productService';
import { fetchCategory } from '@/lib/services/categoryService';
import { formatCurrency } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

import type { AppDispatch } from '@/store';
import type { Product } from '@/types/product';
import type { Category } from '@/types/category';

const ProductsPage = () => {
    const dispatch = useDispatch<AppDispatch>();

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedCategory, setSelectedCategory] = useState<string[]>([]);
    const [filterOptions, setFilterOptions] = useState<{ label: string; value: string }[]>([]);
    const { t } = useTranslation();

    const loadProducts = async () => {
        setLoading(true);
        const data = await fetchProduct();
        setProducts(data);
        setLoading(false);
    };

    useEffect(() => {
        loadProducts();

        const loadOptions = async () => {
            const categories: Category[] = await fetchCategory();
            const mapped = categories
                .filter(c => c.name && c._id)
                .map((c) => ({
                    label: c.name!,
                    value: c._id!,
                }));
            setFilterOptions(mapped);
        };
        loadOptions();
    }, []);

    const filteredProducts = selectedCategory.length
        ? products.filter((product) =>
            Array.isArray(product.category) &&
            product.category.some((catId) => selectedCategory.includes(catId))
        )
        : products;

    const deleteProduct = async (id: string) => {
        try {
            const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error();
            dispatch(
                setNotification({
                    type: 'success',
                    message: t('product.form_delete.success'),
                    description: '',
                })
            );
            loadProducts();
        } catch {
            dispatch(
                setNotification({
                    type: 'error',
                    message: t('product.form_delete.failed'),
                    description: '',
                })
            );
        }
    };

    const columns = [
        {
            title: t('product.table.name'),
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: t('product.table.price'),
            dataIndex: 'price',
            key: 'price',
            render: (v: number) => formatCurrency(v),
        },
        {
            title: t('product.table.actions.title'),
            key: 'actions',
            render: (_: any, record: Product) => (
                <div className="flex flex-wrap md:flex-nowrap gap-4">
                    <Link href={`/products/edit/?id=${record._id}`}>
                        <Button
                            color="primary"
                            variant="outlined"
                            icon={<EditOutlined />}
                        >
                            {t('product.table.actions.edit')}
                        </Button>
                    </Link>
                    <Popconfirm
                        title={t('product.form_delete.confirm.title')}
                        onConfirm={() => deleteProduct(record._id!)}
                        okText={t('product.form_delete.confirm.ok')}
                        cancelText={t('product.form_delete.confirm.cancel')}
                    >
                        <Button danger icon={<DeleteOutlined />}>
                            {t('product.table.actions.delete')}
                        </Button>
                    </Popconfirm>
                </div>
            ),
        },
    ];

    return (
        <Container>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-3xl font-bold">{t('product.page_title')}</h1>

                <Link href="/products/create">
                    <Button
                        type="primary"
                        icon={<AppstoreAddOutlined />}
                    >
                        {t('product.page_add')}
                    </Button>
                </Link>
            </div>

            {/* Select filter */}
            <div className="mb-4">
                <Select
                    mode="multiple"
                    allowClear
                    style={{ width: 240 }}
                    placeholder={t('product.page_filter')}
                    onChange={(value: string[]) => setSelectedCategory(value)}
                    options={filterOptions}
                />
            </div>

            <Table
                bordered
                dataSource={filteredProducts}
                columns={columns}
                rowKey="_id"
                loading={loading}
            />
        </Container>
    );
};

export default ProductsPage;
