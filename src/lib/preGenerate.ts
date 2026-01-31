import { QUESTION_BANK } from "@/data/questions";
import { loadAIQuestions, saveAIQuestions } from "@/lib/db";

export async function preGenerateAllTopics(currentTopic: string) {
    const tasks: { category: string; topic: string }[] = [];

    for (const [catKey, catVal] of Object.entries(QUESTION_BANK)) {
        // Skip primary category as it uses ageGroups, not topics
        if (catKey === "primary" || !('topics' in catVal) || !catVal.topics) {
            continue;
        }

        for (const topicKey of Object.keys(catVal.topics)) {
            if (topicKey !== currentTopic) {
                tasks.push({ category: catKey, topic: topicKey });
            }
        }
    }

    for (const { category, topic } of tasks) {
        const cached = await loadAIQuestions(topic);
        if (cached) continue;

        console.log("🔧 Pre-generating:", topic, "Category:", category);

        try {
            const res = await fetch("/api/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ topic, category }),
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