import { expect, test, describe, vi } from 'vitest';
import { GET } from '@/app/api/owner/finance/route';
import { auth } from '@/server/auth/auth';
import { prisma } from '@/server/db/prisma';

// Mock auth
vi.mock('@/server/auth/auth', () => ({
    auth: vi.fn(),
}));

// Mock prisma
vi.mock('@/server/db/prisma', () => ({
    prisma: {
        payment: {
            findMany: vi.fn(),
        },
    },
}));

describe('GET /api/owner/finance', () => {
    test('returns 403 if user is not OWNER', async () => {
        // Setup mock non-owner user
        (auth as any).mockResolvedValueOnce({
            user: { id: 'user1', role: 'ADMIN' },
        });

        // Mock request object (using URL for query params)
        const req = new Request('http://localhost/api/owner/finance');
        const response = await GET(req);

        expect(response.status).toBe(403);
    });

    test('returns 200 and expected data shape if user is OWNER', async () => {
        // Setup mock owner
        (auth as any).mockResolvedValueOnce({
            user: { id: 'owner1', role: 'OWNER' },
        });

        // Setup mock pristine data from DB
        (prisma.payment.findMany as any).mockResolvedValueOnce([
            {
                id: '1',
                amount: 500000,
                confirmedAt: new Date('2026-01-15T00:00:00Z'),
                status: 'CONFIRMED',
            },
            {
                id: '2',
                amount: 600000,
                confirmedAt: new Date('2026-02-15T00:00:00Z'),
                status: 'CONFIRMED',
            },
        ]);

        // Mock request
        const req = new Request('http://localhost/api/owner/finance?year=2026');
        const response = await GET(req);

        expect(response.status).toBe(200);
        const data = await response.json();

        // Verify response shape
        expect(Array.isArray(data)).toBe(true);
        expect(data.length).toBe(12);
        expect(data[0].total).toBe(500000); // Jan
        expect(data[1].total).toBe(600000); // Feb
        expect(data[2].total).toBe(0); // Mar
    });
});
