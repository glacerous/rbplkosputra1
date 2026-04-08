import { NextResponse } from "next/server";
import { listUsers } from "@/server/services/user.service";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const users = await listUsers();
        return NextResponse.json(users);
    } catch (error) {
        console.error("[API_ADMIN_USERS_GET]", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
