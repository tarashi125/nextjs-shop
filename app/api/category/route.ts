import { connectToDatabase } from '@/lib/mongodb';
import Category from '@/models/Category';

import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function GET() {
    await connectToDatabase();

    try {
        const categories = await Category.find();
        return NextResponse.json(categories);
    } catch (error: any) {
        return NextResponse.json({ message: error.message || 'Failed to fetch categories' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    await connectToDatabase();

    try {
        const data = await req.json();
        const created = await Category.create(data);
        return NextResponse.json(created, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message || 'Failed to create category' }, { status: 400 });
    }
}