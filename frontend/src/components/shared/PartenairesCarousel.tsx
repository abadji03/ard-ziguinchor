'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { partenairesService } from '@/services/partenaires.service';
import type { Partenaire } from '@/types';

function PartenaireCard({ partenaire }: { partenaire: Partenaire }) {
  return (
    <Link
      href={`/partenaires/${partenaire.slug}`}
      className="flex-shrink-0 w-52 md:w-64 group hover-lift"
    >
      <div className="bg-white border border-gray-100 rounded-2xl p-5 h-32 md:h-36 flex items-center justify-center shadow-xs hover:border-primary/30 transition-all">
        {partenaire.logo ? (
          <Image
            src={partenaire.logo}
            alt={partenaire.nom}
            width={180}
            height={90}
            className="object-contain max-h-20 md:max-h-24 w-auto grayscale group-hover:grayscale-0 transition-all"
          />
        ) : (
          <div className="text-center">
            {partenaire.sigle ? (
              <div className="font-bold text-primary text-2xl group-hover:scale-105 transition-transform">
                {partenaire.sigle}
              </div>
            ) : (
              <div className="font-medium text-gray-600 text-center leading-tight px-2 group-hover:text-primary transition-colors line-clamp-3">
                {partenaire.nom}
              </div>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}

export function PartenairesCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  const { data } = useQuery({
    queryKey: ['partenaires', 'actifs'],
    queryFn: () => partenairesService.getAll({ limit: 20, statut: 'actif' }),
    staleTime: 300_000,
  });

  const partenaires = data?.data ?? [];

  // Défilement automatique continu (comme le ticker du héros)
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let raf = 0;
    let last = 0;
    const step = (ts: number) => {
      if (!paused) {
        if (last && ts - last < 40) {
          el.scrollLeft += 1;
        }
        // Boucle infinie fluide : revient au début quand la moitié (dupliquée) est passée
        if (el.scrollLeft >= el.scrollWidth / 2) {
          el.scrollLeft = 0;
        }
      }
      last = ts;
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [paused, partenaires.length]);

  if (partenaires.length === 0) {
    return null;
  }

  // Duplique la liste pour un défilement infini fluide
  const displayed = [...partenaires, ...partenaires];

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -400 : 400,
      behavior: 'smooth',
    });
  };

  return (
    <section className="bg-gray-50 border-y border-gray-100 py-12 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">Nos Partenaires</h2>
            <p className="text-sm text-gray-500 mt-1">Ils nous font confiance et soutiennent le développement de la région</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => scroll('left')}
              className="p-2 rounded-full border border-gray-200 text-gray-600 hover:border-primary hover:text-primary transition-colors"
              aria-label="Défiler à gauche"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-2 rounded-full border border-gray-200 text-gray-600 hover:border-primary hover:text-primary transition-colors"
              aria-label="Défiler à droite"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Piste défilante automatique */}
        <div className="relative" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
          <div className="absolute left-0 top-0 bottom-0 w-10 z-10 bg-gradient-to-r from-gray-50 to-transparent pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-10 z-10 bg-gradient-to-l from-gray-50 to-transparent pointer-events-none" />

          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {displayed.map((p, idx) => (
              <PartenaireCard key={`${p.id}-${idx}`} partenaire={p} />
            ))}
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/partenaires"
            className="inline-flex items-center gap-2 text-sm text-primary font-medium hover:underline"
          >
            Voir tous nos partenaires →
          </Link>
        </div>
      </div>
    </section>
  );
}
