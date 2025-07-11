import type { ReactNode } from 'react';

interface OrderLayoutProps {
    children: ReactNode;
}

export default async function OrderLayout({ children }: OrderLayoutProps) {
    return <>{children}</>;
}