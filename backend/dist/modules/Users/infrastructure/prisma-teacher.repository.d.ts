import { PrismaClient } from "@prisma/client";
import type { TeacherRepository } from "../domain/teacher.repository.js";
export declare class PrismaTeacherRepository implements TeacherRepository {
    private readonly prisma;
    constructor(prisma: PrismaClient);
    findAll(params: {
        skip?: number;
        take?: number;
        q?: string;
        tenantId: string;
    }): Promise<[number, any[]]>;
    findById(id: string): Promise<any | null>;
    update(id: string, data: any): Promise<any>;
    delete(id: string): Promise<void>;
}
//# sourceMappingURL=prisma-teacher.repository.d.ts.map