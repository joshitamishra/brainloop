"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import { loadAIQuestions, saveAIQuestions } from "@/lib/db";
import { loadStaticQuestions } from "@/lib/loadStaticQuestions";

export default function QuizStartPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { status } = useSession();

    // URL params
    const category = searchParams.get("category");
    const topicKey = searchParams.get("topic");
    const age = searchParams.get("age"); // only for primary

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const initCalled = useRef(false);

    /* 🔄 RESET WHEN URL CHANGES */
    useEffect(() => {
        setError("");
        setLoading(true);
        initCalled.current = false;

        sessionStorage.removeItem("currentSessionQuestions");
        sessionStorage.removeItem("quiz_session_active");
    }, [category, topicKey, age]);

    /* 🔐 AUTH GUARD */
    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        }
    }, [status, router]);

    /* 🚀 MAIN INIT */
    useEffect(() => {
        if (status !== "authenticated") return;
        if (!category || !topicKey) {
            router.push("/topic");
            return;
        }

        if (initCalled.current) return;
        initCalled.current = true;

        async function init() {
            setLoading(true);

            /* ================================
               1️⃣ TRY STATIC QUESTIONS FIRST
            ================================= */
            const staticQuestions = await loadStaticQuestions({
                category,
                topic: topicKey,
                age,
            });

            if (staticQuestions && staticQuestions.length > 0) {
                beginSession(staticQuestions);
                return;
            }

            /* ================================
               2️⃣ FALLBACK → AI
            ================================= */
            const cached = await loadAIQuestions(topicKey);
            if (cached && cached.length > 0) {
                beginSession(cached);
                return;
            }

            try {
                const res = await fetch("/api/generate", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ category, topic: topicKey }),
                });

                const data = await res.json();

                if (!data.questions || !Array.isArray(data.questions)) {
                    throw new Error("Invalid AI response");
                }

                await saveAIQuestions(topicKey, data.questions);
                beginSession(data.questions);
            } catch (err) {
                console.error("❌ AI generation failed:", err);
                setError("Failed to load questions.");
                setLoading(false);
            }
        }

        init();
    }, [status, category, topicKey, age, router]);

    /* ▶️ START SESSION */
    function beginSession(questions: any[]) {
        sessionStorage.setItem(
            "currentSessionQuestions",
            JSON.stringify(questions)
        );
        sessionStorage.setItem("quiz_session_active", "true");

        router.push(
            `/quiz/session?category=${category}&topic=${topicKey}${age ? `&age=${age}` : ""}`
        );
    }

    /* 🖥 UI STATES */
    if (status === "loading") {
        return <div className="p-10">Checking login…</div>;
    }

    if (error) {
        return <div className="text-red-400 text-lg p-6">❌ {error}</div>;
    }

    if (loading) {
        return (
            <div className="p-10 text-center space-y-6">
                <h2 className="text-2xl font-semibold">Preparing your session…</h2>
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-400 mx-auto" />
                <p className="text-gray-400">Please wait a moment.</p>
            </div>
        );
    }

    return null;
}