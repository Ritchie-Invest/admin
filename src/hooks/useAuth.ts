import {
  login as loginApi,
  logout as logoutApi,
  fetchWithAuth,
  setTokens,
  clearTokens,
  refreshSafe,
  getAccessToken,
} from '@/services/auth.service';
import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useAuth() {
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    const accessToken = getAccessToken();
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

  const loginMutation = useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const tokens = await loginApi(data.email, data.password);
      setTokens(tokens.accessToken);
      setIsAuthenticated(true);
      setAuthChecked(true);
      return tokens;
    },
    onSuccess: () => {
      queryClient.clear();
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await logoutApi();
      clearTokens();
      setIsAuthenticated(false);
      setAuthChecked(true);
    },
    onSuccess: () => {
      queryClient.clear();
    },
  });

  return {
    authChecked,
    isAuthenticated,
    login: (email: string, password: string) =>
      loginMutation.mutateAsync({ email, password }),
    logout: () => logoutMutation.mutateAsync(),
    loginStatus: loginMutation.status,
    loginError: loginMutation.error,
    logoutStatus: logoutMutation.status,
    logoutError: logoutMutation.error,
    fetchProtected: fetchWithAuth,
  };
}
