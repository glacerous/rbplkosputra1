import { z } from 'zod';
import { prisma } from '@/server/db/prisma';
import { createNotification } from '@/server/services/notification.service';
import { sendComplaintStatusEmail } from '@/server/email/resend';

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
  const complaint = await prisma.complaint.update({
    where: { id },
    data: { status },
  });

  if (status === 'IN_PROGRESS' || status === 'RESOLVED') {
    prisma.user
      .findUnique({
        where: { id: complaint.customerId },
        select: { email: true, name: true },
      })
      .then((user) => {
        if (!user) return;
        createNotification(
          complaint.customerId,
          'COMPLAINT',
          'Update Status Komplain',
          `Komplain "${complaint.title}" kini ${status === 'IN_PROGRESS' ? 'sedang diproses' : 'telah diselesaikan'}.`,
        ).catch(console.error);
        sendComplaintStatusEmail({
          to: user.email,
          customerName: user.name,
          complaintTitle: complaint.title,
          newStatus: status,
        }).catch(console.error);
      })
      .catch(console.error);
  }

  return complaint;
}
