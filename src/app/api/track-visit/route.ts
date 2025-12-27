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
        console.log(`[Track-Visit] User: ${email || 'anonymous'}`);

        const body = await req.json();
        const { ip, userAgent } = body;

        // Track visit (non-blocking)
        // We pass the data from the body to override the request headers
        trackVisit(req, email, { ip, userAgent }).catch((error) => {
            console.error('[Track-Visit API] Error tracking visit:', error);
        });

        return NextResponse.json({ ok: true });
    } catch (err) {
        console.error('[Track-Visit API] Fatal error:', err);
        // Return error but don't fail the request
        return NextResponse.json({ ok: false, error: 'Tracking failed' }, { status: 500 });
    }
}

