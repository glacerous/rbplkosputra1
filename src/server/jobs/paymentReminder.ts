import { prisma } from '@/server/db/prisma';
import { log } from '@/server/lib/logger';
import { createNotification } from '../services/notification.service';
import { sendPaymentReminderEmail } from '../email/resend';

export async function sendPaymentReminders() {
    try {
        const pendingReservations = await prisma.reservation.findMany({
            where: {
                status: 'RESERVED',
                payments: {
                    some: {
                        status: 'PENDING',
                    },
                },
            },
            include: {
                customer: true,
            },
        });

        if (pendingReservations.length === 0) {
            log.info('No pending reservations found for reminders.');
            return;
        }

        log.info(`Sending payment reminders to ${pendingReservations.length} users...`);

        const reminderPromises = pendingReservations.map(async (res) => {
            try {
                await Promise.all([
                    createNotification(
                        res.customerId,
                        'PAYMENT',
                        'Pengingat Pembayaran',
                        'Mohon segera lakukan pembayaran untuk reservasi Anda.'
                    ),
                    sendPaymentReminderEmail({
                        to: res.customer.email,
                        customerName: res.customer.name,
                    }),
                ]);
                return { id: res.id, success: true };
            } catch (err) {
                log.error(`Failed to send reminder for reservation ${res.id}`, err);
                return { id: res.id, success: false };
            }
        });

        const results = await Promise.all(reminderPromises);
        const successCount = results.filter((r) => r.success).length;

        log.info(`Successfully sent ${successCount}/${pendingReservations.length} payment reminders.`);
    } catch (error: any) {
        log.error('Error during sendPaymentReminders job:', error);
        throw error;
    }
}
