import { describe, it, expect, vi } from 'vitest';
import {
  uploadPaymentProof,
  confirmPayment,
  rejectPayment,
  getUserPayments,
  getTransactionReport,
} from '../payment.service';
import { prismaMock } from '@/test/setup';
import { PaymentStatus } from '@prisma/client';

describe('Payment Service', () => {
  const mockPayment = {
    id: 'payment-1',
    reservationId: 'reservation-1',
    customerId: 'customer-1',
    amount: 1000000,
    status: PaymentStatus.PENDING,
    proofUrl: null,
    paidAt: null,
    confirmedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    reservation: {
      id: 'reservation-1',
      roomId: 'room-1',
      customerId: 'customer-1',
      status: 'RESERVED' as const,
      checkInAt: null,
      checkOutAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  };

  describe('uploadPaymentProof', () => {
    it('should update proofUrl on happy path', async () => {
      prismaMock.payment.findUnique.mockResolvedValue(mockPayment);
      prismaMock.payment.update.mockResolvedValue({
        ...mockPayment,
        proofUrl: 'https://example.com/proof.jpg',
        status: PaymentStatus.PENDING,
      });

      const result = await uploadPaymentProof(
        'payment-1',
        'customer-1',
        'https://example.com/proof.jpg',
      );

      expect(prismaMock.payment.update).toHaveBeenCalledWith({
        where: { id: 'payment-1' },
        data: {
          proofUrl: 'https://example.com/proof.jpg',
          status: 'PENDING',
          paidAt: expect.any(Date),
        },
      });
      expect(result.proofUrl).toBe('https://example.com/proof.jpg');
    });

    it('should throw if payment not found', async () => {
      prismaMock.payment.findUnique.mockResolvedValue(null);

      await expect(
        uploadPaymentProof('nonexistent', 'customer-1', 'url'),
      ).rejects.toThrow('Pembayaran tidak ditemukan');
    });

    it('should throw if wrong customer', async () => {
      prismaMock.payment.findUnique.mockResolvedValue(mockPayment);

      await expect(
        uploadPaymentProof('payment-1', 'wrong-customer', 'url'),
      ).rejects.toThrow('Akses ditolak');
    });

    it('should throw if payment is CONFIRMED', async () => {
      prismaMock.payment.findUnique.mockResolvedValue({
        ...mockPayment,
        status: PaymentStatus.CONFIRMED,
      });

      await expect(
        uploadPaymentProof('payment-1', 'customer-1', 'url'),
      ).rejects.toThrow(
        'Bukti hanya bisa diunggah untuk pembayaran yang pending atau ditolak',
      );
    });
  });

  describe('confirmPayment', () => {
    it('should call $transaction and update payment, reservation, room, and create transaction', async () => {
      const confirmedPayment = {
        ...mockPayment,
        status: PaymentStatus.CONFIRMED,
        confirmedAt: new Date(),
      };

      let capturedTxMock: any;

      prismaMock.$transaction.mockImplementation(async (fn: any) => {
        capturedTxMock = {
          payment: {
            update: vi.fn().mockResolvedValue(confirmedPayment),
          },
          reservation: {
            update: vi.fn().mockResolvedValue({}),
          },
          room: {
            update: vi.fn().mockResolvedValue({}),
          },
          transaction: {
            create: vi.fn().mockResolvedValue({}),
          },
        };
        return fn(capturedTxMock);
      });

      const result = await confirmPayment('payment-1');

      expect(prismaMock.$transaction).toHaveBeenCalled();
      expect(result.status).toBe(PaymentStatus.CONFIRMED);
      expect(capturedTxMock.transaction.create).toHaveBeenCalledWith({
        data: { paymentId: mockPayment.id, total: mockPayment.amount },
      });
    });
  });

  describe('getTransactionReport', () => {
    const mockTransaction = {
      id: 'transaction-1',
      paymentId: 'payment-1',
      total: 1000000,
      createdAt: new Date('2026-03-08'),
      updatedAt: new Date('2026-03-08'),
      payment: {
        customer: { name: 'John Doe', email: 'john@example.com' },
        reservation: {
          room: { number: '101' },
        },
      },
    };

    it('should return all transactions ordered by createdAt desc', async () => {
      prismaMock.transaction.findMany.mockResolvedValue([mockTransaction]);

      const result = await getTransactionReport();

      expect(prismaMock.transaction.findMany).toHaveBeenCalledWith({
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
      expect(result).toEqual([mockTransaction]);
    });

    it('should return empty array when no transactions exist', async () => {
      prismaMock.transaction.findMany.mockResolvedValue([]);

      const result = await getTransactionReport();

      expect(result).toEqual([]);
    });
  });

  describe('rejectPayment', () => {
    it('should update payment status to REJECTED', async () => {
      prismaMock.payment.update.mockResolvedValue({
        ...mockPayment,
        status: PaymentStatus.REJECTED,
      });

      const result = await rejectPayment('payment-1');

      expect(prismaMock.payment.update).toHaveBeenCalledWith({
        where: { id: 'payment-1' },
        data: { status: 'REJECTED' },
      });
      expect(result.status).toBe(PaymentStatus.REJECTED);
    });
  });

  describe('getUserPayments', () => {
    it('should call findMany with correct customerId filter', async () => {
      prismaMock.payment.findMany.mockResolvedValue([mockPayment]);

      const result = await getUserPayments('customer-1');

      expect(prismaMock.payment.findMany).toHaveBeenCalledWith({
        where: { customerId: 'customer-1' },
        include: {
          reservation: {
            include: { room: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toEqual([mockPayment]);
    });
  });
});
