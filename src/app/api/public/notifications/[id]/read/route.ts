import { auth } from '@/server/auth/auth';
import { markNotificationRead } from '@/server/services/notification.service';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const { id } = await params;
    const notification = await markNotificationRead(id, session.user.id);
    return NextResponse.json(notification, { status: 200 });
  } catch (error: unknown) {
    console.error('Mark Notification Read Error:', error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 },
    );
  }
}
