import { connectToDatabase } from '@/lib/mongodb';
import Product from '@/models/Product';

import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';


export async function GET() {
    await connectToDatabase();

    try {
        const products = await Product.find();
        return NextResponse.json(products);
    } catch (error) {
        return NextResponse.json(
            { message: 'Failed to fetch products' },
            { status: 500 }
        );
    }

}

export async function POST(req: NextRequest) {
    await connectToDatabase();

    try {
        const data = await req.json();

        const created = await Product.create(data);
        return NextResponse.json(created, { status: 201 });
    } catch (error: any) {
        return NextResponse.json(
            { message: error.message || 'Failed to create product' },
            { status: 400 }
        );
    }
}