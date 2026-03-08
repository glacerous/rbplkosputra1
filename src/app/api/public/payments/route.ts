import { auth } from "@/server/auth/auth";
import { getUserPayments } from "@/server/services/payment.service";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const payments = await getUserPayments(session.user.id);

        return NextResponse.json(payments, { status: 200 });
    } catch (error: any) {
        console.error("Fetch User Payments Error:", error);
        return NextResponse.json({ message: error.message || "Internal Server Error" }, { status: 500 });
    }
}
