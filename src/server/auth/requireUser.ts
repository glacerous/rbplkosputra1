import { auth } from '@/server/auth/auth';
import { ApiError } from '@/server/errors/api-error';

/**
 * Ensures there is an active session for the current request.
 * Use this in API routes to protect endpoints from unauthorized access.
 * 
 * @returns The active session object
 * @throws {ApiError} 401 error if no session exists
 */
export async function requireUser() {
    const session = await auth();

    if (!session || !session.user) {
        throw ApiError.unauthorized('Sesi telah berakhir atau Anda belum login.');
    }

    return session;
}
