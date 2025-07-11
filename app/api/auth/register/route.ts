import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        await connectToDatabase();
        const body = await req.json();
        const { username, name, password } = body;

        if (!username || !name || !password) {
            return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return NextResponse.json({ error: 'Username already taken.' }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            username,
            name,
            password: hashedPassword,
        });

        return NextResponse.json({
            message: 'User registered successfully',
            user: {
                id: newUser._id.toString(),
                username: newUser.username,
                name: newUser.name,
            },
        }, { status: 201 });

    } catch (error: any) {
        console.error('Register error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}