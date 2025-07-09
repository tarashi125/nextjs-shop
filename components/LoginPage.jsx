"use client";
import { useSession } from "next-auth/react";
import { useState } from "react";
import LoginForm from "@/components/LoginForm";
import RegisterForm from "@/components/RegisterForm";

export default function LoginPage() {
    const { data: session, status } = useSession();
    const [formShowing, setFormShowing] = useState('login');

    if (status !== 'loading' && !session?.user?.id) {
        return (
            <div className="flex justify-center items-center h-screen">

                <div className="bg-white p-8 rounded-2xl shadow-xl border border-neutral-200 w-96">
                    <h2 className="text-2xl font-bold mb-4 text-center">
                        {formShowing === 'login' ? 'Login' : 'Register'}
                    </h2>

                    {formShowing === 'login' ? (
                        <LoginForm setFormShowing={setFormShowing} />
                    ) : (
                        <RegisterForm setFormShowing={setFormShowing} />
                    )}
                </div>

            </div>
        );
    }
}