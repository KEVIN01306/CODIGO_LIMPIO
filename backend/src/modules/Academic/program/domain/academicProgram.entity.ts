export interface AcademicProgram {
    id: string;
    tenantId: string;
    code: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateAcademicProgram extends Omit<AcademicProgram, 'id' | 'createdAt' | 'updatedAt'> {}

export interface UpdateAcademicProgram extends Partial<Omit<AcademicProgram, 'id' | 'tenantId' | 'createdAt' | 'updatedAt'>> {}

export interface GetAcademicProgram extends AcademicProgram {}

export interface GetSimpleAcademicProgram extends Pick<AcademicProgram, 'id' | 'code' | 'name' | 'createdAt'> {}
