import { prisma } from '@/server/db/prisma';

export async function getMonthlyFinanceSummary(year: number = new Date().getFullYear()) {
    try {
        const startDate = new Date(year, 0, 1);
        const endDate = new Date(year, 11, 31, 23, 59, 59, 999);

        const confirmedPayments = await prisma.payment.findMany({
            where: {
                status: 'CONFIRMED',
                confirmedAt: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            select: {
                amount: true,
                confirmedAt: true,
            },
        });

        // Initialize summary for 12 months
        const monthlySummary = Array.from({ length: 12 }, (_, i) => ({
            month: i + 1,
            total: 0,
        }));

        // Aggregate totals by month
        confirmedPayments.forEach((payment) => {
            if (payment.confirmedAt) {
                const monthIndex = payment.confirmedAt.getMonth();
                monthlySummary[monthIndex].total += payment.amount;
            }
        });

        return monthlySummary;
    } catch (error) {
        console.error('Error in getMonthlyFinanceSummary:', error);
        throw new Error('Gagal mengambil ringkasan keuangan bulanan');
    }
}
