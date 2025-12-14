"use client";

import { signIn } from "next-auth/react";

export default function LoginPage() {
    const handleSignIn = () => {
        signIn("google", { 
            callbackUrl: "/",
            redirect: true 
        });
    };

    return (
        <div className="flex flex-col items-center mt-32">
            <h1 className="text-3xl font-bold mb-6">Login to Continue</h1>

            <button
                onClick={handleSignIn}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
                Sign in with Google
            </button>
        </div>
    );
}
