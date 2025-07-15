
import { useForm, useFieldArray } from 'react-hook-form';
import { useCreateGameModule, McqGameModuleFormValues } from '@/services/game-module.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { useState } from 'react';

const defaultValues: McqGameModuleFormValues = {
  gameType: 'MCQ',
  question: '',
  choices: [
    { text: '', isCorrect: false, correctionMessage: '' },
    { text: '', isCorrect: false, correctionMessage: '' },
  ],
};

export function GameModuleCreateDialog({ lessonId }: { lessonId: string }) {
  const [open, setOpen] = useState(false);
  const form = useForm<McqGameModuleFormValues>({
    defaultValues,
  });
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'choices',
  });
  const createMutation = useCreateGameModule(lessonId);
  const onSubmit = (values: McqGameModuleFormValues) => {
    createMutation.mutate(values, {
      onSuccess: () => {
        setOpen(false);
        form.reset(defaultValues);
      },
    });
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">+ Ajouter un module MCQ</Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle>Ajouter un QCM</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-2">
            <label htmlFor="question">Question</label>
            <Input id="question" {...form.register('question', { required: true })} />
            {form.formState.errors.question && (
              <span className="text-red-500 text-sm">{form.formState.errors.question.message}</span>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label>Choix</label>
            {fields.map((field, idx) => (
              <div key={field.id} className="flex gap-2 items-center border p-2 rounded mb-2">
                <Input
                  placeholder={`Choix #${idx + 1}`}
                  {...form.register(`choices.${idx}.text`, { required: true })}
                />
                <Input
                  placeholder="Message de correction"
                  {...form.register(`choices.${idx}.correctionMessage`)}
                />
                <label className="flex items-center gap-1">
                  <input type="checkbox" {...form.register(`choices.${idx}.isCorrect`)} />
                  Correct
                </label>
                <Button type="button" variant="destructive" size="sm" onClick={() => remove(idx)} disabled={fields.length <= 2}>
                  Supprimer
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={() => append({ text: '', isCorrect: false, correctionMessage: '' })}>
              + Ajouter un choix
            </Button>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Ajout...' : 'Ajouter'}
            </Button>
            <DialogClose asChild>
              <Button type="button" variant="outline">Annuler</Button>
            </DialogClose>
          </DialogFooter>
          {createMutation.error && (
            <div className="text-red-500 text-sm">Erreur lors de l'ajout</div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
