import type { Campus } from './campus.interfaces';
import type { AcademicProgram } from './academicProgram.interfaces';

export interface Cohort {
  id: string;
  campusId: string;
  programId: string;
  name: string;
  startYear: number;
  createdAt: string;
  updatedAt?: string;
  campus?: Campus;
  program?: AcademicProgram;
}

export interface CreateCohortDTO {
  campusId: string;
  programId: string;
  name: string;
  startYear: number;
}

export interface UpdateCohortDTO {
  campusId?: string;
  programId?: string;
  name?: string;
  startYear?: number;
}

export interface CohortFormValues {
  campusId: string;
  programId: string;
  name: string;
  startYear: number;
}
