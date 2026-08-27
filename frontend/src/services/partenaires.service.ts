import api from '@/lib/api';
import { buildQueryString } from '@/lib/utils';
import type { Partenaire, PaginatedResponse, QueryParams } from '@/types';

export interface PartenairesQueryParams extends QueryParams {
  typeId?: string;
  pays?: string;
}

export const partenairesService = {
  getAll: async (params: PartenairesQueryParams = {}): Promise<PaginatedResponse<Partenaire>> => {
    const query = buildQueryString(params);
    const { data } = await api.get(`/partenaires?${query}`);
    return data;
  },

  getBySlug: async (slug: string): Promise<Partenaire> => {
    const { data } = await api.get(`/partenaires/slug/${slug}`);
    return data;
  },
};
