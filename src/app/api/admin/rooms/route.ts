import { NextResponse } from "next/server";
import { getRooms, createRoom } from "@/server/services/room.service";
import { roomSchema } from "@/server/validators/room.schema";

export async function GET() {
    try {
        const rooms = await getRooms();
        return NextResponse.json(rooms);
    } catch (error) {
        console.error("[API_ADMIN_ROOMS_GET]", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const result = roomSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                { message: "Validation Error", errors: result.error.flatten().fieldErrors },
                { status: 400 }
            );
        }

        const room = await createRoom(result.data);
        return NextResponse.json(room, { status: 201 });
    } catch (error: any) {
        console.error("[API_ADMIN_ROOMS_POST]", error);
        if (error.code === "P2002") {
            return NextResponse.json(
                { message: "Room number already exists" },
                { status: 400 }
            );
        }
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
