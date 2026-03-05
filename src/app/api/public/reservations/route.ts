import { auth } from "@/server/auth/auth";
import { createReservation } from "@/server/services/reservation.service";
import { NextResponse } from "next/server";
import { z } from "zod";

const reservationSchema = z.object({
    roomId: z.string().min(1, "Room ID is required"),
});

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session || !session.user?.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { roomId } = reservationSchema.parse(body);

        const result = await createReservation(roomId, session.user.id);

        return NextResponse.json(result, { status: 201 });
    } catch (error: any) {
        console.error("Reservation Error:", error);
        if (error instanceof z.ZodError) {
            return NextResponse.json({ message: "Validation error", errors: error.flatten().fieldErrors }, { status: 400 });
        }
        return NextResponse.json({ message: error.message || "Internal Server Error" }, { status: 500 });
    }
}
