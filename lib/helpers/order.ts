import type { Order, OrderItem } from '@/types/order';

export function createDefaultOrder(): Order {
    return {
        title: '',
        description: '',
        status: 'processing',
        items: [],
        total: 0,
        totalDiscount: 0,
        totalTax: 0,
    };
}

export function createDefaultOrderItem(): OrderItem {
    return {
        productId: null,
        name: '',
        qty: 1,
        price: 0,
        discount: 0,
        tax: 0,
        type: 'select',
    };
}