"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function UserPanel() {
    const { data: session } = useSession();

    // Not logged in
    if (!session) {
        return (
            <Link href="/login" className="text-blue-400">
                Login
            </Link>
        );
    }

    // Logged in
    return (
        <div>
            <p className="text-sm text-gray-300 mb-2">
                Signed in as <span className="text-white">{session.user.username}</span>
            </p>

            <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="text-red-400 hover:text-red-300 text-sm"
            >
                Logout
            </button>
        </div>
    );
}