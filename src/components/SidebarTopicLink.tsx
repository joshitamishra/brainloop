"use client";

import Link from "next/link";

export default function SidebarTopicLink({ href, children }) {
    return (
        <Link
            href={href}
            onClick={(e) => {
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
            }}
            className="block px-3 py-2 rounded-md hover:bg-[#2a2a2d] transition"
        >
            {children}
        </Link>
    );
}
