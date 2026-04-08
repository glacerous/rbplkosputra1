import { prisma } from '@/server/db/prisma';
import { log } from '@/server/lib/logger';

export async function expireReservations() {
    const expirationTime = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours ago

    try {
        const expiredReservations = await prisma.reservation.findMany({
            where: {
                status: 'RESERVED',
                createdAt: { lt: expirationTime },
                payments: {
                    some: {
                        status: 'PENDING',
                    },
                },
            },
            include: {
                room: true,
            },
        });

        if (expiredReservations.length === 0) {
            log.info('No expired reservations found.');
            return;
        }

        log.info(`Found ${expiredReservations.length} expired reservations. Expiring now...`);

        const result = await prisma.$transaction(async (tx) => {
            const updatedReservations = await tx.reservation.updateMany({
                where: {
                    id: { in: expiredReservations.map((r) => r.id) },
                },
                data: {
                    status: 'CANCELLED',
                },
            });

            await tx.room.updateMany({
                where: {
                    id: { in: expiredReservations.map((r) => r.roomId) },
                },
                data: {
                    status: 'AVAILABLE',
                },
            });

            // Update associated pending payments to REJECTED
            await tx.payment.updateMany({
                where: {
                    reservationId: { in: expiredReservations.map((r) => r.id) },
                    status: 'PENDING',
                },
                data: {
                    status: 'REJECTED',
                },
            });

            return updatedReservations;
        });

        log.info(`Successfully expired ${expiredReservations.length} reservations.`);
        return result;
    } catch (error: any) {
        log.error('Error during expireReservations job:', error);
        throw error;
    }
}
