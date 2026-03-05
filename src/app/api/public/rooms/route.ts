import { NextResponse } from "next/server";
import { getRooms } from "@/server/services/room.service";

export async function GET() {
    try {
        const rooms = await getRooms();
        return NextResponse.json(rooms);
    } catch (error) {
        console.error("[API_PUBLIC_ROOMS_GET]", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
