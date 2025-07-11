export interface Product {
    _id?: string;
    name: string;
    slug: string;
    price: number;
    category?: string[];
    createdAt?: string;
    updatedAt?: string;
}
