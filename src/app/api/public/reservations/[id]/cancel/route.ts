import { auth } from '@/server/auth/auth';
import { cancelReservation } from '@/server/services/reservation.service';
import { NextResponse } from 'next/server';

export async function PATCH(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await cancelReservation(id, session.user.id);

    return NextResponse.json(
      { message: 'Reservasi berhasil dibatalkan' },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Internal Server Error' },
      { status: 400 },
    );
  }
}
