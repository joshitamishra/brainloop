"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
    const [dark, setDark] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem("theme-dark") === "true";
        setDark(saved);
        document.documentElement.classList.toggle("dark", saved);
    }, []);

    function toggle() {
        const next = !dark;
        setDark(next);
        localStorage.setItem("theme-dark", next.toString());
        document.documentElement.classList.toggle("dark", next);
    }

    return (
        <button
            onClick={toggle}
            className="px-4 py-2 rounded-lg bg-indigo-600 dark:bg-indigo-500 text-white shadow hover:opacity-90"
        >
            {dark ? "Light Mode" : "Dark Mode"}
        </button>
    );
}