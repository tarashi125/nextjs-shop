'use client';

import { useSession } from 'next-auth/react';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();

    if (status === 'loading' || !session?.user?.id) return null;

    return <>{children}</>;
}