import { auth } from '@/server/auth/auth';
import {
  createComplaint,
  createComplaintSchema,
  getUserComplaints,
} from '@/server/services/complaint.service';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const complaints = await getUserComplaints(session.user.id);
    return NextResponse.json(complaints, { status: 200 });
  } catch (error: any) {
    console.error('Fetch User Complaints Error:', error);
    return NextResponse.json(
      { message: error.message || 'Internal Server Error' },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const parsed = createComplaintSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { message: parsed.error.issues[0]?.message ?? 'Validasi gagal' },
        { status: 400 },
      );
    }

    const complaint = await createComplaint(session.user.id, parsed.data);
    return NextResponse.json(complaint, { status: 201 });
  } catch (error: any) {
    console.error('Create Complaint Error:', error);
    return NextResponse.json(
      { message: error.message || 'Internal Server Error' },
      { status: 500 },
    );
  }
}
