export class ApiError extends Error {
    public statusCode: number;

    constructor(message: string, statusCode: number = 500) {
        super(message);
        this.name = 'ApiError';
        this.statusCode = statusCode;

        // Set prototype explicitly for built-in Error extending to work properly in Node/TS
        Object.setPrototypeOf(this, ApiError.prototype);
    }

    static badRequest(message: string = 'Bad Request') {
        return new ApiError(message, 400);
    }

    static unauthorized(message: string = 'Unauthorized') {
        return new ApiError(message, 401);
    }

    static forbidden(message: string = 'Forbidden') {
        return new ApiError(message, 403);
    }

    static notFound(message: string = 'Not Found') {
        return new ApiError(message, 404);
    }

    static internal(message: string = 'Internal Server Error') {
        return new ApiError(message, 500);
    }
}
