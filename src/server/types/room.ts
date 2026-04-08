import { RoomStatus } from '@prisma/client';

export interface Room {
  id: string;
  number: string;
  category: string;
  priceMonthly: number;
  facilities?: string | null;
  imageUrl?: string | null;
  status: RoomStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateRoomInput {
  number: string;
  category: string;
  priceMonthly: number;
  facilities?: string;
  imageUrl?: string | null;
  status?: RoomStatus;
}

export type UpdateRoomInput = Partial<CreateRoomInput>;
