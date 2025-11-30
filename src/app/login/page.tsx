"use client";

import { signIn } from "next-auth/react";

export default function LoginPage() {
    return (
        <div className="flex flex-col items-center justify-center h-screen text-center">
            <h1 className="text-3xl font-semibold mb-6">Sign In</h1>

            <p className="text-gray-400 mb-10">
                Continue with your Google account to begin.
            </p>

            <button
                onClick={() => signIn("google")}
                className="w-64 py-3 bg-[#3b82f6] rounded-lg hover:bg-[#2563eb] transition text-white"
            >
                Continue with Google
            </button>
        </div>
    );
}