import { auth } from "@/server/auth/auth";
import { getPendingPayments } from "@/server/services/payment.service";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const session = await auth();
        if (!session || (session.user.role !== "ADMIN" && session.user.role !== "OWNER")) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const payments = await getPendingPayments();

        return NextResponse.json(payments, { status: 200 });
    } catch (error: any) {
        console.error("Fetch Pending Payments Error:", error);
        return NextResponse.json({ message: error.message || "Internal Server Error" }, { status: 500 });
    }
}
