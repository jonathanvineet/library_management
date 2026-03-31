import apiClient from '@/api/client';
import type { Member } from '@/types';

export const membersService = {
  getAll: async (): Promise<Member[]> => {
    const { data } = await apiClient.get('/members');
    return data;
  },
  getByEmail: async (email: string): Promise<Member> => {
    const { data } = await apiClient.get(`/members/email/${email}`);
    return data;
  },
  updateStatus: async (id: string, active: boolean): Promise<Member> => {
    const { data } = await apiClient.patch(`/members/${id}/status`, { active });
    return data;
  },
};
