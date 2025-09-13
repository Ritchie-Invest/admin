import { buildApiUrl } from '@/lib/api';
import type { LessonFormValues } from '@/schemas/lesson.schema';
import { fetchWithAuth } from './auth.service';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export type Lesson = {
  id: string;
  title: string;
  description: string;
  isPublished: boolean;
};

export async function getLessonsByChapter(
  chapterId: string,
): Promise<Lesson[]> {
  const res = await fetchWithAuth(
    buildApiUrl(`/lessons/chapter/${chapterId}`),
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
  const res = await fetchWithAuth(buildApiUrl('/lessons'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ ...data, chapterId }),
  });
  if (!res.ok) throw new Error('Failed to create lesson');
  return res.json();
}

export async function updateLesson(
  lessonId: string,
  data: Partial<Pick<Lesson, 'title' | 'description' | 'isPublished'>>,
): Promise<Lesson> {
  const res = await fetchWithAuth(buildApiUrl(`/lessons/${lessonId}`), {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update lesson');
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

export function usePublishLesson(chapterId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (lessonId: string) =>
      updateLesson(lessonId, { isPublished: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lessons', chapterId] });
    },
  });
}

export function useUnpublishLesson(chapterId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (lessonId: string) =>
      updateLesson(lessonId, { isPublished: false }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lessons', chapterId] });
    },
  });
}
