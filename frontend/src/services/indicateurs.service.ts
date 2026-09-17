import api from '@/lib/api';
import { buildQueryString } from '@/lib/utils';
import type { Indicateur, PaginatedResponse } from '@/types';

export interface IndicateursQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  secteurId?: string;
  departementId?: string;
  communeId?: string;
  annee?: number;
}

export const indicateursService = {
  getIndicateurs: async (params?: IndicateursQueryParams): Promise<PaginatedResponse<Indicateur>> => {
    const qs = buildQueryString(params ?? {});
    const { data } = await api.get(`/indicateurs${qs ? `?${qs}` : ''}`);
    return data;
  },

  getIndicateurById: async (id: string): Promise<Indicateur> => {
    const { data } = await api.get(`/indicateurs/${id}`);
    return data;
  },

  getBySecteur: async (secteurId: string): Promise<Indicateur[]> => {
    const { data } = await api.get(`/indicateurs/secteur/${secteurId}`);
    return data;
  },

  getByCommune: async (communeId: string): Promise<Indicateur[]> => {
    const { data } = await api.get(`/indicateurs/commune/${communeId}`);
    return data;
  },
};
