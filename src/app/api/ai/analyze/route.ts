import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        let body;
        try {
            body = await req.json();
        } catch (e) {
            return NextResponse.json({ error: "Invalid request format" }, { status: 400 });
        }

        const { history } = body;
        const apiKey = (process.env.GEMINI_API_KEY || "").trim();

        if (!apiKey) {
            return NextResponse.json({
                analysis: {
                    summary: "AI Coach is offline. Please add your GEMINI_API_KEY to Fly secrets.",
                    strengths: ["Setup Required"],
                    weaknesses: ["Missing API Key"],
                    recommendation: "Run: fly secrets set GEMINI_API_KEY=...",
                    interests: ["System Config"],
                    persona: "The Offline Coach"
                }
            });
        }

        if (!history || history.length === 0) {
            return NextResponse.json({
                analysis: {
                    summary: "Welcome! I'm ready to analyze your progress. Take a quiz to see your first set of insights!",
                    strengths: ["Ready to Learn"],
                    weaknesses: ["No Data"],
                    recommendation: "Start with a 5-minute quiz now.",
                    interests: ["Exploring"],
                    persona: "The New Explorer"
                }
            });
        }

        const prompt = `
            You are "BrainLoop AI Coach". Be extremely precise and concise.
            Analyze history: ${JSON.stringify(history.slice(0, 15))}
            
            Return ONLY a JSON object:
            {
              "summary": "max 25 words insight",
              "strengths": ["word1", "word2"],
              "weaknesses": ["word1", "word2"],
              "recommendation": "max 12 words tip",
              "interests": ["field1", "field2"],
              "persona": "2-word title"
            }
        `;

        let analysisData = null;
        let lastError = "";

        // 1. Get the list of models to see what's actually available
        let availableModels: any[] = [];
        try {
            const listUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
            const listRes = await fetch(listUrl);
            const listData = await listRes.json();
            if (listRes.ok && listData.models) {
                availableModels = listData.models.filter((m: any) =>
                    m.supportedGenerationMethods.includes("generateContent")
                );
                console.log(`[AI Coach] Found ${availableModels.length} compatible models.`);
                // Log first 3 models for debugging
                console.log(`[AI Coach] Top models: ${availableModels.slice(0, 3).map(m => m.name).join(", ")}`);
            } else {
                console.error("[AI Coach] Model list failed:", listData.error?.message);
            }
        } catch (e: any) {
            console.error("[AI Coach] Error listing models:", e.message);
        }

        // 2. Define priority list
        const priorityQueries = ["gemini-1.5-flash", "gemini-2.0-flash", "gemini-1.5-pro", "gemini-pro"];
        let modelsToTry: string[] = [];

        for (const query of priorityQueries) {
            const found = availableModels.find(m => m.name.toLowerCase().includes(query));
            if (found) modelsToTry.push(found.name);
        }

        // Add any other models found as fallback
        availableModels.forEach(m => {
            if (!modelsToTry.includes(m.name)) modelsToTry.push(m.name);
        });

        // If list failed, use defaults
        if (modelsToTry.length === 0) {
            modelsToTry = ["models/gemini-1.5-flash", "models/gemini-pro"];
        }

        // 3. Try each model with both v1 and v1beta
        const versions = ["v1", "v1beta"];

        outerLoop: for (const modelName of modelsToTry) {
            for (const version of versions) {
                try {
                    console.log(`[AI Coach] Trying ${modelName} on ${version}...`);
                    const url = `https://generativelanguage.googleapis.com/${version}/${modelName}:generateContent?key=${apiKey}`;

                    const response = await fetch(url, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            contents: [{ parts: [{ text: prompt }] }]
                        })
                    });

                    const data = await response.json();

                    if (response.ok) {
                        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
                        if (text) {
                            console.log(`[AI Coach] SUCCESS with ${modelName} (${version})`);
                            analysisData = text;
                            break outerLoop;
                        }
                    } else {
                        lastError = data.error?.message || "Unknown error";
                        console.warn(`[AI Coach] ${modelName} (${version}) failed: ${lastError}`);
                    }
                } catch (err: any) {
                    lastError = err.message;
                    console.error(`[AI Coach] Network error with ${modelName}:`, lastError);
                }
            }
        }

        if (!analysisData) {
            return NextResponse.json({
                error: `AI Service Error: All models failed. Last error: ${lastError}`
            }, { status: 500 });
        }

        let analysis;
        try {
            const jsonMatch = analysisData.match(/\{[\s\S]*\}/);
            analysis = JSON.parse(jsonMatch ? jsonMatch[0] : analysisData);
        } catch (e) {
            console.error("[AI Coach] JSON Parse Error:", analysisData);
            analysis = {
                summary: analysisData.slice(0, 100),
                strengths: ["Analysis"],
                weaknesses: ["Formatting"],
                recommendation: "Try refreshing the analysis."
            };
        }

        return NextResponse.json({ analysis });

    } catch (error: any) {
        console.error("[AI Coach] Fatal Error:", error);
        return NextResponse.json({ error: `Internal Error: ${error.message}` }, { status: 500 });
    }
}
