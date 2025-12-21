"use client";

import { useSession, signIn } from "next-auth/react";
import Link from "next/link";
import { ReactNode } from "react";

type Props = {
    href: string;
    children: ReactNode;
    isContent?: boolean;
};

export default function SidebarTopicLink({
    href,
    children,
    isContent = false,
}: Props) {
    const { data: session } = useSession();

    function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
        // 🔐 Require login for quiz pages only
        if (!session && !isContent) {
            e.preventDefault();
            const cb = `${window.location.origin}${href}`;
            signIn("google", { callbackUrl: cb });
            return;
        }

        // ⛔ Prevent topic switching during active quiz
        if (!isContent) {
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
