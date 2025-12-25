"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { QUESTION_BANK } from "@/data/questions-client";

/* ---------------------------
   🔵 TOPIC DEFINITIONS
---------------------------- */

const MATH_TOPICS = [
    { key: "algebra", label: "Algebra" },
    { key: "geometry", label: "Geometry" },
    { key: "calculus", label: "Calculus" },
    { key: "trigonometry", label: "Trigonometry" }
];

const COMPUTER_TOPICS = [
    { key: "linux_commands", label: "Linux Commands" },
    { key: "microsoft_excel", label: "Microsoft Excel" }
]

const GK_TOPICS = [
    { key: "current_affairs", label: "Current Affairs" },
    { key: "geography", label: "Geography" }
];
const PHYSICS_TOPICS = [
    { key: "mechanics", label: "Mechanics" },
    { key: "optics", label: "Optics" }
];

const PRIMARY_TOPICS = [
    { key: "basic_math", label: "Math" },
    { key: "english", label: "English" },
    { key: "science", label: "Science" },
    { key: "reading", label: "Reading Comprehension" },
    { key: "shlok", label: "Shlok" }
];

/* ---------------------------
   🔵 TOPIC PAGE
---------------------------- */

export default function TopicPage() {
    const router = useRouter();
    const { status, data: session } = useSession();

    // Redirect unauthenticated users to login (only after status is confirmed)
    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        }
    }, [status, router]);

    function goToTopic(key: string, category: string) {
        // Check authentication before navigating
        if (status !== "authenticated") {
            router.push("/login");
            return;
        }

        // 🔒 Check for premium content
        if (["math", "physics", "chemistry"].includes(category)) {
            router.push("/premium");
            return;
        }

        console.log("Topic key:", key);
        console.log("Category:", category);
        router.push(`/quiz/start?topic=${key}&category=${category}`);
    }

    // Show loading while checking session
    if (status === "loading") {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-rose-500"></div>
            </div>
        );
    }

    // Don't render content if unauthenticated (will redirect)
    if (status === "unauthenticated") {
        return null;
    }

    return (
        <div className="space-y-10 animate-fadeIn">

            {/* MATH */}
            <div>
                <h2 className="text-lg font-semibold text-slate-400 uppercase">Math</h2>
                <div className="grid gap-3 mt-2">
                    {MATH_TOPICS.map(t => (
                        <button
                            key={t.key}
                            onClick={() => goToTopic(t.key, "math")}
                            className="p-4 bg-white dark:bg-slate-800 border rounded-xl shadow hover:shadow-lg transition-all hover:scale-[1.02] text-left text-slate-900 dark:text-white"
                        >
                            <span className="flex justify-between items-center w-full">
                                {t.label}
                                <span className="text-sm text-gray-400">🔒</span>
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* PHYSICS */}
            <div>
                <h2 className="text-lg font-semibold text-slate-400 uppercase">Physics</h2>
                <div className="grid gap-3 mt-2">
                    {PHYSICS_TOPICS.map(t => (
                        <button
                            key={t.key}
                            onClick={() => goToTopic(t.key, "physics")}
                            className="p-4 bg-white dark:bg-slate-800 border rounded-xl shadow hover:shadow-lg transition-all hover:scale-[1.02] text-left text-slate-900 dark:text-white"
                        >
                            <span className="flex justify-between items-center w-full">
                                {t.label}
                                <span className="text-sm text-gray-400">🔒</span>
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* CHEMISTRY */}
            <div>
                <h2 className="text-lg font-semibold text-slate-400 uppercase">Chemistry</h2>
                <div className="grid gap-3 mt-2">
                    {[{ key: "periodic_table", label: "Periodic Table" }].map(t => (
                        <button
                            key={t.key}
                            onClick={() => goToTopic(t.key, "chemistry")}
                            className="p-4 bg-white dark:bg-slate-800 border rounded-xl shadow hover:shadow-lg transition-all hover:scale-[1.02] text-left text-slate-900 dark:text-white"
                        >
                            <span className="flex justify-between items-center w-full">
                                {t.label}
                                <span className="text-sm text-gray-400">🔒</span>
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* COMPUTER */}
            <div>
                <h2 className="text-lg font-semibold text-slate-400 uppercase">Computer</h2>
                <div className="grid gap-3 mt-2">
                    {COMPUTER_TOPICS.map(t => (
                        <button
                            key={t.key}
                            onClick={() => goToTopic(t.key, "computer")}
                            className="p-4 bg-white dark:bg-slate-800 border rounded-xl shadow hover:shadow-lg transition-all hover:scale-[1.02] text-left text-slate-900 dark:text-white">
                            {t.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* GK BLOCK */}
            <div>
                <h2 className="text-lg font-semibold text-slate-400 uppercase">GK</h2>
                <div className="grid gap-3 mt-2">
                    {GK_TOPICS.map(t => (
                        <button
                            key={t.key}
                            onClick={() => goToTopic(t.key, "gk")}
                            className="p-4 bg-white dark:bg-slate-800 border rounded-xl shadow hover:shadow-lg transition-all hover:scale-[1.02] text-left text-slate-900 dark:text-white">
                            {t.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* PRIMARY BLOCK */}
            <div>
                <h2 className="text-lg font-semibold text-slate-400 uppercase">
                    {QUESTION_BANK.primary.label}
                </h2>

                {Object.entries(QUESTION_BANK.primary.ageGroups).map(([ageKey, ageGroup]) => (
                    <div key={ageKey} className="mt-4">
                        <h3 className="text-sm text-slate-500 mb-2">
                            {ageGroup.label}
                        </h3>

                        <div className="grid gap-3">
                            {Object.entries(ageGroup.topics).map(([topicKey, topic]) => (
                                <button
                                    key={topicKey}
                                    onClick={() => {
                                        if ("kind" in topic && topic.kind === "content" && "route" in topic) {
                                            router.push(topic.route);
                                        } else {
                                            router.push(
                                                `/quiz/start?category=primary&age=${ageKey}&topic=${topicKey}`
                                            );
                                        }
                                    }}
                                    className="p-4 bg-white dark:bg-slate-800 border rounded-xl shadow hover:shadow-lg transition-all hover:scale-[1.02] text-left text-slate-900 dark:text-white"
                                >
                                    {topic.label}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}