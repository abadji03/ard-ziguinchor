import api from '@/lib/api';
import { buildQueryString } from '@/lib/utils';
import type { Opportunite, PaginatedResponse, QueryParams } from '@/types';

export interface OpportunitesQueryParams extends QueryParams {
  typeId?: string;
  statut?: string;
  secteur?: string;
}

export const opportunitesService = {
  getAll: async (params: OpportunitesQueryParams = {}): Promise<PaginatedResponse<Opportunite>> => {
    const query = buildQueryString(params);
    const { data } = await api.get(`/opportunites?${query}`);
    return data;
  },

  getBySlug: async (slug: string): Promise<Opportunite> => {
    const { data } = await api.get(`/opportunites/slug/${slug}`);
    return data;
  },
};
