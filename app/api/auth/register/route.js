import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req) {
    try {
        await connectToDatabase();
        const body = await req.json();
        const { username, name, password } = body;

        if (!username || !name || !password) {
            return Response.json({ error: "All fields are required." }, { status: 400 });
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return Response.json({ error: "Username already taken." }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            username,
            name,
            password: hashedPassword,
        });

        return Response.json({
            message: "User registered successfully",
            user: { id: newUser._id, username: newUser.username, name: newUser.name }
        }, { status: 201 });

    } catch (err) {
        console.error("Register error:", err);
        return Response.json({ error: "Internal Server Error" }, { status: 500 });
    }
}