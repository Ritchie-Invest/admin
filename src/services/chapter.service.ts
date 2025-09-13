import { buildApiUrl } from '@/lib/api';
import { fetchWithAuth } from './auth.service';

export type Chapter = {
  id: string;
  title: string;
  description: string;
  isPublished: boolean;
};

export async function getChapters(): Promise<Chapter[]> {
  const res = await fetchWithAuth(buildApiUrl('/chapters'), {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
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
  const res = await fetchWithAuth(buildApiUrl('/chapters'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
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
  const res = await fetchWithAuth(buildApiUrl(`/chapters/${chapterId}`), {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update chapter');
  return res.json();
}

export async function getChapterById(chapterId: string): Promise<Chapter> {
  const res = await fetchWithAuth(buildApiUrl(`/chapters/${chapterId}`), {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Chapter not found');
  return res.json();
}

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export function useChapters() {
  return useQuery({
    queryKey: ['chapters'],
    queryFn: getChapters,
  });
}

export function useCreateChapter() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createChapter,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chapters'] });
    },
  });
}

export function useUpdateChapter() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      chapterId,
      data,
    }: {
      chapterId: string;
      data: Partial<Pick<Chapter, 'title' | 'description' | 'isPublished'>>;
    }) => updateChapter(chapterId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chapters'] });
    },
  });
}

export function usePublishChapter(chapterId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => updateChapter(chapterId, { isPublished: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chapter', chapterId] });
    },
  });
}

export function useUnpublishChapter(chapterId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => updateChapter(chapterId, { isPublished: false }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chapter', chapterId] });
    },
  });
}

export function useChapter(chapterId: string | undefined) {
  return useQuery({
    queryKey: ['chapter', chapterId],
    queryFn: () => getChapterById(chapterId!),
    enabled: !!chapterId,
  });
}
