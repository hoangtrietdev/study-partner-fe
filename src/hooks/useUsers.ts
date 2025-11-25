import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { User, PaginatedResponse } from '@/types';

interface UserFilters {
  page?: number;
  limit?: number;
  schoolName?: string;
  major?: string;
  faculty?: string;
}

export function useUsers(filters: UserFilters = {}) {
  return useQuery<PaginatedResponse<User>>({
    queryKey: ['users', filters],
    queryFn: async () => {
      const { data } = await api.get('/users', { params: filters });
      return data;
    },
  });
}

export function useUser(id: string) {
  return useQuery<User>({
    queryKey: ['user', id],
    queryFn: async () => {
      const { data } = await api.get(`/users/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<User> }) => {
      const response = await api.put(`/users/${id}`, data);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['user', data._id] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}
