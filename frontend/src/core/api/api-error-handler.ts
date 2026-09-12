import { toast } from "react-toastify";
import { useAuthStore } from "../store/auth.store";

const isAbortError = (error: any) => {
    if (!error) return false;
    if (typeof error === 'object') {
        return error.name === 'CanceledError' || error.code === 'ERR_CANCELED' || (error instanceof DOMException && error.name === 'AbortError');
    }
    return false;
};

export const handleApiError = (error: any) => {
    if (isAbortError(error)) {
        return;
    }

    const status = error.response?.status;
    const data = error.response?.data;
    const backendMessage = error.response?.data?.message || "Error inesperado";
    const backendCode = data?.code;

    const errorMessages: Record<number, { title: string; desc?: string }> = {
        403: { title: "Acceso denegado", desc: "No tienes permisos para esto." },
        404: { title: "No encontrado", desc: "El recurso solicitado no existe." },
        500: { title: "Error de servidor", desc: "Lo sentimos, hubo un fallo interno." },
    };

    if (status === 403 && backendCode === 'LIMIT_EXCEEDED') {
        toast.error(`${"Límite alcanzado"}\n${backendMessage}`);
        return;
    }

    if (status === 401) {
        if (backendCode === "TOKEN_EXPIRED") {
            toast.error(`Sesión expirada\nTu sesión ha caducado por seguridad. Inicia sesión de nuevo.`);
            useAuthStore.getState().clearAuth();
            return;
        }

        if (backendCode === "INVALID_CREDENTIALS") {
            toast.error(`Error de acceso\nEl correo o la contraseña son incorrectos.`);
            return;
        }

        toast.error(`No autorizado\nDebes iniciar sesión.`);
        useAuthStore.getState().clearAuth();
        return;
    }

    const errorDetail = errorMessages[status] || { title: backendMessage, desc: undefined };

    toast.error(errorDetail.desc ? `${errorDetail.title}\n${errorDetail.desc}` : errorDetail.title);
};