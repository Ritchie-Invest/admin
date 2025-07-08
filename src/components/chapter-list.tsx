'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Chapter, getChapters, createChapter } from '@/services/chapter.service';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link } from 'react-router-dom';

export function ChapterList() {
  const queryClient = useQueryClient();
  const { data: chapters = [], isLoading, error } = useQuery({
    queryKey: ['chapters'],
    queryFn: getChapters,
  });
  const createChapterMutation = useMutation({
    mutationFn: createChapter,
    onSuccess: (newChapter) => {
      queryClient.setQueryData(['chapters'], (old: Chapter[] = []) => [...old, newChapter]);
    },
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  async function handleCreate(e?: React.FormEvent) {
    if (e) e.preventDefault();
    setFormError(null);
    createChapterMutation.mutate(
      { title, description },
      {
        onSuccess: () => {
          setModalOpen(false);
          setTitle('');
          setDescription('');
        },
        onError: (e: any) => setFormError(e.message || 'Error creating chapter'),
      }
    );
  }

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">Error: {error?.toString()}</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Chapitres</h2>
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-black text-white">
              + Ajouter un chapitre
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleCreate} className="flex flex-col gap-4">
              <DialogHeader>
                <DialogTitle>Ajouter un chapitre</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-2">
                <Label htmlFor="chapter-title">Titre</Label>
                <Input
                  id="chapter-title"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  required
                  disabled={createChapterMutation.isPending}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="chapter-description">Description</Label>
                <Input
                  id="chapter-description"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  required
                  disabled={createChapterMutation.isPending}
                />
              </div>
              {formError && <div className="text-red-500 text-sm">{formError}</div>}
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline" disabled={createChapterMutation.isPending}>
                    Annuler
                  </Button>
                </DialogClose>
                <Button type="submit" disabled={createChapterMutation.isPending}>
                  {createChapterMutation.isPending ? 'Création...' : 'Créer'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <ul className="space-y-2">
        {chapters.map((chapter) => (
          <li key={chapter.id} className="border p-4 rounded">
            <Link to={`/chapters/${chapter.id}`} className="block hover:underline">
              <div className="font-semibold">{chapter.title}</div>
              <div className="text-sm text-gray-600">{chapter.description}</div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
