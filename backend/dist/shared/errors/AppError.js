class AppError extends Error {
    code;
    statusCode;
    constructor(message, code, statusCode = 400) {
        super(message);
        this.code = code;
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, AppError.prototype);
    }
}
export default AppError;
//# sourceMappingURL=AppError.js.map