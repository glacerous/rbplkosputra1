import { auth } from '@/server/auth/auth';
import { updateComplaintStatus } from '@/server/services/complaint.service';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const statusSchema = z.object({
  status: z.enum(['OPEN', 'IN_PROGRESS', 'RESOLVED']),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (
      !session ||
      (session.user.role !== 'ADMIN' && session.user.role !== 'OWNER')
    ) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const parsed = statusSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { message: parsed.error.issues[0]?.message ?? 'Validasi gagal' },
        { status: 400 },
      );
    }

    const complaint = await updateComplaintStatus(id, parsed.data.status);
    return NextResponse.json(complaint, { status: 200 });
  } catch (error: unknown) {
    console.error('Update Complaint Status Error:', error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 },
    );
  }
}
