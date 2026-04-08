import { auth } from "@/server/auth/auth";
import { getTransactionReport } from "@/server/services/payment.service";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const session = await auth();
        if (!session || (session.user.role !== "ADMIN" && session.user.role !== "OWNER")) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const transactions = await getTransactionReport();

        return NextResponse.json(transactions, { status: 200 });
    } catch (error: unknown) {
        console.error("Fetch Transaction Report Error:", error);
        return NextResponse.json({ message: error instanceof Error ? error.message : "Internal Server Error" }, { status: 500 });
    }
}
