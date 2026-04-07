import { z } from 'zod';
import { ApiError } from '@/server/errors/api-error';

/**
 * Validates a request body using a Zod schema.
 * 
 * @param request The Next.js Request object
 * @param schema The Zod schema to validate against
 * @returns The parsed and typed data
 * @throws {ApiError} 400 error if validation fails or body cannot be parsed
 */
export async function validateRequest<T>(request: Request, schema: z.ZodType<T>): Promise<T> {
    try {
        const body = await request.json();
        const result = schema.safeParse(body);

        if (!result.success) {
            // Format Zod errors into a readable string
            const errorMessage = result.error.issues
                .map(issue => `${issue.path.join('.')}: ${issue.message}`)
                .join(', ');

            throw new ApiError(`Validation failed: ${errorMessage}`, 400);
        }

        return result.data;
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        // Handle invalid JSON parsing
        throw new ApiError('Invalid JSON format in request body', 400);
    }
}
