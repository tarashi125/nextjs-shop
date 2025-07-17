type OrderStatus = 'processing' | 'completed' | 'pending' | 'trash';

export const orderStatus: OrderStatus[] = [
    'processing',
    'completed',
    'pending',
    'trash',
]

export const getStatusColor = (status) => {
    switch (status) {
        case 'processing':
            return 'green';
        case 'completed':
            return 'blue';
        case 'pending':
            return 'grey';
        case 'trash':
            return 'red';
        default:
            return 'default';
    }
};