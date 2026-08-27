'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { X, ChevronLeft, ChevronRight, Images } from 'lucide-react';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Card } from '@/components/ui/Card';
import { LoadingState } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { galerieService } from '@/services/galerie.service';
import type { Media } from '@/types';

function Lightbox({ medias, index, onClose, onPrev, onNext }: {
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
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <button onClick={onClose} aria-label="Fermer"
        className="absolute top-4 right-4 p-2 text-white/70 hover:text-white bg-black/40 rounded-lg z-10">
        <X className="h-6 w-6" />
      </button>
      <button onClick={(e) => { e.stopPropagation(); onPrev(); }} aria-label="Image précédente"
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 text-white/70 hover:text-white bg-black/40 rounded-lg">
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button onClick={(e) => { e.stopPropagation(); onNext(); }} aria-label="Image suivante"
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-white/70 hover:text-white bg-black/40 rounded-lg">
        <ChevronRight className="h-6 w-6" />
      </button>
      <div className="relative max-w-4xl max-h-[80vh] w-full" onClick={(e) => e.stopPropagation()}>
        <Image
          src={media.fichier}
          alt={media.texteAlt || media.nom}
          width={1200}
          height={800}
          className="object-contain max-h-[80vh] w-full rounded-lg"
        />
        {(media.legende || media.credit) && (
          <div className="text-center mt-2 text-sm text-white/70">
            {media.legende && <p>{media.legende}</p>}
            {media.credit && <p className="text-xs">© {media.credit}</p>}
          </div>
        )}
        <p className="text-center text-xs text-white/50 mt-1">{index + 1} / {medias.length}</p>
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
  const prevImage = () => lightbox && setLightbox({ ...lightbox, index: (lightbox.index - 1 + lightbox.medias.length) % lightbox.medias.length });
  const nextImage = () => lightbox && setLightbox({ ...lightbox, index: (lightbox.index + 1) % lightbox.medias.length });

  return (
    <div className="bg-background min-h-screen">
      <div className="bg-primary py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <Breadcrumb items={[{ label: 'Galerie' }]} />
          <SectionTitle
            title="Galerie"
            subtitle="Photos et vidéos des projets, événements et activités"
            className="mt-4 mb-0 [&_h2]:text-white [&_p]:text-blue-100"
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {isLoading ? (
          <LoadingState message="Chargement de la galerie…" />
        ) : !galeries?.length ? (
          <EmptyState title="Galerie vide" description="Aucun album disponible pour le moment." icon={<Images className="h-12 w-12" />} />
        ) : (
          <div className="space-y-12">
            {galeries.map((galerie) => {
              // Médias dans les albums
              const albumSections = galerie.albums?.filter(a => a.medias?.length) ?? [];
              // Médias directement liés à la galerie (auto-sync)
              const directMedias = (galerie.galerieMedias ?? []).map(gm => gm.media);

              return (
                <section key={galerie.id}>
                  <h2 className="text-xl font-semibold text-gray-900 mb-1">{galerie.nom}</h2>
                  {galerie.description && (
                    <p className="text-sm text-gray-500 mb-4">{galerie.description}</p>
                  )}

                  {/* Médias directs (auto-synchronisés) */}
                  {directMedias.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 mb-6">
                      {directMedias.map((media, idx) => (
                        <button
                          key={media.id}
                          onClick={() => openLightbox(directMedias, idx)}
                          className="relative h-40 rounded-xl overflow-hidden bg-gray-100 group focus:outline-none focus:ring-2 focus:ring-primary"
                          aria-label={media.texteAlt || media.nom}
                        >
                          <Image
                            src={media.fichier}
                            alt={media.texteAlt || media.nom}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-200"
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Albums */}
                  {albumSections.map((album) => (
                    <div key={album.id} className="mb-6">
                      <h3 className="text-base font-medium text-gray-700 mb-3">{album.titre}</h3>
                      {album.description && (
                        <p className="text-sm text-gray-500 mb-3">{album.description}</p>
                      )}
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                        {album.medias!.map((media, idx) => (
                          <button
                            key={media.id}
                            onClick={() => openLightbox(album.medias!, idx)}
                            className="relative h-40 rounded-xl overflow-hidden bg-gray-100 group focus:outline-none focus:ring-2 focus:ring-primary"
                            aria-label={media.texteAlt || media.nom}
                          >
                            <Image
                              src={media.fichier}
                              alt={media.texteAlt || media.nom}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-200"
                              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}

                  {directMedias.length === 0 && albumSections.length === 0 && (
                    <p className="text-sm text-gray-400 italic">Aucune image dans cette galerie.</p>
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
