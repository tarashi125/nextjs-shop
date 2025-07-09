"use client"
import { useParams } from 'next/navigation';

export default function OrderDetailPage() {
    const params = useParams();
    const { id } = params;

    return (
        <div>
            <h1>Chi tiết đơn hàng: {id}</h1>
        </div>
    );
}