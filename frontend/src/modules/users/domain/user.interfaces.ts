export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  tenantId: string;
  createdAt: string;
  updatedAt?: string;
}
