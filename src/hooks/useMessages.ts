import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Message } from '@/types';

export function useMessages(matchId: string) {
  return useQuery<Message[]>({
    queryKey: ['messages', matchId],
    queryFn: async () => {
      const { data } = await api.get(`/messages/${matchId}`);
      return data;
    },
    enabled: !!matchId,
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ matchId, content }: { matchId: string; content: string }) => {
      const { data } = await api.post(`/messages/${matchId}`, { content });
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['messages', variables.matchId] });
    },
  });
}

export function useDeleteMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ messageId, matchId }: { messageId: string; matchId: string }) => {
      await api.delete(`/messages/${messageId}`);
      return matchId;
    },
    onSuccess: (matchId) => {
      queryClient.invalidateQueries({ queryKey: ['messages', matchId] });
    },
  });
}
