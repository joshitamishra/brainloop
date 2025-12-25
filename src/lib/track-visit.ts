// src/lib/track-visit.ts
// Utility to track anonymous visits

import { getClientIP, getLocationFromIP, getUserAgent } from "./geolocation";
import { getDbClient } from "./db-server";

export async function trackVisit(req: Request, email?: string) {
    // Fire and forget - don't block the request
    Promise.resolve().then(async () => {
        try {
            const ip = getClientIP(req);
            const location = await getLocationFromIP(ip);
            const userAgent = getUserAgent(req);
            const today = new Date().toISOString().split("T")[0];

            const client = getDbClient();
            await client.connect();

            try {
                await client.query("BEGIN");

                if (email && !email.includes("@visitor")) {
                    // For authenticated users, we want to ensure they are "logged in" for the day
                    // even if they just visited the site (persistent session)

                    // Check if location record exists for today
                    const existingLocation = await client.query(
                        `
                        SELECT id 
                        FROM locations 
                        WHERE email = $1 AND login_date = $2 AND location = $3
                        `,
                        [email, today, location]
                    );

                    if (existingLocation.rows.length > 0) {
                        // Update existing record - increment login count as requested
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
                        // First visit of the day for this location -> Count as a login!
                        await client.query(
                            `
                            INSERT INTO locations (email, location, last_login, login_date, number_of_logins_today, ip_address, user_agent)
                            VALUES ($1, $2, CURRENT_TIMESTAMP, $3, 1, $4, $5)
                            `,
                            [email, location, today, ip, userAgent]
                        );
                    }

                    await client.query("COMMIT");
                    return;
                } else {
                    // Track anonymous visit (store with email = 'anonymous@visitor')
                    // NOTE: We do NOT increment number_of_logins_today here - that's only for actual logins
                    // This just tracks that an anonymous user visited, updates last_login timestamp
                    const anonymousEmail = `anonymous_${ip.replace(/\./g, "_").replace(/:/g, "_")}@visitor`;

                    // Create anonymous user entry if doesn't exist
                    await client.query(
                        `
                        INSERT INTO users (email, name)
                        VALUES ($1, $2)
                        ON CONFLICT (email) DO NOTHING
                        `,
                        [anonymousEmail, "Anonymous Visitor"]
                    );

                    const existingLocation = await client.query(
                        `
                        SELECT id 
                        FROM locations 
                        WHERE email = $1 AND login_date = $2 AND location = $3
                        `,
                        [anonymousEmail, today, location]
                    );

                    if (existingLocation.rows.length > 0) {
                        // Update last_login timestamp only, don't increment login count
                        await client.query(
                            `
                            UPDATE locations 
                            SET 
                                last_login = CURRENT_TIMESTAMP,
                                ip_address = $1,
                                user_agent = $2,
                                updated_at = CURRENT_TIMESTAMP
                            WHERE id = $3
                            `,
                            [ip, userAgent, existingLocation.rows[0].id]
                        );
                    } else {
                        // Create new location record with login_count = 0 (not a login, just a visit)
                        await client.query(
                            `
                            INSERT INTO locations (email, location, last_login, login_date, number_of_logins_today, ip_address, user_agent)
                            VALUES ($1, $2, CURRENT_TIMESTAMP, $3, 0, $4, $5)
                            `,
                            [anonymousEmail, location, today, ip, userAgent]
                        );
                    }
                }

                await client.query("COMMIT");
            } catch (err) {
                await client.query("ROLLBACK");
                console.error("Visit tracking error:", err);
            } finally {
                await client.end();
            }
        } catch (err) {
            // Silently fail - don't block requests
            console.error("Visit tracking error:", err);
        }
    });
}

