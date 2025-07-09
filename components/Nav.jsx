'use client';

import { useEffect, useState } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { Button, Dropdown, Space } from 'antd';
import {
    MenuOutlined,
    ProductOutlined,
    LogoutOutlined,
    BookOutlined,
    UnorderedListOutlined,
} from '@ant-design/icons';
import Container from '@/components/Container';
import Link from 'next/link';
import clsx from 'clsx';
import styles from '@/styles/Header.module.css';

const items = [
    { key: 'orders', label: <Link href="/orders">Orders</Link>, icon: <BookOutlined /> },
    { key: 'products', label: <Link href="/products">Products</Link>, icon: <ProductOutlined /> },
    { key: 'category', label: <Link href="/category">Category</Link>, icon: <UnorderedListOutlined /> },
    { type: 'divider' },
    {
        key: 'logout',
        label: <a onClick={(e) => { e.preventDefault(); signOut(); }}>Logout</a>,
        icon: <LogoutOutlined />,
    },
];

const Nav = () => {
    const { data: session } = useSession();
    const [hidden, setHidden] = useState(false);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        let ticking = false;

        const handleScroll = () => {
            const currentY = window.scrollY;
            const diff = currentY - lastScrollY;

            if (!ticking) {
                window.requestAnimationFrame(() => {
                    if (Math.abs(diff) > 5) {
                        setHidden(diff > 0 && currentY > 80);
                        setLastScrollY(currentY);
                    }
                    ticking = false;
                });

                ticking = true;
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    if (!session?.user) return null;

    return (
        <div className={clsx(styles.navFixed, hidden && styles.navHidden)} >
            <Container>
                <div className="flex items-center justify-between h-[78px]">
                    <div className={`${styles.logo}`}>
                        <a href="/" className="logo m-0">Shop</a>
                    </div>
                    <Space>
                        <Dropdown menu={{ items }} placement="bottomRight">
                            <Button><MenuOutlined /></Button>
                        </Dropdown>
                    </Space>
                </div>
                <hr className={`logo-hr mt-0 pt-1 border-0 ${styles.hr}`} />
            </Container>
        </div>
    );
};

export default Nav;