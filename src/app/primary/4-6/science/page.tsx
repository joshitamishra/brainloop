"use client";

import { redirect } from "next/navigation";

export default function SciencePage() {
    redirect("/quiz/start?category=primary&age=4-6&topic=science");
}
