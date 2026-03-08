import { auth } from '@/server/auth/auth';
import { getAllComplaints } from '@/server/services/complaint.service';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const session = await auth();
    if (
      !session ||
      (session.user.role !== 'ADMIN' && session.user.role !== 'OWNER')
    ) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const complaints = await getAllComplaints();
    return NextResponse.json(complaints, { status: 200 });
  } catch (error: any) {
    console.error('Fetch All Complaints Error:', error);
    return NextResponse.json(
      { message: error.message || 'Internal Server Error' },
      { status: 500 },
    );
  }
}
