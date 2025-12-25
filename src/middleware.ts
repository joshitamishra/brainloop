import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Environment detection (useful for logging, debugging, or future conditional logic)
const isStaging = process.env.FLY_APP_NAME === "brainloop-staging";

// Track visits for all requests (authenticated and non-authenticated)
// Since middleware runs in Edge Runtime, we call an API route instead of direct DB access
export default function middleware(req: NextRequest) {
    // Fire and forget - call API route to track visit (non-blocking)
    const baseUrl = process.env.NEXTAUTH_URL ||
        (process.env.FLY_APP_NAME ? `https://${process.env.FLY_APP_NAME}.fly.dev` : null);

    if (!baseUrl) {
        console.error('[Middleware] No baseUrl configured for track-visit');
        return NextResponse.next();
    }

    fetch(`${baseUrl}/api/track-visit`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            url: req.url,
            userAgent: req.headers.get('user-agent') || '',
            ip: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown',
        }),
    })
        .then(response => {
            if (!response.ok) {
                console.error(`[Middleware] Track-visit failed with status ${response.status}`);
            }
        })
        .catch((error) => {
            console.error('[Middleware] Track-visit error:', error);
        });

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};