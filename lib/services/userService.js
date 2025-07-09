import { connectToDatabase } from "@lib/mongodb";
import User from "@models/User";
import bcrypt from "bcryptjs";

export const authorizeUser = async ({ credentials }) => {
    await connectToDatabase();

    const user = await User.findOne({ username: credentials.username }).lean();
    if (!user) return null;

    const isMatch = await bcrypt.compare(credentials.password, user.password);
    if (!isMatch) return null;

    return {
        id: user._id.toString(),
        username: user.username,
        name: user.name,
    };
};