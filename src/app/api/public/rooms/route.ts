import { NextResponse } from "next/server";
import { getRooms } from "@/server/services/room.service";
import { RoomStatus } from "@prisma/client";

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const status = searchParams.get("status") as RoomStatus | null;

        const rooms = await getRooms(status || undefined);
        return NextResponse.json(rooms);
    } catch (error) {
        console.error("[API_PUBLIC_ROOMS_GET]", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
