export class AuditMapper {
    static toDomain(log) {
        return {
            id: log.id,
            userId: log.userId,
            action: log.action,
            resource: log.resource,
            resourceId: log.resourceId,
            details: log.details,
            createdAt: log.createdAt
        };
    }
}
//# sourceMappingURL=audit.mapper.js.map