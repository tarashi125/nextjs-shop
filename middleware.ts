import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';

const protectedRoutes = ['/orders', '/products', '/category'];

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    const isProtected = protectedRoutes.some((path) =>
        pathname.startsWith(path)
    );

    if (!isProtected) return NextResponse.next();

    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
        const loginUrl = req.nextUrl.clone();
        loginUrl.pathname = '/';
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/orders/:path*',
        '/products/:path*',
        '/category/:path*',
    ],
};