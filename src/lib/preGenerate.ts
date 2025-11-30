import { QUESTION_BANK } from "@/data/questions";
import { loadAIQuestions, saveAIQuestions } from "@/lib/db";

export async function preGenerateAllTopics(currentTopic: string) {
    const allTopics = Object.values(QUESTION_BANK)
        .flatMap((cat) => Object.keys(cat.topics))
        .filter((topic) => topic !== currentTopic);

    for (const topic of allTopics) {
        const cached = await loadAIQuestions(topic);
        if (cached) continue;

        console.log("🔧 Pre-generating:", topic);

        try {
            const res = await fetch("/api/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ topic }),
            });

            const data = await res.json();
            if (data.questions) {
                await saveAIQuestions(topic, data.questions);
            }
        } catch (err) {
            console.warn("⚠️ Pre-generation failed for:", topic);
        }
    }

    console.log("✨ Pre-generation complete.");
}