// Normalize text for string comparison
function normalize(str: string): string {
  return str
    .toLowerCase()
    .replace(/[\.,%]/g, "")           // remove punctuation + %
    .replace(/\b(the|a|an)\b/g, "")   // remove articles
    .replace(/\s+/g, " ")
    .trim();
}

// Extract number from text (e.g., "Approx 71%" -> 71)
function extractNumber(str: string): number | null {
  const match = str.match(/-?\d+(\.\d+)?/);
  return match ? parseFloat(match[0]) : null;
}

export function isAnswerCorrect(user: string, correct: string): boolean {
  if (!user || !correct) return false;

  const userNum = extractNumber(user);
  const correctNum = extractNumber(correct);

  // 🎯 1. If both answers contain numbers → numeric comparison
  if (userNum !== null && correctNum !== null) {
    const tolerance = 0; // Exact match required for numeric answers
    const diff = Math.abs(userNum - correctNum);
    return diff <= tolerance;
  }

  // 🎯 2. If answers are not numeric → fallback to string matching
  const u = normalize(user);
  const c = normalize(correct);

  return u === c;
}
