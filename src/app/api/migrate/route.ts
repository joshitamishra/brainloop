import { NextResponse } from "next/server";
import { getDbClient } from "@/lib/db-server";
import fs from "fs";
import path from "path";

export async function GET() {
    try {
        const client = getDbClient();
        await client.connect();

        const schemaPath = path.join(process.cwd(), "src", "lib", "db-schema.sql");
        const schemaSql = fs.readFileSync(schemaPath, "utf8");

        // Split by semicolon to run statements individually if needed, 
        // but pg usually handles multiple statements.
        // However, let's run it as one block.
        await client.query(schemaSql);

        await client.end();

        return NextResponse.json({ success: true, message: "Migration executed successfully" });
    } catch (error) {
        console.error("Migration error:", error);
        return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
    }
}
