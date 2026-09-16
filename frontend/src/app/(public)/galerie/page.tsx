'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { X, ChevronLeft, ChevronRight, Images, ZoomIn, Folder } from 'lucide-react';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { LoadingState } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { galerieService } from '@/services/galerie.service';
import type { Media } from '@/types';

function Lightbox({
  medias,
  index,
  onClose,
  onPrev,
  onNext,
}: {
  medias: Media[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const media = medias[index];
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Visionneuse d'image"
      className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        aria-label="Fermer"
        className="absolute top-5 right-5 p-2.5 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors z-20"
      >
        <X className="h-6 w-6" />
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onPrev();
        }}
        aria-label="Image précédente"
        className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 p-3 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onNext();
        }}
        aria-label="Image suivante"
        className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 p-3 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      <div
        className="relative max-w-5xl max-h-[85vh] w-full flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-full max-h-[75vh] flex items-center justify-center">
          <Image
            src={media.fichier}
            alt={media.texteAlt || media.nom}
            width={1400}
            height={900}
            className="object-contain max-h-[75vh] w-auto rounded-2xl shadow-2xl"
          />
        </div>

        <div className="text-center mt-4 text-white">
          {media.legende && <p className="text-sm font-medium">{media.legende}</p>}
          <div className="flex items-center justify-center gap-3 text-xs text-slate-400 mt-1">
            {media.credit && <span>© {media.credit}</span>}
            <span>
              {index + 1} / {medias.length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function GaleriePage() {
  const [lightbox, setLightbox] = useState<{ medias: Media[]; index: number } | null>(null);

  const { data: galeries, isLoading } = useQuery({
    queryKey: ['galeries'],
    queryFn: () => galerieService.getAll(),
    staleTime: 5 * 60 * 1000,
  });

  const openLightbox = (medias: Media[], i: number) => setLightbox({ medias, index: i });
  const closeLightbox = () => setLightbox(null);
  const prevImage = () =>
    lightbox &&
    setLightbox({
      ...lightbox,
      index: (lightbox.index - 1 + lightbox.medias.length) % lightbox.medias.length,
    });
  const nextImage = () =>
    lightbox &&
    setLightbox({
      ...lightbox,
      index: (lightbox.index + 1) % lightbox.medias.length,
    });

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* En-tête Institutionnel */}
      <div className="bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-14 md:pt-12 md:pb-16">
          <div className="text-slate-400 mb-4">
            <Breadcrumb items={[{ label: 'Médiathèque & Galerie' }]} />
          </div>

          <div className="max-w-3xl">
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-500/30 mb-3">
              Archives Visuelles Régionales
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
              Médiathèque Régionale
            </h1>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
              Reportages photos sur le terrain, inaugurations d'infrastructures communales, ateliers de
              formation et paysages emblématiques de la région de Ziguinchor.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 md:py-14">
        {isLoading ? (
          <div className="py-16">
            <LoadingState message="Chargement des albums et visuels…" />
          </div>
        ) : !galeries?.length ? (
          <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center">
            <EmptyState
              title="Aucun album photo disponible"
              description="Les archives visuelles sont en cours de numérisation."
              icon={<Images className="h-12 w-12 text-slate-300" />}
            />
          </div>
        ) : (
          <div className="space-y-16">
            {galeries.map((galerie) => {
              const albumSections = galerie.albums?.filter((a) => a.medias?.length) ?? [];
              const directMedias = (galerie.galerieMedias ?? []).map((gm) => gm.media);

              return (
                <section
                  key={galerie.id}
                  className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-xs"
                >
                  <div className="mb-6">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                      Collection
                    </span>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-2">
                      {galerie.nom}
                    </h2>
                    {galerie.description && (
                      <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-3xl">
                        {galerie.description}
                      </p>
                    )}
                  </div>

                  {/* Photos directes */}
                  {directMedias.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 mb-8">
                      {directMedias.map((media, idx) => (
                        <button
                          key={media.id}
                          onClick={() => openLightbox(directMedias, idx)}
                          className="relative h-44 rounded-xl overflow-hidden bg-slate-100 group focus:outline-none focus:ring-2 focus:ring-emerald-600 border border-slate-200/80 cursor-zoom-in"
                          aria-label={media.texteAlt || media.nom}
                        >
                          <Image
                            src={media.fichier}
                            alt={media.texteAlt || media.nom}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                          />
                          <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <ZoomIn className="h-6 w-6 text-white drop-shadow-md" />
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Albums imbriqués */}
                  {albumSections.map((album) => (
                    <div key={album.id} className="mt-8 pt-6 border-t border-slate-100">
                      <div className="flex items-center gap-2 mb-3">
                        <Folder className="h-4 w-4 text-emerald-700" />
                        <h3 className="text-base font-bold text-slate-900">{album.titre}</h3>
                      </div>
                      {album.description && (
                        <p className="text-xs text-slate-500 mb-4">{album.description}</p>
                      )}
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
                        {album.medias!.map((media, idx) => (
                          <button
                            key={media.id}
                            onClick={() => openLightbox(album.medias!, idx)}
                            className="relative h-44 rounded-xl overflow-hidden bg-slate-100 group focus:outline-none focus:ring-2 focus:ring-emerald-600 border border-slate-200/80 cursor-zoom-in"
                            aria-label={media.texteAlt || media.nom}
                          >
                            <Image
                              src={media.fichier}
                              alt={media.texteAlt || media.nom}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                            />
                            <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                              <ZoomIn className="h-6 w-6 text-white drop-shadow-md" />
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}

                  {directMedias.length === 0 && albumSections.length === 0 && (
                    <p className="text-xs text-slate-400 italic">Aucune image dans cette galerie.</p>
                  )}
                </section>
              );
            })}
          </div>
        )}
      </div>

      {lightbox && (
        <Lightbox
          medias={lightbox.medias}
          index={lightbox.index}
          onClose={closeLightbox}
          onPrev={prevImage}
          onNext={nextImage}
        />
      )}
    </div>
  );
}
