export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { trackVisit } from "@/lib/track-visit";

// POST endpoint to track visits (called from middleware)
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        const email = session?.user?.email || undefined;

        // Use the incoming request directly - it has all the headers we need
        // Track visit (non-blocking)
        trackVisit(req, email).catch((error) => {
            console.error('[Track-Visit API] Error tracking visit:', error);
        });

        return NextResponse.json({ ok: true });
    } catch (err) {
        console.error('[Track-Visit API] Fatal error:', err);
        // Return error but don't fail the request
        return NextResponse.json({ ok: false, error: 'Tracking failed' }, { status: 500 });
    }
}

