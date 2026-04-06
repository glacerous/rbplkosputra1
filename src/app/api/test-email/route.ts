import { sendReservationEmail } from '@/server/email/resend';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
    if (process.env.NODE_ENV !== 'development') {
        return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    try {
        const testTarget = process.env.TEST_EMAIL || 'azzakyraihan@gmail.com';

        console.log('[Test Email API] Triggering test email to:', testTarget);

        await sendReservationEmail({
            to: testTarget,
            customerName: 'Test User',
        });

        return NextResponse.json({
            status: 'success',
            message: `Email test triggered to ${testTarget}. Check inbox/spam.`
        });
    } catch (error: any) {
        console.error('[Test Email API] Error:', error);
        return NextResponse.json({
            status: 'error',
            message: error.message
        }, { status: 500 });
    }
}
