"use client";

import QuizUI from "@/components/QuizUI";
import { useSearchParams } from "next/navigation";

export default function QuizSessionPage() {
    const searchParams = useSearchParams();
    const topic = searchParams.get("topic");
    const category = searchParams.get("category");

    if (!topic) {
        return <div className="text-red-400 p-6">❌ No topic provided.</div>;
    }

    return (
        <div>
            <QuizUI topic={topic} category={category} />
        </div>
    );
}
