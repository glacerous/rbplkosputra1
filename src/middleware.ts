import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request });
    const { pathname } = request.nextUrl;

    // --- LOGGING ---
    if (pathname.startsWith("/api")) {
        console.log(`[${new Date().toISOString()}] ${request.method} ${pathname}`);
    }

    // Allow auth-related paths, public files, and the forbidden page
    if (
        pathname.startsWith("/api/auth") ||
        pathname === "/login" ||
        pathname === "/403" ||
        pathname === "/"
    ) {
        return NextResponse.next();
    }

    // --- API PROTECTION ---

    // Admin API -> ADMIN only
    if (pathname.startsWith("/api/admin")) {
        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        if (token.role !== "ADMIN") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }
    }

    // Owner API -> OWNER only
    if (pathname.startsWith("/api/owner")) {
        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        if (token.role !== "OWNER") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }
    }

    // Public API -> No role restriction (authentication handled in routes if needed)
    if (pathname.startsWith("/api/public")) {
        return NextResponse.next();
    }

    // --- UI PROTECTION ---

    // Admin UI -> ADMIN only
    if (pathname.startsWith("/admin")) {
        if (!token) {
            return NextResponse.redirect(new URL("/login", request.url));
        }
        if (token.role !== "ADMIN") {
            return NextResponse.redirect(new URL("/403", request.url));
        }
    }

    // Owner UI -> OWNER only
    if (pathname.startsWith("/owner")) {
        if (!token) {
            return NextResponse.redirect(new URL("/login", request.url));
        }
        if (token.role !== "OWNER") {
            return NextResponse.redirect(new URL("/403", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public (public folder)
         */
        "/((?!_next/static|_next/image|favicon.ico|public).*)",
    ],
};
