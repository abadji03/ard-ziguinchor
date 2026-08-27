import api from '@/lib/api';
import type { SearchResult } from '@/types';

export const rechercheService = {
  search: async (q: string): Promise<SearchResult> => {
    const { data } = await api.get(`/recherche?q=${encodeURIComponent(q)}`);
    return data;
  },
};
