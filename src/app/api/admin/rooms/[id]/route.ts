import { NextResponse } from "next/server";
import { getRoomById, updateRoom, deleteRoom } from "@/server/services/room.service";
import { roomSchema } from "@/server/validators/room.schema";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const room = await getRoomById(id);
        return NextResponse.json(room);
    } catch (error: any) {
        console.error("[API_ADMIN_ROOM_ID_GET]", error);
        if (error.message === "Room not found") {
            return NextResponse.json({ message: "Room not found" }, { status: 404 });
        }
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await req.json();
        const result = roomSchema.partial().safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                { message: "Validation Error", errors: result.error.flatten().fieldErrors },
                { status: 400 }
            );
        }

        const room = await updateRoom(id, result.data);
        return NextResponse.json(room);
    } catch (error: any) {
        console.error("[API_ADMIN_ROOM_ID_PUT]", error);
        if (error.message === "Room not found") {
            return NextResponse.json({ message: "Room not found" }, { status: 404 });
        }
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

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await deleteRoom(id);
        return new NextResponse(null, { status: 204 });
    } catch (error: any) {
        console.error("[API_ADMIN_ROOM_ID_DELETE]", error);
        if (error.message === "Room not found") {
            return NextResponse.json({ message: "Room not found" }, { status: 404 });
        }
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
