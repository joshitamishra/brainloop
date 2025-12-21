"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import { loadAIQuestions, saveAIQuestions } from "@/lib/db";
import { loadPrimaryQuestions } from "@/lib/loadPrimaryQuestions";

export default function QuizStartPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { status } = useSession();

    // URL params
    const category = searchParams.get("category");
    const topicKey = searchParams.get("topic");
    const age = searchParams.get("age"); // required for primary

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Prevent double execution (React strict mode)
    const initCalled = useRef(false);

    /* ✅ ADD THIS RESET EFFECT */
    useEffect(() => {
        // 🔄 reset ALL quiz state when URL changes
        setError("");
        setLoading(true);
        initCalled.current = false;

        // also clear stale session data
        sessionStorage.removeItem("currentSessionQuestions");
        sessionStorage.removeItem("quiz_session_active");
    }, [category, topicKey, age]);

    // -----------------------------
    // Auth guard
    // -----------------------------
    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        }
    }, [status, router]);

    // -----------------------------
    // Main init
    // -----------------------------
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

            /* =====================================================
               PRIMARY BLOCK (STATIC, AGE-BASED)
            ===================================================== */
            if (category === "primary") {
                if (!age) {
                    setError("Missing age group.");
                    setLoading(false);
                    return;
                }

                try {
                    const questions = await loadPrimaryQuestions(age, topicKey);

                    if (!questions || questions.length === 0) {
                        setError("No questions found for this topic.");
                        setLoading(false);
                        return;
                    }
                    beginSession(questions);
                    return;
                } catch (err) {
                    console.error("Primary load error:", err);
                    setError("Failed to load primary content.");
                    setLoading(false);
                    return;
                }
            }

            /* =====================================================
               NON-PRIMARY (AI / STATIC)
            ===================================================== */
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
                    setError("Failed to generate questions.");
                    setLoading(false);
                    return;
                }

                await saveAIQuestions(topicKey, data.questions);
                beginSession(data.questions);
            } catch (err) {
                console.error("Generate error:", err);
                setError("Failed to contact AI engine.");
                setLoading(false);
            }
        }

        init();
    }, [status, category, topicKey, age, router]);

    // -----------------------------
    // Start session
    // -----------------------------
    function beginSession(questions: any[]) {
        //clear bad session
        sessionStorage.removeItem("currentSessionQuestions");

        sessionStorage.setItem(
            "currentSessionQuestions",
            JSON.stringify(questions)
        );

        sessionStorage.setItem("quiz_session_active", "true");

        router.push(
            `/quiz/session?category=${category}&topic=${topicKey}${age ? `&age=${age}` : ""}`
        );
    }

    // -----------------------------
    // UI states
    // -----------------------------
    if (status === "loading") {
        return <div className="p-10">Checking login…</div>;
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
                    Preparing your session…
                </h2>
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-400 mx-auto" />
                <p className="text-gray-400">Please wait a moment.</p>
            </div>
        );
    }

    return null;
}