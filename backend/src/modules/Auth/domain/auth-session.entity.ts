

export interface AuthSession {
    id: string;
    token: string;
    userId: string;
    expiresAt: Date;
    createdAt: Date;
}