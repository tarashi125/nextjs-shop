'use client';

import { useParams } from 'next/navigation';

export default function OrderDetailPage() {
    const { id } = useParams<{ id: string }>();

    return (
        <div>
            <h1>Chi tiết đơn hàng: {id}</h1>
        </div>
    );
}