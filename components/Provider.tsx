'use client';

import { ReactNode } from 'react';
import { SessionProvider } from 'next-auth/react';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from '@/store';
import NotificationHandler from '@/components/NotificationHandler';

import type { Session } from 'next-auth';

interface IProps {
  children: ReactNode;
  session: Session | null;
}

const Provider = ({ children, session }: IProps) => {
    return (
        <SessionProvider session={session}>
            <ReduxProvider store={store}>
                <NotificationHandler/>
                {children}
            </ReduxProvider>
        </SessionProvider>
    );
};

export default Provider;