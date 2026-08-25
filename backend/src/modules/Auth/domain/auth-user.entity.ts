export interface AuthUser {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    passwordHash: string;
    isActive: boolean;
    permissions: string[];
    roles: string[];
}