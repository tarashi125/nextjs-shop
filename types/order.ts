import { Dayjs } from 'dayjs';

export interface Order {
    _id?: string;
    userId?: string;
    title: string;
    description: string;
    status: string;
    items: OrderItem[];
    total: number;
    totalDiscount: number;
    totalTax: number;
    createdAt?: string;
    updateAt?: string;
}

export interface OrderItem {
    _id?: string;
    productId?: string | null;
    name: string;
    qty: number;
    price: number;
    discount: number;
    tax: number;
    type?: string;
}

export interface OrderFilterParams {
    status: string;
    date: Dayjs | null;
    startDate: string;
    endDate: string;
}
