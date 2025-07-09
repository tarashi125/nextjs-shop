export const fetchCategory = async () => {
    const res = await fetch('/api/category');
    if (!res.ok) throw new Error('Fetch products failed!');
    return res.json();
}

export const fetchCategoryById = async (id) => {
    const res = await fetch(`/api/category/${id}`);
    if (!res.ok) throw new Error('Fetch category detail failed!');
    return res.json();
};

export const createCategory = async (values) => {
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
}

export const updateCategory = async (id, data) => {
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

export const deleteCategory = async (id) => {
    const res = await fetch(`/api/category/${id}`, {
        method: 'DELETE'
    });
    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || 'Delete category failed!');
    }
    return res.json();
}