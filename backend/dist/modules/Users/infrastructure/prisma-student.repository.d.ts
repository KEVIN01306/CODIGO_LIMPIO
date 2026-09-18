import { PrismaClient } from "@prisma/client";
import type { StudentRepository } from "../domain/student.repository.js";
export declare class PrismaStudentRepository implements StudentRepository {
    private readonly prisma;
    constructor(prisma: PrismaClient);
    findAll(params: {
        skip?: number;
        take?: number;
        q?: string;
        tenantId: string;
    }): Promise<[number, any[]]>;
    findById(id: string): Promise<any | null>;
    findByUserId(userId: string): Promise<any | null>;
    update(id: string, data: any): Promise<any>;
    delete(id: string): Promise<void>;
}
//# sourceMappingURL=prisma-student.repository.d.ts.map