export interface Campus {
  id: string;
  tenantId: string;
  code: string;
  name: string;
  address: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateCampusDTO {
  code: string;
  name: string;
  address?: string | null;
}

export interface UpdateCampusDTO {
  code?: string;
  name?: string;
  address?: string | null;
  isActive?: boolean;
}

export interface CampusFormValues {
  code: string;
  name: string;
  address: string;
  isActive: boolean;
}
