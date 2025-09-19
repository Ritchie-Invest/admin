import { useForm, Controller } from 'react-hook-form';
import {
  useCreateGameModule,
  TrueOrFalseGameModuleFormValues,
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

const defaultValues: TrueOrFalseGameModuleFormValues = {
  gameType: 'TRUE_OR_FALSE',
  sentence: '',
  isTrue: false,
};

export function TrueOrFalseModuleCreateDialog({
  lessonId,
}: {
  lessonId: string;
}) {
  const [open, setOpen] = useState(false);
  const form = useForm<TrueOrFalseGameModuleFormValues>({
    defaultValues,
  });
  const createMutation = useCreateGameModule(lessonId);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      form.reset(defaultValues);
      setFormError(null);
    }
  }, [open, form]);

  const onSubmit = (values: TrueOrFalseGameModuleFormValues) => {
    setFormError(null);
    const payload: TrueOrFalseGameModuleFormValues = {
      gameType: 'TRUE_OR_FALSE',
      sentence: values.sentence.trim(),
      isTrue: values.isTrue,
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
        <Button variant="outline">+ Ajouter un module True Or False</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[640px] max-h-[85vh] overflow-y-auto">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-5"
        >
          <DialogHeader>
            <DialogTitle>Ajouter un Vrai ou Faux</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-2">
            <Label htmlFor="question">Phrase</Label>
            <Input
              autoFocus
              id="sentence"
              placeholder="Saisissez la phrase"
              {...form.register('sentence', {
                required: 'La phrase est requise',
              })}
              aria-invalid={!!form.formState.errors.sentence}
            />
            {form.formState.errors.sentence && (
              <p className="text-red-500 text-xs">
                {form.formState.errors.sentence.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Controller
                name={'isTrue'}
                control={form.control}
                render={({ field: f }) => (
                  <Checkbox
                    id={'isTrue'}
                    checked={!!f.value}
                    onCheckedChange={(v) => f.onChange(!!v)}
                  />
                )}
              />
              <Label htmlFor={'isTrue'}>Vrai</Label>
            </div>
          </div>

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
