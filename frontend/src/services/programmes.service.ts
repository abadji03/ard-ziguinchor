import api from '@/lib/api';
import { buildQueryString } from '@/lib/utils';
import type { Programme, PaginatedResponse, QueryParams } from '@/types';

export const programmesService = {
  getAll: async (params: QueryParams = {}): Promise<PaginatedResponse<Programme>> => {
    const query = buildQueryString(params);
    const { data } = await api.get(`/programmes?${query}`);
    return data;
  },

  getBySlug: async (slug: string): Promise<Programme> => {
    const { data } = await api.get(`/programmes/slug/${slug}`);
    return data;
  },
};
