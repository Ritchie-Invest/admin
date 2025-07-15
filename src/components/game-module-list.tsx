
import { useGameModulesByLesson, useDeleteGameModule, GameModule } from '@/services/game-module.service';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export function GameModuleList({ lessonId }: { lessonId: string }) {
  const { data: modules = [], isLoading, error } = useGameModulesByLesson(lessonId);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const deleteMutation = useDeleteGameModule(deletingId || '', lessonId);

  const handleDelete = (id: string) => {
    setDeletingId(id);
    deleteMutation.mutate(undefined, {
      onSettled: () => setDeletingId(null),
    });
  };

  if (isLoading) return <div>Chargement des modules...</div>;
  if (error) return <div className="text-red-500">Erreur lors du chargement des modules</div>;

  return (
    <ul className="space-y-2">
      {modules.length === 0 && <li className="text-gray-400">Aucun module</li>}
      {modules.map((mod: GameModule) => (
        <li key={mod.id} className="border p-4 rounded">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold">{mod.gameType}</span>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleDelete(mod.id)}
              disabled={deletingId === mod.id && deleteMutation.isPending}
            >
              {deletingId === mod.id && deleteMutation.isPending ? 'Suppression...' : 'Supprimer'}
            </Button>
          </div>
          {((mod.gameType === 'MCQ' && mod.contract && mod.contract.question) || (mod.question && mod.choices)) ? (
            <div>
              <div className="mb-2">
                <span className="font-semibold">Question :</span> {mod.contract?.question || mod.question}
              </div>
              <ul className="ml-4 list-disc">
                {(mod.contract?.choices || mod.choices)?.map((choice: any, idx: number) => (
                  <li key={choice.id || idx} className="mb-1">
                    <span className={choice.isCorrect ? 'text-green-700 font-semibold' : ''}>
                      {choice.text}
                    </span>
                    {choice.isCorrect && <span className="ml-2 text-xs text-green-600">(bonne réponse)</span>}
                    {choice.correctionMessage && (
                      <div className="text-xs text-gray-500 ml-2">{choice.correctionMessage}</div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
