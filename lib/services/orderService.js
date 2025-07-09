export const fetchOrders = async (params = {}) => {
    const query = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        if (Array.isArray(value)) {
            value.forEach(v => query.append(key, v));
        } else if (value !== undefined && value !== null) {
            query.set(key, value);
        }
    });

    const url = `/api/orders${query.toString() ? `?${query.toString()}` : ''}`;

    const res = await fetch(url);
    if (!res.ok) throw new Error('Fetch orders failed!');
    return res.json();
};

export const fetchOrderById = async (id) => {
    const res = await fetch(`/api/orders/${id}`);
    if (!res.ok) throw new Error('Fetch order detail failed!');
    return res.json();
};

export const createOrder = async (data) => {
    const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || 'Create order failed!');
    }

    return res.json();
};

export const updateOrder = async (id, data) => {
    try {
        const res = await fetch(`/api/orders/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!res.ok) {
            const contentType = res.headers.get('content-type');
            const errorText = contentType?.includes('application/json')
                ? (await res.json()).message || JSON.stringify(await res.json())
                : await res.text();

            console.error('❌ Update order failed:', res.status, errorText);
            throw new Error(errorText || 'Update order failed!');
        }

        return await res.json();
    } catch (error) {
        console.error('❌ Network or parsing error:', error);
        throw error;
    }
};

export const deleteOrder = async (id) => {
    const res = await fetch(`/api/orders/${id}`, {
        method: 'DELETE',
    });

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || 'Delete order failed!');
    }

    return res.json();
};