import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { useCreateGameModule, McqGameModuleFormValues } from '@/services/game-module.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { useEffect, useState } from 'react';

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
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => form.setFocus('question'), 0);
    } else {
      setFormError(null);
    }
  }, [open, form]);

  const onSubmit = (values: McqGameModuleFormValues) => {
    setFormError(null);
    const trimmed = values.choices.map((c) => ({
      ...c,
      text: c.text.trim(),
      correctionMessage: c.correctionMessage?.trim() ?? '',
    }));
    const nonEmpty = trimmed.filter((c) => c.text.length > 0);
    if (nonEmpty.length < 2) {
      setFormError('Ajoutez au moins deux choix non vides.');
      return;
    }
    if (!nonEmpty.some((c) => c.isCorrect)) {
      setFormError('Marquez au moins une bonne réponse.');
      return;
    }
    const payload: McqGameModuleFormValues = {
      gameType: 'MCQ',
      question: values.question.trim(),
      choices: nonEmpty,
    };
    createMutation.mutate(payload, {
      onSuccess: () => {
        setOpen(false);
        form.reset(defaultValues);
      },
      onError: () => setFormError("Erreur lors de l'ajout"),
    });
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">+ Ajouter un module MCQ</Button>
      </DialogTrigger>
  <DialogContent className="sm:max-w-[640px] max-h-[85vh] overflow-y-auto">
  <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <DialogHeader>
            <DialogTitle>Ajouter un QCM</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-2">
            <Label htmlFor="question">Question</Label>
            <Input
              id="question"
              placeholder="Saisissez la question"
              {...form.register('question', { required: 'La question est requise' })}
              aria-invalid={!!form.formState.errors.question}
            />
            {form.formState.errors.question && (
              <p className="text-red-500 text-xs">{form.formState.errors.question.message as string}</p>
            )}
          </div>

          <fieldset className="flex flex-col gap-3">
            <legend className="text-sm font-medium">Choix</legend>
            <p className="text-xs text-muted-foreground">Au moins deux choix non vides et une réponse correcte.</p>
            {fields.map((field, idx) => (
              <div key={field.id} className="rounded border p-3 space-y-3">
                <div className="flex items-center gap-2">
                  <Controller
                    name={`choices.${idx}.isCorrect`}
                    control={form.control}
                    render={({ field: f }) => (
                      <Checkbox id={`choice-correct-${idx}`} checked={!!f.value} onCheckedChange={(v) => f.onChange(!!v)} />
                    )}
                  />
                  <Label htmlFor={`choice-correct-${idx}`}>Correct</Label>
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor={`choice-text-${idx}`}>Texte du choix #{idx + 1}</Label>
                  <Input
                    id={`choice-text-${idx}`}
                    placeholder={`Texte du choix #${idx + 1}`}
                    {...form.register(`choices.${idx}.text`, { required: 'Le texte est requis' })}
                    aria-invalid={!!form.formState.errors.choices?.[idx]?.text}
                  />
                  {form.formState.errors.choices?.[idx]?.text?.message && (
                    <p className="text-red-500 text-xs mt-1">{form.formState.errors.choices?.[idx]?.text?.message as string}</p>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor={`choice-correction-${idx}`}>Message de correction (optionnel)</Label>
                  <Input
                    id={`choice-correction-${idx}`}
                    placeholder="Explication affichée après la réponse"
                    {...form.register(`choices.${idx}.correctionMessage`)}
                  />
                </div>
                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => remove(idx)}
                    disabled={fields.length <= 2}
                  >
                    Supprimer le choix
                  </Button>
                </div>
              </div>
            ))}
            <div>
              <Button
                type="button"
                variant="outline"
                onClick={() => append({ text: '', isCorrect: false, correctionMessage: '' })}
              >
                + Ajouter un choix
              </Button>
            </div>
          </fieldset>

          {formError && <div className="text-red-600 text-sm">{formError}</div>}

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={createMutation.isPending}>Annuler</Button>
            </DialogClose>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Ajout…' : 'Ajouter'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
