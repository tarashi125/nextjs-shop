'use client'
import { useSession } from "next-auth/react";
import Container from "@/components/Container";
import LoginPage from "@/components/LoginPage";
import Orders from "@/components/order/Orders";


const Home = () => {
    const { data: session, status } = useSession();

    if (status === 'loading') return null;

    if (!session?.user?.id) return (
        <Container>
            <LoginPage />
        </Container>
    );

    return (
        <Container>

            <Orders />

        </Container>
    );
}

export default Home