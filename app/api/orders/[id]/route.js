import { connectToDatabase } from '@/lib/mongodb';
import Order from '@/models/Order';
import OrderItem from '@/models/OrderItem';

export async function GET(req, { params }) {
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
            return new Response(JSON.stringify({ message: 'Order not found' }), {
                status: 404,
            });
        }

        return new Response(JSON.stringify(order), {
            status: 200,
        });
    } catch (err) {
        console.error('Error fetching order:', err);
        return new Response(JSON.stringify({ message: 'Failed to fetch order' }), {
            status: 500,
        });
    }
}


export async function PATCH(req, { params }) {
    await connectToDatabase();
    const { id: orderId } = await params;
    const data = await req.json();

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
        } = data;

        //Update order with new data
        const updatedFields = {
            ...(title !== undefined && { title }),
            ...(description !== undefined && { description }),
            ...(status !== undefined && { status }),
            ...(total !== undefined && { total }),
            ...(totalDiscount !== undefined && { totalDiscount }),
            ...(totalTax !== undefined && { totalTax }),
        };
        const order = await Order.findByIdAndUpdate(orderId, updatedFields, {
            new: true,
        });

        //Update order items
        if (Array.isArray(items)) {
            // Delete old OrderItem
            await OrderItem.deleteMany({ _id: { $in: order.items } });

            // Create new OrderItem
            const newItems = await OrderItem.insertMany(
                items.map((item) => ({
                    ...item,
                    orderId,
                }))
            );

            // save items list to order
            order.items = newItems.map((i) => i._id);
            await order.save();
        }

        return Response.json(order);
    } catch (error) {
        console.error("PATCH order error:", error);
        return new Response("Failed to update order", { status: 500 });
    }
}


export async function DELETE(req, { params }) {
    await connectToDatabase();
    const { id } = await params;

    try {
        // 1. Delete order items
        await OrderItem.deleteMany({ orderId: id });

        // 2. Delete order
        const deletedOrder = await Order.findByIdAndDelete(id);

        if (!deletedOrder) {
            return new Response(JSON.stringify({ message: 'Order not found' }), {
                status: 404,
            });
        }

        return new Response(JSON.stringify({ message: 'Order deleted successfully' }), {
            status: 200,
        });
    } catch (err) {
        return new Response(JSON.stringify({ message: 'Failed to delete order' }), {
            status: 500,
        });
    }
}