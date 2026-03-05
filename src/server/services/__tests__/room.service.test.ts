import { describe, it, expect, vi } from "vitest";
import {
    getRooms,
    getRoomById,
    createRoom,
    updateRoom,
    deleteRoom
} from "../room.service";
import { prismaMock } from "@/test/setup";
import { RoomStatus } from "@prisma/client";

describe("Room Service", () => {
    const mockRoom = {
        id: "room-1",
        number: "101",
        category: "Standard",
        priceMonthly: 1000000,
        facilities: "Wifi, AC",
        status: RoomStatus.AVAILABLE,
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    describe("getRooms", () => {
        it("should return a list of rooms", async () => {
            prismaMock.room.findMany.mockResolvedValue([mockRoom]);

            const result = await getRooms();

            expect(result).toEqual([mockRoom]);
            expect(prismaMock.room.findMany).toHaveBeenCalled();
        });
    });

    describe("getRoomById", () => {
        it("should return a room if it exists", async () => {
            prismaMock.room.findUnique.mockResolvedValue(mockRoom);

            const result = await getRoomById("room-1");

            expect(result).toEqual(mockRoom);
            expect(prismaMock.room.findUnique).toHaveBeenCalledWith({
                where: { id: "room-1" },
            });
        });

        it("should throw an error if room does not exist", async () => {
            prismaMock.room.findUnique.mockResolvedValue(null);

            await expect(getRoomById("non-existent")).rejects.toThrow("Room not found");
        });
    });

    describe("createRoom", () => {
        it("should create a new room", async () => {
            const input = {
                number: "102",
                category: "Deluxe",
                priceMonthly: 2000000,
                facilities: "Wifi, AC, TV",
            };

            prismaMock.room.create.mockResolvedValue({ ...mockRoom, ...input, id: "room-2" });

            const result = await createRoom(input);

            expect(result.number).toBe("102");
            expect(prismaMock.room.create).toHaveBeenCalledWith({
                data: input,
            });
        });
    });

    describe("updateRoom", () => {
        it("should update an existing room", async () => {
            prismaMock.room.findUnique.mockResolvedValue(mockRoom);
            prismaMock.room.update.mockResolvedValue({ ...mockRoom, number: "101-Updated" });

            const result = await updateRoom("room-1", { number: "101-Updated" });

            expect(result.number).toBe("101-Updated");
            expect(prismaMock.room.update).toHaveBeenCalled();
        });
    });

    describe("deleteRoom", () => {
        it("should delete an existing room", async () => {
            prismaMock.room.findUnique.mockResolvedValue(mockRoom);
            prismaMock.room.delete.mockResolvedValue(mockRoom);

            const result = await deleteRoom("room-1");

            expect(result).toEqual(mockRoom);
            expect(prismaMock.room.delete).toHaveBeenCalledWith({
                where: { id: "room-1" },
            });
        });
    });
});
