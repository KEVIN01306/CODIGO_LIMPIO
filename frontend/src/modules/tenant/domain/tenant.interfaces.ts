export interface TenantConfiguration {
  id: string;
  slug: string;
  name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateTenantDTO {
  name?: string;
  slug?: string;
  isActive?: boolean;
}

export interface SebConfiguration {
  defaultSebConfigKey: string | null;
}

export interface UpdateSebConfigDTO {
  defaultSebConfigKey: string | null;
}

export interface TenantInfoFormValues {
  name: string;
  slug: string;
  isActive: boolean;
}

export interface SebConfigFormValues {
  defaultSebConfigKey: string;
}
