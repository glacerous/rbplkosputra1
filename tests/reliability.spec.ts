import { describe, it, expect, vi, beforeEach } from 'vitest';
import { expireReservations } from '../src/server/jobs/expireReservation';
import { sendPaymentReminders } from '../src/server/jobs/paymentReminder';
import { prisma } from '../src/server/db/prisma';
import { log } from '../src/server/lib/logger';

// Mock prisma and logger
vi.mock('../src/server/db/prisma', () => ({
    prisma: {
        reservation: {
            findMany: vi.fn(),
            updateMany: vi.fn(),
        },
        room: {
            updateMany: vi.fn(),
        },
        payment: {
            updateMany: vi.fn(),
        },
        $transaction: vi.fn((cb) => cb(prisma)),
    },
}));

vi.mock('../src/server/lib/logger', () => ({
    log: {
        info: vi.fn(),
        error: vi.fn(),
        warn: vi.fn(),
        debug: vi.fn(),
    },
    logBuffer: [],
}));

vi.mock('../src/server/services/notification.service', () => ({
    createNotification: vi.fn().mockResolvedValue({}),
}));

vi.mock('../src/server/email/resend', () => ({
    sendPaymentReminderEmail: vi.fn().mockResolvedValue({}),
}));

describe('Reliability & Observability Tests', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('expireReservations job', () => {
        it('should skip if no expired reservations found', async () => {
            // @ts-expect-error - mocked member
            prisma.reservation.findMany.mockResolvedValue([]);

            await expireReservations();

            expect(log.info).toHaveBeenCalledWith('No expired reservations found.');
        });

        it('should cancel expired reservations and update rooms', async () => {
            const mockExpired = [
                { id: 'res-1', roomId: 'room-1' },
                { id: 'res-2', roomId: 'room-2' },
            ];
            // @ts-expect-error - mocked member
            prisma.reservation.findMany.mockResolvedValue(mockExpired);

            await expireReservations();

            expect(prisma.reservation.updateMany).toHaveBeenCalled();
            expect(prisma.room.updateMany).toHaveBeenCalled();
            expect(log.info).toHaveBeenCalledWith(expect.stringContaining('Successfully expired 2 reservations'));
        });
    });

    describe('sendPaymentReminders job', () => {
        it('should skip if no pending reservations found', async () => {
            // @ts-expect-error - mocked member
            prisma.reservation.findMany.mockResolvedValue([]);

            await sendPaymentReminders();

            expect(log.info).toHaveBeenCalledWith('No pending reservations found for reminders.');
        });

        it('should send reminders for pending reservations', async () => {
            const mockPending = [
                { id: 'res-1', customerId: 'user-1', customer: { email: 'test@example.com', name: 'Test' } },
            ];
            // @ts-expect-error - mocked member
            prisma.reservation.findMany.mockResolvedValue(mockPending);

            await sendPaymentReminders();

            expect(log.info).toHaveBeenCalledWith(expect.stringContaining('Sending payment reminders to 1 users'));
            expect(log.info).toHaveBeenCalledWith(expect.stringContaining('Successfully sent 1/1 payment reminders'));
        });
    });
});
