import { RoomStatus } from "@prisma/client";

export interface Room {
    id: string;
    number: string;
    category: string;
    priceMonthly: number;
    facilities?: string | null;
    status: RoomStatus;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateRoomInput {
    number: string;
    category: string;
    priceMonthly: number;
    facilities?: string;
    status?: RoomStatus;
}

export interface UpdateRoomInput extends Partial<CreateRoomInput> { }
