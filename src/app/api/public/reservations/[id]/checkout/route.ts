import { auth } from "@/server/auth/auth";
import { checkoutReservation } from "@/server/services/reservation.service";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        await checkoutReservation(id, session.user.id);

        return NextResponse.json({ message: "Checkout berhasil" }, { status: 200 });
    } catch (error: any) {
        console.error("Checkout Error:", error);
        return NextResponse.json({ message: error.message || "Internal Server Error" }, { status: 500 });
    }
}
