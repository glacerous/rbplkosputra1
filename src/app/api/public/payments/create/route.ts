import { auth } from "@/server/auth/auth";
import { createMonthlyPayment } from "@/server/services/payment.service";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { reservationId } = await req.json();
        if (!reservationId) {
            return NextResponse.json({ message: "Reservation ID is required" }, { status: 400 });
        }

        const payment = await createMonthlyPayment(reservationId, session.user.id);

        return NextResponse.json(payment, { status: 201 });
    } catch (error: any) {
        console.error("Create Monthly Payment Error:", error);
        return NextResponse.json({ message: error.message || "Internal Server Error" }, { status: 500 });
    }
}
