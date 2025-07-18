
import { AntdRegistry } from '@ant-design/nextjs-registry';
import Provider from '@/components/Provider';
import Nav from '@/components/Nav';
import type { Metadata } from 'next';
import '@/styles/global.css';
import '@ant-design/v5-patch-for-react-19';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
    const session = await getServerSession(authOptions);

    return (
        <html>
            <body>
                <AntdRegistry>
                    <Provider session={session}>
                        <Nav />
                        <main className="pt-[100px] min-h-screen">{children}</main>
                    </Provider>
                </AntdRegistry>
            </body>
        </html>
    );
}

export default RootLayout;