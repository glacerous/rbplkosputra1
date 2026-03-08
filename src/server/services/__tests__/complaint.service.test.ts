import { describe, it, expect, vi } from 'vitest';
import {
  createComplaint,
  getUserComplaints,
  getAllComplaints,
  updateComplaintStatus,
} from '../complaint.service';
import { prismaMock } from '@/test/setup';

vi.mock('@/server/email/resend', () => ({
  sendComplaintStatusEmail: vi.fn().mockResolvedValue(undefined),
}));
vi.mock('@/server/services/notification.service', () => ({
  createNotification: vi.fn().mockResolvedValue(undefined),
}));

import { sendComplaintStatusEmail } from '@/server/email/resend';
import { createNotification } from '@/server/services/notification.service';

describe('Complaint Service', () => {
  const mockComplaint = {
    id: 'complaint-1',
    customerId: 'customer-1',
    reservationId: null,
    title: 'Kamar Bocor',
    content: 'Atap kamar saya bocor saat hujan lebat kemarin.',
    status: 'OPEN' as const,
    createdAt: new Date('2026-03-08'),
    updatedAt: new Date('2026-03-08'),
  };

  describe('createComplaint', () => {
    it('should create complaint with status OPEN', async () => {
      prismaMock.complaint.create.mockResolvedValue(mockComplaint);

      const result = await createComplaint('customer-1', {
        title: 'Kamar Bocor',
        content: 'Atap kamar saya bocor saat hujan lebat kemarin.',
      });

      expect(prismaMock.complaint.create).toHaveBeenCalledWith({
        data: {
          customerId: 'customer-1',
          title: 'Kamar Bocor',
          content: 'Atap kamar saya bocor saat hujan lebat kemarin.',
          reservationId: undefined,
          status: 'OPEN',
        },
      });
      expect(result.status).toBe('OPEN');
    });

    it('should throw if title is too short (Zod validation)', async () => {
      await expect(
        createComplaint('customer-1', {
          title: 'AB',
          content: 'Atap kamar saya bocor saat hujan lebat kemarin.',
        }),
      ).rejects.toThrow();
    });

    it('should throw if content is too short (Zod validation)', async () => {
      await expect(
        createComplaint('customer-1', {
          title: 'Kamar Bocor',
          content: 'Bocor',
        }),
      ).rejects.toThrow();
    });
  });

  describe('getUserComplaints', () => {
    it('should return complaints filtered by customerId', async () => {
      prismaMock.complaint.findMany.mockResolvedValue([mockComplaint]);

      const result = await getUserComplaints('customer-1');

      expect(prismaMock.complaint.findMany).toHaveBeenCalledWith({
        where: { customerId: 'customer-1' },
        include: { customer: { select: { name: true } } },
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toEqual([mockComplaint]);
    });

    it('should return empty array when no complaints for customer', async () => {
      prismaMock.complaint.findMany.mockResolvedValue([]);

      const result = await getUserComplaints('customer-99');

      expect(result).toEqual([]);
    });
  });

  describe('getAllComplaints', () => {
    it('should return all complaints ordered by createdAt desc', async () => {
      prismaMock.complaint.findMany.mockResolvedValue([mockComplaint]);

      const result = await getAllComplaints();

      expect(prismaMock.complaint.findMany).toHaveBeenCalledWith({
        include: { customer: { select: { name: true, email: true } } },
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toEqual([mockComplaint]);
    });
  });

  describe('updateComplaintStatus', () => {
    const mockUser = { email: 'customer@example.com', name: 'Customer' };

    it('should call complaint.update with correct id and status', async () => {
      const updated = { ...mockComplaint, status: 'IN_PROGRESS' as const };
      prismaMock.complaint.update.mockResolvedValue(updated);
      prismaMock.user.findUnique.mockResolvedValue(mockUser);

      const result = await updateComplaintStatus('complaint-1', 'IN_PROGRESS');

      expect(prismaMock.complaint.update).toHaveBeenCalledWith({
        where: { id: 'complaint-1' },
        data: { status: 'IN_PROGRESS' },
      });
      expect(result.status).toBe('IN_PROGRESS');
    });

    it('should update status to RESOLVED', async () => {
      const resolved = { ...mockComplaint, status: 'RESOLVED' as const };
      prismaMock.complaint.update.mockResolvedValue(resolved);
      prismaMock.user.findUnique.mockResolvedValue(mockUser);

      const result = await updateComplaintStatus('complaint-1', 'RESOLVED');

      expect(result.status).toBe('RESOLVED');
    });

    it('should fire-and-forget notification and email for IN_PROGRESS', async () => {
      const updated = { ...mockComplaint, status: 'IN_PROGRESS' as const };
      prismaMock.complaint.update.mockResolvedValue(updated);
      prismaMock.user.findUnique.mockResolvedValue(mockUser);

      await updateComplaintStatus('complaint-1', 'IN_PROGRESS');

      await new Promise((r) => setTimeout(r, 0));

      expect(sendComplaintStatusEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: mockUser.email,
          newStatus: 'IN_PROGRESS',
        }),
      );
      expect(createNotification).toHaveBeenCalledWith(
        mockComplaint.customerId,
        'COMPLAINT',
        expect.any(String),
        expect.any(String),
      );
    });

    it('should fire-and-forget notification and email for RESOLVED', async () => {
      const resolved = { ...mockComplaint, status: 'RESOLVED' as const };
      prismaMock.complaint.update.mockResolvedValue(resolved);
      prismaMock.user.findUnique.mockResolvedValue(mockUser);

      await updateComplaintStatus('complaint-1', 'RESOLVED');

      await new Promise((r) => setTimeout(r, 0));

      expect(sendComplaintStatusEmail).toHaveBeenCalledWith(
        expect.objectContaining({ to: mockUser.email, newStatus: 'RESOLVED' }),
      );
    });

    it('should NOT fire notification for OPEN status', async () => {
      vi.clearAllMocks();
      prismaMock.complaint.update.mockResolvedValue(mockComplaint);

      await updateComplaintStatus('complaint-1', 'OPEN');

      await new Promise((r) => setTimeout(r, 0));

      expect(createNotification).not.toHaveBeenCalled();
    });
  });
});
