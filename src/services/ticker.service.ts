import { buildApiUrl } from '@/lib/api';
import { fetchWithAuth } from './auth.service';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export type VariationDirection = 'UP' | 'DOWN' | 'FLAT';

export type Ticker = {
  id: string;
  name: string;
  symbol: string;
  type: string;
  currency: string;
  price: number;
  variation: number;
  variationPercent: number;
  variationDirection: VariationDirection;
};

export async function getTickers(): Promise<Ticker[]> {
  const res = await fetchWithAuth(buildApiUrl('/tickers'), {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to fetch tickers');
  const data = await res.json();
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.tickers)) return data.tickers;
  throw new Error('API did not return a list of tickers');
}

export async function createTicker(data: {
  name: string;
  symbol: string;
  type: string;
  currency: string;
}): Promise<Ticker> {
  const res = await fetchWithAuth(buildApiUrl('/tickers'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create ticker');
  return res.json();
}

export function useTickers() {
  return useQuery({
    queryKey: ['tickers'],
    queryFn: getTickers,
  });
}

export function useCreateTicker() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTicker,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickers'] });
    },
  });
}
