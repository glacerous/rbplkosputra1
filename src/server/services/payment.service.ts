import { prisma } from "@/server/db/prisma";

export async function confirmPayment(paymentId: string) {
    return await prisma.$transaction(async (tx) => {
        // 1. Update Payment status
        const payment = await tx.payment.update({
            where: { id: paymentId },
            data: {
                status: "CONFIRMED",
                confirmedAt: new Date(),
            },
            include: {
                reservation: true
            }
        });

        // 2. Update Reservation status
        await tx.reservation.update({
            where: { id: payment.reservationId },
            data: {
                status: "CHECKED_IN",
                checkInAt: new Date(),
            }
        });

        // 3. Update Room status
        await tx.room.update({
            where: { id: payment.reservation.roomId },
            data: {
                status: "OCCUPIED",
            }
        });

        return payment;
    });
}

export async function rejectPayment(paymentId: string) {
    return await prisma.payment.update({
        where: { id: paymentId },
        data: {
            status: "REJECTED",
        }
    });
}

export async function getPendingPayments() {
    return await prisma.payment.findMany({
        where: { status: "PENDING" },
        include: {
            customer: true,
            reservation: {
                include: {
                    room: true
                }
            }
        },
        orderBy: { createdAt: "desc" }
    });
}
