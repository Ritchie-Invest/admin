import { useForm, useFieldArray, Controller } from 'react-hook-form';
import {
  useCreateGameModule,
  FillInTheBlankGameModuleFormValues,
} from '@/services/game-module.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { useEffect, useState } from 'react';

const defaultValues: FillInTheBlankGameModuleFormValues = {
  gameType: 'FILL_IN_THE_BLANK',
  firstText: '',
  secondText: '',
  blanks: [
    { text: '', isCorrect: false, correctionMessage: '' },
    { text: '', isCorrect: false, correctionMessage: '' },
  ],
};

export function FillInTheBlankModuleCreateDialog({
  lessonId,
}: {
  lessonId: string;
}) {
  const [open, setOpen] = useState(false);
  const form = useForm<FillInTheBlankGameModuleFormValues>({
    defaultValues,
  });
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'blanks',
  });
  const createMutation = useCreateGameModule(lessonId);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      form.reset(defaultValues);
      setFormError(null);
    }
  }, [open, form]);

  const onSubmit = (values: FillInTheBlankGameModuleFormValues) => {
    setFormError(null);
    const trimmed = values.blanks.map((c) => ({
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
    const payload: FillInTheBlankGameModuleFormValues = {
      gameType: 'FILL_IN_THE_BLANK',
      firstText: values.firstText.trim(),
      secondText: values.secondText.trim(),
      blanks: nonEmpty,
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
        <Button variant="outline">+ Ajouter un module Fill In The Blank</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[640px] max-h-[85vh] overflow-y-auto">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-5"
        >
          <DialogHeader>
            <DialogTitle>Ajouter un Texte à trous</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-2">
            <Label htmlFor="question">Début</Label>
            <Input
              autoFocus
              id="firstText"
              placeholder="Saisissez la première partie de la phrase"
              {...form.register('firstText', {
                required: 'La première partie de la phrase est requise',
              })}
              aria-invalid={!!form.formState.errors.firstText}
            />
            {form.formState.errors.firstText && (
              <p className="text-red-500 text-xs">
                {form.formState.errors.firstText.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="question">Fin</Label>
            <Input
              id="secondText"
              placeholder="Saisissez la seconde partie de la phrase"
              {...form.register('secondText', {
                required: 'La seconde partie de la phrase est requise',
              })}
              aria-invalid={!!form.formState.errors.secondText}
            />
            {form.formState.errors.secondText && (
              <p className="text-red-500 text-xs">
                {form.formState.errors.secondText.message}
              </p>
            )}
          </div>

          <fieldset className="flex flex-col gap-3">
            <legend className="text-sm font-medium">Choix</legend>
            <p className="text-xs text-muted-foreground">
              Au moins deux choix non vides et une réponse correcte.
            </p>
            {fields.map((field, idx) => (
              <div key={field.id} className="rounded border p-3 space-y-3">
                <div className="flex items-center gap-2">
                  <Controller
                    name={`blanks.${idx}.isCorrect`}
                    control={form.control}
                    render={({ field: f }) => (
                      <Checkbox
                        id={`blank-correct-${idx}`}
                        checked={!!f.value}
                        onCheckedChange={(v) => f.onChange(!!v)}
                      />
                    )}
                  />
                  <Label htmlFor={`blank-correct-${idx}`}>Correct</Label>
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor={`blank-text-${idx}`}>
                    Texte du choix #{idx + 1}
                  </Label>
                  <Input
                    id={`blank-text-${idx}`}
                    placeholder={`Texte du choix #${idx + 1}`}
                    {...form.register(`blanks.${idx}.text`, {
                      required: 'Le texte est requis',
                    })}
                    aria-invalid={!!form.formState.errors.blanks?.[idx]?.text}
                  />
                  {form.formState.errors.blanks?.[idx]?.text?.message && (
                    <p className="text-red-500 text-xs mt-1">
                      {form.formState.errors.blanks[idx].text.message}
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor={`choice-correction-${idx}`}>
                    Message de correction (optionnel)
                  </Label>
                  <Input
                    id={`blank-correction-${idx}`}
                    placeholder="Explication affichée après la réponse"
                    {...form.register(`blanks.${idx}.correctionMessage`)}
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
                onClick={() =>
                  append({ text: '', isCorrect: false, correctionMessage: '' })
                }
              >
                + Ajouter un choix
              </Button>
            </div>
          </fieldset>

          {formError && <div className="text-red-600 text-sm">{formError}</div>}

          <DialogFooter>
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                disabled={createMutation.isPending}
              >
                Annuler
              </Button>
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
