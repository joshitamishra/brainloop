import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(_req: NextRequest) {
    // no-op middleware (does nothing)
    return NextResponse.next();
}

export const config = {
    matcher: [], // run on no routes
};
