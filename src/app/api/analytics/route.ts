export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getDbClient } from "@/lib/db-server";

// GET endpoint to retrieve analytics
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const days = parseInt(searchParams.get("days") || "7", 10);
        const email = searchParams.get("email"); // Optional: filter by specific user

        const client = getDbClient();
        await client.connect();

        try {
            let query: string;
            let params: any[];

            if (email) {
                // Get analytics for specific user
                query = `
                    SELECT 
                        u.id,
                        u.name,
                        u.email,
                        u.phoneno,
                        u.created_at,
                        COUNT(DISTINCT l.login_date) as total_visit_days,
                        SUM(l.number_of_logins_today) as total_visits,
                        MAX(l.last_login) as last_visit,
                        json_agg(
                            json_build_object(
                                'location', l.location,
                                'login_date', l.login_date,
                                'visits', l.number_of_logins_today,
                                'last_login', l.last_login
                            ) ORDER BY l.login_date DESC, l.last_login DESC
                        ) FILTER (WHERE l.login_date >= CURRENT_DATE - INTERVAL '${days} days') as recent_locations
                    FROM users u
                    LEFT JOIN locations l ON u.email = l.email 
                        AND l.login_date >= CURRENT_DATE - INTERVAL '${days} days'
                    WHERE u.email = $1 AND u.email NOT LIKE '%@visitor'
                    GROUP BY u.id, u.name, u.email, u.phoneno, u.created_at
                `;
                params = [email];
            } else {
                // Get overall analytics
                query = `
                    SELECT 
                        COUNT(DISTINCT u.id) FILTER (WHERE u.email NOT LIKE '%@visitor') as total_users,
                        COUNT(DISTINCT CASE WHEN l.login_date >= CURRENT_DATE - INTERVAL '${days} days' AND u.email NOT LIKE '%@visitor' THEN u.email END) as active_users,
                        SUM(CASE WHEN l.login_date >= CURRENT_DATE - INTERVAL '${days} days' AND l.email NOT LIKE '%@visitor' THEN l.number_of_logins_today ELSE 0 END) as total_visits,
                        COUNT(DISTINCT CASE WHEN l.login_date >= CURRENT_DATE - INTERVAL '${days} days' AND l.email NOT LIKE '%@visitor' THEN l.location END) as unique_locations,
                        json_agg(
                            DISTINCT jsonb_build_object(
                                'location', l.location,
                                'visits', (
                                    SELECT SUM(number_of_logins_today) 
                                    FROM locations 
                                    WHERE location = l.location 
                                    AND login_date >= CURRENT_DATE - INTERVAL '${days} days'
                                    AND email NOT LIKE '%@visitor'
                                )
                            )
                        ) FILTER (WHERE l.login_date >= CURRENT_DATE - INTERVAL '${days} days' AND l.email NOT LIKE '%@visitor') as locations_breakdown
                    FROM users u
                    LEFT JOIN locations l ON u.email = l.email
                `;
                params = [];
            }

            const result = await client.query(query, params);

            // Get top locations
            const topLocationsQuery = `
                SELECT 
                    location,
                    SUM(number_of_logins_today) as total_visits,
                    COUNT(DISTINCT email) as unique_users
                FROM locations
                WHERE login_date >= CURRENT_DATE - INTERVAL '${days} days'
                    AND email NOT LIKE '%@visitor'
                GROUP BY location
                ORDER BY total_visits DESC
                LIMIT 10
            `;
            const topLocations = await client.query(topLocationsQuery);

            // Get daily visit stats
            const dailyStatsQuery = `
                SELECT 
                    login_date as date,
                    SUM(number_of_logins_today) as visits,
                    COUNT(DISTINCT email) as unique_visitors
                FROM locations
                WHERE login_date >= CURRENT_DATE - INTERVAL '${days} days'
                    AND email NOT LIKE '%@visitor'
                GROUP BY login_date
                ORDER BY login_date DESC
            `;
            const dailyStats = await client.query(dailyStatsQuery);

            return NextResponse.json({
                ok: true,
                data: {
                    summary: result.rows[0] || {},
                    topLocations: topLocations.rows,
                    dailyStats: dailyStats.rows,
                },
            });
        } finally {
            await client.end();
        }
    } catch (err) {
        console.error("Analytics error:", err);
        return NextResponse.json(
            { ok: false, error: "Failed to fetch analytics" },
            { status: 500 }
        );
    }
}

