export async function loadStaticQuestions(params: {
    category: string;
    topic: string;
    age?: string | null;
}) {
    const { category, topic, age } = params;

    try {
        // 🧒 PRIMARY (age-based)
        if (category === "primary") {
            if (!age) {
                throw new Error("Primary category requires age");
            }

            const mod = await import(
                `@/data/primary/${age}/${topic}`
            );

            return mod.questions;
        }

        // 📘 GK
        if (category === "gk") {
            const mod = await import(
                `@/data/gk/${topic}`
            );
            return mod.questions;
        }

        // 💻 COMPUTER
        if (category === "computer") {
            const mod = await import(
                `@/data/computer/${topic}`
            );
            return mod.questions;
        }

        // ❌ Not static
        return null;
    } catch (err) {
        console.error(
            "❌ Failed to load static questions:",
            { category, topic, age },
            err
        );
        return null;
    }
}