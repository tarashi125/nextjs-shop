import { connectToDatabase } from '@/lib/mongodb';
import Product from '@/models/Product';

export async function GET(req, { params }) {
    await connectToDatabase();
    const product = await Product.findById(params.id);
    return Response.json(product);
}

export async function PATCH(req, { params }) {
    await connectToDatabase();
    const data = await req.json();
    const updated = await Product.findByIdAndUpdate(params.id, data, { new: true });
    return Response.json(updated);
}

export async function DELETE(req, { params }) {
    await connectToDatabase();
    await Product.findByIdAndDelete(params.id);
    return Response.json({ message: 'Deleted' });
}