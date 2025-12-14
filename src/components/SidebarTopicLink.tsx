"use client";

import { useSession, signIn } from "next-auth/react";
import Link from "next/link";

export default function SidebarTopicLink({ href, children }) {
    const { data: session } = useSession();

    function handleClick(e) {
        if (!session) {
            e.preventDefault();
            // make callback url absolute so NextAuth will accept it
            const cb = `${window.location.origin}${href}`;
            signIn("google", { callbackUrl: cb });
            return;
        }

        const active = window.localStorage.getItem("quiz_session_active");
        if (active === "true") {
            const proceed = window.confirm(
                "A session is currently running.\n\nSwitching topics will end your current session.\n\nDo you want to leave this session?"
            );
            if (!proceed) {
                e.preventDefault();
                return;
            }
            window.localStorage.removeItem("quiz_session_active");
        }
    }

    return (
        <Link
            href={href}
            onClick={handleClick}
            className="block px-3 py-2 rounded-md hover:bg-[#2a2a2d] transition"
        >
            {children}
        </Link>
    );
}
