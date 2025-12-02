import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { setCookie, getCookie, deleteCookie } from 'cookies-next';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt?: string;
  googleId?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  refreshToken: string | null;
  error: string | null;
}

interface AuthActions {
  setUser: (user: User) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  setTokens: (token: string, refreshToken: string) => void;
  login: (user: User, token: string, refreshToken: string) => void;
  logout: () => void;
}

type AuthStore = AuthState & AuthActions;

// Cookie storage implementation
const cookieStorage = {
  getItem: (name: string): string | null => {
    try {
      const cookie = getCookie(name);
      return cookie ? String(cookie) : null;
    } catch {
      return null;
    }
  },
  setItem: (name: string, value: string): void => {

    setCookie(name, value, {
      maxAge: name === 'userData' ? 3600 : 7 * 24 * 60 * 60, // 1 hour for access token, 7 days for others
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

  },
  removeItem: (name: string): void => {
    deleteCookie(name);

  },
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      token: null,
      refreshToken: null,
      error: null,

      // Actions
      setUser: (user: User) => {
        set({ user });
        setCookie('userDataEmail', user.email, {
          maxAge: 7 * 24 * 60 * 60,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
        });
      },

      setIsAuthenticated: (isAuthenticated: boolean) => {
        set({ isAuthenticated });
        setCookie('isAuthenticated', String(isAuthenticated), {
          maxAge: 7 * 24 * 60 * 60,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
        });
      },

      setTokens: (token: string, refreshToken: string) => {
        set({ token, refreshToken });
        setCookie('userData', token, {
          maxAge: 3600, // 1 hour for access token
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
        });
        setCookie('userDataRefresh', refreshToken, {
          maxAge: 7 * 24 * 60 * 60, // 7 days for refresh token
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
        });
      },


      login: (user: User, token: string, refreshToken: string) => {
        const { setUser, setIsAuthenticated, setTokens } = get();
        setUser(user);
        setTokens(token, refreshToken);
        setIsAuthenticated(true);
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          token: null,
          refreshToken: null,
          error: null,
        });
        deleteCookie('userData');
        deleteCookie('userDataRefresh');
        deleteCookie('userDataEmail');
        deleteCookie('userDataId');
        deleteCookie('isAuthenticated');
        try {
          localStorage.removeItem('auth-storage');
        } catch {
          return null
        }
      },

    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => cookieStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        token: state.token,
        refreshToken: state.refreshToken,
      }),
    }
  )
);

// Helper hook for checking authentication status
export const useAuth = () => {
  const { user, isAuthenticated, token, error } = useAuthStore();
  return {
    user,
    isAuthenticated,
    error,
    isLoggedIn: isAuthenticated && !!user && !!token,
  };
};

// Helper function to get auth headers for API calls
export const getAuthHeaders = () => {
  const token = useAuthStore.getState().token;
  return token
    ? {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'X-Platform': 'website',
    }
    : {
      'Content-Type': 'application/json',
      'X-Platform': 'website',
    };
};