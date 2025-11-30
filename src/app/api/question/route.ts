import { NextResponse } from "next/server";

export const runtime = "edge"; // Cloudflare-compatible

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const topic = searchParams.get("topic") || "math";

    const prompt = `
    Generate one simple math revision question for topic "${topic}".
    The question must be extremely simple (grade 5 level).
    Provide output as JSON:
    {
      "text": "...",
      "answer": "..."
    }
  `;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
        }),
    });

    const json = await response.json();
    const content = json.choices[0].message.content;

    return NextResponse.json(JSON.parse(content));
}
