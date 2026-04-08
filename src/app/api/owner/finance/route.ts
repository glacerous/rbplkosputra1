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
    } catch (error: unknown) {
        console.error('API Error in /api/owner/finance:', error);

        const errorMessage = error instanceof Error ? error.message : 'Unknown error';

        if (errorMessage.includes('Unauthorized') || errorMessage.includes('Forbidden')) {
            return NextResponse.json({ error: errorMessage }, { status: 403 });
        }

        return NextResponse.json(
            { error: 'Gagal memproses laporan keuangan' },
            { status: 500 }
        );
    }
}
