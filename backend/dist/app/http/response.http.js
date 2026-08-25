class Response {
    status;
    code;
    message;
    data;
    count;
    meta;
    constructor(status, message, data, code, meta) {
        this.status = status;
        this.message = message;
        this.data = data;
        if (code)
            this.code = code;
        if (meta) {
            this.meta = meta;
            if (Array.isArray(data))
                this.count = data.length;
        }
        else if (Array.isArray(data)) {
            this.count = data.length;
        }
    }
    ;
    static success(message, data) {
        return new Response('success', message, data);
    }
    ;
    static pagination(message, data, total, limit, offset) {
        return new Response('success', message, data, undefined, { total, limit, offset });
    }
    static error(message, code) {
        return new Response('error', message, null, code);
    }
    ;
    static validation(error) {
        const mensajeLimpio = error.issues
            .map(err => `${err.path.join('.')}: ${err.message}`)
            .join(", ");
        return new Response('error', `Error of the validation: ${mensajeLimpio}`, error.flatten().fieldErrors, 'VALIDATION_ERROR');
    }
}
;
export default Response;
//# sourceMappingURL=response.http.js.map