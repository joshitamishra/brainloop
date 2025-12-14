"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import { loadAIQuestions, saveAIQuestions } from "@/lib/db";
import { QUESTION_BANK } from "@/data/questions";
import { preGenerateAllTopics } from "@/lib/preGenerate";

export default function QuizStartPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { status } = useSession();

    const topicKey = searchParams.get("topic");
    const category = searchParams.get("category");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [todayHistory, setTodayHistory] = useState<any[]>([]);

    const initCalled = useRef(false); // 🚀 NEW: prevents double API calls

    let topicLabel = "Unknown Topic";

    function isValidCategory(key: string): key is keyof typeof QUESTION_BANK {
        return key in QUESTION_BANK;
    }
    if (
        category &&
        topicKey &&
        isValidCategory(category) &&
        isValidTopic(category, topicKey)
    ) {
        topicLabel = (QUESTION_BANK as any)[category].topics[topicKey].label;
    }

    function isValidTopic(
        category: keyof typeof QUESTION_BANK,
        key: string
    ): key is keyof typeof QUESTION_BANK[typeof category]["topics"] {
        return key in QUESTION_BANK[category].topics;
    }

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        }
    }, [status, router]);

    useEffect(() => {
        if (status !== "authenticated") return;

        if (!topicKey) {
            router.push("/topic");
            return;
        }

        if (initCalled.current) return;
        initCalled.current = true;

        async function init() {
            setLoading(true);

            console.log("➡️ topicKey:", topicKey);
            console.log("➡️ category:", category);

            console.log("Is valid category?", isValidCategory(category!));
            console.log(
                "Is valid topic?",
                category && isValidCategory(category) && isValidTopic(category, topicKey!)
            );

            if (category === "primary" || category === "chemistry") {
                console.log("🎒 STATIC MODE — SHOULD USE STATIC QUESTIONS");
            }

            // --------------------------------------------------
            // 🚫 HARD STOP → PRIMARY CATEGORY NEVER USES LLM
            // --------------------------------------------------
            if (category === "primary" || category === "chemistry" || category === "computer" || category === "gk") {
                console.log("🎒 Static category → Using static questions only");

                if (
                    isValidCategory(category) &&
                    topicKey &&
                    isValidTopic(category, topicKey)
                ) {
                    const staticQs = (QUESTION_BANK as any)[category].topics[topicKey].questions;

                    if (!staticQs || staticQs.length === 0) {
                        console.error("❌ No static questions found for:", topicKey);
                        setError("Static questions not found.");
                        setLoading(false);
                        return;
                    }

                    beginSession(staticQs);
                    return; // ← IMPORTANT
                }

                console.error("❌ Invalid static topic:", topicKey);
                setError("Invalid static topic.");
                setLoading(false);
                return;
            }
            // --------------------------------------------------

            // NORMAL FLOW FOR NON-PRIMARY CATEGORIES
            const cached = await loadAIQuestions(topicKey!);
            if (cached) {
                beginSession(cached);
                return;
            }

            try {
                const res = await fetch("/api/generate", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ topic: topicKey, category }),
                });

                const data = await res.json();

                if (!data.questions) {
                    setError("Failed to generate questions.");
                    setLoading(false);
                    return;
                }

                await saveAIQuestions(topicKey!, data.questions);
                beginSession(data.questions);

            } catch (err) {
                console.error("Generate error:", err);
                setError("Failed to contact AI engine.");
                setLoading(false);
            }
        }

        init();
    }, [status, topicKey, category, router]);

    if (status === "loading") {
        return <div>Checking login…</div>;
    }
    if (status === "unauthenticated") return null;

    function beginSession(questions: any) {
        if (!questions || !Array.isArray(questions) || questions.length === 0) {
            console.error("❌ Cannot begin quiz: empty or invalid question list", questions);
            return;
        }

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