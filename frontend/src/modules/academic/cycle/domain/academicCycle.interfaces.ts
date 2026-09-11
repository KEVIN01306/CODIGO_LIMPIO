import type { Campus } from '../../campus/domain/campus.interfaces';

export interface AcademicCycle {
  id: string;
  campusId: string;
  name: string;
  year: number;
  order: number;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  createdAt: string;
  updatedAt?: string;
  campus?: Campus;
}

export interface CreateAcademicCycleDTO {
  campusId: string;
  name: string;
  year: number;
  order: number;
  startDate: string;
  endDate: string;
  isCurrent?: boolean;
}

export interface UpdateAcademicCycleDTO {
  campusId?: string;
  name?: string;
  year?: number;
  order?: number;
  startDate?: string;
  endDate?: string;
  isCurrent?: boolean;
}

export interface AcademicCycleFormValues {
  campusId: string;
  name: string;
  year: number;
  order: number;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
}
