import type { Product } from '@/types/product';

export function createDefaultProduct(): Product {
    return {
        name: '',
        slug: '',
        price: 0,
        category: [],
    };
}