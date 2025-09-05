import { buildApiUrl } from '@/lib/api';

export type AuthTokens = {
  accessToken: string;
};

export type User = {
  id: string;
  email: string;
  name: string;
};

function getAccessToken(): string | null {
  return sessionStorage.getItem('accessToken');
}

function setAccessToken(token: string) {
  sessionStorage.setItem('accessToken', token);
}

function clearAccessToken() {
  sessionStorage.removeItem('accessToken');
}

export async function login(
  email: string,
  password: string,
): Promise<AuthTokens> {
  const res = await fetch(buildApiUrl('/auth/login'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error('Login failed');
  return res.json();
}

export async function refresh(): Promise<AuthTokens> {
  const res = await fetch(buildApiUrl('/auth/refresh'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Refresh token failed');
  return res.json();
}

export async function logout(): Promise<void> {
  const res = await fetch(buildApiUrl('/auth/logout'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Logout failed');
}

let refreshPromise: Promise<AuthTokens> | null = null;

export async function refreshSafe(): Promise<AuthTokens> {
  if (!refreshPromise) {
    refreshPromise = refresh()
      .then((tokens) => {
        setAccessToken(tokens.accessToken);
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
  // Normalisation si URL relative (pas de schéma)
  let finalInput: RequestInfo = input;
  if (typeof finalInput === 'string' && !/^https?:\/\//i.test(finalInput)) {
    finalInput = buildApiUrl(
      finalInput.startsWith('/') ? finalInput : `/${finalInput}`,
    );
  }

  let accessToken = getAccessToken();

  async function doFetch(token: string | null) {
    const baseHeaders =
      init.headers &&
      !(init.headers instanceof Headers) &&
      !Array.isArray(init.headers)
        ? { ...init.headers }
        : {};
    return fetch(finalInput, {
      ...init,
      headers: {
        ...baseHeaders,
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
    });
  }

  if (!accessToken) {
    try {
      await refreshSafe();
      accessToken = getAccessToken();
    } catch {
      clearAccessToken();
      window.location.href = '/login';
      throw new Error('Session expirée');
    }
  }

  let res = await doFetch(accessToken);

  if (res.status === 401) {
    try {
      await refreshSafe();
      accessToken = getAccessToken();
    } catch {
      clearAccessToken();
      window.location.href = '/login';
      throw new Error('Session expirée');
    }
    res = await doFetch(accessToken);
  }

  return res;
}

export {
  setAccessToken as setTokens,
  clearAccessToken as clearTokens,
  getAccessToken,
};
