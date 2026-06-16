import {
  createContext,
  createElement,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  ACCESS_TOKEN_STORAGE_KEY,
  clearAuthStorage,
  getAuthStorage,
  REFRESH_TOKEN_STORAGE_KEY,
  USER_STORAGE_KEY,
} from '@/services/authStorage';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: AuthUser, accessToken: string, refreshToken?: string, keepLoggedIn?: boolean) => void;
  logout: () => void;
  updateUser: (patch: Partial<AuthUser>) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const raw = localStorage.getItem(USER_STORAGE_KEY) || sessionStorage.getItem(USER_STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return !!localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY) || !!sessionStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
  });

  const login = useCallback((userData: AuthUser, accessToken: string, refreshToken?: string, keepLoggedIn = false) => {
    const storage = keepLoggedIn ? localStorage : sessionStorage;
    clearAuthStorage();
    storage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
    storage.setItem(ACCESS_TOKEN_STORAGE_KEY, accessToken);
    if (refreshToken) {
      storage.setItem(REFRESH_TOKEN_STORAGE_KEY, refreshToken);
    }
    setUser(userData);
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(() => {
    clearAuthStorage();
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const updateUser = useCallback((patch: Partial<AuthUser>) => {
    setUser(prev => {
      if (!prev) return null;
      const updated = { ...prev, ...patch };
      getAuthStorage().setItem(USER_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated,
      isLoading: false,
      login,
      logout,
      updateUser,
    }),
    [user, isAuthenticated, login, logout, updateUser]
  );

  return createElement(AuthContext.Provider, { value }, children);
}

export function useAuthData() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthData must be used within an AuthProvider');
  }
  return context;
}

