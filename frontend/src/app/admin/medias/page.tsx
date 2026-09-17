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
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold cursor-pointer transition-colors shadow-2xs ${
                uploading
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : 'bg-emerald-700 text-white hover:bg-emerald-800'
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
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5">
          {data.data.map((media) => (
            <div key={media.id} className="group relative bg-slate-100 rounded-2xl overflow-hidden border border-slate-200/80 aspect-square shadow-2xs">
              <Image
                src={media.fichier}
                alt={media.texteAlt || media.nom}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
              />
              {/* Overlay au hover */}
              <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/60 transition-all flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 gap-2 p-2.5 backdrop-blur-[2px]">
                <p className="text-white text-xs font-semibold text-center truncate w-full">{media.nom}</p>
                {media.taille && <p className="text-white/80 text-xs font-mono">{formatFileSize(media.taille)}</p>}
                <button
                  onClick={() => deleteMut.mutateAsync(media.id)}
                  aria-label={`Supprimer ${media.nom}`}
                  className="p-2 bg-rose-600 text-white rounded-xl hover:bg-rose-700 transition-colors shadow-sm cursor-pointer"
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
