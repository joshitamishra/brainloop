export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";

/**
 * Extract the first JSON array from the model output.
 */
function extractJsonArray(raw: string): string | null {
    if (!raw) return null;
    const start = raw.indexOf("[");
    const end = raw.lastIndexOf("]") + 1;
    if (start === -1 || end === 0) return null;
    return raw.slice(start, end);
}

/**
 * Clean up the LLM JSON so JSON.parse won't explode.
 * - remove markdown fences
 * - remove JS-style // comments
 * - remove LaTeX escapes like \( \)
 * - remove invalid backslash escape sequences
 * - remove trailing commas
 */
function cleanLLMJson(text: string): string {
    return text
        // strip markdown fences
        .replace(/```json/gi, "")
        .replace(/```/g, "")

        // remove JS-style comments
        .replace(/\/\/.*$/gm, "")

        // remove LaTeX-y escapes
        .replace(/\\\(/g, "(")
        .replace(/\\\)/g, ")")
        .replace(/\\\[/g, "[")
        .replace(/\\\]/g, "]")

        // remove *invalid* backslash escapes
        // keep only: \" \\ \/ \b \f \n \r \t \uXXXX
        .replace(/\\(?!["\\/bfnrtu])/g, "")

        // remove trailing commas before } or ]
        .replace(/,\s*([}\]])/g, "$1")

        .trim();
}

export async function POST(request: Request) {
    console.log("🔵 [API] /api/generate called");
    const { topic, category } = await request.json();
    console.log("📥 Requested topic:", topic);

    if (!topic) {
        return NextResponse.json({ error: "Missing topic" }, { status: 400 });
    }
    let prompt;
    if (category === "primary" || category === "chemistry" || category === "" || category === "gk" || category == "computer") {
        /* prompt = `
        You are an expert children's educator. Create EXACTLY 5 kid-friendly questions for the topic "${topic}".
        Return ONLY valid JSON. No commentary. No backticks.
        
        Each question should follow this structure:
        {
        "difficulty": "easy",
        "type": "kid",
        "question": "string"
        }
 
        Rules:
        - Use simple vocabulary (ages 5–10).
        - Use fun, friendly tone.
        - No equations unless extremely simple (1+2 type).
        - No abstract concepts.
        - Use animals, shapes, colors, food, nature.
        - Return ONLY the JSON array.
        `; */
        console.log("Skipping AI. Using static questions only.");
        return;
    } else {
        prompt = `
        You are an expert tutor. Create EXACTLY 5 questions for the topic "${topic}".
        Return ONLY valid JSON. No backticks. No commentary.

        Each question must follow this format:
        {
        "difficulty": "easy|medium|conceptual|applied|advanced",
        "type": "recall|apply|explain|solve|generalize",
        "question": "string"
        }

        Return only JSON array.`
    }
    try {
        console.log("📡 Sending request to Ollama…");

        const controller = new AbortController();
        const timeout = setTimeout(() => {
            console.log("⏳ Timeout reached — aborting Ollama request");
            controller.abort();
        }, 120_000); // 120s to be safe locally

        const response = await fetch("http://127.0.0.1:11434/api/generate", {
            method: "POST",
            signal: controller.signal,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                model: "deepseek-r1:1.5b",    // or "deepseek-coder:1.3b" if you prefer
                prompt,
                stream: false,
            }),
        });

        clearTimeout(timeout);

        console.log("📨 Ollama response status:", response.status);

        if (!response.ok) {
            const errText = await response.text().catch(() => "");
            console.log("❌ Non-200 from Ollama:", errText);
            return NextResponse.json(
                { error: "LLM error", status: response.status, body: errText },
                { status: 502 }
            );
        }

        const data: any = await response.json();
        console.log("📝 Raw Ollama response:", data);

        const raw = data?.response ?? "";
        const jsonChunk = extractJsonArray(raw);

        if (!jsonChunk) {
            console.log("❌ Could not find JSON array in model output.");
            return NextResponse.json(
                { error: "JSON array not found in model output", raw },
                { status: 500 }
            );
        }

        console.log("📦 Extracted JSON text:", jsonChunk);

        const cleaned = cleanLLMJson(jsonChunk);
        console.log("🧹 Cleaned JSON:", cleaned);

        let parsed;
        try {
            parsed = JSON.parse(cleaned);
        } catch (err) {
            console.log("❌ JSON.parse failed:", err);
            return NextResponse.json(
                {
                    error: "Failed to parse LLM JSON",
                    cleaned,
                    message: (err as Error).message,
                },
                { status: 500 }
            );
        }

        console.log("✅ Parsed JSON successfully");
        return NextResponse.json({ questions: parsed });
    } catch (error: any) {
        if (error.name === "AbortError") {
            console.log("⛔ Ollama request aborted (timeout)");
            return NextResponse.json(
                { error: "LLM request timed out" },
                { status: 504 }
            );
        }

        console.log("❌ Error contacting Ollama:", error);
        return NextResponse.json(
            { error: "Failed to contact Ollama", details: String(error) },
            { status: 500 }
        );
    }
}