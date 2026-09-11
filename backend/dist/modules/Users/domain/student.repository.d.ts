export interface StudentRepository {
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
//# sourceMappingURL=student.repository.d.ts.map