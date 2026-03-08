import { AttendanceStatus } from '@prisma/client';
import { prisma } from '@/server/db/prisma';
import { z } from 'zod';

export const submitAttendanceSchema = z.object({
  status: z.enum(['PRESENT', 'ABSENT']),
  reason: z.string().optional(),
});

export async function submitAttendance(
  cleanerId: string,
  data: z.infer<typeof submitAttendanceSchema>,
) {
  const validated = submitAttendanceSchema.parse(data);
  return await prisma.attendance.create({
    data: {
      cleanerId,
      status: validated.status as AttendanceStatus,
      reason: validated.reason,
    },
  });
}

export async function getCleanerAttendances(cleanerId: string) {
  return await prisma.attendance.findMany({
    where: { cleanerId },
    orderBy: { timestamp: 'desc' },
  });
}

export async function getAllAttendances() {
  return await prisma.attendance.findMany({
    include: {
      cleaner: { select: { name: true, email: true } },
    },
    orderBy: { timestamp: 'desc' },
  });
}
