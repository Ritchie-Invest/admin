import { API_BASE_URL } from '@/lib/api';
import type { LessonFormValues } from '@/schemas/lesson.schema';
import { fetchWithAuth } from './auth.service';

export type Lesson = {
  id: string;
  title: string;
  description: string;
};

export async function getLessonsByChapter(
  chapterId: string,
): Promise<Lesson[]> {
  const res = await fetchWithAuth(
    `${API_BASE_URL}/lessons/chapter/${chapterId}`,
    {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    },
  );
  if (!res.ok) throw new Error('Failed to fetch lessons');
  const data = await res.json();
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.lessons)) return data.lessons;
  throw new Error('API did not return a list of lessons');
}

export async function createLesson(
  chapterId: string,
  data: LessonFormValues,
): Promise<Lesson> {
  const res = await fetchWithAuth(`${API_BASE_URL}/lessons`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ ...data, chapterId }),
  });
  if (!res.ok) throw new Error('Failed to create lesson');
  return res.json();
}
