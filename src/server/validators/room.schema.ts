import { z } from "zod";
import { RoomStatus } from "@prisma/client";

export const roomSchema = z.object({
    number: z.string().min(1, "Nomor kamar harus diisi"),
    category: z.string().min(3, "Kategori minimal 3 karakter"),
    priceMonthly: z.number().positive("Harga per bulan harus positif"),
    facilities: z.string().optional(),
    status: z.nativeEnum(RoomStatus).default(RoomStatus.AVAILABLE),
});

export type RoomSchema = z.infer<typeof roomSchema>;
