import { API_BASE_URL } from '@/lib/api';

export type Chapter = {
  id: string;
  title: string;
  description: string;
  isPublished: boolean;
};

function getAuthHeaders(): Record<string, string> {
  const accessToken = sessionStorage.getItem('accessToken');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;
  return headers;
}

export async function getChapters(): Promise<Chapter[]> {
  const res = await fetch(`${API_BASE_URL}/chapters`, {
    method: 'GET',
    headers: getAuthHeaders(),
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to fetch chapters');
  const data = await res.json();
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.chapters)) return data.chapters;
  throw new Error('API did not return a list of chapters');
}

export async function createChapter(data: {
  title: string;
  description: string;
}): Promise<Chapter> {
  const res = await fetch(`${API_BASE_URL}/chapters`, {
    method: 'POST',
    headers: getAuthHeaders(),
    credentials: 'include',
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create chapter');
  return res.json();
}

export async function updateChapter(
  chapterId: string,
  data: Partial<Pick<Chapter, 'title' | 'description' | 'isPublished'>>,
): Promise<Chapter> {
  const res = await fetch(`${API_BASE_URL}/chapters/${chapterId}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    credentials: 'include',
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update chapter');
  return res.json();
}

export async function getChapterById(chapterId: string): Promise<Chapter> {
  const res = await fetch(`${API_BASE_URL}/chapters/${chapterId}`, {
    method: 'GET',
    headers: getAuthHeaders(),
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Chapter not found');
  return res.json();
}
