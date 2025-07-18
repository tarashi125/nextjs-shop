import { connectToDatabase } from '@/lib/mongodb';
import Category from '@/models/Category';

import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    await connectToDatabase();
    const url = new URL(req.url);
    const id = url.pathname.split('/').pop();

    try {
        const category = await Category.findById(id);
        if (!category) {
            return NextResponse.json({ message: 'Category not found' }, { status: 404 });
        }

        return NextResponse.json(category);
    } catch (error: any) {
        return NextResponse.json({ message: error.message || 'Failed to fetch category' }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest) {
    await connectToDatabase();
    const url = new URL(req.url);
    const id = url.pathname.split('/').pop();

    try {
        const data = await req.json();
        const updated = await Category.findByIdAndUpdate(id, data, { new: true });

        if (!updated) {
            return NextResponse.json({ message: 'Category not found' }, { status: 404 });
        }

        return NextResponse.json(updated);
    } catch (error: any) {
        return NextResponse.json({ message: error.message || 'Failed to update category' }, { status: 400 });
    }
}

export async function DELETE(req: NextRequest) {
    await connectToDatabase();
    const url = new URL(req.url);
    const id = url.pathname.split('/').pop();

    try {
        const deleted = await Category.findByIdAndDelete(id);
        if (!deleted) {
            return NextResponse.json({ message: 'Category not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Category deleted successfully' });
    } catch (error: any) {
        return NextResponse.json({ message: error.message || 'Failed to delete category' }, { status: 400 });
    }
}