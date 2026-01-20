"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const slides = [
    { emoji: "🟥", text: "Red" },
    { emoji: "🟦", text: "Blue" },
    { emoji: "🟩", text: "Green" },
    { emoji: "🌞", text: "Yellow Sun" },
    { emoji: "🌙", text: "Moon" },
    { emoji: "⭐", text: "Star" },
    { emoji: "🍎", text: "Red Apple" },
    { emoji: "🐸", text: "Green Frog" },
    { emoji: "🟥 🟦 🟥", text: "Red Blue Red" },
    { emoji: "⭐ ⚪ ⭐", text: "Star Circle Star" }
];

export default function ColorsAndShapesPage() {
    const router = useRouter();
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prevIndex) => (prevIndex + 1) % slides.length);
        }, 6000); // changes every 6 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 dark:from-slate-900 dark:via-purple-900 dark:to-slate-800 p-4">
            <div className="text-center bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-12 w-full max-w-md transition-all">
                {/* Back Button */}
                <button
                    onClick={() => router.push("/topic")}
                    className="mb-6 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 underline transition-colors"
                >
                    ← Back to Topics
                </button>

                {/* Emoji Display */}
                <div className="text-[120px] mb-8 leading-none animate-fadeIn" key={index}>
                    {slides[index].emoji}
                </div>

                {/* Text Display */}
                <div className="text-5xl font-bold text-slate-800 dark:text-white mb-8 animate-fadeIn" key={`text-${index}`}>
                    {slides[index].text}
                </div>

                {/* Instruction */}
                <div className="text-base text-slate-500 dark:text-slate-400 italic">
                    Say it out loud with your child
                </div>

                {/* Progress Dots */}
                <div className="flex justify-center gap-2 mt-8">
                    {slides.map((_, i) => (
                        <div
                            key={i}
                            className={`w-2 h-2 rounded-full transition-all ${i === index
                                    ? "bg-purple-500 w-6"
                                    : "bg-slate-300 dark:bg-slate-600"
                                }`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
