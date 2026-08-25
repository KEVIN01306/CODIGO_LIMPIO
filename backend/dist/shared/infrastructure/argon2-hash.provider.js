import bcrypt from "argon2";
export class Argon2HashProvider {
    async hash(payload) {
        return bcrypt.hash(payload);
    }
    async compare(payload, hashed) {
        const plainValue = payload.trim();
        const storedValue = hashed.trim();
        if (!storedValue) {
            return false;
        }
        if (!storedValue.startsWith('$')) {
            return storedValue === plainValue;
        }
        try {
            return await bcrypt.verify(storedValue, plainValue);
        }
        catch {
            return false;
        }
    }
}
//# sourceMappingURL=argon2-hash.provider.js.map