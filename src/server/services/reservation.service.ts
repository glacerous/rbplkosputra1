import { prisma } from "@/server/db/prisma";

export async function createReservation(roomId: string, customerId: string) {
    // 1. Check if room exists and is available
    const room = await prisma.room.findUnique({
        where: { id: roomId }
    });

    if (!room) {
        throw new Error("Kamar tidak ditemukan");
    }

    if (room.status !== "AVAILABLE") {
        throw new Error("Kamar sudah terisi atau sedang dalam perbaikan");
    }

    // 2. Check if user already has an active or pending reservation
    const existingReservation = await prisma.reservation.findFirst({
        where: {
            customerId,
            status: { in: ["RESERVED", "CHECKED_IN"] }
        }
    });

    if (existingReservation) {
        throw new Error("Anda sudah memiliki reservasi aktif atau sedang menunggu konfirmasi");
    }

    // 3. Create Reservation and initial Payment in a transaction
    return await prisma.$transaction(async (tx) => {
        const reservation = await tx.reservation.create({
            data: {
                roomId,
                customerId,
                status: "RESERVED",
            }
        });

        const payment = await tx.payment.create({
            data: {
                reservationId: reservation.id,
                customerId,
                amount: room.priceMonthly,
                status: "PENDING",
            }
        });

        return { reservation, payment };
    });
}

export async function getUserReservation(userId: string) {
    return await prisma.reservation.findFirst({
        where: { customerId: userId },
        include: {
            room: true,
            payments: {
                orderBy: { createdAt: 'desc' }
            }
        },
        orderBy: { createdAt: 'desc' }
    });
}
