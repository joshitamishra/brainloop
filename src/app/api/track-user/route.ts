export const runtime = "nodejs";

import { NextResponse } from "next/server";
import pkg from "pg";

const { Client } = pkg;

export async function POST(req) {
    const { auth_id, username, email } = await req.json();

    const client = new Client({
        connectionString: "postgres://postgres:pass123@localhost:5433/postgres",
    });

    await client.connect();

    try {
        await client.query(
            `
      INSERT INTO bl_users (auth_id, username, email, last_login)
      VALUES ($1, $2, $3, NOW())
      ON CONFLICT (auth_id)
      DO UPDATE SET last_login = NOW()
      `,
            [auth_id, username, email]
        );
        return NextResponse.json({ ok: true });
    } catch (err) {
        console.error("User tracking error:", err);
        return NextResponse.json({ ok: false }, { status: 500 });
    } finally {
        await client.end();
    }
}