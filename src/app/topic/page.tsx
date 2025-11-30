"use client";

import { useRouter } from "next/navigation";

const topics = [
    "Basic Algebra",
    "Fractions",
    "Percentages",
    "Geometry Basics",
    "Trigonometry Intro",
];

export default function TopicPage() {
    const router = useRouter();

    return (
        <div className="space-y-6 animate-fadeIn">
            <h2 className="text-2xl font-semibold text-slate-700 dark:text-slate-200">
                Choose a Topic
            </h2>

            <div className="grid gap-4">
                {topics.map((topic) => (
                    <button
                        key={topic}
                        onClick={() => router.push(`/quiz?topic=${encodeURIComponent(topic)}`)}
                        className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow hover:shadow-lg transition-all hover:scale-[1.02] text-left border border-rose-200 dark:border-rose-800"
                    >
                        <span className="text-xl text-rose-600 dark:text-rose-400 font-medium">
                            {topic}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
}
