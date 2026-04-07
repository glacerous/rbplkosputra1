import { NextResponse } from 'next/server';
import { requireRole } from '@/server/guards/requireRole';
import { getMonthlyFinanceSummary } from '@/server/services/finance.service';

export async function GET(request: Request) {
    try {
        // 1. Role-based access control (WAJIB)
        await requireRole(['OWNER']);

        // 2. Query param handling
        const { searchParams } = new URL(request.url);
        const yearStr = searchParams.get('year');
        const year = yearStr ? parseInt(yearStr) : new Date().getFullYear();

        // 3. Service call
        const data = await getMonthlyFinanceSummary(year);

        return NextResponse.json(data);
    } catch (error: any) {
        console.error('API Error in /api/owner/finance:', error);

        if (error.message.includes('Unauthorized') || error.message.includes('Forbidden')) {
            return NextResponse.json({ error: error.message }, { status: 403 });
        }

        return NextResponse.json(
            { error: 'Gagal memproses laporan keuangan' },
            { status: 500 }
        );
    }
}
