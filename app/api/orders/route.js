import { connectToDatabase } from '@/lib/mongodb';
import Order from '@/models/Order';
import OrderItem from '@/models/OrderItem';

export async function GET(req) {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    let filter = {};

    const status = searchParams.get('status');

    if (status && status !== 'all') {
        filter.status = status;
    } else if (!status) {
        filter.status = { $ne: 'trash' };
    }

    const startDate = searchParams.get('startDate'); // ISO string
    const endDate = searchParams.get('endDate');     // ISO string
    if (startDate || endDate) {
        filter.createdAt = {};
        if (startDate) {
            filter.createdAt.$gte = new Date(startDate);
        }
        if (endDate) {
            filter.createdAt.$lte = new Date(endDate);
        }
    }

    const orders = await Order.find(filter)
        .populate('items')
        .sort({ createdAt: -1 });

    return Response.json(orders);
}

export async function POST(req) {
    await connectToDatabase();
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

    // 2. Create OrderItem
    const createdItems = await OrderItem.insertMany(
        items.map(item => ({
            ...item,
            orderId: newOrder._id,
        }))
    );

    // 3. Update list OrderItem to order
    newOrder.items = createdItems.map(item => item._id);
    await newOrder.save();

    return Response.json(newOrder);
}