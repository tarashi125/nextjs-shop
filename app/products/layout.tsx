import type { ReactNode } from 'react';

interface ProductLayoutProps {
    children: ReactNode;
}

export default async function ProductLayout({ children }: ProductLayoutProps) {
    return <>{children}</>;
}