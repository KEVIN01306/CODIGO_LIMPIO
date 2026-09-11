export interface Campus {
    id: string;
    tenantId: string;
    code: string;
    name: string;
    address: string | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateCampus extends Omit<Campus, 'id' | 'isActive' | 'createdAt' | 'updatedAt'> {}

export interface UpdateCampus extends Partial<Omit<Campus, 'id' | 'tenantId' | 'createdAt' | 'updatedAt'>> {}

export interface GetCampus extends Campus {}

export interface GetSimpleCampus extends Pick<Campus, 'id' | 'tenantId' | 'code' | 'name' | 'address' | 'isActive' | 'createdAt'> {}
