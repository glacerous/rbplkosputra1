import { describe, it, expect } from 'vitest';
import {
  createNotification,
  getUserNotifications,
  markNotificationRead,
  getUnreadCount,
} from '../notification.service';
import { prismaMock } from '@/test/setup';
import { NotificationType } from '@prisma/client';

describe('Notification Service', () => {
  const mockNotification = {
    id: 'notif-1',
    userId: 'user-1',
    type: NotificationType.PAYMENT,
    title: 'Pembayaran Dikonfirmasi',
    message: 'Pembayaran Anda telah dikonfirmasi.',
    readAt: null,
    createdAt: new Date('2026-03-09'),
  };

  describe('createNotification', () => {
    it('should call prisma.notification.create with correct args', async () => {
      prismaMock.notification.create.mockResolvedValue(mockNotification);

      const result = await createNotification(
        'user-1',
        NotificationType.PAYMENT,
        'Pembayaran Dikonfirmasi',
        'Pembayaran Anda telah dikonfirmasi.',
      );

      expect(prismaMock.notification.create).toHaveBeenCalledWith({
        data: {
          userId: 'user-1',
          type: NotificationType.PAYMENT,
          title: 'Pembayaran Dikonfirmasi',
          message: 'Pembayaran Anda telah dikonfirmasi.',
        },
      });
      expect(result).toEqual(mockNotification);
    });
  });

  describe('getUserNotifications', () => {
    it('should filter by userId and order by createdAt desc', async () => {
      prismaMock.notification.findMany.mockResolvedValue([mockNotification]);

      const result = await getUserNotifications('user-1');

      expect(prismaMock.notification.findMany).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toEqual([mockNotification]);
    });
  });

  describe('markNotificationRead', () => {
    it('should update readAt when ownership matches', async () => {
      const readNotif = { ...mockNotification, readAt: new Date() };
      prismaMock.notification.findUnique.mockResolvedValue(mockNotification);
      prismaMock.notification.update.mockResolvedValue(readNotif);

      const result = await markNotificationRead('notif-1', 'user-1');

      expect(prismaMock.notification.update).toHaveBeenCalledWith({
        where: { id: 'notif-1' },
        data: { readAt: expect.any(Date) },
      });
      expect(result.readAt).toBeDefined();
    });

    it('should throw when userId does not match notification.userId', async () => {
      prismaMock.notification.findUnique.mockResolvedValue(mockNotification);

      await expect(markNotificationRead('notif-1', 'other-user')).rejects.toThrow('Akses ditolak');
    });

    it('should throw when notification not found', async () => {
      prismaMock.notification.findUnique.mockResolvedValue(null);

      await expect(markNotificationRead('nonexistent', 'user-1')).rejects.toThrow(
        'Notifikasi tidak ditemukan',
      );
    });
  });

  describe('getUnreadCount', () => {
    it('should call prisma.notification.count with userId and readAt null', async () => {
      prismaMock.notification.count.mockResolvedValue(3);

      const result = await getUnreadCount('user-1');

      expect(prismaMock.notification.count).toHaveBeenCalledWith({
        where: { userId: 'user-1', readAt: null },
      });
      expect(result).toBe(3);
    });
  });
});
