export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getDbClient } from "@/lib/db-server";
import { getClientIP, getLocationFromIP, getUserAgent } from "@/lib/geolocation";

export async function POST(req: Request) {
    try {
        const { auth_id, username, email, phoneno } = await req.json();

        if (!email) {
            return NextResponse.json({ ok: false, error: "Email is required" }, { status: 400 });
        }

        // Get IP and location
        const ip = getClientIP(req);
        const location = await getLocationFromIP(ip);
        const userAgent = getUserAgent(req);
        const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format

        const client = getDbClient();
        await client.connect();

        try {
            // Start transaction
            await client.query("BEGIN");

            // Insert or update user
            await client.query(
                `
                INSERT INTO users (email, name, phoneno)
                VALUES ($1, $2, $3)
                ON CONFLICT (email) 
                DO UPDATE SET 
                    name = COALESCE(EXCLUDED.name, users.name),
                    phoneno = COALESCE(EXCLUDED.phoneno, users.phoneno),
                    updated_at = CURRENT_TIMESTAMP
                `,
                [email, username || null, phoneno || null]
            );

            // Check if location record exists for today
            const existingLocation = await client.query(
                `
                SELECT id, number_of_logins_today 
                FROM locations 
                WHERE email = $1 AND login_date = $2 AND location = $3
                `,
                [email, today, location]
            );

            if (existingLocation.rows.length > 0) {
                // Update existing record - increment login count
                await client.query(
                    `
                    UPDATE locations 
                    SET 
                        number_of_logins_today = number_of_logins_today + 1,
                        last_login = CURRENT_TIMESTAMP,
                        ip_address = $1,
                        user_agent = $2,
                        updated_at = CURRENT_TIMESTAMP
                    WHERE id = $3
                    `,
                    [ip, userAgent, existingLocation.rows[0].id]
                );
            } else {
                // Insert new location record for today
                await client.query(
                    `
                    INSERT INTO locations (email, location, last_login, login_date, number_of_logins_today, ip_address, user_agent)
                    VALUES ($1, $2, CURRENT_TIMESTAMP, $3, 1, $4, $5)
                    `,
                    [email, location, today, ip, userAgent]
                );
            }

            // Commit transaction
            await client.query("COMMIT");

            return NextResponse.json({ ok: true });
        } catch (err) {
            // Rollback on error
            await client.query("ROLLBACK");
            throw err;
        } finally {
            await client.end();
        }
    } catch (err) {
        console.error("User tracking error:", err);
        return NextResponse.json({ ok: false, error: "Internal server error" }, { status: 500 });
    }
}