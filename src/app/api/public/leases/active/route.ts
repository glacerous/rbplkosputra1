import { NextResponse } from "next/server";
import { auth } from "@/server/auth/auth";
import { leaseService } from "@/server/services/lease.service";

export async function GET() {
    try {
        const session = await auth();

        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const activeLease = await leaseService.getActiveLeaseByUserId(session.user.id);
        return NextResponse.json(activeLease);
    } catch (error) {
        console.error("[API_LEASES_ACTIVE_GET]", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
