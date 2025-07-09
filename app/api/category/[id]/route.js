import { connectToDatabase } from '@/lib/mongodb';
import Category from '@/models/Category';

export async function GET(req, { params }) {
    await connectToDatabase();
    const category = await Category.findById(params.id);
    return Response.json(category);
}

export async function PATCH(req, { params }) {
    await connectToDatabase();
    const data = await req.json();
    const updated = await Category.findByIdAndUpdate(params.id, data, { new: true });
    return Response.json(updated);
}

export async function DELETE(req, { params }) {
    await connectToDatabase();
    await Category.findByIdAndDelete(params.id);
    return Response.json({ message: 'Deleted' });
}