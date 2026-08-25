import { SignJWT, jwtVerify, type JWTPayload } from 'jose';
import AppError from '@shared/errors/AppError.js';


class JwtProvider {
    private readonly secret: Uint8Array;
    private readonly issuer: string;
    private readonly audience: string;

    constructor() {
        if (!process.env.JWT_SECRET || !process.env.JWT_ISS || !process.env.JWT_AUD) {
            throw new AppError('Missing critical JWT environment variables', "MISSING_ENV_VARS");
        }

        this.secret = new TextEncoder().encode(process.env.JWT_SECRET);
        this.issuer = process.env.JWT_ISS;
        this.audience = process.env.JWT_AUD;
    }
    
    async generateTokens(
        userId: string,
        roles: string[],
        permissions: string[]
    ) {
        const payload: JWTPayload = { roles, permissions };

        const accessToken = await new SignJWT(payload)
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setIssuer(this.issuer!)
            .setAudience(this.audience!)
            .setSubject(userId)
            .setExpirationTime(process.env.JWT_ACCESS_TTL || '15m')
            .sign(this.secret);

        const refreshToken = await new SignJWT({})
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setIssuer(this.issuer!)
            .setAudience(this.audience!)
            .setSubject(userId)
            .setExpirationTime(process.env.JWT_REFRESH_TTL || '7d')
            .sign(this.secret);

        return { accessToken, refreshToken }
    }

    async verifyToken(token: string): Promise<JWTPayload> {
        const { payload } = await jwtVerify(token, this.secret, {
            issuer: this.issuer,
            audience: this.audience,
        });

        return payload;
    }

}

export default JwtProvider;