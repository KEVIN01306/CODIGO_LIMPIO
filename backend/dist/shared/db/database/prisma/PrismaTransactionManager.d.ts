import type { PrismaClient } from '@prisma/client';
import type { TransactionManager } from '../TransactionManager.js';
export declare class PrismaTransactionManager implements TransactionManager {
    private readonly prisma;
    constructor(prisma: PrismaClient);
    run<T>(fn: (tx: any) => Promise<T>): Promise<T>;
}
//# sourceMappingURL=PrismaTransactionManager.d.ts.map