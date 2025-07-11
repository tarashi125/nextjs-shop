import type { Product } from '@/types/product';

/**
 * Fetch all products
 */
export const fetchProduct = async (): Promise<Product[]> => {
    const res = await fetch('/api/products');
    if (!res.ok) throw new Error('Fetch products failed!');
    return res.json();
};

/**
 * Fetch a single product by ID.
 *
 * @param id - The ID of the product.
 * @returns A promise that resolves to the product.
 * @throws An error if the request fails.
 */
export const fetchProductById = async (id: string): Promise<Product> => {
    const res = await fetch(`/api/products/${id}`);
    if (!res.ok) throw new Error('Product not found');
    return res.json();
};

/**
 * Create a new product.
 *
 * @param data - The product data to create.
 * @returns A promise that resolves to the newly created product.
 * @throws An error if the request fails.
 */
export const createProduct = async (data: Omit<Product, '_id'>): Promise<Product> => {
    const res = await fetch('/api/products', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || 'Create product failed!');
    }

    return res.json();
};

/**
 * Update an existing product by ID.
 *
 * @param id - The ID of the product to update.
 * @param data - Partial product data to update.
 * @returns A promise that resolves to the updated product.
 * @throws An error if the request fails or the response is invalid.
 */
export const updateProduct = async (id: string, data: Partial<Product>): Promise<Product> => {
    const res = await fetch(`/api/products/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || 'Update product failed!');
    }

    return res.json();
};

/**
 * Delete an product by ID.
 *
 * @param id - The ID of the product to delete.
 * @returns A promise that resolves to the deleted product.
 * @throws An error if the request fails.
 */
export const deleteProduct = async (id: string): Promise<{ success: boolean }> => {
    const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
    });

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || 'Delete product failed!');
    }

    return res.json();
};