'use client';

import { useState } from 'react';
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
import { useCreateTicker, useTickers } from '@/services/ticker.service.ts';
import { IconArrowDown, IconArrowUp } from '@tabler/icons-react';

export function TickerList() {
  const { data: tickers = [], isLoading, error } = useTickers();
  const createTickerMutation = useCreateTicker();
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [type, setType] = useState('');
  const [currency, setCurrency] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    createTickerMutation.mutate(
      { name, symbol, type, currency },
      {
        onError: (err: unknown) => {
          if (err instanceof Error) setFormError(err.message);
          else setFormError('Erreur inconnue');
        },
        onSuccess: () => {
          setModalOpen(false);
          setName('');
          setSymbol('');
        },
      },
    );
  }

  if (isLoading) return <div>Loading...</div>;
  if (error)
    return <div className="text-red-600">Error: {error.toString()}</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Tickers</h2>
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-black text-white">+ Ajouter un ticker</Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleCreate} className="flex flex-col gap-4">
              <DialogHeader>
                <DialogTitle>Ajouter un ticker</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-2">
                <Label htmlFor="ticker-name">Nom</Label>
                <Input
                  id="ticker-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={createTickerMutation.isPending}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="ticker-symbol">Symbol</Label>
                <Input
                  id="ticker-symbol"
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value)}
                  required
                  disabled={createTickerMutation.isPending}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="ticker-type">Type</Label>
                <Input
                  id="ticker-type"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  required
                  disabled={createTickerMutation.isPending}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="ticker-currency">Devise</Label>
                <Input
                  id="ticker-currency"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  required
                  disabled={createTickerMutation.isPending}
                />
              </div>
              {formError && (
                <div className="text-red-500 text-sm">{formError}</div>
              )}
              <DialogFooter>
                <DialogClose asChild>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={createTickerMutation.isPending}
                  >
                    Annuler
                  </Button>
                </DialogClose>
                <Button type="submit" disabled={createTickerMutation.isPending}>
                  {createTickerMutation.isPending ? 'Création...' : 'Créer'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <ul className="space-y-2">
        {tickers.map((ticker) => (
          <li key={ticker.id} className="border p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-semibold">{ticker.name}</div>
                <div className="text-sm text-gray-600">
                  {ticker.price} {ticker.currency}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {ticker.variationDirection === 'UP' && (
                  <div className="flex justify-between items-center">
                    <IconArrowUp size={16} className="text-green-500" />
                    <div className="text-sm text-green-500 font-semibold">
                      {ticker.variationPercent} %
                    </div>
                  </div>
                )}
                {ticker.variationDirection === 'DOWN' && (
                  <div className="flex justify-between items-center">
                    <IconArrowDown size={16} className="text-red-500" />
                    <div className="text-sm text-red-500 font-semibold">
                      {ticker.variationPercent} %
                    </div>
                  </div>
                )}
                {ticker.variationDirection === 'FLAT' && (
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-500 font-semibold">
                      {ticker.variationPercent} %
                    </div>
                  </div>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
