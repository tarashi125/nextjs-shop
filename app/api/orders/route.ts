import { connectToDatabase } from '@/lib/mongodb';
import Order from '@/models/Order';
import OrderItem from '@/models/OrderItem';

import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    let filter: Record<string, any> = {};

    const status = searchParams.get('status');

    if (status && status !== 'all') {
        filter.status = status;
    } else if (!status) {
        filter.status = { $ne: 'trash' };
    }

    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    if (startDate || endDate) {
        filter.createdAt = {};
        if (startDate) filter.createdAt.$gte = new Date(startDate);
        if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    try {
        const orders = await Order.find(filter)
            .populate('items')
            .sort({ createdAt: -1 });

        return NextResponse.json(orders);
    } catch (error: any) {
        return NextResponse.json({ message: error.message || 'Failed to fetch orders' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    await connectToDatabase();

    try {
        const body = await req.json();
        const {
            userId,
            title,
            description,
            status = 'processing',
            total,
            totalDiscount,
            totalTax,
            items = [],
        } = body;

        // 1. Create order without items
        const newOrder = await Order.create({
            userId,
            title,
            description,
            status,
            total,
            totalDiscount,
            totalTax,
            items: [],
        });

        // 2. Create order items
        const createdItems = await OrderItem.insertMany(
            items.map((item: any) => ({
                ...item,
                orderId: newOrder._id,
            }))
        );

        // 3. Link items to order
        newOrder.items = createdItems.map((item) => item._id);
        await newOrder.save();

        return NextResponse.json(newOrder, { status: 201 });
    } catch (error: any) {
        return NextResponse.json(
            { message: error.message || 'Failed to create order' },
            { status: 400 }
        );
    }
}