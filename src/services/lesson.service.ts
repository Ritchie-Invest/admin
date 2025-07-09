import { API_BASE_URL } from '@/lib/api';
import type { LessonFormValues } from '@/schemas/lesson.schema';
import { fetchWithAuth } from './auth.service';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

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

export function useLessonsByChapter(chapterId: string | undefined) {
  return useQuery({
    queryKey: ['lessons', chapterId],
    queryFn: () => getLessonsByChapter(chapterId!),
    enabled: !!chapterId,
  });
}

export function useCreateLesson(chapterId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: LessonFormValues) => createLesson(chapterId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lessons', chapterId] });
    },
  });
}
