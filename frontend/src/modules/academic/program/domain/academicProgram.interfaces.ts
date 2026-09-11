export interface AcademicProgram {
  id: string;
  tenantId: string;
  code: string;
  name: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateAcademicProgramDTO {
  code: string;
  name: string;
}

export interface UpdateAcademicProgramDTO {
  code?: string;
  name?: string;
}

export interface AcademicProgramFormValues {
  code: string;
  name: string;
}
