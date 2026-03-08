import { describe, it, expect } from 'vitest';
import {
  submitAttendance,
  getCleanerAttendances,
  getAllAttendances,
} from '../attendance.service';
import { prismaMock } from '@/test/setup';
import { AttendanceStatus } from '@prisma/client';

describe('Attendance Service', () => {
  const mockAttendance = {
    id: 'attendance-1',
    cleanerId: 'cleaner-1',
    status: AttendanceStatus.PRESENT,
    reason: null,
    proofUrl: null,
    timestamp: new Date('2026-03-09'),
  };

  describe('submitAttendance', () => {
    it('should create attendance with cleanerId and status', async () => {
      prismaMock.attendance.create.mockResolvedValue(mockAttendance);

      const result = await submitAttendance('cleaner-1', { status: 'PRESENT' });

      expect(prismaMock.attendance.create).toHaveBeenCalledWith({
        data: {
          cleanerId: 'cleaner-1',
          status: AttendanceStatus.PRESENT,
          reason: undefined,
        },
      });
      expect(result.status).toBe(AttendanceStatus.PRESENT);
    });

    it('should include reason when provided', async () => {
      const withReason = { ...mockAttendance, status: AttendanceStatus.ABSENT, reason: 'Sakit' };
      prismaMock.attendance.create.mockResolvedValue(withReason);

      const result = await submitAttendance('cleaner-1', { status: 'ABSENT', reason: 'Sakit' });

      expect(prismaMock.attendance.create).toHaveBeenCalledWith({
        data: {
          cleanerId: 'cleaner-1',
          status: AttendanceStatus.ABSENT,
          reason: 'Sakit',
        },
      });
      expect(result.reason).toBe('Sakit');
    });

    it('should throw on invalid status (Zod validation)', async () => {
      await expect(
        submitAttendance('cleaner-1', { status: 'INVALID' as any }),
      ).rejects.toThrow();
    });
  });

  describe('getCleanerAttendances', () => {
    it('should filter by cleanerId and order by timestamp desc', async () => {
      prismaMock.attendance.findMany.mockResolvedValue([mockAttendance]);

      const result = await getCleanerAttendances('cleaner-1');

      expect(prismaMock.attendance.findMany).toHaveBeenCalledWith({
        where: { cleanerId: 'cleaner-1' },
        orderBy: { timestamp: 'desc' },
      });
      expect(result).toEqual([mockAttendance]);
    });
  });

  describe('getAllAttendances', () => {
    it('should return all records with cleaner relation', async () => {
      const withCleaner = {
        ...mockAttendance,
        cleaner: { name: 'Budi', email: 'budi@example.com' },
      };
      prismaMock.attendance.findMany.mockResolvedValue([withCleaner]);

      const result = await getAllAttendances();

      expect(prismaMock.attendance.findMany).toHaveBeenCalledWith({
        include: {
          cleaner: { select: { name: true, email: true } },
        },
        orderBy: { timestamp: 'desc' },
      });
      expect(result).toEqual([withCleaner]);
    });
  });
});
