import { type ZodError } from "zod";
type ErrorCode = string;
type Status = "success" | "error";
interface MetaPagination {
    total: number;
    limit: number;
    offset: number;
}
declare class Response<T = any> {
    readonly status: Status;
    readonly code?: ErrorCode;
    readonly message: string;
    readonly data: T | null;
    readonly count?: number;
    readonly meta?: MetaPagination;
    private constructor();
    static success<T>(message: string, data: T): Response<T>;
    static pagination<T>(message: string, data: T[], total: number, limit: number, offset: number): Response<T[]>;
    static error(message: string, code: ErrorCode): Response<null>;
    static validation(error: ZodError): Response<any>;
}
export default Response;
//# sourceMappingURL=response.http.d.ts.map