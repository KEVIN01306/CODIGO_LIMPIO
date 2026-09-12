import { useEffect, useRef, useState } from 'react';
import { useAuthStore } from '../store/auth.store';
import { refreshAccessToken } from '../api/axios.config';

/**
 * Centralized authentication initialization hook.
 * Runs once on application startup to recover the session from the refresh token cookie.
 */
export const useAuthInitialization = () => {
  const { status, clearAuth } = useAuthStore();
  const [isInitialized, setIsInitialized] = useState(false);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const initializeAuth = async () => {
      try {
        await refreshAccessToken();
      } catch {
        // Refresh token failed, expired, or not present
        clearAuth();
      } finally {
        setIsInitialized(true);
      }
    };

    initializeAuth();
  }, [clearAuth]);

  return { isInitialized, status };
};
