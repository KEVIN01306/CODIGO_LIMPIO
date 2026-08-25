import type { HashProvider } from "../domain/hash.provider.js";
export declare class Argon2HashProvider implements HashProvider {
    hash(payload: string): Promise<string>;
    compare(payload: string, hashed: string): Promise<boolean>;
}
//# sourceMappingURL=argon2-hash.provider.d.ts.map