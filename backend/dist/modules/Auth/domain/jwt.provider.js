import { SignJWT, jwtVerify } from 'jose';
import AppError from '../../../shared/errors/AppError.js';
class JwtProvider {
    secret;
    issuer;
    audience;
    constructor() {
        if (!process.env.JWT_SECRET || !process.env.JWT_ISS || !process.env.JWT_AUD) {
            throw new AppError('Missing critical JWT environment variables', "MISSING_ENV_VARS");
        }
        this.secret = new TextEncoder().encode(process.env.JWT_SECRET);
        this.issuer = process.env.JWT_ISS;
        this.audience = process.env.JWT_AUD;
    }
    async generateTokens(userId, roles, permissions, tenantId, campusId) {
        const payload = { roles, permissions, tenantId, campusId };
        const accessToken = await new SignJWT(payload)
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setIssuer(this.issuer)
            .setAudience(this.audience)
            .setSubject(userId)
            .setExpirationTime(process.env.JWT_ACCESS_TTL || '15m')
            .sign(this.secret);
        const refreshToken = await new SignJWT({})
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setIssuer(this.issuer)
            .setAudience(this.audience)
            .setSubject(userId)
            .setExpirationTime(process.env.JWT_REFRESH_TTL || '7d')
            .sign(this.secret);
        return { accessToken, refreshToken };
    }
    async verifyToken(token) {
        const { payload } = await jwtVerify(token, this.secret, {
            issuer: this.issuer,
            audience: this.audience,
        });
        return payload;
    }
}
export default JwtProvider;
//# sourceMappingURL=jwt.provider.js.map