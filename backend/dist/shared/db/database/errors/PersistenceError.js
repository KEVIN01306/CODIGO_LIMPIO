export class PersistenceError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }
}
//# sourceMappingURL=PersistenceError.js.map