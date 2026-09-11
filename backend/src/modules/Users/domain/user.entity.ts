export interface User {
    id: string;
    email: string;
    passwordHash: string;
    firstName: string;
    lastName: string;
    isActive: boolean;
    tenantId: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateUser extends Omit<User, 'id' | 'isActive' | 'createdAt' | 'updatedAt'> { }

export interface UpdateUser extends Partial<Omit<User, 'id' | 'isActive' | 'createdAt' | 'updatedAt'>> { }

export interface GetUser extends Omit<User, 'passwordHash'> { }

export interface GetSimpleUser extends Pick<User, 'id' | 'firstName' | 'lastName' | 'email' | 'isActive'> { }
