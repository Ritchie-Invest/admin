import { API_BASE_URL } from '@/lib/api';
import { fetchWithAuth } from './auth.service';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// MCQ
export type McqChoiceContract = {
  id?: string;
  text: string;
  isCorrect: boolean;
  correctionMessage?: string;
};

export type McqContract = {
  question: string;
  choices: McqChoiceContract[];
};

export type McqModuleRequest = {
  gameType: 'MCQ';
  contract: McqContract;
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

// Fill in the blank
export type FillInTheBlankChoiceContract = {
  id?: string;
  text: string;
  isCorrect: boolean;
  correctionMessage?: string;
};

export type FillInTheBlankContract = {
  firstText: string;
  secondText: string;
  blanks: FillInTheBlankChoiceContract[];
};

export type FillInTheBlankModuleRequest = {
  gameType: 'FILL_IN_THE_BLANK';
  contract: FillInTheBlankContract;
};

export type FillInTheBlankChoice = {
  text: string;
  isCorrect: boolean;
  correctionMessage: string;
};

export type FillInTheBlankGameModuleFormValues = {
  gameType: 'FILL_IN_THE_BLANK';
  firstText: string;
  secondText: string;
  blanks: FillInTheBlankChoice[];
};

// True or False
export type TrueOrFalseContract = {
  sentence: string;
  isTrue: boolean;
};

export type TrueOrFalseModuleRequest = {
  gameType: 'TRUE_OR_FALSE';
  contract: TrueOrFalseContract;
};

export type TrueOrFalseGameModuleFormValues = {
  gameType: 'TRUE_OR_FALSE';
  sentence: string;
  isTrue: boolean;
};

export type GameModuleRequest =
  | McqModuleRequest
  | FillInTheBlankModuleRequest
  | TrueOrFalseModuleRequest;

export type McqModule = {
  gameType: 'MCQ';
  question: string;
  choices: McqChoiceContract[];
};

export type FillInTheBlankModule = {
  gameType: 'FILL_IN_THE_BLANK';
  firstText: string;
  secondText: string;
  blanks: FillInTheBlankChoiceContract[];
};

export type TrueOrFalseModule = {
  gameType: 'TRUE_OR_FALSE';
  sentence: string;
  isTrue: boolean;
};

export type GameModule = {
  id: string;
  lessonId: string;
  createdAt: string;
  updatedAt: string;
} & (McqModule | FillInTheBlankModule | TrueOrFalseModule);

export async function getGameModulesByLesson(
  lessonId: string,
): Promise<GameModule[]> {
  const res = await fetchWithAuth(`${API_BASE_URL}/lessons/${lessonId}`);
  if (!res.ok) {
    throw new Error('Failed to fetch lesson');
  }
  const data = await res.json();
  if (data && Array.isArray(data.modules)) {
    return data.modules;
  }
  if (data && data.modules && Array.isArray(data.modules)) {
    return data.modules;
  }
  throw new Error('API did not return a list of modules');
}

export async function createGameModule(
  lessonId: string,
  data:
    | McqGameModuleFormValues
    | FillInTheBlankGameModuleFormValues
    | TrueOrFalseGameModuleFormValues,
): Promise<GameModule> {
  let payload: unknown = {};
  if (data.gameType === 'MCQ') {
    payload = {
      gameType: data.gameType,
      contract: {
        question: data.question,
        choices: data.choices,
      },
    } satisfies McqModuleRequest;
  } else if (data.gameType === 'FILL_IN_THE_BLANK') {
    payload = {
      gameType: data.gameType,
      contract: {
        firstText: data.firstText,
        secondText: data.secondText,
        blanks: data.blanks,
      },
    } satisfies FillInTheBlankModuleRequest;
  } else if (data.gameType === 'TRUE_OR_FALSE') {
    payload = {
      gameType: data.gameType,
      contract: {
        sentence: data.sentence,
        isTrue: data.isTrue,
      },
    } satisfies TrueOrFalseModuleRequest;
  }
  const res = await fetchWithAuth(
    `${API_BASE_URL}/lessons/${lessonId}/modules`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload),
    },
  );
  if (!res.ok) {
    throw new Error('Failed to create game module');
  }
  return res.json();
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
    mutationFn: (
      data:
        | McqGameModuleFormValues
        | FillInTheBlankGameModuleFormValues
        | TrueOrFalseGameModuleFormValues,
    ) => createGameModule(lessonId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['game-modules', lessonId] });
    },
  });
}
