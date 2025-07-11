import type { Order, OrderFilterParams } from '@/types/order';

/**
 * Fetch a list of orders with optional filter parameters.
 *
 * @param params - Filtering parameters like status, startDate, endDate...
 * @returns A promise that resolves to a list of orders.
 * @throws An error if the request fails.
 */
export const fetchOrders = async (params: Partial<OrderFilterParams> = {}): Promise<Order[]> => {
    const query = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        if (Array.isArray(value)) {
            value.forEach(v => {
                if (v != null) query.append(key, String(v));
            });
        } else if (value != null) {
            query.set(key, String(value));
        }
    });

    const url = `/api/orders${query.toString() ? `?${query.toString()}` : ''}`;

    const res = await fetch(url);
    if (!res.ok) throw new Error('Fetch orders failed!');
    return res.json();
};

/**
 * Fetch a single order by ID.
 *
 * @param id - The ID of the order.
 * @returns A promise that resolves to the order.
 * @throws An error if the request fails.
 */
export const fetchOrderById = async (id: string): Promise<Order> => {
    const res = await fetch(`/api/orders/${id}`);
    if (!res.ok) throw new Error('Fetch order detail failed!');
    return res.json();
};

/**
 * Create a new order.
 *
 * @param data - The order data to create.
 * @returns A promise that resolves to the newly created order.
 * @throws An error if the request fails.
 */
export const createOrder = async (data: Order): Promise<Order> => {
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

/**
 * Update an existing order by ID.
 *
 * @param id - The ID of the order to update.
 * @param data - Partial order data to update.
 * @returns A promise that resolves to the updated order.
 * @throws An error if the request fails or the response is invalid.
 */
export const updateOrder = async (id: string, data: Partial<Order>): Promise<Order> => {
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

            console.error('Update order failed:', res.status, errorText);
            throw new Error(errorText || 'Update order failed!');
        }

        return await res.json();
    } catch (error) {
        console.error('Network or parsing error:', error);
        throw error;
    }
};

/**
 * Delete an order by ID.
 *
 * @param id - The ID of the order to delete.
 * @returns A promise that resolves to the deleted order.
 * @throws An error if the request fails.
 */
export const deleteOrder = async (id: string): Promise<Order> => {
    const res = await fetch(`/api/orders/${id}`, {
        method: 'DELETE',
    });

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || 'Delete order failed!');
    }

    return res.json();
};