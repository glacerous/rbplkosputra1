import { prisma } from "@/server/db/prisma";

export async function getAdminStats() {
    const [
        totalRooms,
        occupiedRooms,
        pendingPayments,
        openComplaints,
        totalUsers
    ] = await Promise.all([
        prisma.room.count(),
        prisma.room.count({ where: { status: "OCCUPIED" } }),
        prisma.payment.count({ where: { status: "PENDING" } }),
        prisma.complaint.count({ where: { status: "OPEN" } }),
        prisma.user.count()
    ]);

    return {
        totalRooms,
        occupiedRooms,
        pendingPayments,
        openComplaints,
        totalUsers
    };
}
