'use client';

import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import { Upload, Trash2, Image as ImageIcon } from 'lucide-react';
import { PageHeader } from '@/components/admin/PageHeader';
import { LoadingState } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';
import api from '@/lib/api';
import { formatFileSize } from '@/lib/utils';
import type { Media, PaginatedResponse } from '@/types';

export default function AdminMediasPage() {
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-medias'],
    queryFn: async (): Promise<PaginatedResponse<Media>> => {
      const res = await api.get('/medias?limit=50');
      return res.data;
    },
  });

  const deleteMut = useMutation({
    mutationFn: async (id: string) => { await api.delete(`/medias/${id}`); },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-medias'] }),
  });

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    setUploading(true);
    try {
      const form = new FormData();
      Array.from(files).forEach((f) => form.append('files', f));
      await api.post('/upload/medias', form);
      qc.invalidateQueries({ queryKey: ['admin-medias'] });
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="Médiathèque"
        description="Images et fichiers uploadés"
        actions={
          <>
            <input
              ref={fileRef}
              type="file"
              multiple
              accept="image/*,video/*"
              className="hidden"
              id="upload-input"
              onChange={handleUpload}
              aria-label="Téléverser des médias"
            />
            <label
              htmlFor="upload-input"
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors ${
                uploading
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-primary text-white hover:bg-primary/90'
              }`}
            >
              <Upload className="h-4 w-4" />
              {uploading ? 'Envoi…' : 'Uploader'}
            </label>
          </>
        }
      />

      {isLoading ? (
        <LoadingState />
      ) : !data?.data?.length ? (
        <EmptyState
          title="Médiathèque vide"
          description="Uploadez vos premières images ou vidéos."
          icon={<ImageIcon className="h-12 w-12" />}
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {data.data.map((media) => (
            <div key={media.id} className="group relative bg-gray-50 rounded-xl overflow-hidden border border-gray-100 aspect-square">
              <Image
                src={media.fichier}
                alt={media.texteAlt || media.nom}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
              />
              {/* Overlay au hover */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 gap-2 p-2">
                <p className="text-white text-xs text-center truncate w-full">{media.nom}</p>
                {media.taille && <p className="text-white/70 text-xs">{formatFileSize(media.taille)}</p>}
                <button
                  onClick={() => deleteMut.mutateAsync(media.id)}
                  aria-label={`Supprimer ${media.nom}`}
                  className="p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {data && data.total > 0 && (
        <p className="text-xs text-gray-400 text-right">{data.total} média{data.total > 1 ? 's' : ''} au total</p>
      )}
    </div>
  );
}
