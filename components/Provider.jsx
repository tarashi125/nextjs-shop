"use client";
import { SessionProvider } from "next-auth/react";
import { Provider as ReduxProvider } from 'react-redux';
import { store } from '@/store';
import NotificationHandler from '@/components/NotificationHandler';

const Provider = ({ children, session }) => {
    return (
        <SessionProvider session={session}>
            <ReduxProvider store={store}>
                <NotificationHandler/>
                {children}
            </ReduxProvider>
        </SessionProvider>
    )
}

export default Provider