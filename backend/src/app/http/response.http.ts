import { meta, type ZodError } from "zod";

type ErrorCode = string;
type Status = "success" | "error";

interface MetaPagination {
    total: number;
    limit: number;
    offset: number;
}

class Response<T = any> {
    public readonly status: Status;
    public readonly code?: ErrorCode;
    public readonly message: string;
    public readonly data: T | null;
    public readonly count?: number;
    public readonly meta?: MetaPagination;

    private constructor(
        status: Status,
        message: string,
        data: T | null,
        code?: ErrorCode,
        meta?: MetaPagination,
    ) {
        this.status = status;
        this.message = message;
        this.data = data;
        if (code) this.code = code;

        if (meta) {
            this.meta = meta;
            if (Array.isArray(data)) this.count = data.length;
        } else if (Array.isArray(data)) {
            this.count = data.length;
        }
    };

    static success<T>(message: string, data: T): Response<T> {
        return new Response('success', message, data);
    };

    static pagination<T>(message: string, data: T[], total: number, limit: number, offset: number): Response<T[]> {
        return new Response('success', message, data, undefined, { total, limit, offset });
    }

    static error(message: string, code: ErrorCode): Response<null> {
        return new Response('error', message, null, code);
    };

    static validation(error: ZodError): Response<any> {
        const mensajeLimpio = error.issues
            .map(err => `${err.path.join('.')}: ${err.message}`)
            .join(", ");

        return new Response(
            'error',
            `Error of the validation: ${mensajeLimpio}`,
            error.flatten().fieldErrors,
            'VALIDATION_ERROR'
        );
    }
};

export default Response;