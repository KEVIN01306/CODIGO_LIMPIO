export class PrismaTransactionManager {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async run(fn) {
        return await this.prisma.$transaction(async (tx) => {
            return await fn(tx);
        }, { maxWait: 10000, timeout: 30000 });
    }
}
//# sourceMappingURL=PrismaTransactionManager.js.map