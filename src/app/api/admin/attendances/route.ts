import { auth } from '@/server/auth/auth';
import { getAllAttendances } from '@/server/services/attendance.service';
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
    const attendances = await getAllAttendances();
    return NextResponse.json(attendances, { status: 200 });
  } catch (error: any) {
    console.error('Fetch All Attendances Error:', error);
    return NextResponse.json(
      { message: error.message || 'Internal Server Error' },
      { status: 500 },
    );
  }
}
