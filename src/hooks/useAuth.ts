import {
  login as loginApi,
  logout as logoutApi,
  fetchWithAuth,
  setTokens,
  clearTokens,
  refreshSafe,
} from '@/services/auth.service';
import { useCallback, useEffect, useState } from 'react';

export function useAuth() {
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const accessToken = sessionStorage.getItem('accessToken');

    const tryRefresh = async () => {
      try {
        await refreshSafe();
        setIsAuthenticated(true);
      } catch {
        clearTokens();
        setIsAuthenticated(false);
      } finally {
        setAuthChecked(true);
      }
    };

    if (accessToken) {
      setIsAuthenticated(true);
      setAuthChecked(true);
    } else {
      tryRefresh();
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    console.log('Logging in with', { email, password });
    const tokens = await loginApi(email, password);
    setTokens(tokens);
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(async () => {
    await logoutApi();
    clearTokens();
    setIsAuthenticated(false);
  }, []);

  return {
    login,
    logout,
    authChecked,
    isAuthenticated,
    fetchProtected: fetchWithAuth,
  };
}
