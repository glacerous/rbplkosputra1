import { requireUser } from '@/server/auth/requireUser';
import { validateRequest } from '@/server/validators/validate';
import { ApiError } from '@/server/errors/api-error';
import {
  createComplaint,
  createComplaintSchema,
  getUserComplaints,
} from '@/server/services/complaint.service';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await requireUser();
    const complaints = await getUserComplaints(session.user.id);
    return NextResponse.json(complaints, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      return NextResponse.json({ message: error.message }, { status: error.statusCode });
    }
    console.error('Fetch User Complaints Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await requireUser();
    const parsedData = await validateRequest(req, createComplaintSchema);
    const complaint = await createComplaint(session.user.id, parsedData);

    return NextResponse.json(complaint, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      return NextResponse.json({ message: error.message }, { status: error.statusCode });
    }
    console.error('Create Complaint Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
