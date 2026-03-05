import { prisma } from "@/server/db/prisma";
import { RoomStatus } from "@prisma/client";
import { CreateRoomInput, UpdateRoomInput } from "@/server/types/room";

export async function getRooms() {
    return await prisma.room.findMany({
        orderBy: {
            createdAt: "desc",
        },
    });
}

export async function getRoomById(id: string) {
    const room = await prisma.room.findUnique({
        where: { id },
    });

    if (!room) {
        throw new Error("Room not found");
    }

    return room;
}

export async function createRoom(data: CreateRoomInput) {
    return await prisma.room.create({
        data,
    });
}

export async function updateRoom(
    id: string,
    data: UpdateRoomInput
) {
    // Check if room exists
    await getRoomById(id);

    return await prisma.room.update({
        where: { id },
        data,
    });
}

export async function deleteRoom(id: string) {
    // Check if room exists
    await getRoomById(id);

    return await prisma.room.delete({
        where: { id },
    });
}
