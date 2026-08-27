import api from '@/lib/api';
import { buildQueryString } from '@/lib/utils';
import { API_URL } from '@/constants';
import type {
  Document,
  PaginatedResponse,
  QueryParams,
  TypePlanification,
} from '@/types';

export interface DocumentsQueryParams extends QueryParams {
  categorieId?: string;
  format?: string;
  langue?: string;
  typePlanification?: TypePlanification;
  sousType?: string;
  departementId?: string;
  arrondissementId?: string;
  communeId?: string;
}

export interface PlanificationTerritoriale {
  pdc: Array<{
    departement: { id: string; nom: string } | null;
    communes: Array<{
      commune: { id: string; nom: string } | null;
      documents: Document[];
    }>;
  }>;
  pdd: Array<{
    departement: { id: string; nom: string } | null;
    communes: Array<{
      commune: { id: string; nom: string } | null;
      documents: Document[];
    }>;
  }>;
}

export const documentsService = {
  getAll: async (params: DocumentsQueryParams = {}): Promise<PaginatedResponse<Document>> => {
    const query = buildQueryString(params);
    const { data } = await api.get(`/documents?${query}`);
    return data;
  },

  getTerritoriale: async (): Promise<PlanificationTerritoriale> => {
    const { data } = await api.get('/documents/territoriale');
    return data;
  },

  getBySlug: async (slug: string): Promise<Document> => {
    const { data } = await api.get(`/documents/slug/${slug}`);
    return data;
  },

  incrementDownload: async (id: string): Promise<void> => {
    await api.post(`/documents/${id}/telecharger`);
  },

  download: async (id: string): Promise<void> => {
    const url = `${API_URL}/documents/${id}/download`;
    const res = await fetch(url);
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(`Téléchargement impossible (${res.status})${text ? `: ${text}` : ''}`);
    }
    const blob = await res.blob();
    const disposition = res.headers.get('content-disposition');
    const filenameMatch = disposition && disposition.match(/filename="?([^"]+)"?/);
    const filename = filenameMatch?.[1] || `document-${id}.bin`;
    const downloadUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = filename;
    a.rel = 'noopener,noreferrer';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(downloadUrl);
  },
};
