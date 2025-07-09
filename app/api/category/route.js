import { connectToDatabase } from '@/lib/mongodb';
import Category from '@/models/Category';

export async function GET() {
    await connectToDatabase();
    const category = await Category.find();
    return Response.json(category);
}

export async function POST(req) {
    await connectToDatabase();
    const data = await req.json();

    const created = await Category.create(data);
    return Response.json(created, { status: 201 });
}