import { NotificationType } from '@prisma/client';
import { prisma } from '@/server/db/prisma';

export async function createNotification(
  userId: string,
  type: NotificationType,
  title: string,
  message: string,
) {
  return await prisma.notification.create({
    data: { userId, type, title, message },
  });
}

export async function getUserNotifications(userId: string) {
  return await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
}

export async function markNotificationRead(id: string, userId: string) {
  const notification = await prisma.notification.findUnique({ where: { id } });
  if (!notification) throw new Error('Notifikasi tidak ditemukan');
  if (notification.userId !== userId) throw new Error('Akses ditolak');
  return await prisma.notification.update({
    where: { id },
    data: { readAt: new Date() },
  });
}

export async function getUnreadCount(userId: string) {
  return await prisma.notification.count({
    where: { userId, readAt: null },
  });
}
