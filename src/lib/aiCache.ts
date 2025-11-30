export function getTodayKey(topic: string) {
    const today = new Date().toISOString().split("T")[0];
    return `ai_questions_${topic}_${today}`;
}
