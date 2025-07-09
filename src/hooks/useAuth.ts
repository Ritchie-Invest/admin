import {
  login as loginApi,
  logout as logoutApi,
  fetchWithAuth,
  setTokens,
  clearTokens,
  getRefreshToken,
  refreshSafe,
} from '@/services/auth.service';
import { useCallback, useEffect, useState } from 'react';

export function useAuth() {
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const accessToken = sessionStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

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
    } else if (refreshToken) {
      tryRefresh();
    } else {
      setAuthChecked(true);
      setIsAuthenticated(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const tokens = await loginApi(email, password);
    setTokens(tokens);
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(async () => {
    const refreshToken = getRefreshToken();
    if (refreshToken) await logoutApi(refreshToken);
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
