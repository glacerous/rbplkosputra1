import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request });
    const { pathname } = request.nextUrl;

    // Allow auth-related paths, public files, and the forbidden page
    if (
        pathname.startsWith("/api/auth") ||
        pathname === "/login" ||
        pathname === "/403" ||
        pathname === "/"
    ) {
        return NextResponse.next();
    }

    // Protect Admin/Owner routes
    if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
        if (!token) {
            if (pathname.startsWith("/api/")) {
                return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
            }
            return NextResponse.redirect(new URL("/login", request.url));
        }

        const role = (token as any).role;

        // ADMIN only -> /api/admin
        if (pathname.startsWith("/api/admin")) {
            if (role !== "ADMIN") {
                return NextResponse.json({ error: "Forbidden" }, { status: 403 });
            }
        }

        // ADMIN + OWNER -> /admin
        if (pathname.startsWith("/admin")) {
            if (role !== "ADMIN" && role !== "OWNER") {
                return NextResponse.redirect(new URL("/403", request.url));
            }
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
