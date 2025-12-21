"use client";

import { useRouter } from "next/navigation";

export default function PrimaryBasicMath68Page() {
    const router = useRouter();

    // Immediately forward into the quiz flow
    // (keeps ONE quiz engine, no duplication)
    router.replace(
        "/quiz/start?category=primary&age=4-6&topic=reading_comprehension"
    );

    return (
        <div className="p-10 text-center">
            Preparing reading comprehension (6–8)…
        </div>
    );
}
