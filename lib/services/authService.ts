import { connectToDatabase } from '@/lib/mongodb';
import User, { IUser } from '@/models/User';
import bcrypt from 'bcryptjs';

interface Credentials {
    username: string;
    password: string;
}

interface AuthenticatedUser {
    id: string;
    username: string;
    name: string;
}

export const authorizeUser = async ( credentials: Credentials ): Promise<AuthenticatedUser | null> => {
    await connectToDatabase();

    const user = await User.findOne({ username: credentials.username }).select('+password') as IUser;
    if (!user || !user.password) return null;

    const isMatch = await bcrypt.compare(credentials.password, user.password);
    if (!isMatch) return null;

    return {
        id: user._id.toString(),
        username: user.username,
        name: user.name,
    };
};