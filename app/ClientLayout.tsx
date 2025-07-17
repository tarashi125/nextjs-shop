'use client';

// import { useEffect } from 'react';
// import { useTranslation } from 'react-i18next';
import Nav from '@/components/Nav';

const ClientLayout = ({children }: { children: React.ReactNode }) => {
    // const { i18n } = useTranslation();
    // useEffect(() => {
    //     if (typeof document !== 'undefined') {
    //         document.documentElement.lang = i18n.language;
    //     }
    // }, [i18n.language]);

    return (
        <>
            <Nav />
            <main className="pt-[100px] min-h-screen">{children}</main>
        </>
    );
}

export default ClientLayout;
