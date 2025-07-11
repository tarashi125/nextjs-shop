import { connectToDatabase } from '@/lib/mongodb';
import Order from '@/models/Order';
import OrderItem from '@/models/OrderItem';
import { NextRequest } from 'next/server';
import { Types } from 'mongoose';
import { NextResponse } from 'next/server';

interface Params {
    params: { id: string };
}


export async function GET(req: NextRequest, { params }: Params) {
    await connectToDatabase();
    const { id } = await params;

    try {
        const order = await Order.findById(id)
            .populate({
                path: 'items',
                model: 'OrderItem',
            })
            .lean();

        if (!order) {
            return NextResponse.json({ message: 'Order not found' }, { status: 404 });
        }

        return NextResponse.json(order);
    } catch (error: any) {
        console.error('Error fetching order:', error);
        return NextResponse.json({ message: 'Failed to fetch order' }, { status: 500 });
    }
}


export async function PATCH(req: NextRequest, { params }: Params) {
    await connectToDatabase();
    const { id: orderId } = await params;

    try {
        // 1. Update order (title, description, total...)
        const {
            title,
            description,
            status = 'processing',
            total,
            totalTax,
            totalDiscount,
            items,
        } = await req.json();

        //Update order with new data
        const updatedFields: Record<string, any> = {
            ...(title !== undefined && { title }),
            ...(description !== undefined && { description }),
            ...(status !== undefined && { status }),
            ...(total !== undefined && { total }),
            ...(totalTax !== undefined && { totalTax }),
            ...(totalDiscount !== undefined && { totalDiscount }),
        };

        const order = await Order.findByIdAndUpdate(orderId, updatedFields, { new: true });

        if (!order) {
            return NextResponse.json({ message: 'Order not found' }, { status: 404 });
        }

        //Update order items
        if (Array.isArray(items)) {
            // Delete old OrderItem
            await OrderItem.deleteMany({ _id: { $in: order.items } });

            // Create new OrderItem
            const newItems = await OrderItem.insertMany(
                items.map((item: any) => ({
                    ...item,
                    orderId: new Types.ObjectId(orderId),
                }))
            );

            // save items list to order
            order.items = newItems.map((i) => i._id);
            await order.save();
        }

        return NextResponse.json(order);
    } catch (error: any) {
        console.error('PATCH order error:', error);
        return NextResponse.json({ message: 'Failed to update order' }, { status: 500 });
    }
}


export async function DELETE(req: NextRequest, { params }: Params) {
    await connectToDatabase();
    const { id } = await params;

    try {
        // 1. Delete order items
        await OrderItem.deleteMany({ orderId: id });

        // 2. Delete order
        const deletedOrder = await Order.findByIdAndDelete(id);

        if (!deletedOrder) {
            return NextResponse.json({ message: 'Order not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Order deleted successfully' });
    } catch (error: any) {
        console.error('DELETE order error:', error);
        return NextResponse.json({ message: 'Failed to delete order' }, { status: 500 });
    }
}