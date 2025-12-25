export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { getDbClient } from "@/lib/db-server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: NextRequest) {
    try {
        // Check authentication
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json(
                { ok: false, error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { name } = await req.json();

        if (!name || !name.trim()) {
            return NextResponse.json(
                { ok: false, error: "Name is required" },
                { status: 400 }
            );
        }

        const client = getDbClient();
        await client.connect();

        try {
            // Update user's name
            // Insert or update user's name
            await client.query(
                `
                INSERT INTO users (email, name)
                VALUES ($2, $1)
                ON CONFLICT (email) 
                DO UPDATE SET 
                    name = EXCLUDED.name,
                    updated_at = CURRENT_TIMESTAMP
                `,
                [name.trim(), session.user.email]
            );

            return NextResponse.json({ ok: true });
        } catch (err) {
            console.error("Error updating user name:", err);
            throw err;
        } finally {
            await client.end();
        }
    } catch (err) {
        console.error("Update name error:", err);
        return NextResponse.json(
            { ok: false, error: "Internal server error" },
            { status: 500 }
        );
    }
}

