import { auth } from "@/server/auth/auth";
import { getUserPayments } from "@/server/services/payment.service";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const payments = await getUserPayments(session.user.id);

        return NextResponse.json(payments, { status: 200 });
    } catch (error: unknown) {
        console.error("Fetch User Payments Error:", error);
        return NextResponse.json({ message: error instanceof Error ? error.message : "Internal Server Error" }, { status: 500 });
    }
}
