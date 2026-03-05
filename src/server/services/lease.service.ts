import { prisma } from "@/server/db/prisma";

export const leaseService = {
    /**
     * Get an active lease (reservation with CHECKED_IN status) for a user.
     */
    async getActiveLeaseByUserId(userId: string) {
        return await prisma.reservation.findFirst({
            where: {
                customerId: userId,
                status: { in: ["RESERVED", "CHECKED_IN"] },
            },
            include: {
                room: true,
                payments: {
                    orderBy: {
                        createdAt: "desc",
                    },
                    take: 1,
                },
            },
            orderBy: {
                createdAt: "desc"
            }
        });
    },
};
