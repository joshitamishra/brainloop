// src/lib/db-server.ts
// Server-side PostgreSQL database utilities

import pkg from "pg";
const { Client } = pkg;

export function getDbClient() {
    const connectionString = 
        process.env.DATABASE_URL || 
        "postgres://postgres:pass123@localhost:5433/postgres";
    
    return new Client({
        connectionString,
    });
}

export async function executeQuery<T = any>(
    query: string,
    params?: any[]
): Promise<T[]> {
    const client = getDbClient();
    
    try {
        await client.connect();
        const result = await client.query(query, params);
        return result.rows as T[];
    } finally {
        await client.end();
    }
}

