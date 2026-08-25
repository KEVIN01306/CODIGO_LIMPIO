import { PersistenceError } from "./PersistenceError.js";
export class DatabaseError extends PersistenceError {
    constructor(message = 'Database error') {
        super(message);
        this.name = "DatabaseError";
    }
}
//# sourceMappingURL=DatabaseError.js.map