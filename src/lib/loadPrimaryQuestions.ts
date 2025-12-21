export async function loadPrimaryQuestions(
    age: string,
    topic: string
) {
    try {
        return await import(`@/data/primary/${age}/${topic}`).then(
            (m) => m.questions
        );
    } catch (err) {
        console.error("❌ Failed to load primary questions:", err);
        return null;
    }
}