import { type JWTPayload } from 'jose';
declare class JwtProvider {
    private readonly secret;
    private readonly issuer;
    private readonly audience;
    constructor();
    generateTokens(userId: string, roles: string[], permissions: string[], tenantId: string, campusId?: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    verifyToken(token: string): Promise<JWTPayload>;
}
export default JwtProvider;
//# sourceMappingURL=jwt.provider.d.ts.map