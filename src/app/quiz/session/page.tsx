"use client";

import QuizUI from "@/components/QuizUI";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function QuizSessionPage() {
    const { data: session, status } = useSession();
    const searchParams = useSearchParams();
    const router = useRouter();

    const topic = searchParams.get("topic");
    const category = searchParams.get("category");

    /**──────────────────────────────────────────
     * 🔐 1. ENFORCE LOGIN BEFORE ENTERING SESSION
     *──────────────────────────────────────────*/
    useEffect(() => {
        if (status === "unauthenticated") {
            router.replace("/login"); // ⬅️ Force login
        }
    }, [status, router]);

    if (status === "loading") {
        return <div className="text-gray-400 p-6">Checking login…</div>;
    }

    if (status === "unauthenticated") {
        return null; // Required until redirect finishes
    }

    /**──────────────────────────────────────────
     * ⚠️ 2. VALIDATE TOPIC PARAM
     *──────────────────────────────────────────*/
    if (!topic) {
        return <div className="text-red-400 p-6">❌ No topic provided.</div>;
    }

    /**──────────────────────────────────────────
     * 🚪 3. HANDLE EXIT BACK TO MAIN PAGE
     *──────────────────────────────────────────*/
    function handleExit() {
        router.push("/");
    }

    /**──────────────────────────────────────────
     * 🎯 4. RENDER QUIZ UI
     *──────────────────────────────────────────*/
    return (
        <div>
            <QuizUI
                topic={topic}
                category={category}
                userName={session?.user?.name}
                onExit={handleExit}
            />
        </div>
    );
}