import type { PersistenceError } from "../errors/PersistenceError.js";
import AppError from "../../../errors/AppError.js";
export declare class PrismaErrorMapper {
    static map(error: unknown): PersistenceError | AppError | Error;
}
//# sourceMappingURL=PrismaErrorMapper.d.ts.map