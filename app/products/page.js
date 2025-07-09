'use client';
import { useEffect, useState } from 'react';
import { Table, Button, Select, Popconfirm } from 'antd';
import Container from "@components/Container";
import { useDispatch } from 'react-redux';
import { setNotification } from '@/store/notificationSlice';
import Link from "next/link";
import {fetchProduct} from "@lib/productService";
import { fetchCategory } from "@lib/categoryService";
import {formatCurrency} from "@lib/utils";
import { DeleteOutlined, EditOutlined, AppstoreAddOutlined } from '@ant-design/icons';

const ProductsPage = () => {
    const dispatch = useDispatch();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState([]);

    const [filterOptions, setFilterOptions] = useState([]);

    const loadProducts = async () => {
        setLoading(true);
        const data = await fetchProduct();
        setProducts(data);
        setLoading(false);
    }

    useEffect(() => {
        loadProducts();

        const loadOptions = async () => {
            const categories = await fetchCategory();
            const mapped = categories.map((c) => ({
                label: c.name,
                value: c._id,
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

    const deleteProduct = async (id) => {
        try {
            const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error();
            dispatch(
                setNotification({
                    type: 'success',
                    message: 'Product deleted success!',
                    description: '',
                })
            );
            loadProducts();
        } catch {
            dispatch(
                setNotification({
                    type: 'success',
                    message: 'Product deleted failed!',
                    description: '',
                })
            );
        }
    };

    const columns = [
        { title: 'Name', dataIndex: 'name', key: 'name' },
        { title: 'Price', dataIndex: 'price', key: 'price', render: (v) => formatCurrency(v) },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <div className={`flex flex-wrap md:flex-nowrap gap-4`}>
                    <Link href={`/products/edit/?id=${record._id}`}>
                        <Button color="primary" variant="outlined" icon={<EditOutlined />}>Edit</Button>
                    </Link>
                    <Popconfirm
                        title="Are you sure to delete this product?"
                        onConfirm={() => deleteProduct(record._id)}
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
                <h1 className="text-3xl font-bold">Products</h1>

                <Link href={'/products/create'}>
                    <Button
                        type="primary"
                        icon={<AppstoreAddOutlined />}
                    >
                        Add Product
                    </Button>
                </Link>
            </div>

            {/* Select filter */}
            <div className="mb-4">
                <Select
                    mode="multiple"
                    allowClear
                    style={{ width: 240 }}
                    placeholder="Filter by category"
                    onChange={(value) => setSelectedCategory(value)}
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
}

export default ProductsPage
