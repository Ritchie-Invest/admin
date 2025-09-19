import {
  useGameModulesByLesson,
  GameModule,
} from '@/services/game-module.service';

export function GameModuleList({ lessonId }: { lessonId: string }) {
  const {
    data: modules = [],
    isLoading,
    error,
  } = useGameModulesByLesson(lessonId);

  if (isLoading) return <div>Chargement des modules...</div>;
  if (error)
    return (
      <div className="text-red-500">Erreur lors du chargement des modules</div>
    );

  return (
    <ul className="space-y-3">
      {modules.length === 0 && <li className="text-gray-400">Aucun module</li>}
      {modules.map((module: GameModule) => (
        <li key={module.id} className="rounded-lg border p-4">
          <div className="mb-2 text-sm text-muted-foreground uppercase tracking-wide">
            {module.gameType}
          </div>
          {module.gameType === 'MCQ' && module.question && module.choices ? (
            <div>
              <div className="mb-2">
                <span className="font-semibold">Question :</span>{' '}
                {module.question}
              </div>
              <ul className="ml-4 list-disc">
                {module.choices.map((choice, idx: number) => (
                  <li key={choice.id || idx} className="mb-1">
                    <span
                      className={
                        choice.isCorrect ? 'text-green-700 font-semibold' : ''
                      }
                    >
                      {choice.text}
                    </span>
                    {choice.isCorrect && (
                      <span className="ml-2 text-xs text-green-600">
                        (bonne réponse)
                      </span>
                    )}
                    {choice.correctionMessage && (
                      <div className="text-xs text-gray-500 ml-2">
                        {choice.correctionMessage}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          {module.gameType === 'FILL_IN_THE_BLANK' &&
          module.firstText !== undefined &&
          module.secondText !== undefined &&
          module.blanks ? (
            <div>
              <div className="mb-2">
                <span className="font-semibold">Phrase :</span>{' '}
                {module.firstText}
                <span className="underline">_____</span>
                {module.secondText}
              </div>
              <ul className="ml-4 list-disc">
                {module.blanks.map((blank, idx: number) => (
                  <li key={blank.id || idx} className="mb-1">
                    <span
                      className={
                        blank.isCorrect ? 'text-green-700 font-semibold' : ''
                      }
                    >
                      {blank.text}
                    </span>
                    {blank.isCorrect && (
                      <span className="ml-2 text-xs text-green-600">
                        (bonne réponse)
                      </span>
                    )}
                    {blank.correctionMessage && (
                      <div className="text-xs text-gray-500 ml-2">
                        {blank.correctionMessage}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          {module.gameType === 'TRUE_OR_FALSE' && module.sentence ? (
            <div>
              <div className="mb-2">
                <span className="font-semibold">Phrase :</span>{' '}
                {module.sentence}
              </div>
              <div>
                <span className="font-semibold">Réponse :</span>{' '}
                {module.isTrue ? 'Vrai' : 'Faux'}
              </div>
            </div>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
