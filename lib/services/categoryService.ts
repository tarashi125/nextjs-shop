import type { Category } from '@/types/category';

/**
 * Fetch all categories
 */
export const fetchCategory = async (): Promise<Category[]> => {
    const res = await fetch('/api/category');
    if (!res.ok) throw new Error('Fetch categories failed!');
    return res.json();
};

/**
 * Fetch category by ID
 */
export const fetchCategoryById = async (id: string): Promise<Category> => {
    const res = await fetch(`/api/category/${id}`);
    if (!res.ok) throw new Error('Fetch category detail failed!');
    return res.json();
};

/**
 * Create new category
 */
export const createCategory = async (values: Category): Promise<Category> => {
    const res = await fetch('/api/category', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
    });
    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || 'Create category failed!');
    }

    return res.json();
};

/**
 * Update category by ID
 */
export const updateCategory = async (id: string, data: Partial<Category>): Promise<Category> => {
    const res = await fetch(`/api/category/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || 'Update category failed!');
    }

    return res.json();
};

/**
 * Delete category by ID
 */
export const deleteCategory = async (id: string): Promise<Category> => {
    const res = await fetch(`/api/category/${id}`, {
        method: 'DELETE',
    });
    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || 'Delete category failed!');
    }
    return res.json();
};