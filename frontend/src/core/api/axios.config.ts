import axios, { type InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '../store/auth.store';
import { handleApiError } from './api-error-handler';
import type { AuthUser } from '../../modules/auth/domain/auth.interfaces';

const baseURL = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) || 'http://localhost:8000';

/**
 * Public Axios client: used for login, refresh, logout, and other unauthenticated endpoints.
 * Never attaches Authorization headers and never triggers the refresh interceptor.
 */
export const publicApi = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Shared in-flight refresh promise to prevent simultaneous refresh requests (Requirement 9).
 */
let refreshPromise: Promise<string> | null = null;

export const refreshAccessToken = async (): Promise<string> => {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      try {
        const response = await publicApi.post<{
          status: string;
          message: string;
          data: {
            accessToken: string;
            user?: AuthUser;
          };
        }>('/auth/refresh');

        const newAccessToken = response.data?.data?.accessToken;
        if (!newAccessToken) {
          throw new Error('No access token returned from refresh endpoint');
        }

        let user = response.data?.data?.user;

        // Missing user recovery: if refresh endpoint didn't provide user, fetch from /auth/me (Requirement 11)
        if (!user) {
          const profileResponse = await publicApi.get<{
            status: string;
            message: string;
            data: AuthUser;
          }>('/auth/me', {
            headers: {
              Authorization: `Bearer ${newAccessToken}`,
            },
          });
          user = profileResponse.data?.data;
        }

        if (user) {
          useAuthStore.getState().setAuth(user, newAccessToken);
        } else {
          useAuthStore.getState().setAccessToken(newAccessToken);
        }

        return newAccessToken;
      } catch (error) {
        useAuthStore.getState().clearAuth();
        throw error;
      }
    })().finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
};

/**
 * Authenticated Axios client: used for protected endpoints.
 * Automatically attaches Authorization header from in-memory store.
 * Automatically catches TOKEN_EXPIRED errors, refreshes the token, and retries the original request once.
 */
const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  let token = useAuthStore.getState().accessToken;

  // Missing access token recovery: if no token in memory and user is not unauthenticated (Requirement 10)
  if (!token) {
    const status = useAuthStore.getState().status;
    if (status !== 'unauthenticated') {
      try {
        token = await refreshAccessToken();
      } catch {
        return Promise.reject(new axios.Cancel('Authentication recovery failed. No access token available.'));
      }
    }
  }

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (config.data instanceof FormData && config.headers) {
    delete config.headers['Content-Type'];
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (
      axios.isCancel(error) ||
      error?.code === 'ERR_CANCELED' ||
      error?.name === 'CanceledError' ||
      (typeof DOMException !== 'undefined' && error instanceof DOMException && error.name === 'AbortError')
    ) {
      return Promise.reject(error);
    }

    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    const status = error.response?.status;
    const backendCode = error.response?.data?.code;

    // TOKEN_EXPIRED handling (Requirements 6, 7, 8, 20, 22)
    if (status === 401 && backendCode === 'TOKEN_EXPIRED') {
      if (originalRequest && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const newAccessToken = await refreshAccessToken();
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          }
          return api(originalRequest);
        } catch (refreshError) {
          useAuthStore.getState().clearAuth();
          return Promise.reject(refreshError);
        }
      } else {
        // Request already retried once and expired again — prevent infinite loop (Requirements 8, 22)
        useAuthStore.getState().clearAuth();
        return Promise.reject(error);
      }
    }

    // Other 401 errors (e.g. INVALID_TOKEN, UNAUTHORIZED) (Requirement 21)
    if (status === 401) {
      if (backendCode !== 'INVALID_CREDENTIALS') {
        useAuthStore.getState().clearAuth();
      }
    }

    handleApiError(error);
    return Promise.reject(error);
  }
);

export default api;
