"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

import { loadAIQuestions, saveAIQuestions } from "@/lib/db";
import { QUESTION_BANK } from "@/data/questions";
import { preGenerateAllTopics } from "@/lib/preGenerate";

export default function QuizStartPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const topicKey = searchParams.get("topic");
    const category = searchParams.get("category");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const initCalled = useRef(false); // 🚀 NEW: prevents double API calls

    const topicLabel =
        QUESTION_BANK[category]?.topics[topicKey]?.label || "Unknown Topic";

    useEffect(() => {
        if (!topicKey) {
            router.push("/quiz");
            return;
        }

        // 🚀 Prevent React Strict Mode double-run
        if (initCalled.current) return;
        initCalled.current = true;

        async function init() {
            setLoading(true);

            const cached = await loadAIQuestions(topicKey);
            if (cached) {
                beginSession(cached);
                return;
            }

            try {
                const res = await fetch("/api/generate", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ topic: topicKey }),
                });

                const data = await res.json();

                if (!data.questions) {
                    setError("Failed to generate questions.");
                    setLoading(false);
                    return;
                }

                await saveAIQuestions(topicKey, data.questions);
                beginSession(data.questions);

                // Pre-generate other topics AFTER session starts
                setTimeout(() => {
                    preGenerateAllTopics(topicKey);
                }, 1000);

            } catch (err) {
                console.error("Generate error:", err);
                setError("Failed to contact AI engine.");
                setLoading(false);
            }
        }

        init();
    }, [topicKey]);

    function beginSession(questions) {
        sessionStorage.setItem(
            "currentSessionQuestions",
            JSON.stringify(questions)
        );

        sessionStorage.setItem("quiz_session_active", "true");

        router.push(`/quiz/session?topic=${topicKey}&category=${category}`);
    }

    if (error) {
        return (
            <div className="text-red-400 text-lg p-6">
                ❌ {error}
            </div>
        );
    }

    if (loading) {
        return (
            <div className="p-10 text-center space-y-6">
                <h2 className="text-2xl font-semibold">
                    Generating questions for <span className="text-blue-400">{topicLabel}</span>…
                </h2>

                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-400 mx-auto"></div>

                <p className="text-gray-400">
                    This may take a few seconds on your local AI model.
                </p>
            </div>
        );
    }

    return null;
}