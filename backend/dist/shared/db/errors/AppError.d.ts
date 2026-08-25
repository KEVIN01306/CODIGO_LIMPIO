declare class AppError extends Error {
    code: string;
    statusCode: number;
    constructor(message: string, code: string, statusCode?: number);
}
export default AppError;
//# sourceMappingURL=AppError.d.ts.map