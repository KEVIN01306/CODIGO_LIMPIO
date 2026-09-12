import { create } from 'zustand';
import type { AuthUser } from '../../modules/auth/domain/auth.interfaces';

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

export interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  status: AuthStatus;
  isAuthenticated: boolean;

  setAuth: (user: AuthUser, accessToken: string) => void;
  setUser: (user: AuthUser) => void;
  setAccessToken: (accessToken: string) => void;
  setStatus: (status: AuthStatus) => void;
  clearAuth: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  status: 'loading',
  isAuthenticated: false,

  setAuth: (user: AuthUser, accessToken: string) =>
    set({
      user,
      accessToken,
      status: 'authenticated',
      isAuthenticated: true,
    }),

  setUser: (user: AuthUser) =>
    set((state) => ({
      user,
      status: state.accessToken ? 'authenticated' : state.status,
      isAuthenticated: !!state.accessToken,
    })),

  setAccessToken: (accessToken: string) =>
    set((state) => ({
      accessToken,
      status: state.user ? 'authenticated' : state.status,
      isAuthenticated: !!state.user,
    })),

  setStatus: (status: AuthStatus) =>
    set({
      status,
      isAuthenticated: status === 'authenticated',
    }),

  clearAuth: () =>
    set({
      user: null,
      accessToken: null,
      status: 'unauthenticated',
      isAuthenticated: false,
    }),

  logout: () =>
    set({
      user: null,
      accessToken: null,
      status: 'unauthenticated',
      isAuthenticated: false,
    }),
}));
