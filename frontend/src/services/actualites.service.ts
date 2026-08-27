import api from '@/lib/api';
import { buildQueryString } from '@/lib/utils';
import type { Actualite, PaginatedResponse, QueryParams } from '@/types';

export interface ActualitesQueryParams extends QueryParams {
  categorieId?: string;
  statut?: string;
  tag?: string;
}

export const actualitesService = {
  getAll: async (params: ActualitesQueryParams = {}): Promise<PaginatedResponse<Actualite>> => {
    const query = buildQueryString(params);
    const { data } = await api.get(`/actualites?${query}`);
    return data;
  },

  getBySlug: async (slug: string): Promise<Actualite> => {
    const { data } = await api.get(`/actualites/slug/${slug}`);
    return data;
  },

  getRecentes: async (limit = 6): Promise<Actualite[]> => {
    const { data } = await api.get(`/actualites?limit=${limit}&statut=publie&page=1`);
    return data.data ?? data;
  },
};
