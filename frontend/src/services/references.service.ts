import api from '@/lib/api';
import type { ChiffreCle, Banniere, Membre, Departement, Arrondissement, Commune, Faq, Secteur, ContenuEditorial, ContenuStatique, NavigationItem } from '@/types';

export const referencesService = {
  getChiffresCles: async (): Promise<ChiffreCle[]> => {
    const { data } = await api.get('/references/chiffres-cles');
    return data;
  },

  getBannieres: async (): Promise<Banniere[]> => {
    const { data } = await api.get('/references/bannieres');
    return data;
  },

  getMembres: async (): Promise<Membre[]> => {
    const { data } = await api.get('/membres');
    return data.data ?? data;
  },

  getDepartements: async (): Promise<Departement[]> => {
    const { data } = await api.get('/references/departements');
    return data;
  },

  getDepartementById: async (id: string): Promise<Departement> => {
    const { data } = await api.get(`/references/departements/${id}`);
    return data;
  },

  getSecteurs: async (): Promise<Secteur[]> => {
    const { data } = await api.get('/references/secteurs');
    return data;
  },

  getTypesPartenaires: async (): Promise<{ id: string; nom: string }[]> => {
    const { data } = await api.get('/references/types-partenaires');
    return data;
  },

  getTypesOpportunites: async (): Promise<{ id: string; nom: string }[]> => {
    const { data } = await api.get('/references/types-opportunites');
    return data;
  },

  getArrondissements: async (departementId?: string): Promise<Arrondissement[]> => {
    const url = departementId
      ? `/references/departements/${departementId}/arrondissements`
      : '/references/arrondissements';
    const { data } = await api.get(url);
    return data;
  },

  getArrondissementById: async (id: string): Promise<Arrondissement> => {
    const { data } = await api.get(`/references/arrondissements/${id}`);
    return data;
  },

  getCommunes: async (departementId?: string, arrondissementId?: string): Promise<Commune[]> => {
    const url = arrondissementId
      ? `/references/arrondissements/${arrondissementId}/communes`
      : departementId
        ? `/references/departements/${departementId}/communes`
        : '/references/communes';
    const { data } = await api.get(url);
    return data;
  },

  getCommuneById: async (id: string): Promise<Commune> => {
    const { data } = await api.get(`/references/communes/${id}`);
    return data;
  },

  getFaqs: async (): Promise<Faq[]> => {
    const { data } = await api.get('/faq');
    return data.data ?? data;
  },

  /**
   * Contenus éditoriaux (textes/listes pilotés depuis Paramètres).
   * @param includeInactifs réservé à l'admin (affiche aussi les blocs masqués)
   */
  getContenusEditoriaux: async (params?: {
    type?: string;
    section?: string;
    includeInactifs?: boolean;
  }): Promise<ContenuEditorial[]> => {
    const { data } = await api.get('/contenus', {
      params: {
        limit: 100, // max accepté par le backend (ValidationPipe)
        ...(params?.type ? { type: params.type } : {}),
        ...(params?.section ? { section: params.section } : {}),
        // Côté admin on veut aussi les blocs masqués (actif = false).
        ...(params?.includeInactifs ? { includeInactifs: 'true' } : {}),
      },
    });
    return data.data ?? data;
  },

  /** Blocs actifs d'une page, regroupés par type (usage public). */
  getContenusSection: async (
    section: string,
  ): Promise<Record<string, ContenuEditorial[]>> => {
    const { data } = await api.get(`/contenus/section/${section}`);
    return data;
  },

  /** Blocs actifs d'un type (ex. DIRECTIONS pour un select de formulaire). */
  getContenusByType: async (type: string): Promise<ContenuEditorial[]> => {
    const { data } = await api.get(`/contenus/type/${type}`);
    return data;
  },

  createContenuEditorial: async (
    data: Partial<ContenuEditorial>,
  ): Promise<ContenuEditorial> => {
    const res = await api.post('/contenus', data);
    return res.data;
  },

  updateContenuEditorial: async (
    id: string,
    data: Partial<ContenuEditorial>,
  ): Promise<ContenuEditorial> => {
    const res = await api.patch(`/contenus/${id}`, data);
    return res.data;
  },

    deleteContenuEditorial: async (id: string): Promise<void> => {
    await api.delete(`/contenus/${id}`);
  },

  // ── Contenus statiques ───────────────────────────────────────────────────────
  getContenuStatique: async (cle: string): Promise<ContenuStatique> => {
    const { data } = await api.get(`/references/contenus-statiques/cle/${cle}`);
    return data;
  },
  getContenusStatiques: async (): Promise<ContenuStatique[]> => {
    const { data } = await api.get('/references/contenus-statiques', {
      params: { includeInactifs: 'true' },
    });
    return data?.data ?? data;
  },
  createContenuStatique: async (
    data: Partial<ContenuStatique>,
  ): Promise<ContenuStatique> => {
    const res = await api.post('/references/contenus-statiques', data);
    return res.data;
  },
  updateContenuStatique: async (
    id: string,
    data: Partial<ContenuStatique>,
  ): Promise<ContenuStatique> => {
    const res = await api.patch(`/references/contenus-statiques/${id}`, data);
    return res.data;
  },
  deleteContenuStatique: async (id: string): Promise<void> => {
    await api.delete(`/references/contenus-statiques/${id}`);
  },

  // ── Navigation ───────────────────────────────────────────────────────────────
  /** Retourne la liste plate des items d'une section (header / footer / legal). */
  getNavigation: async (
    section?: string,
  ): Promise<NavigationItem[]> => {
    const { data } = await api.get('/references/navigation', {
      params: section ? { section } : undefined,
    });
    return data?.data ?? data;
  },
  createNavigationItem: async (
    data: Partial<NavigationItem>,
  ): Promise<NavigationItem> => {
    const res = await api.post('/references/navigation', data);
    return res.data;
  },
  updateNavigationItem: async (
    id: string,
    data: Partial<NavigationItem>,
  ): Promise<NavigationItem> => {
    const res = await api.patch(`/references/navigation/${id}`, data);
    return res.data;
  },
  deleteNavigationItem: async (id: string): Promise<void> => {
    await api.delete(`/references/navigation/${id}`);
  },
};
