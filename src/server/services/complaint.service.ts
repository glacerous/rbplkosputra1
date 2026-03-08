import { z } from 'zod';
import { prisma } from '@/server/db/prisma';

export const createComplaintSchema = z.object({
  title: z.string().min(3).max(100),
  content: z.string().min(10).max(1000),
  reservationId: z.string().optional(),
});

export async function createComplaint(
  customerId: string,
  data: z.infer<typeof createComplaintSchema>,
) {
  const validated = createComplaintSchema.parse(data);
  return await prisma.complaint.create({
    data: {
      customerId,
      title: validated.title,
      content: validated.content,
      reservationId: validated.reservationId,
      status: 'OPEN',
    },
  });
}

export async function getUserComplaints(customerId: string) {
  return await prisma.complaint.findMany({
    where: { customerId },
    include: {
      customer: { select: { name: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getAllComplaints() {
  return await prisma.complaint.findMany({
    include: {
      customer: { select: { name: true, email: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function updateComplaintStatus(
  id: string,
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED',
) {
  return await prisma.complaint.update({
    where: { id },
    data: { status },
  });
}
