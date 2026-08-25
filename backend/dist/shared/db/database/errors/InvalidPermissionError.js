import { PersistenceError } from "./PersistenceError.js";
export class InvalidPermissionError extends PersistenceError {
    constructor(message = 'Permiso inválido para el negocio') {
        super(message);
    }
}
//# sourceMappingURL=InvalidPermissionError.js.map