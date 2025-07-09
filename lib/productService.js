export const fetchProduct = async () => {
    const res = await fetch('/api/products');
    if (!res.ok) throw new Error('Fetch products failed!');
    return res.json();
};

export const fetchProductById = async (id) => {
    const res = await fetch(`/api/products/${id}`);
    if (!res.ok) throw new Error('Product not found');
    return res.json();
};

export const createProduct = async (data) => {
    const res = await fetch('/api/products', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || 'Create product failed!');
    }

    return res.json();
};

export const deleteProduct = async (id) => {
    const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
    });

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || 'Delete product failed!');
    }

    return res.json();
};

export const updateProduct = async (id, data) => {
    const res = await fetch(`/api/products/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || 'Update product failed!');
    }

    return res.json();
};