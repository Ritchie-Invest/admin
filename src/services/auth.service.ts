import { API_BASE_URL } from '@/lib/api';

export type AuthTokens = {
  accessToken: string;
};

export type User = {
  id: string;
  email: string;
  name: string;
};

export async function login(
  email: string,
  password: string,
): Promise<AuthTokens> {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error('Login failed');
  return res.json();
}

export async function refresh(): Promise<AuthTokens> {
  const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Refresh token failed');
  return res.json();
}

export async function logout(): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/auth/logout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Logout failed');
}

function getAccessToken(): string | null {
  return sessionStorage.getItem('accessToken');
}

export function setTokens(tokens: AuthTokens) {
  sessionStorage.setItem('accessToken', tokens.accessToken);
}

export function clearTokens() {
  sessionStorage.removeItem('accessToken');
}

let refreshPromise: Promise<AuthTokens> | null = null;

export async function refreshSafe(): Promise<AuthTokens> {
  if (!refreshPromise) {
    refreshPromise = refresh()
      .then((tokens) => {
        setTokens(tokens);
        return tokens;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

export async function fetchWithAuth(
  input: RequestInfo,
  init: RequestInit = {},
): Promise<Response> {
  if (
    typeof input === 'string' &&
    (input.includes('/auth/refresh') || input.includes('/auth/login'))
  ) {
    throw new Error(
      'fetchWithAuth ne doit pas être utilisé pour /auth/refresh ou /auth/login',
    );
  }

  let accessToken = getAccessToken();

  if (!accessToken) {
    try {
      await refreshSafe();
      accessToken = getAccessToken();
    } catch (e) {
      clearTokens();
      window.location.href = '/login';
      throw new Error('Session expirée');
    }
  }

  if (!accessToken) {
    throw new Error('Not authenticated');
  }

  const baseHeaders =
    init.headers &&
    !(init.headers instanceof Headers) &&
    !Array.isArray(init.headers)
      ? { ...init.headers }
      : {};

  const authInit: RequestInit = {
    ...init,
    headers: {
      ...baseHeaders,
      Authorization: `Bearer ${accessToken}`,
    },
    credentials: 'include',
  };

  let res = await fetch(input, authInit);

  if (res.status === 401) {
    try {
      await refreshSafe();
      accessToken = getAccessToken();
    } catch (e) {
      clearTokens();
      window.location.href = '/login';
      throw new Error('Session expirée');
    }

    const retryInit: RequestInit = {
      ...authInit,
      headers: {
        ...baseHeaders,
        Authorization: `Bearer ${accessToken}`,
      },
    };

    res = await fetch(input, retryInit);
  }

  return res;
}
