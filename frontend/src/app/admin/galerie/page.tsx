'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import { Images, FolderOpen } from 'lucide-react';
import { PageHeader } from '@/components/admin/PageHeader';
import { LoadingState } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { ActionButtons } from '@/components/admin/ActionButtons';
import { galerieService } from '@/services/galerie.service';
import { adminGalerie } from '@/services/admin.service';

export default function AdminGaleriePage() {
  const qc = useQueryClient();

  const { data: galeries, isLoading } = useQuery({
    queryKey: ['admin-galeries'],
    queryFn: () => galerieService.getAll(),
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => adminGalerie.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-galeries'] }),
  });

  return (
    <div className="space-y-4">
      <PageHeader
        title="Galerie"
        description="Albums photo et vidéo"
        createHref="/admin/galerie/new"
        createLabel="Nouvelle galerie"
      />

      {isLoading ? (
        <LoadingState />
      ) : !galeries?.length ? (
        <EmptyState
          title="Galerie vide"
          description="Créez votre première galerie photo."
          icon={<Images className="h-12 w-12" />}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {galeries.map((galerie) => (
            <div key={galerie.id} className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-md hover:border-emerald-300 transition-all duration-200 flex flex-col justify-between">
              {/* Aperçu images */}
              <div className="grid grid-cols-3 h-32 bg-slate-100 border-b border-slate-200/60">
                {[
                  ...((galerie.galerieMedias ?? []).map(gm => gm.media)),
                  ...(galerie.albums?.flatMap(a => a.medias ?? []) ?? []),
                ].slice(0, 3).map((media, i) => (
                  <div key={i} className="relative">
                    <Image
                      src={media.fichier}
                      alt={media.texteAlt || media.nom}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
                {[
                  ...((galerie.galerieMedias ?? []).map(gm => gm.media)),
                  ...(galerie.albums?.flatMap(a => a.medias ?? []) ?? []),
                ].length === 0 && (
                  <div className="col-span-3 flex items-center justify-center text-slate-300">
                    <Images className="h-10 w-10" />
                  </div>
                )}
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">{galerie.nom}</h3>
                  {galerie.description && (
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">{galerie.description}</p>
                  )}
                </div>
                <div className="flex items-center justify-between gap-2 pt-4 mt-3 border-t border-slate-100">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                    <FolderOpen className="h-3.5 w-3.5 text-emerald-600" />
                    <span>
                      {galerie.albums?.length ?? 0} album{(galerie.albums?.length ?? 0) > 1 ? 's' : ''} ·{' '}
                      {[
                        ...((galerie.galerieMedias ?? []).map(gm => gm.media)),
                        ...(galerie.albums?.flatMap(a => a.medias ?? []) ?? []),
                      ].length} média{[
                        ...((galerie.galerieMedias ?? []).map(gm => gm.media)),
                        ...(galerie.albums?.flatMap(a => a.medias ?? []) ?? []),
                      ].length > 1 ? 's' : ''}
                    </span>
                  </div>
                  <ActionButtons
                    viewHref="/galerie"
                    editHref={`/admin/galerie/${galerie.id}/edit`}
                    onDelete={() => deleteMut.mutateAsync(galerie.id)}
                    deleteLabel={galerie.nom}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
