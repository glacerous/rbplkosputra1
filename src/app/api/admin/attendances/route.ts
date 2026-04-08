import { auth } from '@/server/auth/auth';
import { getAllAttendances } from '@/server/services/attendance.service';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await auth();
    if (
      !session ||
      (session.user.role !== 'ADMIN' && session.user.role !== 'OWNER')
    ) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const attendances = await getAllAttendances();
    return NextResponse.json(attendances, { status: 200 });
  } catch (error: unknown) {
    console.error('Fetch All Attendances Error:', error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 },
    );
  }
}
