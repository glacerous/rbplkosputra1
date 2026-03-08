import { auth } from '@/server/auth/auth';
import {
  submitAttendance,
  submitAttendanceSchema,
  getCleanerAttendances,
} from '@/server/services/attendance.service';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const body = await req.json();
    const parsed = submitAttendanceSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { message: parsed.error.issues[0]?.message ?? 'Validasi gagal' },
        { status: 400 },
      );
    }
    const attendance = await submitAttendance(session.user.id, parsed.data);
    return NextResponse.json(attendance, { status: 201 });
  } catch (error: any) {
    console.error('Submit Attendance Error:', error);
    return NextResponse.json(
      { message: error.message || 'Internal Server Error' },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const attendances = await getCleanerAttendances(session.user.id);
    return NextResponse.json(attendances, { status: 200 });
  } catch (error: any) {
    console.error('Fetch Attendances Error:', error);
    return NextResponse.json(
      { message: error.message || 'Internal Server Error' },
      { status: 500 },
    );
  }
}
