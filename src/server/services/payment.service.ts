import { prisma } from '@/server/db/prisma';

export async function confirmPayment(paymentId: string) {
  return await prisma.$transaction(async (tx) => {
    // 1. Update Payment status
    const payment = await tx.payment.update({
      where: { id: paymentId },
      data: {
        status: 'CONFIRMED',
        confirmedAt: new Date(),
      },
      include: {
        reservation: true,
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
}

export async function rejectPayment(paymentId: string) {
  return await prisma.payment.update({
    where: { id: paymentId },
    data: { status: 'REJECTED' },
  });
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

  return await prisma.payment.update({
    where: { id: paymentId },
    data: {
      proofUrl,
      status: 'PENDING',
      paidAt: new Date(),
    },
  });
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
