import api from '@/lib/api';
import { buildQueryString } from '@/lib/utils';
import type { Projet, PaginatedResponse, QueryParams } from '@/types';

export interface ProjetsQueryParams extends QueryParams {
  statut?: string;
  secteurId?: string;
  departementId?: string;
  communeId?: string;
}

export const projetsService = {
  getAll: async (params: ProjetsQueryParams = {}): Promise<PaginatedResponse<Projet>> => {
    const query = buildQueryString(params);
    const { data } = await api.get(`/projets?${query}`);
    return data;
  },

  getBySlug: async (slug: string): Promise<Projet> => {
    const { data } = await api.get(`/projets/slug/${slug}`);
    return data;
  },

  getRecents: async (limit = 6): Promise<Projet[]> => {
    const { data } = await api.get(`/projets?limit=${limit}&page=1`);
    return data.data ?? data;
  },
};
