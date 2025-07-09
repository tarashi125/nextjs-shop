export const orderStatus = {
    'processing': "Processing",
    'completed': "Completed",
    'pending': "Pending",
    'trash': 'Trash',
}

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

export const productDefault = {
    name: '',
    slug: '',
    price: '',
    category: [],
};

export const orderDefault = {
    title: '',
    description: '',
    status: 'processing',
    total: 0,
    items: [],
}

export const categoryDefault = {
    name: '',
}