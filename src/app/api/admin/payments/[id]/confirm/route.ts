import { auth } from "@/server/auth/auth";
import { confirmPayment } from "@/server/services/payment.service";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await auth();
        if (!session || (session.user.role !== "ADMIN" && session.user.role !== "OWNER")) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const result = await confirmPayment(id);

        return NextResponse.json(result, { status: 200 });
    } catch (error: any) {
        console.error("Payment Confirmation Error:", error);
        return NextResponse.json({ message: error.message || "Internal Server Error" }, { status: 500 });
    }
}
