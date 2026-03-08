import { prisma } from '@/server/db/prisma';

export async function createReservation(roomId: string, customerId: string) {
  // 1. Check if room exists and is available
  const room = await prisma.room.findUnique({
    where: { id: roomId },
  });

  if (!room) {
    throw new Error('Kamar tidak ditemukan');
  }

  if (room.status !== 'AVAILABLE') {
    throw new Error('Kamar sudah terisi atau sedang dalam perbaikan');
  }

  // 2. Check if user already has an active or pending reservation
  const existingReservation = await prisma.reservation.findFirst({
    where: {
      customerId,
      status: { in: ['RESERVED', 'CHECKED_IN'] },
    },
  });

  if (existingReservation) {
    throw new Error(
      'Anda sudah memiliki reservasi aktif atau sedang menunggu konfirmasi',
    );
  }

  // 3. Create Reservation and initial Payment in a transaction
  return await prisma.$transaction(async (tx) => {
    const reservation = await tx.reservation.create({
      data: {
        roomId,
        customerId,
        status: 'RESERVED',
      },
    });

    const payment = await tx.payment.create({
      data: {
        reservationId: reservation.id,
        customerId,
        amount: room.priceMonthly,
        status: 'PENDING',
      },
    });

    return { reservation, payment };
  });
}

export async function checkoutReservation(
  reservationId: string,
  customerId: string,
) {
  const reservation = await prisma.reservation.findUnique({
    where: { id: reservationId },
    include: { room: true },
  });

  if (!reservation) throw new Error('Reservasi tidak ditemukan');
  if (reservation.customerId !== customerId) throw new Error('Akses ditolak');
  if (reservation.status !== 'CHECKED_IN')
    throw new Error('Hanya reservasi aktif yang bisa di-checkout');

  return await prisma.$transaction(async (tx) => {
    await tx.reservation.update({
      where: { id: reservationId },
      data: {
        status: 'CHECKED_OUT',
        checkOutAt: new Date(),
      },
    });

    await tx.room.update({
      where: { id: reservation.roomId },
      data: { status: 'AVAILABLE' },
    });
  });
}

export async function cancelReservation(
  reservationId: string,
  customerId: string,
) {
  const reservation = await prisma.reservation.findUnique({
    where: { id: reservationId },
    include: { room: true },
  });

  if (!reservation) throw new Error('Reservasi tidak ditemukan');
  if (reservation.customerId !== customerId) throw new Error('Akses ditolak');
  if (reservation.status !== 'RESERVED')
    throw new Error(
      'Hanya reservasi yang belum dikonfirmasi yang bisa dibatalkan',
    );

  return await prisma.$transaction(async (tx) => {
    await tx.reservation.update({
      where: { id: reservationId },
      data: { status: 'CANCELLED' },
    });
    await tx.room.update({
      where: { id: reservation.roomId },
      data: { status: 'AVAILABLE' },
    });
    await tx.payment.updateMany({
      where: { reservationId, status: 'PENDING' },
      data: { status: 'REJECTED' },
    });
  });
}

export async function getUserReservationHistory(userId: string) {
  return await prisma.reservation.findMany({
    where: { customerId: userId },
    include: {
      room: true,
      payments: { orderBy: { createdAt: 'desc' } },
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getUserReservation(userId: string) {
  return await prisma.reservation.findFirst({
    where: { customerId: userId },
    include: {
      room: true,
      payments: {
        orderBy: { createdAt: 'desc' },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
}
