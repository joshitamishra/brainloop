"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function ProfileSetupPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (session?.user?.name) {
            setName(prev => prev || session.user.name || "");
        }
    }, [session]);

    if (status === "loading") {
        return (
            <div className="flex flex-col items-center mt-16 space-y-6 animate-fadeIn">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-rose-500"></div>
            </div>
        );
    }

    if (status === "unauthenticated") {
        router.push("/login");
        return null;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name.trim()) {
            setError("Please enter your name");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const response = await fetch("/api/user/update-name", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name: name.trim() }),
            });

            const data = await response.json();

            if (data.ok) {
                // Redirect to home page
                router.push("/");
            } else {
                setError(data.error || "Failed to update name");
            }
        } catch (err) {
            setError("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center mt-16 space-y-6 animate-fadeIn max-w-md mx-auto px-4">
            <h2 className="text-3xl font-bold text-slate-700 dark:text-slate-200">
                Welcome to Brainloop!
            </h2>

            <p className="text-lg text-slate-600 dark:text-slate-300 text-center">
                Please tell us your name to get started.
            </p>

            <form onSubmit={handleSubmit} className="w-full space-y-4">
                <div>
                    <label
                        htmlFor="name"
                        className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                    >
                        Your Name
                    </label>
                    <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your name"
                        className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 dark:bg-slate-800 dark:text-slate-200"
                        disabled={loading}
                        autoFocus
                    />
                </div>

                {error && (
                    <div className="text-red-500 text-sm text-center">{error}</div>
                )}

                <button
                    type="submit"
                    disabled={loading || !name.trim()}
                    className="w-full px-8 py-4 bg-rose-500 hover:bg-rose-600 disabled:bg-slate-400 disabled:cursor-not-allowed text-white text-xl rounded-xl shadow-lg transition-all hover:scale-105 active:scale-95"
                >
                    {loading ? "Saving..." : "Continue"}
                </button>
            </form>
        </div>
    );
}

