export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { getDbClient } from "@/lib/db-server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        
        if (!session?.user?.email) {
            return NextResponse.json({ hasName: false });
        }

        const client = getDbClient();
        await client.connect();

        try {
            const result = await client.query(
                `SELECT name FROM users WHERE email = $1`,
                [session.user.email]
            );

            const hasName = result.rows.length > 0 && result.rows[0].name && result.rows[0].name.trim() !== "";

            return NextResponse.json({ hasName });
        } finally {
            await client.end();
        }
    } catch (err) {
        console.error("Check name error:", err);
        return NextResponse.json({ hasName: false });
    }
}

