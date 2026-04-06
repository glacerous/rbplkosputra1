import { prisma } from '@/server/db/prisma';
import { createNotification } from '@/server/services/notification.service';
import {
  sendPaymentConfirmedEmail,
  sendPaymentRejectedEmail,
} from '@/server/email/resend';

export async function confirmPayment(paymentId: string) {
  const payment = await prisma.$transaction(async (tx) => {
    // 1. Update Payment status
    const payment = await tx.payment.update({
      where: { id: paymentId },
      data: {
        status: 'CONFIRMED',
        confirmedAt: new Date(),
      },
      include: {
        reservation: { include: { room: true } },
      },
    });

    // 2. Update Reservation status
    await tx.reservation.update({
      where: { id: payment.reservationId },
      data: {
        status: 'CHECKED_IN',
        checkInAt: new Date(),
      },
    });

    // 3. Update Room status
    await tx.room.update({
      where: { id: payment.reservation.roomId },
      data: { status: 'OCCUPIED' },
    });

    // 4. Create Transaction record
    await tx.transaction.create({
      data: {
        paymentId: payment.id,
        total: payment.amount,
      },
    });

    return payment;
  });

  const user = await prisma.user.findUnique({
    where: { id: payment.customerId },
    select: { email: true, name: true },
  });

  if (user) {
    const roomNumber = payment.reservation.room.number;
    await Promise.all([
      createNotification(
        payment.customerId,
        'PAYMENT',
        'Pembayaran Dikonfirmasi',
        `Pembayaran Anda untuk Kamar ${roomNumber} telah dikonfirmasi.`,
      ),
      sendPaymentConfirmedEmail({
        to: user.email,
        customerName: user.name,
        roomNumber,
      }),
    ]).catch(console.error);
  }

  return payment;
}

export async function rejectPayment(paymentId: string) {
  const payment = await prisma.payment.update({
    where: { id: paymentId },
    data: { status: 'REJECTED' },
  });

  const user = await prisma.user.findUnique({
    where: { id: payment.customerId },
    select: { email: true, name: true },
  });

  if (user) {
    await Promise.all([
      createNotification(
        payment.customerId,
        'PAYMENT',
        'Pembayaran Ditolak',
        'Pembayaran Anda telah ditolak. Silakan unggah ulang bukti pembayaran.',
      ),
      sendPaymentRejectedEmail({
        to: user.email,
        customerName: user.name,
      }),
    ]).catch(console.error);
  }

  return payment;
}

export async function uploadPaymentProof(
  paymentId: string,
  customerId: string,
  proofUrl: string,
) {
  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
  });

  if (!payment) throw new Error('Pembayaran tidak ditemukan');
  if (payment.customerId !== customerId) throw new Error('Akses ditolak');
  if (payment.status !== 'PENDING' && payment.status !== 'REJECTED') {
    throw new Error(
      'Bukti hanya bisa diunggah untuk pembayaran yang pending atau ditolak',
    );
  }

  const updatedPayment = await prisma.payment.update({
    where: { id: paymentId },
    data: {
      proofUrl,
      status: 'PENDING',
      paidAt: new Date(),
    },
  });

  // Notify admins
  const admins = await prisma.user.findMany({
    where: { role: 'ADMIN' },
    select: { id: true },
  });

  await Promise.all(
    admins.map((admin) =>
      createNotification(
        admin.id,
        'PAYMENT',
        'Bukti Pembayaran Baru',
        'User mengunggah bukti pembayaran',
      ),
    ),
  ).catch(console.error);

  return updatedPayment;
}

export async function getPendingPayments() {
  return await prisma.payment.findMany({
    where: { status: 'PENDING' },
    include: {
      customer: true,
      reservation: {
        include: { room: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getTransactionReport() {
  return prisma.transaction.findMany({
    include: {
      payment: {
        include: {
          customer: { select: { name: true, email: true } },
          reservation: {
            include: { room: { select: { number: true } } },
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getUserPayments(customerId: string) {
  return await prisma.payment.findMany({
    where: { customerId },
    include: {
      reservation: {
        include: { room: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function createMonthlyPayment(reservationId: string, customerId: string) {
  const reservation = await prisma.reservation.findUnique({
    where: { id: reservationId },
    include: { room: true },
  });

  if (!reservation) throw new Error('Reservasi tidak ditemukan');
  if (reservation.customerId !== customerId) throw new Error('Akses ditolak');
  if (reservation.status !== 'CHECKED_IN') throw new Error('Kamar harus dalam status aktif');

  // Check if there is already a pending payment for this reservation
  const pendingPayment = await prisma.payment.findFirst({
    where: {
      reservationId,
      status: 'PENDING',
    },
  });

  if (pendingPayment) {
    return pendingPayment;
  }

  return await prisma.payment.create({
    data: {
      reservationId,
      customerId,
      amount: reservation.room.priceMonthly,
      status: 'PENDING',
    },
  });
}
