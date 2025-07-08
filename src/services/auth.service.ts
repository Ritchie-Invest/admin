import { API_BASE_URL } from '@/lib/api';

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
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
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error('Login failed');
  return res.json();
}

export async function refresh(refreshToken: string): Promise<AuthTokens> {
  const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ refreshToken }),
  });
  if (!res.ok) throw new Error('Refresh token failed');
  return res.json();
}

export async function logout(refreshToken: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/auth/logout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ refreshToken }),
  });
  if (!res.ok) throw new Error('Logout failed');
}
