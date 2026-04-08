import { auth } from '@/server/auth/auth';
import { getUserNotifications } from '@/server/services/notification.service';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const notifications = await getUserNotifications(session.user.id);
    return NextResponse.json(notifications, { status: 200 });
  } catch (error: unknown) {
    console.error('Fetch Notifications Error:', error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 },
    );
  }
}
