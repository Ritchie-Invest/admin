const rawBase = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000';
let normalized = rawBase.trim();
if (!/^https?:\/\//i.test(normalized)) {
  normalized = `https://${normalized}`;
}
normalized = normalized.replace(/\/+$/, '');

export const API_BASE_URL = normalized;

export function buildApiUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  const suffix = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${suffix}`;
}
