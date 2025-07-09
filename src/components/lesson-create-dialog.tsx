import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { lessonSchema, LessonFormValues } from '@/schemas/lesson.schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { useCreateLesson } from '@/services/lesson.service';
import { useState } from 'react';

export function LessonCreateDialog({ chapterId }: { chapterId: string }) {
  const [open, setOpen] = useState(false);
  const form = useForm<LessonFormValues>({
    resolver: zodResolver(lessonSchema),
    defaultValues: { title: '', description: '' },
  });
  const createLessonMutation = useCreateLesson(chapterId);
  const onSubmit = (values: LessonFormValues) => {
    createLessonMutation.mutate(values, {
      onSuccess: () => {
        setOpen(false);
        form.reset();
      },
    });
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-black text-white">+ Ajouter une leçon</Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle>Ajouter une leçon</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-2">
            <Label htmlFor="title">Titre</Label>
            <Input id="title" {...form.register('title')} />
            {form.formState.errors.title && (
              <span className="text-red-500 text-sm">{form.formState.errors.title.message}</span>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="description">Description</Label>
            <Input id="description" {...form.register('description')} />
            {form.formState.errors.description && (
              <span className="text-red-500 text-sm">{form.formState.errors.description.message}</span>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="order">Ordre</Label>
            <Input id="order" type="number" min={1} step={1} {...form.register('order')} />
            {form.formState.errors.order && (
              <span className="text-red-500 text-sm">{form.formState.errors.order.message}</span>
            )}
          </div>
          <DialogFooter>
            <Button type="submit" disabled={createLessonMutation.isPending}>
              {createLessonMutation.isPending ? 'Ajout...' : 'Ajouter'}
            </Button>
            <DialogClose asChild>
              <Button type="button" variant="outline">Annuler</Button>
            </DialogClose>
          </DialogFooter>
          {createLessonMutation.error && (
            <div className="text-red-500 text-sm">Erreur lors de l'ajout</div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
