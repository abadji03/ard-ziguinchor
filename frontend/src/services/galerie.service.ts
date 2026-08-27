import api from '@/lib/api';
import type { Galerie, Album } from '@/types';

export const galerieService = {
  getAll: async (): Promise<Galerie[]> => {
    const { data } = await api.get('/galeries');
    return data.data ?? data;
  },

  getBySlug: async (slug: string): Promise<Galerie> => {
    const { data } = await api.get(`/galeries/slug/${slug}`);
    return data;
  },

  getAlbum: async (id: string): Promise<Album> => {
    const { data } = await api.get(`/galeries/albums/${id}`);
    return data;
  },
};
