import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getDbClient } from "@/lib/db-server";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const client = getDbClient();
        await client.connect();

        try {
            // Fetch quiz history
            const historyResult = await client.query(
                `SELECT * FROM quiz_results 
                 WHERE user_email = $1 
                 ORDER BY completed_at DESC 
                 LIMIT 50`,
                [session.user.email]
            );

            // Fetch total usage count (sum of logins across all days/locations)
            const usageResult = await client.query(
                `SELECT SUM(number_of_logins_today) as total_usage 
                 FROM locations 
                 WHERE LOWER(email) = LOWER($1)`,
                [session.user.email]
            );

            const totalUsage = parseInt(usageResult.rows[0]?.total_usage || "0");

            return NextResponse.json({
                history: historyResult.rows,
                totalUsage: totalUsage
            });
        } finally {
            await client.end();
        }
    } catch (error) {
        console.error("Error fetching history:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
