import { useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';
import { User } from '../types';

interface UseAuthReturn {
  user: User | null;
  isLoading: boolean;
  login: (userData: User) => void;
  register: (userData: User) => void;
  logout: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
}

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuthStatus = useCallback(async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error('Auth check error:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback((userData: User) => {
    setUser(userData);
  }, []);

  const register = useCallback((userData: User) => {
    setUser(userData);
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
  }, []);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  return {
    user,
    isLoading,
    login,
    register,
    logout,
    checkAuthStatus,
  };
}; 