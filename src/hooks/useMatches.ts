import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Match, MatchSuggestion } from '@/types';

export function useMatches() {
  return useQuery<Match[]>({
    queryKey: ['matches'],
    queryFn: async () => {
      const { data } = await api.get('/matches');
      return data;
    },
  });
}

export function useMatchSuggestions(
  limit: number = 10,
  useAI: boolean = true,
  enabled: boolean = true,
  matchMode: 'strict' | 'random' = 'random',
) {
  return useQuery<MatchSuggestion[]>({
    queryKey: ['match-suggestions', limit, useAI, matchMode],
    queryFn: async () => {
      console.log('Fetching match suggestions...', { limit, useAI, matchMode });
      const { data } = await api.get('/matches/suggestions', {
        params: { limit: Number(limit), useAI, matchMode },
      });
      return data;
    },
    enabled,
  });
}

export function useCreateMatch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userBId,
      score,
      explanation,
    }: {
      userBId: string;
      score?: number;
      explanation?: string;
    }) => {
      const { data } = await api.post('/matches', {
        userBId,
        score,
        explanation,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['matches'] });
      queryClient.invalidateQueries({ queryKey: ['match-suggestions'] });
    },
  });
}

export function useUnmatch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (matchId: string) => {
      await api.delete(`/matches/${matchId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['matches'] });
    },
  });
}
