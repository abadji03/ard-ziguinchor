import api from '@/lib/api';
import type { Evenement } from '@/types';

export const evenementsService = {
  getAll: async (params: { limit?: number; statut?: string } = {}): Promise<Evenement[]> => {
    const query = new URLSearchParams();
    if (params.limit) query.set('limit', String(params.limit));
    if (params.statut) query.set('statut', params.statut);
    const { data } = await api.get(`/evenements?${query.toString()}`);
    return data.data ?? data;
  },

  getAVenir: async (limit = 5): Promise<Evenement[]> => {
    const { data } = await api.get(`/evenements?limit=${limit}&statut=publie&page=1`);
    return data.data ?? data;
  },
};
