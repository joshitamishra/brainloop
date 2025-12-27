import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getDbClient } from "@/lib/db-server";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { category, topic, score, totalQuestions, timeTaken, details } = body;

        if (!category || !topic || score === undefined || !totalQuestions || timeTaken === undefined) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const client = getDbClient();
        await client.connect();

        try {
            // Ensure table exists (Auto-migration for simplicity as requested)
            await client.query(`
                CREATE TABLE IF NOT EXISTS quiz_results (
                    id SERIAL PRIMARY KEY,
                    user_email VARCHAR(255) NOT NULL,
                    category VARCHAR(255) NOT NULL,
                    topic VARCHAR(255) NOT NULL,
                    score INTEGER NOT NULL,
                    total_questions INTEGER NOT NULL,
                    time_taken_seconds INTEGER NOT NULL,
                    details JSONB,
                    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            `);

            // Insert result
            await client.query(
                `INSERT INTO quiz_results 
                (user_email, category, topic, score, total_questions, time_taken_seconds, details) 
                VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                [
                    session.user.email,
                    category,
                    topic,
                    score,
                    totalQuestions,
                    timeTaken,
                    JSON.stringify(details)
                ]
            );

            return NextResponse.json({ success: true });
        } finally {
            await client.end();
        }
    } catch (error) {
        console.error("Error saving quiz result:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
