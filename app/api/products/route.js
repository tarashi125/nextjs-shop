import { connectToDatabase } from '@/lib/mongodb';
import Product from '@/models/Product';

export async function GET() {
    await connectToDatabase();
    const products = await Product.find();
    return Response.json(products);
}

export async function POST(req) {
    await connectToDatabase();
    const data = await req.json();

    const created = await Product.create(data);
    return Response.json(created, { status: 201 });
}