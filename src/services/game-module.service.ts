import { API_BASE_URL } from '@/lib/api';
import { fetchWithAuth } from './auth.service';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export type McqContract = {
  question: string;
  choices: Array<{
    id?: string;
    text: string;
    isCorrect: boolean;
    correctionMessage?: string;
  }>;
};

export type GameModule = {
  id: string;
  lessonId: string;
  gameType?: string;
  contract?: McqContract;
  order?: number;
  question?: string;
  choices?: Array<{
    id?: string;
    text: string;
    isCorrect: boolean;
    correctionMessage?: string;
  }>;
};

export type McqChoice = {
  text: string;
  isCorrect: boolean;
  correctionMessage: string;
};

export type McqGameModuleFormValues = {
  gameType: 'MCQ';
  question: string;
  choices: McqChoice[];
};

export async function getGameModulesByLesson(
  lessonId: string,
): Promise<GameModule[]> {
  const res = await fetchWithAuth(`${API_BASE_URL}/lessons/${lessonId}`);
  if (!res.ok) throw new Error('Failed to fetch lesson');
  const data = await res.json();
  if (data && Array.isArray(data.modules)) return data.modules;
  if (data && data.modules && Array.isArray(data.modules)) return data.modules;
  throw new Error('API did not return a list of modules');
}

export async function createGameModule(
  lessonId: string,
  data: McqGameModuleFormValues,
): Promise<GameModule> {
  const payload = {
    gameType: data.gameType,
    contract: {
      question: data.question,
      choices: data.choices,
    },
  };
  const res = await fetchWithAuth(
    `${API_BASE_URL}/lessons/${lessonId}/modules`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload),
    },
  );
  if (!res.ok) throw new Error('Failed to create game module');
  return res.json();
}

export async function updateGameModule(
  moduleId: string,
  data: McqGameModuleFormValues,
): Promise<GameModule> {
  const payload = {
    gameType: data.gameType,
    contract: {
      question: data.question,
      choices: data.choices,
    },
  };
  const res = await fetchWithAuth(`${API_BASE_URL}/modules/${moduleId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to update game module');
  return res.json();
}

export async function deleteGameModule(moduleId: string): Promise<void> {
  const res = await fetchWithAuth(`${API_BASE_URL}/modules/${moduleId}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to delete game module');
}

export function useGameModulesByLesson(lessonId: string | undefined) {
  return useQuery({
    queryKey: ['game-modules', lessonId],
    queryFn: () => getGameModulesByLesson(lessonId!),
    enabled: !!lessonId,
  });
}

export function useCreateGameModule(lessonId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: McqGameModuleFormValues) =>
      createGameModule(lessonId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['game-modules', lessonId] });
    },
  });
}

export function useUpdateGameModule(moduleId: string, lessonId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: McqGameModuleFormValues) =>
      updateGameModule(moduleId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['game-modules', lessonId] });
    },
  });
}

export function useDeleteGameModule(moduleId: string, lessonId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => deleteGameModule(moduleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['game-modules', lessonId] });
    },
  });
}
