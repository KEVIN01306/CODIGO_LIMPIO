export type AuditAction = 'LOGIN' | 'LOGOUT' | 'CREATE' | 'UPDATE' | 'DELETE';
export interface AuditLog {
    id: string;
    userId: string | null;
    action: AuditAction;
    resource: string;
    resourceId: string | null;
    details: any | null;
    createdAt: Date;
}
export interface CreateAuditLog {
    userId?: string | null;
    action: AuditAction;
    resource: string;
    resourceId?: string | null;
    details?: any;
}
//# sourceMappingURL=audit-log.entity.d.ts.map