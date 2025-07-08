'use client';

import { useEffect, useState } from 'react';
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

export function ChapterList() {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [creating, setCreating] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    getChapters()
      .then(setChapters)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  async function handleCreate(e?: React.FormEvent) {
    if (e) e.preventDefault();
    setFormError(null);
    setCreating(true);
    try {
      const newChapter = await createChapter({ title, description });
      setChapters((prev) => [...prev, newChapter]);
      setModalOpen(false);
      setTitle('');
      setDescription('');
    } catch (e: any) {
      setFormError(e.message || 'Error creating chapter');
    } finally {
      setCreating(false);
    }
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">Error: {error}</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Chapitres</h2>
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-black text-white">
              + Créer
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleCreate} className="flex flex-col gap-4">
              <DialogHeader>
                <DialogTitle>Créer un chapitre</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-2">
                <Label htmlFor="chapter-title">Titre</Label>
                <Input
                  id="chapter-title"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  required
                  disabled={creating}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="chapter-description">Description</Label>
                <Input
                  id="chapter-description"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  required
                  disabled={creating}
                />
              </div>
              {formError && <div className="text-red-500 text-sm">{formError}</div>}
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline" disabled={creating}>
                    Annuler
                  </Button>
                </DialogClose>
                <Button type="submit" disabled={creating}>
                  {creating ? 'Création...' : 'Créer'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <ul className="space-y-2">
        {chapters.map((chapter) => (
          <li key={chapter.id} className="border p-4 rounded">
            <div className="font-semibold">{chapter.title}</div>
            <div className="text-sm text-gray-600">{chapter.description}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
