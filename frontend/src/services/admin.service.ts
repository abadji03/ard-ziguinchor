/**
 * Service admin générique — opérations CRUD pour toutes les entités.
 * Chaque ressource expose create / update / delete via les endpoints NestJS.
 */
import api from '@/lib/api';

function makeAdminService(resource: string) {
  return {
    create: async <T>(data: unknown): Promise<T> => {
      const res = await api.post(`/${resource}`, data);
      return res.data;
    },
    update: async <T>(id: string, data: unknown): Promise<T> => {
      const res = await api.patch(`/${resource}/${id}`, data);
      return res.data;
    },
    delete: async (id: string): Promise<void> => {
      await api.delete(`/${resource}/${id}`);
    },
    uploadImage: async (id: string, file: File, field = 'image'): Promise<{ url: string }> => {
      const form = new FormData();
      form.append(field, file);
      // NOTE : pas de Content-Type manuel — axios gère la boundary automatiquement.
      const res = await api.patch(`/${resource}/${id}/image`, form);
      return res.data;
    },
  };
}

// Upload d'image générique via /upload/image
// NOTE : Ne pas fixer manuellement Content-Type — axios détecte automatiquement
// le FormData et injecte la bonne boundary. Un header manuel briserait le multipart.
export const uploadImageFile = async (file: File): Promise<{ url: string; publicId: string }> => {
  const form = new FormData();
  form.append('image', file);
  const res = await api.post('/upload/image', form);
  return res.data;
};

export const adminActualites   = makeAdminService('actualites');
export const adminProjets      = makeAdminService('projets');
export const adminProgrammes   = makeAdminService('programmes');
export const adminPartenaires  = makeAdminService('partenaires');
export const adminDocuments    = makeAdminService('documents');
export const adminOpportunites = makeAdminService('opportunites');
export const adminEvenements   = makeAdminService('evenements');
export const adminMembres      = makeAdminService('membres');
export const adminGalerie      = makeAdminService('galeries');
export const adminFaq          = makeAdminService('faq');

// Upload de fichier document
// NOTE : Ne pas fixer manuellement Content-Type — axios gère la boundary automatiquement.
export const uploadDocument = async (file: File): Promise<{ url: string; taille: number; publicId: string }> => {
  const form = new FormData();
  form.append('file', file);
  const res = await api.post('/upload', form);
  // Le backend renvoie `taille` (pas `size`) — correspond au champ Prisma
  return res.data;
};

// ─── Gestion des médias de galerie ──────────────────────────────────────────

/**
 * Upload une image et l'ajoute directement à une galerie existante.
 */
export const galerieAddMedia = async (
  galerieId: string,
  file: File,
  meta: { texteAlt?: string; legende?: string } = {},
): Promise<{ id: string; nom: string; fichier: string; type: string }> => {
  const form = new FormData();
  form.append('image', file);
  if (meta.texteAlt) form.append('texteAlt', meta.texteAlt);
  if (meta.legende) form.append('legende', meta.legende);
  const res = await api.post(`/galeries/${galerieId}/medias`, form);
  return res.data;
};

/**
 * Ajoute un média depuis une URL externe (image ou vidéo) à une galerie.
 */
export const galerieAddMediaFromUrl = async (
  galerieId: string,
  data: { url: string; nom?: string; type?: string; texteAlt?: string; legende?: string },
): Promise<{ id: string; nom: string; fichier: string; type: string }> => {
  const res = await api.post(`/galeries/${galerieId}/medias/url`, data);
  return res.data;
};

/**
 * Retire un média d'une galerie.
 */
export const galerieRemoveMedia = async (
  galerieId: string,
  mediaId: string,
): Promise<void> => {
  await api.delete(`/galeries/${galerieId}/medias/${mediaId}`);
};
