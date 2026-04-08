import { logBuffer } from "@/server/lib/logger";
import { NextResponse } from "next/server";

export async function GET() {
    // Since this is for admin, the middleware already protects it (requires ADMIN role)
    // We return the last 100 logs stored in memory
    return NextResponse.json(logBuffer, { status: 200 });
}
